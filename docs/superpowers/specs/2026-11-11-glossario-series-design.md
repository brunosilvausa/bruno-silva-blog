# Glossário e Séries

Desenho aprovado pelo usuário em 11 de novembro de 2026. Primeira parte da evolução da estrutura do blog (depois vêm Recursos com afiliados e "Comece aqui"; a página de links ficou para depois).

## Objetivo

Dar ao blog dois formatos de conteúdo de blog profissional:

- **Glossário:** termos americanos (EIN, LLC, ITIN…) explicados em português, ligados automaticamente aos posts que os usam.
- **Séries:** posts em sequência numerada, com navegação entre as partes.

Sucesso: o autor cria termos e séries só no Studio; o site mostra as páginas novas, liga os termos nos posts e a navegação da série sem nenhuma outra ação.

## Glossário

### Studio — tipo `term` ("Termo")

| Campo | Tipo | Regra |
|---|---|---|
| `term` | string | Obrigatório, até 40. Como aparece no texto (ex.: "EIN"). |
| `slug` | slug | Obrigatório, gerado do termo. |
| `fullName` | string | Opcional, até 90. Nome completo em inglês. |
| `short` | text | Obrigatório, até 220. Definição curta (balão e lista). |
| `body` | `blockContent` | Opcional. Explicação longa. |
| `aliases` | array de string | Opcional, únicos. Outras grafias reconhecidas no texto. |

Preview: termo + definição curta. Lista do Studio ordenada A–Z.

### Site

- **`/glossario`:** termos A–Z agrupados por letra, barra de letras (âncoras) e campo "Filtrar termos" (JS; sem JS a lista inteira aparece). Vazio: página 404 até existir um termo.
- **`/glossario/[slug]`:** termo, nome completo, definição curta em destaque, explicação (PortableText), "Posts que usam este termo" (BlogGrid, posts cujo texto contém o termo ou uma variação, até 6, mais novos primeiro). JSON-LD `DefinedTerm` com `inDefinedTermSet` → `/glossario` (`DefinedTermSet`). Breadcrumb Blog › Glossário › Termo.
- **Link automático nos posts:** em `PortableText`, só em spans de texto de blocos `normal`, `blockquote` e itens de lista; nunca em títulos, links existentes, código, prompts, checklists, callouts ou legendas. Primeira ocorrência de cada termo por post, palavra inteira; siglas (todas maiúsculas) diferenciam maiúsculas, o resto não. Variações casam igual ao termo. Um termo não é ligado na própria página dele.
- **Marcação:** `<a class="bs-term" href="/glossario/<slug>" data-term-short="…">EIN</a>`. **DS TermTip** (`bs-term`, `BrunoSilvaUSA.terms()`): sublinhado pontilhado volt; com ponteiro fino, hover ou foco mostra um balão com a definição curta (posicionado acima, ou abaixo se não couber; some com Esc, ao sair ou ao rolar); toque segue o link. `aria-describedby` aponta para o balão enquanto aberto.
- **Sitemap:** `/glossario` e cada termo. **RSS:** termos saem como texto simples (sem link).

## Séries

### Studio — tipo `series` ("Série")

| Campo | Tipo | Regra |
|---|---|---|
| `title` | string | Obrigatório, até 70. |
| `slug` | slug | Obrigatório. |
| `description` | text | Obrigatório, até 220. |
| `cover` | image + alt | Opcional. |
| `posts` | array de reference → post | Obrigatório, 2 a 30, únicos, na ordem das partes (arrastar para reordenar). |

Um post pertence a no máximo uma série (aviso de validação se aparecer em duas; o site usa a primeira encontrada).

### Site

- **`/series`:** cartões das séries (título, descrição, "N partes", capa ou bandeira). Vazio: 404 até existir uma série.
- **`/series/[slug]`:** cabeçalho da série e lista numerada das partes (número, título, resumo, tempo de leitura). Só partes já publicadas aparecem e a numeração segue essa ordem. JSON-LD `ItemList` + `CreativeWorkSeries`. Breadcrumb Blog › Séries › Série.
- **No post de uma série:** **DS SeriesBar** no topo do artigo, abaixo da linha do autor: "Parte 2 de 5 · Nome da série" num `<details>` que abre a lista das partes (a atual marcada, `aria-current`). No fim do texto, antes do anterior/próximo: botão "Próxima parte: <título>" (ou, na última, "Ver a série completa"). JSON-LD do post ganha `isPartOf` com a série.
- **Sitemap:** `/series` e cada série.

## Navegação

`site.footer` ganha, na coluna "Blog", "Séries" e "Glossário", exibidos só quando existe ao menos uma série / um termo publicado (contagem vinda do Sanity no Footer). O menu de cima não muda.

## Dados (lib/sanity.js)

Funções novas: `getTerms()`, `getTerm(slug)`, `getSeriesList()`, `getSeries(slug)`, `getSeriesOfPost(postId)`, `getContentCounts()` (termos, séries). `getPost` passa a trazer a série do post (`*[_type=="series" && references(^._id)][0]`). Os termos para o link automático vêm de `getTerms()` (cache por tag, como hoje). Sem Sanity: termos e uma série de exemplo em `content/sample-*.js`, como os posts de exemplo.

## Design system

Componentes novos com README e prévia: **TermTip** (link + balão) e **SeriesBar** (faixa da série no post). Páginas usam componentes existentes (SectionHeader, BlogGrid, BlogCard).

## Fora do escopo

Busca no glossário além do filtro da página; séries aninhadas; tradução; página de links; Recursos/afiliados e "Comece aqui" (próximas partes).

## Testes

- Unidade (`node --test`, padrão de `tests/prompt-content.test.mjs`): casamento de termos (palavra inteira, sigla, primeira ocorrência, nada em títulos/links/código/prompt/checklist), numeração da série só com partes publicadas, RSS sem links de termo.
- Navegador (Playwright, páginas de exemplo): `/glossario` (filtro, letras, sem JS), página do termo, balão (mouse, teclado, Esc, toque), post com termos e com série (faixa, lista, próxima parte), celular 390px sem rolagem lateral, acessibilidade básica.
