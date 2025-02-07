import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ChatPanel({
  isChatOpen,
  setIsChatOpen,
}: {
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
}) {
  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
        }}
      >
        <Button
          size="lg"
          className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg hover:from-purple-600 hover:to-pink-600"
          onClick={() => setIsChatOpen(true)}
        >
          <MessageCircle className="h-8 w-8 text-white" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-2 w-auto overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800 sm:right-6 md:w-80"
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
              <h3 className="font-semibold">HealthMind Assistant</h3>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:cursor-pointer hover:bg-white/20"
                onClick={() => setIsChatOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="h-64 overflow-y-auto p-4 text-gray-600 dark:text-gray-300">
              <p>Hello! How can I assist you with your health journey today?</p>
            </div>
            <div className="border-t p-4">
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full rounded-full border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
