import type { Metadata } from 'next';
import DashboardLayoutClient from './layout.client';

export const metadata: Metadata = {
  title: 'Dashboard - Task Project',
  description: 'Manage your tasks efficiently',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
} 