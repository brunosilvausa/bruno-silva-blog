import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // Studio hospedado em https://bruno-silva-blog.sanity.studio (npm run deploy dentro de studio/).
  deployment: {
    appId: 'ddiexmypayaogfztw2ytjh65',
  },
});
