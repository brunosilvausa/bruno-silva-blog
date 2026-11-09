import Shell from '@/components/Shell';
import SectionHeader from '@/components/SectionHeader';

export const metadata = { title: 'Página não encontrada | Bruno Silva USA' };

export default function NotFound() {
  return (
    <Shell>
      <section className="bs-section" aria-labelledby="titulo">
        <div className="bs-container">
          <SectionHeader level={1} id="titulo" kicker="Erro 404" title={{ before: 'Página não ', em: 'encontrada', after: '' }} text="O post pode ter mudado de endereço ou saído do ar." />
          <p className="blog-empty"><a className="bs-btn bs-btn--primary" href="/">Ver todos os posts</a></p>
        </div>
      </section>
    </Shell>
  );
}
