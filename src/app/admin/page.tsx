import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Admin Panel - PropertyFinder',
  description: 'Administrative dashboard for managing users, properties, and agents',
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground">
          Manage users, properties, agents, and system settings
        </p>
      </div>

      <AdminDashboard />
    </Container>
  );
}