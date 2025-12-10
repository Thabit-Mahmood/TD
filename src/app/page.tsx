import Hero from '@/components/home/Hero';
import ClientLogos from '@/components/home/ClientLogos';
import Services from '@/components/home/Services';
import WhyUs from '@/components/home/WhyUs';
import QaseemSection from '@/components/home/QaseemSection';
import CoverageSection from '@/components/home/CoverageSection';
import Testimonials from '@/components/home/Testimonials';
import ClientsSection from '@/components/home/ClientsSection';
import HomeFAQ from '@/components/home/HomeFAQ';
import CTA from '@/components/home/CTA';

export const metadata = {
  title: 'تي دي للخدمات اللوجستية | شريكك الموثوق في الشحن والتوصيل',
  description: 'خدمات لوجستية متكاملة في السعودية. توصيل سريع، تتبع مباشر، دفع عند الاستلام. معدل توصيل 99.2% في الوقت المحدد. نغطي الرياض، جدة، الدمام وجميع مدن المملكة.',
  alternates: {
    canonical: 'https://tdlogistics.sa',
  },
};

export default function Home() {
  // Structured Data for Organization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'تي دي للخدمات اللوجستية',
    alternateName: 'TD Logistics',
    url: 'https://tdlogistics.sa',
    logo: 'https://tdlogistics.sa/logo.png',
    description: 'شريكك الموثوق في الشحن والتوصيل في المملكة العربية السعودية',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'طريق الملك فهد، حي العليا',
      addressLocality: 'الرياض',
      postalCode: '12244',
      addressCountry: 'SA',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '9200-15499',
        contactType: 'customer service',
        areaServed: 'SA',
        availableLanguage: ['ar', 'en'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '9200-15499',
        contactType: 'sales',
        areaServed: 'SA',
        availableLanguage: ['ar', 'en'],
      },
    ],
    sameAs: [
      'https://www.instagram.com/tdlogistics_sa',
      'https://x.com/tdlogistics_sa',
      'https://www.linkedin.com/company/tdlogistics/',
    ],
  };

  // Structured Data for Local Business
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://tdlogistics.sa',
    name: 'تي دي للخدمات اللوجستية',
    image: 'https://tdlogistics.sa/logo.png',
    telephone: '9200-15499',
    email: 'info@tdlogistics.co',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'طريق الملك فهد، حي العليا',
      addressLocality: 'الرياض',
      postalCode: '12244',
      addressCountry: 'SA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 24.7136,
      longitude: 46.6753,
    },
    url: 'https://tdlogistics.sa',
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '1000',
    },
  };

  // Structured Data for Service
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'خدمات لوجستية وشحن',
    provider: {
      '@type': 'Organization',
      name: 'تي دي للخدمات اللوجستية',
    },
    areaServed: {
      '@type': 'Country',
      name: 'المملكة العربية السعودية',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'خدمات الشحن والتوصيل',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'التوصيل للميل الأخير',
            description: 'توصيل سريع وموثوق إلى عتبة باب عملائك',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'حلول التجارة الإلكترونية',
            description: 'تحصيل الدفع عند الاستلام وإدارة المرتجعات',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'التوصيل المخصص',
            description: 'حلول لوجستية مصممة خصيصاً لاحتياجات عملك',
          },
        },
      ],
    },
  };

  // FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ما هي المناطق التي تغطيها خدماتكم؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'نغطي أكثر من 50 مدينة في جميع أنحاء المملكة العربية السعودية، بما في ذلك الرياض، جدة، الدمام، مكة، المدينة، وجميع المدن الرئيسية والمناطق النائية.',
        },
      },
      {
        '@type': 'Question',
        name: 'كيف يمكنني تتبع شحنتي؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'يمكنك تتبع شحنتك في الوقت الفعلي عبر موقعنا الإلكتروني باستخدام رقم التتبع. نوفر أيضاً إشعارات تلقائية عبر SMS والبريد الإلكتروني لإبقائك على اطلاع بحالة شحنتك.',
        },
      },
      {
        '@type': 'Question',
        name: 'هل توفرون خدمة الدفع عند الاستلام؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'نعم، نوفر خدمة تحصيل الدفع عند الاستلام الكاملة مع تحويل آمن للأموال خلال 48 ساعة عمل وتقارير مالية شاملة.',
        },
      },
      {
        '@type': 'Question',
        name: 'ما هو معدل التوصيل في الوقت المحدد؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'نحافظ على معدل توصيل في الوقت المحدد بنسبة 99.2%، وهو من أعلى المعدلات في صناعة الخدمات اللوجستية في السعودية.',
        },
      },
      {
        '@type': 'Question',
        name: 'كيف يمكنني الحصول على عرض سعر؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'يمكنك طلب عرض سعر مخصص عبر موقعنا الإلكتروني أو الاتصال بفريق المبيعات. نرد على جميع الطلبات خلال 24 ساعة عمل.',
        },
      },
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Hero />
      <ClientsSection />
      <Services />
      <WhyUs />
      <ClientLogos />
      <QaseemSection />
      <CoverageSection />
      <Testimonials />
      <HomeFAQ />
      <CTA />
    </>
  );
}
