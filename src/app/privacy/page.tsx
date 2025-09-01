'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import { useLocale } from '@/contexts/LocaleContext';

export default function PrivacyPage() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  {t.nav.home}
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">{t.privacy.title}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.privacy.title}</h1>
            <p className="text-gray-600 mb-8">{t.privacy.lastUpdated}: {new Date().toLocaleDateString()}</p>

            <div className="prose prose-gray max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.privacy.section1.title}</h2>
                <p className="text-gray-600 mb-4">{t.privacy.section1.content}</p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.privacy.section2.title}</h2>
                <p className="text-gray-600 mb-4">{t.privacy.section2.content}</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  {t.privacy.section2.items.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.privacy.section3.title}</h2>
                <p className="text-gray-600 mb-4">{t.privacy.section3.content}</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  {t.privacy.section3.items.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.privacy.section4.title}</h2>
                <p className="text-gray-600 mb-4">{t.privacy.section4.content}</p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.privacy.section5.title}</h2>
                <p className="text-gray-600 mb-4">{t.privacy.section5.content}</p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.privacy.section6.title}</h2>
                <p className="text-gray-600 mb-4">{t.privacy.section6.content}</p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.privacy.section7.title}</h2>
                <p className="text-gray-600 mb-4">{t.privacy.section7.content}</p>
                <p className="text-gray-600 mt-4">
                  <strong>{t.privacy.section7.email}:</strong>{' '}
                  <a href="mailto:privacy@propertyfinder.com" className="text-blue-600 hover:underline">
                    privacy@propertyfinder.com
                  </a>
                </p>
                <p className="text-gray-600 mt-2">
                  <strong>{t.privacy.section7.address}:</strong><br />
                  PropertyFinder<br />
                  123 Main Street, Suite 100<br />
                  New York, NY 10001
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}