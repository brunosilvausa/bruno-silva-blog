import { defineField, defineType } from 'sanity';

export const series = defineType({
  name: 'series',
  title: 'Série',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: 'slug',
      title: 'Endereço (slug)',
      type: 'slug',
      description: 'Parte final do link: /series/<slug>. Clique em Generate.',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'text',
      rows: 3,
      description: 'Uma ou duas frases sobre o que a série cobre.',
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: 'cover',
      title: 'Capa',
      type: 'image',
      description: 'Opcional. Sem capa, o cartão mostra a bandeira.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          validation: (rule) => rule.custom((alt, ctx) => (ctx.parent?.asset && !alt ? 'Descreva a capa para quem não pode vê-la.' : true)),
        }),
      ],
    }),
    defineField({
      name: 'posts',
      title: 'Posts da série',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'post' }] }],
      description: 'Na ordem das partes. Arraste para reordenar. Um post só deve estar em uma série.',
      validation: (rule) => [
        rule.required().min(2).max(30).unique(),
        // Warn (not block) when a post already belongs to another series.
        rule
          .custom(async (posts, context) => {
            const refs = (posts || []).map((p) => p?._ref).filter(Boolean);
            if (!refs.length) return true;
            const id = context.document?._id || '';
            const published = id.replace(/^drafts\./, '');
            const client = context.getClient({ apiVersion: '2025-02-19' });
            const others = await client.fetch(
              '*[_type == "series" && _id != $id && _id != $draftId && count(posts[_ref in $refs]) > 0]{ title }',
              { id: published, draftId: `drafts.${published}`, refs },
            );
            if (!others?.length) return true;
            const names = others.map((s) => `"${s.title}"`).join(', ');
            return `Algum post já está em outra série: ${names}. O site usa a primeira série encontrada.`;
          })
          .warning(),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', posts: 'posts', media: 'cover' },
    prepare: ({ title, posts, media }) => {
      const n = Array.isArray(posts) ? posts.length : 0;
      return { title, subtitle: `${n} ${n === 1 ? 'parte' : 'partes'}`, media };
    },
  },
});
