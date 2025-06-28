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
    const addPost = await prisma.post.create({
      data: {
        userId: post.isAnonymous ? null : id,
        ...post,
      },
    });
    return { success: true, post: addPost };
  } catch (error) {
    console.error('Error updating step:', error);
    return { success: false, error: 'Failed to create post' };
  }
};
