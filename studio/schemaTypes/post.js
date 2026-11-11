import { defineField, defineType } from 'sanity';

// Same values as lib/pillars.js in the site (brand order). Changing a value here breaks existing posts.
const PILLARS = [
  { title: 'Tecnologia', value: 'tecnologia' },
  { title: 'Empreendedorismo', value: 'empreendedorismo' },
  { title: 'Inovação', value: 'inovacao' },
  { title: 'Impacto Global', value: 'impacto-global' },
];

export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fieldsets: [
    {
      name: 'seo',
      title: 'SEO (Google e redes sociais)',
      description: 'Opcional. Muda só como o post aparece no Google e nos links compartilhados; o post continua igual.',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      description: 'Até dez palavras. O site mostra em maiúsculas.',
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: 'slug',
      title: 'Endereço (slug)',
      type: 'slug',
      description: 'Parte final do link: /posts/<slug>. Clique em Generate.',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pillar',
      title: 'Pilar',
      type: 'string',
      options: { list: PILLARS, layout: 'radio' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data de publicação',
      type: 'datetime',
      description: 'O post só aparece no site a partir desta data.',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Resumo',
      type: 'text',
      rows: 2,
      description: 'Uma frase para os cartões da lista de posts.',
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'lead',
      title: 'Abertura',
      type: 'text',
      rows: 3,
      description: 'Frase em cinza abaixo do título do post. Se ficar vazia, usa o resumo.',
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: 'coverImage',
      title: 'Capa',
      type: 'image',
      description: 'Opcional. Foto do próprio post, colorida. Sem capa, o cartão mostra a bandeira e o ícone do pilar.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          validation: (rule) => rule.custom((alt, ctx) => (ctx.parent?.asset && !alt ? 'Descreva a capa para quem não pode vê-la.' : true)),
        }),
        defineField({ name: 'caption', title: 'Legenda', type: 'string' }),
      ],
    }),
    defineField({ name: 'body', title: 'Texto', type: 'blockContent', validation: (rule) => rule.required() }),
    defineField({ name: 'author', title: 'Autor', type: 'reference', to: [{ type: 'author' }] }),
    defineField({
      name: 'seoTitle',
      title: 'Título para o Google',
      type: 'string',
      fieldset: 'seo',
      description: 'Até 60 caracteres. Aparece na aba do navegador, no Google e nos links compartilhados. Sem ele, usa o título do post.',
      validation: (rule) => rule.max(60).warning('Acima de 60 caracteres o Google corta o título.'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Descrição para o Google',
      type: 'text',
      rows: 2,
      fieldset: 'seo',
      description: 'Até 160 caracteres. Sem ela, usa o resumo.',
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'ogImage',
      title: 'Imagem de compartilhamento',
      type: 'image',
      fieldset: 'seo',
      description: 'Aparece quando o link é compartilhado (WhatsApp, LinkedIn, X). Use 1200 × 630. Sem ela, usa a capa; sem capa, a imagem gerada com a marca.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          validation: (rule) => rule.custom((alt, ctx) => (ctx.parent?.asset && !alt ? 'Descreva a imagem para quem não pode vê-la.' : true)),
        }),
      ],
    }),
  ],
  orderings: [{ title: 'Mais novos primeiro', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: {
    select: { title: 'title', pillar: 'pillar', date: 'publishedAt', media: 'coverImage' },
    prepare: ({ title, pillar, date, media }) => ({
      title,
      subtitle: [PILLARS.find((p) => p.value === pillar)?.title, date ? new Date(date).toLocaleDateString('pt-BR') : 'sem data'].filter(Boolean).join(' • '),
      media,
    }),
  },
});
