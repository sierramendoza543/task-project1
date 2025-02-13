'use client';

import Link from 'next/link';
import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-8 bg-gray-900 text-gray-400">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold mb-4">Task Project</h3>
            <p className="text-sm">
              Streamline your workflow with our intuitive task management platform.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-white transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link 
                  href="https://github.com/sierramendoza543/task-project1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Contact</h3>
            <p className="text-sm">
              Questions? Reach out to us at sierramendoza543@gmail.com
            </p>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-800 text-center text-sm">
          <p>© {new Date().getFullYear()} Task Project. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 