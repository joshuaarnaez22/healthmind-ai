import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
export default function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="group overflow-hidden bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:bg-gray-800/90">
        <CardContent className="p-6">
          <motion.div
            className="mb-4 flex justify-center"
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            {icon}
          </motion.div>
          <h3 className="mb-2 text-center text-xl font-semibold text-gray-800 dark:text-white">
            {title}
          </h3>
          <p className="text-center text-gray-600 dark:text-gray-300">
            {description}
          </p>
          <motion.div
            className="mt-4 h-1 w-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
