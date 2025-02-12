'use client';

import SignUpForm from '@/components/auth/SignUpForm';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Link href="/" className="mb-8">
        <h1 className="text-3xl font-bold text-indigo-600 font-poppins">Task Project</h1>
      </Link>
      <SignUpForm />
      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-indigo-600 hover:text-indigo-800">
          Sign in
        </Link>
      </p>
    </div>
  );
} 