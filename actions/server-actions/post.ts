'use server';

import { prisma } from '@/lib/client';
import { getUserId } from './user';

type createPostTypes = {
  content: string;
  tags: string[];
  likes: number;
  isAnonymous: boolean;
};
export const addNewPost = async (post: createPostTypes) => {
  try {
    const id = await getUserId();
    const postData = await prisma.post.create({
      data: {
        userId: post.isAnonymous ? null : id,
        ...post,
      },
      include: {
        user: true,
        postLikes: true,
      },
    });
    return { success: true, post: postData };
  } catch (error) {
    console.error('Error updating step:', error);
    return { success: false, error: 'Failed to create post' };
  }
};

export const togglePostLike = async (postId: string) => {
  try {
    const userId = await getUserId();

    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingLike) {
      // Remove like (unlike)
      await prisma.postLike.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });

      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
          likes: {
            decrement: 1,
          },
        },
      });
      return { success: true, liked: false, likes: updatedPost.likes };
    } else {
      await prisma.postLike.create({
        data: {
          postId,
          userId,
        },
      });

      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
          likes: {
            increment: 1,
          },
        },
      });

      return { success: true, liked: true, likes: updatedPost.likes };
    }
  } catch (error) {
    console.error('Error updating step:', error);
    return { success: false, error: 'Failed to create post' };
  }
};

export async function addCommentToPost({
  postId,
  content,
  isAnonymous = false,
}: {
  postId: string;
  content: string;
  isAnonymous?: boolean;
}) {
  try {
    const userId = await getUserId();
    const comment = await prisma.comment.create({
      data: {
        content,
        isAnonymous,
        postId,
        userId,
      },
      include: {
        user: true, // include author details for UI
      },
    });

    return { success: true, comment };
  } catch (err) {
    console.error('[ADD_COMMENT_ERROR]', err);
    return { success: false, error: 'Failed to add comment' };
  }
}

export async function toggleCommentLikeAction(commentId: string) {
  const userId = await getUserId();

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const existingLike = await prisma.commentLike.findFirst({
    where: {
      commentId,
      userId,
    },
  });

  if (existingLike) {
    await prisma.$transaction([
      prisma.commentLike.delete({
        where: { id: existingLike.id },
      }),
      prisma.comment.update({
        where: { id: commentId },
        data: {
          likes: {
            decrement: 1,
          },
        },
      }),
    ]);

    return { liked: false };
  } else {
    await prisma.$transaction([
      prisma.commentLike.create({
        data: {
          commentId,
          userId,
        },
      }),
      prisma.comment.update({
        where: { id: commentId },
        data: {
          likes: {
            increment: 1,
          },
        },
      }),
    ]);

    return { liked: true };
  }
}
