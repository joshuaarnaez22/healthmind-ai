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
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Card className="bg-white dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="text-center p-6">
          <div className="mb-4 flex justify-center">{icon}</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
