import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';
import { keepOldSlug } from './actions/keepOldSlug';

// Editor do blog. Os textos da interface do Studio ficam em inglês; os campos estão em português.
export default defineConfig({
  name: 'default',
  title: 'Blog Bruno Silva USA',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Conteúdo')
          .items([
            S.documentTypeListItem('post').title('Posts'),
            S.documentTypeListItem('series').title('Séries'),
            S.listItem()
              .title('Glossário')
              .schemaType('term')
              .child(S.documentTypeList('term').title('Glossário').defaultOrdering([{ field: 'term', direction: 'asc' }])),
            S.listItem()
              .title('Central')
              .schemaType('material')
              .child(S.documentTypeList('material').title('Central').defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])),
            S.documentTypeListItem('author').title('Autores'),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
  // Publishing a post or material whose address changed keeps the old address, so old links still work.
  document: {
    actions: (prev, context) =>
      ['post', 'material'].includes(context.schemaType) ? prev.map((action) => (action.action === 'publish' ? keepOldSlug(action, context) : action)) : prev,
  },
});
