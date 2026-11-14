import { defineField, defineType } from 'sanity';

// Mesmos valores de MATERIAL_KINDS em lib/materials.js (o Studio não importa de lib/).
const KINDS = [
  { value: 'prompt', title: 'Prompt' },
  { value: 'passo-a-passo', title: 'Passo a passo' },
  { value: 'checklist', title: 'Checklist' },
  { value: 'guia', title: 'Guia' },
];

export const material = defineType({
  name: 'material',
  title: 'Material',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'slug',
      title: 'Endereço (slug)',
      type: 'slug',
      description: 'Parte final do link: /central/<slug>. É o endereço que vai no vídeo. Clique em Generate.',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'kind',
      title: 'Tipo',
      type: 'string',
      options: { list: KINDS, layout: 'radio' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Resumo',
      type: 'text',
      rows: 3,
      description: 'Aparece no cartão e na descrição para buscadores (até 160 caracteres).',
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: 'cover',
      title: 'Capa',
      type: 'image',
      description: 'Opcional. Formato vertical (4:5), como o vídeo. Sem capa, o site usa um fundo colorido do tipo.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          description: 'Opcional. Deixe vazio se a imagem for só decorativa: o título já aparece em texto.',
        }),
      ],
    }),
    defineField({
      name: 'minutes',
      title: 'Minutos',
      type: 'number',
      description: 'Opcional. Tempo de uso, de 1 a 30 (aparece como "2 min").',
      validation: (rule) => rule.integer().min(1).max(30),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Link do vídeo',
      type: 'url',
      description: 'Opcional. Link do vídeo de origem.',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'videoDate',
      title: 'Data do vídeo',
      type: 'date',
      description: 'Opcional. Aparece como "Do vídeo de 12/11".',
    }),
    defineField({
      name: 'body',
      title: 'Conteúdo',
      type: 'blockContent',
      description: 'Os mesmos blocos dos posts: prompt com botão copiar, checklist, imagem, dica/atenção.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'next',
      title: 'Próximo material',
      type: 'reference',
      to: [{ type: 'material' }],
      description: 'Opcional. Sem escolha, o site sugere o material mais recente.',
      options: {
        filter: ({ document }) => {
          const id = String(document?._id || '').replace(/^drafts\./, '');
          return { filter: '_type == "material" && !(_id in [$id, "drafts." + $id])', params: { id } };
        },
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data de publicação',
      type: 'datetime',
      description: 'Ordena a Central. Com data futura, o material fica agendado e não aparece.',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'oldSlugs',
      title: 'Endereços antigos',
      type: 'array',
      of: [{ type: 'string' }],
      readOnly: true,
      hidden: ({ value }) => !Array.isArray(value) || value.length === 0,
      description: 'Preenchido sozinho quando você muda o endereço e publica: quem abrir um destes endereços vai para o atual.',
    }),
  ],
  orderings: [{ title: 'Mais novos primeiro', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: {
    select: { title: 'title', kind: 'kind' },
    prepare: ({ title, kind }) => ({ title, subtitle: KINDS.find((k) => k.value === kind)?.title || 'Sem tipo' }),
  },
});
