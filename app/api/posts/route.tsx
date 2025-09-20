import { getUserId } from '@/actions/server-actions/user';
import { prisma } from '@/lib/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId(); // May be null if unauthenticated
    const { searchParams } = req.nextUrl;

    const page = parseInt(searchParams.get('page') || '1', 10);
    const tagsParam = searchParams.get('tags');
    const limit = 10;

    const tagArray = tagsParam
      ? tagsParam
          .split(',')
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean)
      : [];

    const whereCondition = tagArray.length
      ? {
          tags: {
            hasSome: tagArray,
          },
        }
      : undefined;

    const posts = await prisma.post.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: true,
        postLikes: true,
        comments: {
          include: {
            user: true,
            commentLikes: true,
          },
        },
      },
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const enrichedPosts = posts.map((post) => ({
      ...post,
      hasLiked:
        !!userId && post.postLikes.some((like) => like.userId === userId),
      comments: post.comments.map((comment) => ({
        ...comment,
        isLiked:
          !!userId &&
          comment.commentLikes.some((like) => like.userId === userId),
      })),
    }));

    const total = await prisma.post.count({
      where: whereCondition,
    });

    const hasMore = page * limit < total;

    return NextResponse.json({
      posts: enrichedPosts,
      hasMore,
      nextPage: page + 1,
    });
  } catch (error) {
    console.error('Error getting posts:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
