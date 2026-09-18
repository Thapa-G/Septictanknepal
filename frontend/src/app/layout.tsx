import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

import { CompanyProvider } from '@/context/CompanyContext';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://omganeshayasarsafai.com.np';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  verification: {
    google: 'lIt7vq6qCAZ15Ns1Xft0Xy4E41PxxiMGWFt0pv3OdUE',
  },
  icons: {
    icon: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="bg-[#f8fafc] text-[#0f172a] font-sans antialiased min-h-screen flex flex-col selection:bg-[#1d4ed8] selection:text-white">
        <CompanyProvider>
          {children}
        </CompanyProvider>
      </body>
    </html>
  );
}
