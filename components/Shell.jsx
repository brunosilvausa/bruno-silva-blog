import { site, navLinks, footerExtra } from '@/content/site';
import { usingSanity, getContentCounts } from '@/lib/sanity';
import DemoNote from './DemoNote';
import NavBar from './NavBar';
import Footer from './Footer';

/** Every page: the demo note (only while sample posts show), NavBar, main content and Footer. */
export default async function Shell({ current, children }) {
  const counts = await getContentCounts().catch(() => ({ terms: 0, series: 0, materials: 0 }));
  const extra = footerExtra(counts);
  const footer = {
    ...site.footer,
    columns: site.footer.columns.map((c) => (c.title === 'Blog' ? { ...c, links: [...c.links, ...extra] } : c)),
  };
  return (
    <>
      {usingSanity() ? null : <DemoNote note={site.demoNote} />}
      <a className="blog-skip" href="#conteudo">Pular para o conteúdo</a>
      <NavBar nav={{ ...site.nav, links: navLinks(counts) }} current={current} />
      <main id="conteudo" tabIndex={-1}>{children}</main>
      <Footer data={footer} />
    </>
  );
}
