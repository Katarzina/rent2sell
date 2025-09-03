'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';
import { Mail, Phone, MapPin, Globe, MessageSquare, Linkedin } from 'lucide-react';

export default function Footer() {
  const { t } = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Rent2Earn</h3>
            <p className="text-sm mb-4">
              {t.footer.companyDescription}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <MessageSquare className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:text-white transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="text-sm hover:text-white transition-colors">
                  API
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">{t.footer.services}</h3>
            <ul className="space-y-2">
              <li className="text-sm">{t.footer.rentOut}</li>
              <li className="text-sm">{t.footer.rentIn}</li>
              <li className="text-sm">{t.footer.provideServices}</li>
              <li className="text-sm">{t.footer.orderServices}</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">{t.footer.contactInfo}</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  {process.env.NEXT_PUBLIC_COMPANY_ADDRESS}
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 flex-shrink-0" />
                <span className="text-sm">{process.env.NEXT_PUBLIC_CONTACT_PHONE}</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 flex-shrink-0" />
                <span className="text-sm">{process.env.NEXT_PUBLIC_CONTACT_EMAIL}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {currentYear} Rent2Earn. {t.footer.allRightsReserved}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                {t.footer.privacyPolicy}
              </Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                {t.footer.termsOfService}
              </Link>
              <Link href="/cookies" className="text-sm text-gray-400 hover:text-white transition-colors">
                {t.footer.cookiePolicy}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}