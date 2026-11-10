import { site } from '@/content/site';
import { usingSanity } from '@/lib/sanity';
import DemoNote from './DemoNote';
import NavBar from './NavBar';
import Footer from './Footer';

/** Every page: the demo note (only while sample posts show), NavBar, main content and Footer. */
export default function Shell({ current, children }) {
  return (
    <>
      {usingSanity() ? null : <DemoNote note={site.demoNote} />}
      <a className="blog-skip" href="#conteudo">Pular para o conteúdo</a>
      <NavBar nav={site.nav} current={current} />
      <main id="conteudo" tabIndex={-1}>{children}</main>
      <Footer data={site.footer} />
    </>
  );
}
