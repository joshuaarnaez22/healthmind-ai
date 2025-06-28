'use client';
import { pageAnimations } from '@/lib/motion';
import { Filter, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import SharePostModal from './share-post-modal';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { allTags } from '@/lib/constant';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { addNewPost } from '@/actions/server-actions/post';

export default function Community() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newPost, setNewPost] = useState({
    content: '',
    tags: '',
    isAnonymous: false,
  });

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

    const post = {
      content: newPost.content,
      tags,
      likes: 0,
      isAnonymous: newPost.isAnonymous,
    };
    const addedPost = await addNewPost(post);
    console.log(addedPost);
  };
  return (
    <motion.div {...pageAnimations}>
      {' '}
      <div className="space-y-12">
        <header className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-4">
              <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-400 via-pink-400 to-orange-400 shadow-2xl">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h1 className="mb-4 bg-gradient-to-r from-rose-600 via-pink-600 to-orange-600 bg-clip-text text-5xl font-bold text-transparent">
                Safe Haven
              </h1>
            </div>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-600">
              A judgment-free space where you can share openly, support others,
              and find comfort in community
            </p>
          </div>
          <SharePostModal
            setNewPost={setNewPost}
            newPost={newPost}
            createPost={createPost}
          />
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
    </motion.div>
  );
}
