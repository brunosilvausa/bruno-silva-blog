import { ogResponse } from '@/lib/og-response';

// Link preview of /central: "Central de Conteúdo" in volt, the page's one-line promise as the title.
export async function GET() {
  return ogResponse({ kicker: 'Central de Conteúdo', title: 'Prompts e passo a passo dos vídeos, prontos para copiar.' });
}
