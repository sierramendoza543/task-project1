'use client';

import { useState } from 'react';
import { Settings2 } from 'lucide-react';
import Settings from '@/components/settings/Settings';
import { useAuth } from '@/context/AuthContext';

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSettings, setShowSettings] = useState(false);
  const { user, userProfile, isLoading } = useAuth();

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowSettings(true)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors bg-white shadow-sm"
        >
          <Settings2 className="w-5 h-5" />
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {children}
      </main>

      {showSettings && (
        <Settings 
          isOpen={showSettings} 
          onClose={() => setShowSettings(false)} 
          user={user} 
        />
      )}
    </div>
  );
} 