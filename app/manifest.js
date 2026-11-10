import { site } from '@/content/site';

// "Adicionar à tela de início" no celular: nome, cores e ícones do app.
export default function manifest() {
  return {
    name: site.meta.title,
    short_name: 'Bruno Silva',
    description: site.meta.description,
    lang: 'pt-BR',
    start_url: '/',
    display: 'standalone',
    background_color: '#02070b',
    theme_color: '#02070b',
    icons: [
      { src: '/img/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/img/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
