'use client';

import SignInForm from '@/components/auth/SignInForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Link href="/" className="mb-8">
        <h1 className="text-3xl font-bold text-indigo-600 font-poppins">Task Project</h1>
      </Link>
      <SignInForm />
      <p className="mt-4 text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-indigo-600 hover:text-indigo-800">
          Sign up
        </Link>
      </p>
    </div>
  );
} 