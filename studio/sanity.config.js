import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';

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
            S.documentTypeListItem('author').title('Autores'),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
