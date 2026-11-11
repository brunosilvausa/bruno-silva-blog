import { defineField, defineType } from 'sanity';

export const term = defineType({
  name: 'term',
  title: 'Termo',
  type: 'document',
  fields: [
    defineField({
      name: 'term',
      title: 'Termo',
      type: 'string',
      description: 'Como aparece no texto dos posts (ex.: EIN).',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'slug',
      title: 'Endereço (slug)',
      type: 'slug',
      description: 'Parte final do link: /glossario/<slug>. Clique em Generate.',
      options: { source: 'term', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fullName',
      title: 'Nome completo',
      type: 'string',
      description: 'Opcional. Nome completo em inglês (ex.: Employer Identification Number).',
      validation: (rule) => rule.max(90),
    }),
    defineField({
      name: 'short',
      title: 'Definição curta',
      type: 'text',
      rows: 3,
      description: 'Aparece no balão sobre o termo nos posts e na lista do glossário.',
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: 'body',
      title: 'Explicação',
      type: 'blockContent',
      description: 'Opcional. Explicação longa, mostrada na página do termo.',
    }),
    defineField({
      name: 'aliases',
      title: 'Outras grafias',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Opcional. Variações reconhecidas no texto dos posts (ex.: plural ou sigla em outro idioma).',
      validation: (rule) => rule.unique(),
    }),
  ],
  orderings: [{ title: 'A–Z', name: 'termAsc', by: [{ field: 'term', direction: 'asc' }] }],
  preview: {
    select: { title: 'term', subtitle: 'short' },
  },
});
