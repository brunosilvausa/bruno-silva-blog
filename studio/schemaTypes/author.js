import { defineField, defineType } from 'sanity';

export const author = defineType({
  name: 'author',
  title: 'Autor',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nome', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'image', title: 'Foto', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'bio', title: 'Bio', type: 'text', rows: 3, description: 'Aparece na caixa do autor no fim de cada post.', validation: (rule) => rule.max(300) }),
  ],
  preview: { select: { title: 'name', media: 'image' } },
});
