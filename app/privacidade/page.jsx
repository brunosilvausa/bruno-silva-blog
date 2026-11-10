import { legal } from '@/content/legal';
import { FEED_TYPES } from '@/lib/feed';
import LegalPage from '@/components/LegalPage';

export const metadata = {
  title: `${legal.privacidade.title} | Bruno Silva USA`,
  description: legal.privacidade.lead,
  alternates: { canonical: '/privacidade', types: FEED_TYPES },
};

export default function Page() {
  return <LegalPage page={legal.privacidade} updated={legal.updated} current="/privacidade" />;
}
