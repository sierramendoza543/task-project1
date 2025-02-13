'use client';

import { motion, Variants } from 'framer-motion';

interface LoadingScreenProps {}

const containerVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

const textVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
};

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );
} 