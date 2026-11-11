// Séries de EXEMPLO, mostradas só enquanto o Sanity não está configurado (NEXT_PUBLIC_SANITY_PROJECT_ID vazio).
// `posts` lista os slugs dos posts de exemplo (content/sample-posts.js), na ordem de leitura.
// Mantenha a exportação SAMPLE_SERIES depois de ligar o Sanity.

export const SAMPLE_SERIES = [
  {
    _id: 'exemplo-serie-abrir-empresa',
    title: 'Abrir empresa nos EUA',
    slug: 'abrir-empresa-nos-eua',
    description: 'Do estado da LLC ao EIN e ao recebimento em dólar: o caminho para abrir a sua empresa americana sem se perder.',
    cover: null,
    posts: ['como-escolher-o-estado-da-sua-llc', 'o-que-e-o-ein', 'receber-em-dolar-de-clientes-no-brasil'],
  },
];
