# Central de Conteúdo

Desenho aprovado pelo usuário em 14 de novembro de 2026.

## Intenção

Bruno publica vídeos curtos (reels). Quem assiste toca no link do vídeo e cai direto no material daquele vídeo para **copiar o prompt** ou seguir o passo a passo. A Central é o lugar desses materiais: curtos, práticos, feitos para o celular e para pegar rápido.

Sucesso: cada vídeo novo vira um material em poucos minutos no Studio, com um endereço próprio para colocar no vídeo; quem chega copia o prompt sem atrito e encontra o próximo passo.

Referências (só para entender o formato, não a identidade): fernandods.com.br/centraldeMateriais, central-material.pages.dev, goat-entregas.vercel.app.

## Objetivos

- Página `/central` com todos os materiais e uma página por material em `/central/<slug>`.
- Copiar prompt em um toque (PromptCard já existente).
- Depois do material: (1) próximo material relacionado, (2) seguir o perfil, (3) chamada discreta para IA do Zero e Consultoria.

## Fora do escopo

- Pedir e-mail para liberar material (decisão: tudo aberto). Quando a newsletter tiver serviço, entra um quarto passo "receba os novos guias por e-mail"; não construir agora.
- Busca por palavra-chave comentada (estilo Fernando), downloads de PDF/Word, área de membros.

## Anti-objetivos

- Qualquer barreira entre quem chegou do vídeo e o prompt (cadastro, pop-up, rolagem longa antes do conteúdo).
- Materiais aparecendo como artigos: não entram na lista do blog, nas páginas de pilar, na paginação nem no RSS.

## Abordagens consideradas

- **A. Tipo novo no Studio "Material" — escolhida.** Campos próprios (tipo, vídeo, passos), endereços `/central`, separado dos posts. Custa um schema novo e duas páginas.
- **B. Post com marcação "guia rápido".** Mais barato, mas herda a cara de artigo longo (autor, tempo de leitura, pilar), não tem campos do vídeo e exige excluir esses posts de lista, pilar e RSS; separar depois é mais caro.
- **Converter página existente — descartada.** Séries e glossário têm outra função; newsletter depende de serviço ainda não contratado.

## Studio — tipo `material` ("Material")

| Campo | Tipo | Regra |
|---|---|---|
| `title` | string | Obrigatório, até 80. |
| `slug` | slug | Obrigatório, gerado do título (é o endereço que vai no vídeo). Troca de slug usa a mesma ação de guardar endereço antigo (`keepOldSlug` / `oldSlugs`) dos posts. |
| `kind` | string (lista) | Obrigatório: Prompt, Passo a passo, Checklist, Guia. |
| `summary` | text | Obrigatório, até 160. Aparece no cartão e na descrição SEO. |
| `minutes` | number | Opcional, 1–30. "2 min". |
| `videoUrl` | url | Opcional. Link do vídeo de origem. |
| `videoDate` | date | Opcional. "Do vídeo de 12/11". |
| `body` | `blockContent` | Obrigatório. Os mesmos blocos dos posts (prompt com copiar, checklist, imagem, callout). |
| `next` | reference → material | Opcional. Próximo material relacionado. |
| `publishedAt` | datetime | Obrigatório. Ordena a Central. |
| `oldSlugs` | array de string | Somente leitura, preenchido pela ação `keepOldSlug` (registrada também para `material`). |

Preview no Studio: título + tipo. Entrada própria "Central" na `structure` do `sanity.config.js`, com ordenação pela data mais nova.

## Site

### `/central`
- Cabeçalho curto (título "Central de Conteúdo", uma frase) e a lista de materiais mais novos primeiro, como cartões: tipo, título, resumo, minutos.
- Filtro por tipo (botões; sem JS a lista inteira aparece).
- Vazio: 404 até existir um material (mesmo padrão de glossário e séries).

### `/central/[slug]`
Ordem no celular, conteúdo primeiro:
1. Voltar "‹ Central", rótulo do tipo + minutos, título.
2. Linha "Do vídeo de <data> ▸ assistir" quando houver `videoUrl` (abre em nova aba).
3. Corpo (PortableText com PromptCard, Checklist, TermTip do glossário).
4. Fim: "Próximo: <título> →" (campo `next`; sem ele, o material mais recente diferente deste); "Siga para os próximos vídeos" com link do perfil; uma linha com IA do Zero e Consultoria (`URL_IA_DO_ZERO`, `URL_CONSULTORIA` de `content/site.js`).
- SEO: título, descrição = `summary`, OG gerado como nos posts, JSON-LD `CreativeWork` (sem `HowTo`: o corpo é livre e não dá passos estruturados confiáveis) e `BreadcrumbList`; breadcrumb Blog › Central › Material.
- Endereço antigo redireciona com `permanentRedirect`, como os posts.

### Navegação e sitemap
- Menu de cima ganha "Central" (é o destino principal de quem vem dos vídeos). Rodapé, coluna "Blog", também "Central", exibido só quando existe material.
- Sitemap inclui `/central` e cada material. RSS não.

## Dados (`lib/sanity.js`)

`getMaterials()`, `getMaterial(slug)` (com `next` resolvido), `getContentCounts()` passa a contar materiais. Revalidate 60 e tag `sanity`, como o resto. O webhook do README passa a incluir `material` no filtro `_type in [...]`. Sem Sanity: materiais de exemplo em `content/sample-materials.js`.

## Design system

Componente novo com README e prévia: **MaterialCard** (cartão da Central: rótulo do tipo, título, resumo, minutos). A página do material usa componentes existentes (PromptCard, Checklist, TermTip, SectionHeader).

## Decisões do builder (calls de Claude)

- Link do perfil: variável `NEXT_PUBLIC_URL_INSTAGRAM`; sem ela, a linha "Siga" não aparece.
- Menu de cima com "Central": proposta de Claude; reversível.
- MaterialCard nasce no design system (artifact) e chega ao blog pela cópia de sempre do bundle (`public/ds.js`, `styles/ds.css`).
- PromptCard/Checklist/TermTip são os componentes atuais (`PromptBlock.jsx` etc.), sem mudança.
- Testes de navegador ficam fora do repo, como antes (scripts Playwright no container).
- Visual segue o DS atual (volt sobre preto, Orbitron/Barlow).

## Testes

- Unidade (`node --test`): ordenação e filtro por tipo, escolha do "próximo" (campo ou fallback, nunca o próprio), materiais fora de RSS e da lista de posts, contagem para o rodapé.
- Navegador (Playwright, dados de exemplo): `/central` com filtro e sem JS, página do material no celular 390px (prompt visível sem rolar além do título, copiar funciona), links do fim, 404 vazio, redirecionamento de slug antigo.
