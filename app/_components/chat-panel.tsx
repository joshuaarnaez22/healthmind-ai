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
          className="rounded-full w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg"
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
            className="fixed bottom-24 right-2 sm:right-6 w-auto md:w-80 rounded-lg shadow-xl overflow-hidden bg-white dark:bg-gray-800"
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 flex justify-between items-center">
              <h3 className="font-semibold">HealthMind Assistant</h3>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 hover:cursor-pointer"
                onClick={() => setIsChatOpen(false)}
              >
                <X className="h-5 w-5 " />
              </Button>
            </div>
            <div className="h-64 p-4 overflow-y-auto text-gray-600 dark:text-gray-300">
              <p>Hello! How can I assist you with your health journey today?</p>
            </div>
            <div className="border-t p-4">
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
