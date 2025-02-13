'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingScreen from '@/components/ui/LoadingScreen';
import Link from 'next/link';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-bold text-gray-900 font-space">
                Task Project
              </Link>
              <Link
                href="/about"
                className="font-dm text-gray-500 hover:text-gray-900 relative group transition-colors"
              >
                About
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="font-dm text-gray-500 hover:text-gray-900 relative group transition-colors"
              >
                Log In
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
              <Link
                href="/signup"
                className="group relative px-4 py-2 bg-gray-900 text-white rounded-lg overflow-hidden font-dm"
              >
                <span className="relative z-10 flex items-center justify-center w-full">
                  <span>Sign Up</span>
                  <span className="ml-2">→</span>
                </span>
                <span className="absolute inset-0 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="pt-16">
        {children}
      </main>
    </>
  );
} 