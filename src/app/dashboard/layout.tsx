'use client';

import { useAuth } from '@/context/AuthContext';
import Navigation from '@/components/layout/Navigation';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
        pathname === '/dashboard/settings' ? 'pt-24' : 'py-8'
      }`}>
        {children}
      </main>
    </div>
  );
} 