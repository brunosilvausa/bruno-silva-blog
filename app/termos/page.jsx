import { legal } from '@/content/legal';
import { FEED_TYPES } from '@/lib/feed';
import LegalPage from '@/components/LegalPage';

export const metadata = {
  title: `${legal.termos.title} | Bruno Silva USA`,
  description: legal.termos.lead,
  alternates: { canonical: '/termos', types: FEED_TYPES },
};

export default function Page() {
  return <LegalPage page={legal.termos} updated={legal.updated} current="/termos" />;
}
