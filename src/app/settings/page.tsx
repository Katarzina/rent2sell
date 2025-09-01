import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { SettingsForm } from '@/components/settings/SettingsForm';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Settings - PropertyFinder',
  description: 'Manage your account settings and preferences',
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <Container className="py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and set your preferences
          </p>
        </div>

        <SettingsForm user={session.user} />
      </div>
    </Container>
  );
}