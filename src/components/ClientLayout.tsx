'use client';

import { ReactNode, useEffect, useState } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import CookieConsent from './CookieConsent';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AuthProvider>
      {mounted ? children : null}
      <CookieConsent />
    </AuthProvider>
  );
} 