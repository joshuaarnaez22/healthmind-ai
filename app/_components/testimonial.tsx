import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
}

export function Testimonial({ quote, author, role }: TestimonialProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
        <CardContent className="p-6">
          <motion.div
            className="flex justify-center mb-4"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
          >
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
            ))}
          </motion.div>
          <p className="text-gray-600 dark:text-gray-300 mb-4 italic text-center">
            &ldquo;{quote}&rdquo;
          </p>
          <div className="text-center">
            <p className="font-semibold text-gray-800 dark:text-white">
              {author}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
          </div>
          <motion.div
            className="w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mt-4"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
