'use client';
import { pageAnimations } from '@/lib/motion';
import { Filter, Heart, MessageCircle, Send, Shield } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import SharePostModal from './share-post-modal';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { allTags } from '@/lib/constant';
import { Badge } from '@/components/ui/badge';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  addCommentToPost,
  addNewPost,
  toggleCommentLikeAction,
  togglePostLike,
} from '@/actions/server-actions/post';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Comment, Post, PostLike, User } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/nextjs';
import { Textarea } from '@/components/ui/textarea';

type CommentWithExtras = Comment & {
  user: {
    name: string;
    avatar: string | null;
    initials: string;
    username: string;
    profileImageUrl?: string;
  };
  isLiked?: boolean;
  anonymousAvatar?: {
    color: string;
    icon: string;
  };
};

type PostWithUser = Post & {
  user?: User;
  postLikes: PostLike[];
  comments: CommentWithExtras[];
  hasLiked?: boolean;
};

export default function Community() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const userId = user?.id;
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showComments, setShowComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [newPost, setNewPost] = useState({
    content: '',
    tags: '',
    isAnonymous: false,
  });
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const toggleTagFilter = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const createPost = async () => {
    if (!newPost.content.trim()) return;

    const tags = newPost.tags
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);

    const postPayload = {
      content: newPost.content,
      tags,
      likes: 0,
      isAnonymous: newPost.isAnonymous,
    };

    const result = await addNewPost(postPayload);

    if (!result.success || !result.post) return;

    const serverPost = result.post;

    const safePost: PostWithUser = {
      id: serverPost.id ?? crypto.randomUUID(),
      content: serverPost.content,
      createdAt: new Date(serverPost.createdAt ?? new Date()),
      updatedAt: new Date(serverPost.updatedAt ?? new Date()),
      userId: serverPost.userId ?? null,
      likes: serverPost.likes ?? 0,
      isAnonymous: serverPost.isAnonymous ?? false,
      tags: serverPost.tags ?? [],
      user: serverPost.user ?? undefined,
      comments: [],
      postLikes: [],
      hasLiked: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryClient.setQueryData(['posts', selectedTags], (oldData: any) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: [
          {
            ...oldData.pages[0],
            posts: [safePost, ...oldData.pages[0].posts],
          },
          ...oldData.pages.slice(1),
        ],
      };
    });

    setNewPost({
      content: '',
      tags: '',
      isAnonymous: false,
    });
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['posts', selectedTags],
      initialPageParam: 1,
      queryFn: async ({ pageParam = 1 }) => {
        const params = new URLSearchParams({
          page: pageParam.toString(),
        });

        if (selectedTags.length > 0) {
          params.append('tags', selectedTags.join(','));
        }

        const res = await fetch(`/api/posts?${params.toString()}`);
        return res.json();
      },
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.nextPage : undefined,
    });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px' }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNextPage, isFetchingNextPage]);

  const toggleLike = async (postId: string) => {
    if (!userId) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryClient.setQueryData(['posts', selectedTags], (oldData: any) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pages: oldData.pages.map((page: any) => ({
          ...page,
          posts: page.posts.map((post: PostWithUser) => {
            if (post.id !== postId) return post;

            let updatedLikes = post.likes;
            let updatedPostLikes = [...post.postLikes];
            let updatedHasLiked = post.hasLiked;

            if (post.hasLiked) {
              // Unlike
              updatedLikes -= 1;
              updatedPostLikes = updatedPostLikes.filter(
                (like) => like.userId !== userId
              );
              updatedHasLiked = false;
            } else {
              // Like
              updatedLikes += 1;
              updatedPostLikes.push({
                id: `temp-${userId}-${postId}`,
                userId,
                postId,
              });
              updatedHasLiked = true;
            }

            return {
              ...post,
              likes: updatedLikes,
              postLikes: updatedPostLikes,
              hasLiked: updatedHasLiked,
            };
          }),
        })),
      };
    });

    await togglePostLike(postId);
    // queryClient.invalidateQueries({
    //   queryKey: ['posts', selectedTags] as const,
    // });
  };
  const addComment = async (postId: string) => {
    if (!userId) return;

    const content = newComment[postId]?.trim();
    if (!content) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryClient.setQueryData(['posts', selectedTags], (oldData: any) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pages: oldData.pages.map((page: any) => ({
          ...page,
          posts: page.posts.map((post: PostWithUser) => {
            if (post.id !== postId) return post;

            const newCommentObj: CommentWithExtras = {
              id: `temp-${Date.now()}`,
              content,
              createdAt: new Date(),
              updatedAt: new Date(),
              likes: 0,
              postId,
              userId: userId!,
              isAnonymous: false,
              user: {
                username: user?.username || '',
                name: user?.fullName || 'You',
                avatar: user?.imageUrl || null,
                initials:
                  (user?.firstName?.[0] || 'Y') + (user?.lastName?.[0] || 'U'),
              },
            };

            return {
              ...post,
              comments: [...post.comments, newCommentObj],
            };
          }),
        })),
      };
    });

    await addCommentToPost({
      postId,
      content: newComment[postId],
      isAnonymous: false,
    });
    setNewComment((prev) => ({
      ...prev,
      [postId]: '',
    }));
    // if (result.success && result.comment) {
    //   queryClient.invalidateQueries({
    //     queryKey: ['posts', selectedTags],
    //   });

    //   setNewComment((prev) => ({
    //     ...prev,
    //     [postId]: '',
    //   }));
    // }
  };

  const toggleComments = (postId: string) => {
    setShowComments((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };
  const toggleCommentLike = async (postId: string, commentId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryClient.setQueryData(['posts', selectedTags], (oldData: any) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pages: oldData.pages.map((page: any) => ({
          ...page,
          posts: page.posts.map((post: PostWithUser) => {
            if (post.id !== postId) return post;

            const updatedComments = post.comments.map((comment) => {
              if (comment.id !== commentId) return comment;

              const isLiked = comment.isLiked ?? false;
              return {
                ...comment,
                isLiked: !isLiked,
                likes: isLiked ? comment.likes - 1 : comment.likes + 1,
              };
            });

            return { ...post, comments: updatedComments };
          }),
        })),
      };
    });

    await toggleCommentLikeAction(commentId);

    // queryClient.invalidateQueries({
    //   queryKey: ['posts', selectedTags],
    // });
  };

  return (
    <motion.div {...pageAnimations}>
      {' '}
      <div className="space-y-12 p-4">
        <header className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="text-center md:text-left">
            <div className="flex flex-col items-center md:flex-row md:items-center md:gap-4">
              <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-400 via-pink-400 to-orange-400 shadow-2xl">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h1 className="mb-4 bg-gradient-to-r from-rose-600 via-pink-600 to-orange-600 bg-clip-text text-3xl font-bold text-transparent md:text-5xl">
                Safe Haven
              </h1>
            </div>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-600 md:text-xl">
              A judgment-free space where you can share openly, support others,
              and find comfort in community
            </p>
          </div>

          <div className="self-center md:self-auto">
            <SharePostModal
              setNewPost={setNewPost}
              newPost={newPost}
              createPost={createPost}
            />
          </div>
        </header>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="overflow-hidden rounded-3xl border-0 bg-white/60 shadow-xl backdrop-blur-xl">
            <CardHeader className="bg-gradient-to-r from-rose-50 to-orange-50 pb-4">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-rose-400 to-orange-400 p-3 shadow-lg">
                  <Filter className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Explore Topics
                  </h3>
                  <p className="text-sm text-gray-600">
                    Find conversations that resonate with you
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-3">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className={`cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                      selectedTags.includes(tag)
                        ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg hover:from-rose-600 hover:to-orange-600'
                        : 'border-rose-200 text-rose-700 hover:border-rose-300 hover:bg-rose-50 hover:shadow-md'
                    }`}
                    onClick={() => toggleTagFilter(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <div className="mt-6">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedTags([])}
                    className="rounded-xl px-4 py-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <ScrollArea className="mt-8 h-[900px] pr-4">
        <div className="space-y-8">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <AnimatePresence>
              {data?.pages.map((page, i) => (
                <div key={i} className="space-y-8">
                  {page.posts.map((post: PostWithUser, index: number) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -40 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="group overflow-hidden rounded-3xl border-0 bg-white/70 shadow-md backdrop-blur-xl transition-all duration-500 hover:shadow-lg">
                        <CardHeader className="p-8 pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-5">
                              <Avatar className="h-10 w-10 shadow-md">
                                <AvatarImage
                                  src={
                                    post.user?.profileImageUrl ||
                                    'https://github.com/shadcn.png'
                                  }
                                  alt={post.user?.username || ''}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600 font-semibold text-white">
                                  {post.user?.username}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-lg font-bold text-gray-900">
                                    {!post.user?.firstName || post.isAnonymous
                                      ? 'Anonymous'
                                      : post.user.firstName}
                                  </p>

                                  {post.isAnonymous && (
                                    <div className="flex items-center gap-1 rounded-full bg-rose-100 px-2 py-1">
                                      <Shield className="h-3 w-3 text-rose-600" />
                                      <span className="text-xs font-medium text-rose-600">
                                        Anonymous
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500">
                                  {formatDistanceToNow(
                                    new Date(post.createdAt),
                                    {
                                      addSuffix: true,
                                    }
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6 p-8 pt-0">
                          <p className="text-lg font-medium leading-relaxed text-gray-800">
                            {post.content}
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {post.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="rounded-full border border-rose-200 bg-gradient-to-r from-rose-100 to-orange-100 px-4 py-1 text-sm font-medium text-rose-700"
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center gap-8 border-t border-gray-100 pt-6">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => toggleLike(post.id)}
                              className={`flex items-center gap-3 rounded-2xl px-5 py-3 transition-all duration-300 ${
                                post.hasLiked
                                  ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-600 shadow-md'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-red-500'
                              }`}
                            >
                              <Heart
                                className={`h-6 w-6 ${post.hasLiked ? 'fill-current' : ''}`}
                              />
                              <span className="text-base font-semibold">
                                {post.likes}
                              </span>
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => toggleComments(post.id)}
                              className="flex items-center gap-3 rounded-2xl px-5 py-3 text-gray-600 transition-all duration-300 hover:bg-gray-50 hover:text-rose-600"
                            >
                              <MessageCircle className="h-6 w-6" />
                              <span className="text-base font-semibold">
                                {post.comments.length ?? 0}
                              </span>
                            </motion.button>
                          </div>
                          <AnimatePresence>
                            {showComments.includes(post.id) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-6 border-t border-gray-100 pt-8"
                              >
                                {/* Existing Comments */}
                                {post.comments.map((comment) => (
                                  <motion.div
                                    key={comment.id}
                                    className="flex gap-4 rounded-2xl bg-gradient-to-r from-gray-50/80 to-rose-50/80 p-6 backdrop-blur-sm"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                  >
                                    <div className="flex-shrink-0">
                                      {comment.isAnonymous &&
                                      comment.anonymousAvatar ? (
                                        <div
                                          className={`h-10 w-10 rounded-xl bg-gradient-to-br ${comment.anonymousAvatar.color} flex items-center justify-center text-lg shadow-md`}
                                        >
                                          {comment.anonymousAvatar.icon}
                                        </div>
                                      ) : (
                                        <Avatar className="h-10 w-10 shadow-md">
                                          <AvatarImage
                                            src={
                                              post.user?.profileImageUrl ||
                                              '/placeholder.svg'
                                            }
                                            alt={comment.user.username}
                                          />
                                          <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600 font-semibold text-white">
                                            {comment.user.initials}
                                          </AvatarFallback>
                                        </Avatar>
                                      )}
                                    </div>
                                    <div className="flex-1 space-y-3">
                                      <div className="flex items-center gap-3">
                                        <span className="font-bold text-gray-900">
                                          {comment.isAnonymous
                                            ? 'Anonymous'
                                            : comment.user.username}
                                        </span>
                                        {comment.isAnonymous && (
                                          <div className="flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5">
                                            <Shield className="h-2.5 w-2.5 text-rose-600" />
                                            <span className="text-xs font-medium text-rose-600">
                                              Anon
                                            </span>
                                          </div>
                                        )}
                                        {/* <span className="text-xs text-gray-500">{comment.timestamp}</span> */}
                                      </div>
                                      <p className="leading-relaxed text-gray-700">
                                        {comment.content}
                                      </p>
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() =>
                                          toggleCommentLike(post.id, comment.id)
                                        }
                                        className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-all duration-300 ${
                                          comment.isLiked
                                            ? 'bg-red-50 text-red-600'
                                            : 'text-gray-500 hover:bg-red-50 hover:text-red-600'
                                        }`}
                                      >
                                        <Heart
                                          className={`h-4 w-4 ${comment.isLiked ? 'fill-current' : ''}`}
                                        />
                                        {comment.likes > 0 && (
                                          <span className="font-semibold">
                                            {comment.likes}
                                          </span>
                                        )}
                                      </motion.button>
                                    </div>
                                  </motion.div>
                                ))}

                                {/* Add Comment */}
                                <div className="flex gap-4 rounded-2xl border-2 border-rose-100/50 bg-gradient-to-r from-rose-50/80 to-orange-50/80 p-6 backdrop-blur-sm">
                                  <Avatar className="h-10 w-10 flex-shrink-0 shadow-md">
                                    <AvatarFallback className="bg-gradient-to-br from-rose-400 to-orange-500 font-bold text-white">
                                      YU
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-1 gap-3">
                                    <Textarea
                                      placeholder="Share your support and encouragement..."
                                      value={newComment[post.id] || ''}
                                      onChange={(e) =>
                                        setNewComment({
                                          ...newComment,
                                          [post.id]: e.target.value,
                                        })
                                      }
                                      className="min-h-[100px] resize-none rounded-2xl border-2 border-gray-200 bg-white/90 backdrop-blur-sm focus:border-rose-400 focus:ring-rose-400"
                                    />
                                    <motion.div
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <Button
                                        onClick={() => addComment(post.id)}
                                        disabled={!newComment[post.id]?.trim()}
                                        className="self-end rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 px-5 py-3 text-white shadow-lg transition-all duration-300 hover:from-rose-600 hover:to-orange-600 hover:shadow-xl"
                                      >
                                        <Send className="h-5 w-5" />
                                      </Button>
                                    </motion.div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ))}

              {data && (
                <div
                  ref={loaderRef}
                  className="flex h-10 items-center justify-center text-sm text-gray-400"
                >
                  {isFetchingNextPage
                    ? 'Loading more posts...'
                    : hasNextPage
                      ? 'Scroll to load more'
                      : 'No more posts'}
                </div>
              )}
            </AnimatePresence>
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
}
