'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import UserMenu from './UserMenu';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/dashboard?tab=tasks', label: 'Tasks', id: 'tasks' },
  { href: '/dashboard?tab=goals', label: 'Goals', id: 'goals' },
  { href: '/dashboard?tab=analytics', label: 'Analytics', id: 'analytics' }
];

export default function Navigation() {
  const { user } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get('tab') || 'tasks';

  const handleTabClick = (e: React.MouseEvent<HTMLAnchorElement>, tab: string) => {
    e.preventDefault();
    router.push(`/dashboard?tab=${tab}`);
    // Force a refresh of the page state
    window.dispatchEvent(new CustomEvent('tabchange', { detail: tab }));
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold text-gray-900">
              Task Project
            </Link>
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleTabClick(e, item.id)}
                  className={`relative px-1 py-2 text-sm font-medium transition-colors ${
                    currentTab === item.id
                      ? 'text-indigo-600'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                  {currentTab === item.id && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                </Link>
              ))}
            </nav>
          </div>
          <UserMenu />
        </div>
      </div>
    </motion.header>
  );
} 