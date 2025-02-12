'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCookie, setCookie } from '@/utils/cookies';

interface CookieConsentProps {}

export default function CookieConsent({}: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState<boolean>(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = getCookie('cookie-consent');
    if (!hasAccepted) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = (): void => {
    setCookie('cookie-consent', 'true', 365); // Set for one year
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
        >
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1 text-center sm:text-left">
                <p className="text-gray-700 font-dm">
                  We use cookies to enhance your experience and keep you signed in. 
                  By using this website, you agree to our use of cookies.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="/privacy"
                  className="text-indigo-600 hover:text-indigo-800 font-dm text-sm flex items-center justify-center min-w-[80px]"
                >
                  Learn More
                </a>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={acceptCookies}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-dm text-sm transition-colors min-w-[100px]"
                >
                  Accept
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 