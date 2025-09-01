import './globals.css';
import { LocaleProvider } from '@/contexts/LocaleContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import RecoilProvider from '@/components/RecoilProvider';
import AuthProvider from '@/components/AuthProvider';
import UserNav from '@/components/UserNav';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AdminNav from '@/components/AdminNav';
import SearchBar from '@/components/SearchBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PropertyFinder - Find Your Dream Home',
  description: 'Discover the perfect property from our extensive collection. Search by location, price, or property type to find your ideal home.',
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/favicon.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <RecoilProvider>
            <LocaleProvider>
            {/* Global Header */}
            <header className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Logo */}
                <div className="flex-shrink-0">
                  <a href="/" className="text-xl font-bold text-gray-900">
                    <span className="hidden sm:inline">Rent2Earn</span>
                    <span className="hidden min-[400px]:inline sm:hidden">RentE</span>
                    <span className="min-[400px]:hidden">RE</span>
                  </a>
                </div>

                {/* Search */}
                <div className="flex-1 max-w-xl mx-4">
                  <SearchBar />
                </div>

                {/* User Navigation and Language Switcher */}
                <div className="flex items-center gap-4">
                  <AdminNav />
                  <LanguageSwitcher />
                  <UserNav />
                </div>
              </div>
            </div>
          </header>
          
            {/* Main Content with top padding for fixed header */}
            <main className="pt-16">
              {children}
            </main>
            <Toaster />
            </LocaleProvider>
          </RecoilProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
