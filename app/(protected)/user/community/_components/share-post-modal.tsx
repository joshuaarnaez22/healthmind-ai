import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Shield } from 'lucide-react';

type PostDraft = {
  content: string;
  tags: string;
  isAnonymous: boolean;
};

interface SharePostModalProps {
  newPost: PostDraft;
  setNewPost: (post: PostDraft) => void;
  createPost: () => void;
}
export default function SharePostModal({
  setNewPost,
  newPost,
  createPost,
}: SharePostModalProps) {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 px-6 py-4 text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:from-rose-600 hover:via-pink-600 hover:to-orange-600 hover:shadow-2xl">
            <Plus className="mr-3 h-6 w-6" />
            Share Your Heart
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-3xl border-0 bg-white/95 shadow-2xl backdrop-blur-xl sm:max-w-lg">
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-center text-3xl font-bold text-gray-900">
              Share with Care
            </DialogTitle>
            <p className="text-center text-gray-600">
              Your voice matters. Share whats in your heart.
            </p>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div>
              <Label
                htmlFor="content"
                className="mb-3 block text-base font-semibold text-gray-800"
              >
                What would you like to share?
              </Label>
              <Textarea
                id="content"
                placeholder="Express your thoughts, feelings, or experiences. This is a safe space..."
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                className="min-h-[140px] resize-none rounded-2xl border-2 border-gray-200 p-4 text-base focus:border-rose-400 focus:ring-rose-400"
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-rose-100 bg-gradient-to-r from-rose-50 to-orange-50 p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-rose-600" />
                <div>
                  <Label
                    htmlFor="anonymous"
                    className="text-base font-semibold text-gray-800"
                  >
                    Post Anonymously
                  </Label>
                  <p className="text-sm text-gray-600">
                    Your identity will be hidden
                  </p>
                </div>
              </div>
              <Switch
                id="anonymous"
                checked={newPost.isAnonymous}
                onCheckedChange={(checked) =>
                  setNewPost({ ...newPost, isAnonymous: checked })
                }
                className="data-[state=checked]:bg-rose-500"
              />
            </div>

            <div>
              <Label
                htmlFor="tags"
                className="mb-3 block text-base font-semibold text-gray-800"
              >
                Add topics (optional)
              </Label>
              <Input
                id="tags"
                placeholder="e.g., anxiety, healing, selfcare"
                value={newPost.tags}
                onChange={(e) =>
                  setNewPost({ ...newPost, tags: e.target.value })
                }
                className="rounded-2xl border-2 border-gray-200 p-4 text-base focus:border-rose-400 focus:ring-rose-400"
              />
            </div>

            <Button
              onClick={createPost}
              className="w-full rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-rose-600 hover:via-pink-600 hover:to-orange-600 hover:shadow-xl"
            >
              {newPost.isAnonymous ? 'Share Anonymously' : 'Share Post'}
            </Button>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}
