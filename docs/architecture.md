# Como site e Studio se conectam

Verificado no código em 2026-11-17. Site e Studio têm manifestos e lockfiles próprios; a raiz não é um workspace npm.

| Parte | Responsabilidade |
| --- | --- |
| `app/` | Rotas App Router, metadados, OG, RSS/sitemap e APIs |
| `components/` | Composição visual e interações client: formulário, copiar, glossário, leitura |
| `components/PortableText.jsx`, `public/ds.js` | O componente renderiza os checklists. O script guarda e restaura as marcações no `localStorage` por página e checklist. |
| `lib/sanity.js` | Consulta HTTP GROQ de conteúdo publicado e normalização; fallback de amostras sem configuração |
| `lib/format.js`, `lib/pt-html.js`, `lib/feed.js` | Extração, Portable Text e RSS |
| `lib/terms.js`, `lib/materials.js` | Regras compartilhadas de termos e materiais |
| `content/` | Textos fixos, políticas e amostras locais |
| `studio/schemaTypes/`, `studio/actions/` | Schemas Sanity e preservação dos slugs anteriores |
| `tests/` | node:test e fixtures locais de GROQ, sem serviços reais |

## Fronteiras

O servidor lê o dataset público do Sanity via API HTTP; não há SDK no site nem banco PostgreSQL. O Studio usa seu próprio conjunto de dependências. `lib/sanity.js` limita consultas a conteúdo publicado com slug e data válida; páginas usam cache com tag `sanity` e revalidação de 60 segundos.

Quando um slug muda, o Studio preserva o endereço anterior em `oldSlugs`. Se o slug solicitado não identifica um post ou material atual, a rota de `/posts/[slug]` ou `/central/[slug]` consulta `lib/sanity.js`. Se a consulta encontra o slug antigo em conteúdo publicado, a rota redireciona permanentemente para o endereço atual.

`POST /api/revalidate` exige segredo e assinatura HMAC recente; sem segredo responde 404. O cache é invalidado pela tag compartilhada. Não testar a invalidação de produção durante setup.

`POST /api/subscribe` valida formato JSON, origem, tamanho e e-mail, aplica honeypot e limite em memória, então chama `lib/subscribe.js`. Esse adaptador escolhe Kit, Mailchimp, Brevo ou `none`. No modo `none`, o adaptador devolve `{ ok: true, demo: true }` sem guardar o e-mail nem enviá-lo a um provedor. A API repassa o resultado e `components/EmailForm.jsx` usa `demo` para exibir a confirmação de demonstração. O limite é por instância e não impede abuso distribuído. Cabeçalhos encaminhados dependem de proxy confiável; isso requer revisão quando o hosting mudar.

Links externos passam pelas validações existentes. O Studio altera conteúdo remoto somente por ações editoriais; build não equivale a teste de publicação. Variáveis `NEXT_PUBLIC_*` são públicas e incorporadas ao build. Segredos de provedor e webhook permanecem server-side.

## Manutenção

Antes de alterar uma função compartilhada, localizar seus chamadores, schemas, testes e projeções GROQ. Não alterar tipos/nomes entre site e Studio isoladamente. A cópia original do design system é protegida; consulte [design](design.md). Atualize esta referência se fronteiras, cache, serviços, rotas ou contratos mudarem.
