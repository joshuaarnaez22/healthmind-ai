import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AffirmationsSectionProps {
  affirmations: string[];
}
export default function Affirmations({
  affirmations,
}: AffirmationsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % affirmations.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [affirmations.length]);
  return (
    <div className="relative flex h-32 items-center justify-center overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {affirmations.map((affirmation, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: index === currentIndex ? 1 : 0,
              y: index === currentIndex ? 0 : 20,
            }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <p className="px-6 text-center text-xl font-medium italic text-primary">
              &quot;{affirmation}&quot;
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
