'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function MainNavigation() {
  const { user } = useAuth();
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-gray-900 font-space">
              Task Project
            </Link>
          </div>
          
          <nav className="flex items-center gap-6">
            {!isAuthPage && (
              <Link 
                href="/about"
                className="font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                About
              </Link>
            )}
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
      </div>
    </motion.header>
  );
} 