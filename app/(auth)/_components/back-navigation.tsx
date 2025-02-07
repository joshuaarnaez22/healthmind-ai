'use client';
import { MoveLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
export default function BackNavigation() {
  return (
    <Link href="/">
      <motion.div
        className="absolute top-4 left-5 cursor-pointer"
        animate={{ x: [0, -4, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      >
        <MoveLeft className="w-12 h-8 text-muted-foreground" />
      </motion.div>
    </Link>
  );
}
