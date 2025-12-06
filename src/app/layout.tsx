import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingContact from '@/components/ui/FloatingContact';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'تي دي للخدمات اللوجستية | TD Logistics',
  description: 'شريكك الموثوق في الشحن والتوصيل. نقدم خدمات لوجستية متكاملة بأعلى معايير الجودة والأمان في المملكة العربية السعودية.',
  keywords: 'شحن، توصيل، لوجستيات، السعودية، تي دي، TD Logistics، شحن سريع، تتبع الشحنات',
  authors: [{ name: 'TD Logistics' }],
  metadataBase: new URL('https://tdlogistics.sa'),
  openGraph: {
    title: 'تي دي للخدمات اللوجستية | TD Logistics',
    description: 'شريكك الموثوق في الشحن والتوصيل',
    type: 'website',
    locale: 'ar_SA',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingContact />
      </body>
    </html>
  );
}
