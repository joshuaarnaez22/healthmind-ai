'use client';
import { MoveLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
export default function BackNavigation() {
  return (
    <Link href="/">
      <motion.div
        className="absolute left-5 top-4 cursor-pointer"
        animate={{ x: [0, -4, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      >
        <MoveLeft className="h-8 w-12 text-muted-foreground" />
      </motion.div>
    </Link>
  );
}
