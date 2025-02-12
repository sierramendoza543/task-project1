'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import SignUpForm from '@/components/auth/SignUpForm';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-xl mx-auto pt-40 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-space text-4xl font-bold text-gray-900 mb-2"
          >
            Create your account
          </motion.h1>
          <p className="text-gray-600">
            Start organizing your tasks today
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8"
        >
          <SignUpForm />
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Log in
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 