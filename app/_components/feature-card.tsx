import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
export default function FeatureCard({
  icon,
  title,
  description
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
      <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
        <CardContent className="p-6">
          <motion.div
            className="mb-4 flex justify-center"
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {icon}
          </motion.div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white text-center">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            {description}
          </p>
          <motion.div
            className="w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 mt-4"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
