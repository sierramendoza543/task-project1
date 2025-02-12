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

export default function LoadingScreen({}: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="text-center"
      >
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
        </div>
        <motion.h2 
          variants={textVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
          className="text-xl font-bold font-space text-gray-800"
        >
          Signing you in...
        </motion.h2>
        <motion.p
          variants={textVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.4 }}
          className="text-gray-500 font-dm mt-2"
        >
          Just a moment while we prepare your dashboard
        </motion.p>
      </motion.div>
    </div>
  );
} 