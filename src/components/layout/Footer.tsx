'use client';

import Link from 'next/link';
import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Task Project</h3>
            <p className="text-gray-600 text-sm">
              Streamline your workflow with our intuitive task management platform.
            </p>
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Task Project. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About' },
                { href: '/login', label: 'Login' },
                { href: '/signup', label: 'Sign Up' }
              ].map(link => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href="mailto:sierramendoza543@gmail.com"
                  className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  sierramendoza543@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/sierramendoza543/task-project1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Repository</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
} 