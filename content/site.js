// Textos fixos do blog. Os posts vêm do Sanity (ou de content/sample-posts.js enquanto ele não está ligado).
// Títulos com destaque em volt usam { before, em, after }.
import { safeHref } from '@/lib/safe-href';
import { PILLARS } from '@/lib/pillars';

const URL_CURSO = safeHref(process.env.NEXT_PUBLIC_URL_CURSO, 'https://bruno-silva-vendas.vercel.app');
const URL_CONSULTORIA = safeHref(process.env.NEXT_PUBLIC_URL_CONSULTORIA, 'https://bruno-silva-consultoria.vercel.app');
const URL_IA_DO_ZERO = safeHref(process.env.NEXT_PUBLIC_URL_IA_DO_ZERO, 'https://bruno-silva-ia-do-zero.vercel.app');
const URL_BIO = safeHref(process.env.NEXT_PUBLIC_URL_BIO, 'https://bruno-silva-bio.vercel.app');

export const site = {
  meta: {
    title: 'Blog | Bruno Silva USA',
    description: 'Tecnologia, empreendedorismo, inovação e impacto global, direto dos Estados Unidos, em português.',
    image: '/img/avatar.webp', // prévia de link (WhatsApp, redes)
  },

  // Faixa no topo enquanto os posts de exemplo aparecem (some sozinha quando o Sanity é ligado).
  demoNote: { label: 'Exemplo', text: 'Posts de demonstração. Ligue o Sanity para publicar os seus.' },

  nav: {
    ariaLabel: 'Principal',
    logoAlt: 'Bruno Silva USA — início do blog',
    links: PILLARS.map((p) => ({ label: p.label, href: `/pilar/${p.slug}` })),
    cta: { label: 'Quero receber', href: '/newsletter' },
  },

  home: {
    kicker: 'Blog',
    title: { before: 'Tecnologia e negócios ', em: 'direto dos EUA', after: '' },
    text: 'O que eu aprendo empreendendo nos Estados Unidos, explicado em português e sem juridiquês.',
    perPage: 9,
    empty: 'Nenhum post publicado ainda.',
  },

  pillarPage: {
    kicker: 'Pilar',
    texts: {
      tecnologia: 'Ferramentas, IA e tecnologia que eu uso para trabalhar melhor.',
      empreendedorismo: 'Abrir, organizar e fazer crescer um negócio nos Estados Unidos.',
      inovacao: 'Ideias, testes e formas novas de resolver problemas antigos.',
      'impacto-global': 'Trabalhar e vender entre o Brasil, os EUA e o resto do mundo.',
    },
  },

  // Caixa de autor e assinatura dos posts quando o post não tem autor no Sanity.
  author: {
    name: 'Bruno Silva',
    image: '/img/avatar.webp',
    bio: 'Guru da tecnologia, empreendedor e brasileiro nos Estados Unidos. Escreve sobre tecnologia e negócios toda semana.',
  },

  newsletter: {
    kicker: 'Newsletter',
    title: { before: 'Tecnologia e negócios ', em: 'toda semana', after: '' },
    text: 'O que eu estou testando, o que funcionou e o que não funcionou, direto no seu e-mail.',
    benefits: ['Uma ferramenta ou ideia prática por edição', 'Bastidores de empreender nos EUA', 'Leitura de 5 minutos, toda semana'],
    form: { label: 'Seu melhor e-mail', button: 'Quero receber', note: 'Um e-mail por semana. Cancele quando quiser.' },
    lastLabel: 'Ler o último post',
    page: {
      title: 'Newsletter | Bruno Silva USA',
      recentKicker: 'Últimos posts',
      recentTitle: { before: 'O que saiu ', em: 'recentemente', after: '' },
    },
  },

  footer: {
    logoAlt: 'Bruno Silva USA',
    tagline: 'Guru da tecnologia • Empreendedor • Brasileiro nos Estados Unidos',
    columns: [
      { title: 'Blog', links: PILLARS.map((p) => ({ label: p.label, href: `/pilar/${p.slug}` })) },
      { title: 'Trabalhe comigo', links: [{ label: 'Curso', href: URL_CURSO }, { label: 'Consultoria', href: URL_CONSULTORIA }, { label: 'IA do Zero', href: URL_IA_DO_ZERO }] },
      { title: 'Acompanhe', links: [{ label: 'Newsletter', href: '/newsletter' }, { label: 'RSS', href: '/rss.xml' }, { label: 'Todos os links', href: URL_BIO }] },
    ],
    copyright: '© 2026 Bruno Silva USA',
    legal: [{ label: 'Privacidade', href: '#' }, { label: 'Termos', href: '#' }],
  },
};
