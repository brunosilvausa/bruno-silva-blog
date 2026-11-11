import { defineArrayMember, defineField, defineType } from 'sanity';

// The post body. Only what the blog renders (components/PortableText.jsx): paragraphs, two heading levels,
// quotes, lists, bold/italic/code, links, images with caption, "Dica / Atenção", Prompt and Checklist boxes.
export const blockContent = defineType({
  name: 'blockContent',
  title: 'Texto',
  type: 'array',
  of: [
    defineArrayMember({
      name: 'prompt',
      title: 'Prompt',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Título (opcional)', type: 'string' }),
        defineField({ name: 'label', title: 'Rótulo anterior (opcional)', type: 'string', description: 'Compatibilidade com prompts já criados. Usado quando não há título.' }),
        defineField({
          name: 'text',
          title: 'Texto do prompt',
          description: 'O texto exato que o leitor vai copiar. As quebras de linha são mantidas.',
          type: 'text',
          rows: 8,
          validation: (rule) => rule.required().custom((value) => (
            typeof value === 'string' && value.trim().length > 0
              ? true
              : 'Escreva o texto do prompt.'
          )),
        }),
      ],
      preview: {
        select: { title: 'title', label: 'label', text: 'text' },
        prepare: ({ title, label, text }) => ({ title: title?.trim() || label?.trim() || 'Prompt', subtitle: text }),
      },
    }),
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Parágrafo', value: 'normal' },
        { title: 'Título (H2)', value: 'h2' },
        { title: 'Subtítulo (H3)', value: 'h3' },
        { title: 'Citação (uma por post)', value: 'blockquote' },
      ],
      lists: [
        { title: 'Lista', value: 'bullet' },
        { title: 'Lista numerada', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Negrito', value: 'strong' },
          { title: 'Itálico', value: 'em' },
          { title: 'Código', value: 'code' },
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'Endereço',
                type: 'url',
                description: 'https://… para outros sites, ou /posts/… para um post deste blog.',
                validation: (rule) => rule.required().uri({ scheme: ['http', 'https'], allowRelative: true }),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      title: 'Imagem',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          description: 'Descreva a imagem para quem não pode vê-la.',
          validation: (rule) => rule.required(),
        }),
        defineField({ name: 'caption', title: 'Legenda', type: 'string' }),
      ],
    }),
    defineArrayMember({
      name: 'callout',
      title: 'Caixa de destaque',
      type: 'object',
      fields: [
        defineField({
          name: 'tone',
          title: 'Tipo',
          type: 'string',
          options: { list: [{ title: 'Dica', value: 'dica' }, { title: 'Atenção', value: 'atencao' }], layout: 'radio', direction: 'horizontal' },
          initialValue: 'dica',
          validation: (rule) => rule.required(),
        }),
        defineField({ name: 'text', title: 'Texto', type: 'text', rows: 3, validation: (rule) => rule.required().max(400) }),
      ],
      preview: {
        select: { tone: 'tone', text: 'text' },
        prepare: ({ tone, text }) => ({ title: tone === 'atencao' ? 'Atenção' : 'Dica', subtitle: text }),
      },
    }),
    defineArrayMember({
      name: 'checklist',
      title: 'Checklist',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Título',
          type: 'string',
          description: 'Opcional, curto. Ex.: "Teste de sete dias". Sem ele, aparece "Checklist".',
          validation: (rule) => rule.max(60),
        }),
        defineField({
          name: 'items',
          title: 'Itens',
          type: 'array',
          of: [{ type: 'string', validation: (rule) => rule.max(160) }],
          description: 'Um passo por item, até 12. O leitor marca no site e o navegador dele lembra.',
          validation: (rule) => rule.required().min(1).max(12),
        }),
      ],
      preview: {
        select: { title: 'title', items: 'items' },
        prepare: ({ title, items }) => ({ title: `Checklist: ${title || 'Checklist'}`, subtitle: `${(items || []).length} itens` }),
      },
    }),
  ],
});
