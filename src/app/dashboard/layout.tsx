'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import LoadingScreen from '@/components/ui/LoadingScreen';
import Navigation from '@/components/layout/Navigation';
import { Settings2 } from 'lucide-react';
import Settings from '@/components/settings/Settings';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'tasks';

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Sync URL with current tab
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('tab', currentTab);
    window.history.replaceState({}, '', newUrl.toString());
  }, [currentTab]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        {children}
      </main>
    </div>
  );
} 