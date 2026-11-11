import { Orbitron, Barlow, Barlow_Condensed } from 'next/font/google';
import Script from 'next/script';
import '@/styles/tokens.css';
import '@/styles/ds.css';
import '@/styles/page.css';
import { site } from '@/content/site';
import { siteUrl } from '@/lib/site-url';
import { FEED_TYPES } from '@/lib/feed';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['700', '800', '900'], variable: '--font-orbitron', display: 'swap' });
// Only the weights the blog uses: fewer font files to download before the first paint.
const barlow = Barlow({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-barlow', display: 'swap' });
const barlowCondensed = Barlow_Condensed({ subsets: ['latin'], weight: ['600'], variable: '--font-barlow-condensed', display: 'swap' });

export const metadata = {
  metadataBase: siteUrl(),
  title: site.meta.title,
  description: site.meta.description,
  alternates: { types: FEED_TYPES },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Bruno Silva USA',
    title: site.meta.title,
    description: site.meta.description,
    images: [{ url: '/og', width: 1200, height: 630, alt: site.meta.title }],
  },
  twitter: { card: 'summary_large_image', title: site.meta.title, description: site.meta.description, images: ['/og'] },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#02070b',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${orbitron.variable} ${barlow.variable} ${barlowCondensed.variable}`}>
      <body>
        {children}
        {/* Design-system motion helper: reveals, reading progress… Runs after hydration. */}
        <Script src="/ds.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
