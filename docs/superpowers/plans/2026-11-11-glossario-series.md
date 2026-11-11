# Glossário e Séries Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tipos Termo e Série no Studio, páginas `/glossario`, `/glossario/[slug]`, `/series`, `/series/[slug]`, link automático dos termos nos posts com balão (DS TermTip) e faixa da série no post (DS SeriesBar).

**Architecture:** Dados por GROQ em `lib/sanity.js` (com amostras locais sem Sanity). O link automático é uma função pura (`lib/terms.js`) que reescreve os blocos de Portable Text acrescentando uma anotação `termLink` aos spans; `PortableText` a renderiza e o RSS a ignora. Comportamento de navegador (balão, filtro) no bundle do DS (`public/ds.js` / `styles/ds.css`, fonte em `ds-export/project/components/`).

**Tech Stack:** Next 15 App Router (JS), Sanity v6 Studio, GROQ via fetch, `node --test`, Playwright (harness bun `scratchpad/next/harness/render-blog.jsx`).

**Spec:** `docs/superpowers/specs/2026-11-11-glossario-series-design.md`

## Global Constraints

- Textos da interface em português do Brasil; títulos em maiúsculas via CSS (DS), sem emoji.
- Termo: `term` até 40, `fullName` até 90, `short` até 220, `aliases` únicos.
- Série: `title` até 70, `description` até 220, `posts` 2 a 30, únicos; post em no máximo uma série.
- Link automático: primeira ocorrência por post, palavra inteira; sigla (só maiúsculas) diferencia maiúsculas; só spans de blocos `normal`, `blockquote` e itens de lista; nunca títulos, links, `code`, prompt, checklist, callout, legenda; nunca na página do próprio termo.
- Página do termo: até 6 posts que usam o termo, mais novos primeiro.
- `/glossario` e `/series` dão 404 enquanto vazios; links do rodapé só aparecem com conteúdo.
- Alvos de toque ≥ 44px; sem rolagem lateral em 360px; movimento reduzido respeitado.
- Commits no Mac com `-c user.name="Bruno Silva" -c user.email="$(git log -1 --format=%ae)" -c core.hooksPath=/dev/null`, terminando com as linhas de atribuição.

## Review Focus

- Termo dentro de outra palavra ("EIN" em "EINSTEIN", "LLC" em "LLCs") — não liga; plural com "s" colado também não (teste no Task 2).
- Termo em span já com marca de link ou `code` — não vira outro link (Task 2).
- Dois termos onde um contém o outro ("LLC" e "Single-Member LLC") — liga o mais longo primeiro (Task 2).
- Série com parte ainda não publicada (data futura) — some da lista e da contagem "Parte X de Y" (Task 1).
- Balão perto da borda da tela no celular/desktop — não sai da tela nem cria rolagem lateral (Task 4).

---

### Task 1: Dados — termos, séries e amostras

**Files:**
- Create: `content/sample-terms.js`, `content/sample-series.js`
- Modify: `lib/sanity.js`
- Test: `tests/glossary-series.test.mjs` (mesmo `registerHooks` de `tests/prompt-content.test.mjs`)

**Interfaces:**
- Produces (todas `async`, em `lib/sanity.js`):
  - `getTerms(): Term[]` — `Term = { id, term, slug, fullName, short, aliases: string[] }`, ordenados por `term` (pt-BR, sem acento).
  - `getTerm(slug): (Term & { body: Block[] }) | null`.
  - `getSeriesList(): SeriesCard[]` — `{ id, title, slug, description, cover|null, count }`, `count` = partes publicadas.
  - `getSeries(slug): (SeriesCard & { parts: Card[] }) | null` — só partes publicadas, na ordem do campo `posts`.
  - `getContentCounts(): { terms: number, series: number }`.
  - `getPost(slug)` passa a incluir `series: { title, slug, index, total, parts: { title, slug }[] } | null` (`index` 1-based entre as partes publicadas).
- Amostras (sem Sanity): `SAMPLE_TERMS` com EIN, LLC, ITIN, Single-Member LLC; `SAMPLE_SERIES` com uma série "Abrir empresa nos EUA" (posts de exemplo `como-escolher-o-estado-da-sua-llc`, `o-que-e-o-ein`, `receber-em-dolar-de-clientes-no-brasil`).

- [ ] **Step 1: Write the failing tests** — `getTerms()` devolve 4 termos A–Z; `getTerm('ein').fullName === 'Employer Identification Number'`; `getSeries('abrir-empresa-nos-eua').parts.length === 3`; `getPost('o-que-e-o-ein').series` = `{ index: 2, total: 3 }`; `getContentCounts()` = `{ terms: 4, series: 1 }`; GROQ real (groq-js, como no teste existente) da série ignora parte com `publishedAt` no futuro e renumera (`total` 2).
- [ ] **Step 2: Run** `node --test tests/glossary-series.test.mjs` — Expected: FAIL (funções não existem).
- [ ] **Step 3: Implement** as funções e amostras. GROQ da série do post: `*[_type=="series" && references(^._id)][0]{ title, "slug": slug.current, "parts": posts[]->[${LIVE}]{ title, "slug": slug.current, _id } }`. Contagens: `{ "terms": count(*[_type=="term"]), "series": count(*[_type=="series"]) }`.
- [ ] **Step 4: Run** os dois arquivos de teste — Expected: PASS (inclui os 6 de `prompt-content`).
- [ ] **Step 5: Commit** `feat: dados de termos e séries`.

### Task 2: Link automático dos termos

**Files:**
- Create: `lib/terms.js`
- Modify: `components/PortableText.jsx` (anotação `termLink`), `lib/pt-html.js` (ignora `termLink`: só o texto)
- Test: `tests/glossary-series.test.mjs`

**Interfaces:**
- Produces:
  - `matchesTerm(text: string, term: Term): boolean`
  - `linkTerms(blocks: Block[], terms: Term[], { exclude?: string } = {}): Block[]` — devolve cópia; spans divididos onde há termo; o trecho recebe `marks: [..., key]` e o bloco ganha `markDefs: [{ _key: key, _type: 'termLink', slug, short }]`. `exclude` = slug do termo a não ligar.
- Consumes: `Term` do Task 1.
- Regex: `(?<![\p{L}\p{N}])(alias)(?![\p{L}\p{N}])`, flag `u`, e `i` só quando o termo não é todo maiúsculo; candidatos ordenados por comprimento decrescente.
- Render: `termLink` → `<a className="bs-term" href={`/glossario/${slug}`} data-term-short={short}>…</a>`.
- Chamada: `app/posts/[slug]/page.jsx` passa `linkTerms(post.body, await getTerms())` para o `Article`; `app/glossario/[slug]` usa `exclude`.

- [ ] **Step 1: Write the failing tests** — "Peça o EIN hoje. O EIN sai rápido." liga só o primeiro; "EINSTEIN" e "LLCs" não ligam; "ein" minúsculo não liga (sigla); "single-member llc" liga o termo longo e não o "LLC" dentro dele; span com marca `code` ou link não liga; blocos `h2`, `prompt`, `checklist`, `callout` intactos; `exclude: 'ein'` não liga EIN; `portableTextToHtml` do resultado não contém `glossario`.
- [ ] **Step 2: Run** — Expected: FAIL.
- [ ] **Step 3: Implement** `lib/terms.js` e os dois renderers.
- [ ] **Step 4: Run** — Expected: PASS.
- [ ] **Step 5: Commit** `feat: link automático dos termos do glossário`.

### Task 3: Studio — tipos Termo e Série

**Files:**
- Create: `studio/schemaTypes/term.js`, `studio/schemaTypes/series.js`
- Modify: `studio/schemaTypes/index.js`, `studio/sanity.config.js` (itens "Glossário" e "Séries" na estrutura, Glossário ordenado A–Z)

**Interfaces:** campos e limites exatamente como na tabela do spec. Validação de `posts` da série: `rule.required().min(2).max(30).unique()` e `custom` assíncrono com `getClient` que avisa (`warning`) se algum post já está em outra série.

- [ ] **Step 1:** Escrever os schemas e a estrutura.
- [ ] **Step 2: Verify** no Mac: `cd studio && npx sanity schema validate` — Expected: sem erros (rodado pelo usuário se o VM não tiver rede; o build `npm run build --prefix studio` também serve).
- [ ] **Step 3: Commit** `feat(studio): tipos Termo e Série`.

### Task 4: Glossário no site + DS TermTip

**Files:**
- Create: `app/glossario/page.jsx`, `app/glossario/[slug]/page.jsx`, `components/Glossary.jsx`
- Modify: `app/posts/[slug]/page.jsx` (chama `linkTerms`), `lib/jsonld.js` (`definedTermSet`, `definedTerm`), DS `bundle.js`/`bundle.css` → `public/ds.js`/`styles/ds.css`
- Create (DS): `components/TermTip/README.md`, `components/TermTip/preview.html`
- Test: `scratchpad/glossary/test.cjs` (Playwright)

**Interfaces:**
- `getTermPosts(term: Term): Card[]` em `lib/sanity.js` — até 6 posts publicados cujo texto (`portableTextToPlain`) satisfaz `matchesTerm` (Task 2), mais novos primeiro.
- DS `terms(root)`: para cada `a.bs-term[data-term-short]` com ponteiro fino, um único `div.bs-termtip[role=tooltip][id]` reaproveitado; abre em `pointerenter`/`focus`, fecha em `pointerleave`/`blur`/`Escape`/`scroll`; posiciona acima (abaixo se faltar espaço) e prende entre 8px das bordas; liga `aria-describedby` enquanto aberto.
- DS `glossaryFilter(root)`: `input.bs-gloss__filter` esconde `li[data-term]` que não contém o texto (sem acento, minúsculas), esconde letras vazias e mostra "Nenhum termo encontrado." quando zera.
- `/glossario`: `notFound()` se `getTerms()` vazio; metadados "Glossário | Bruno Silva USA".

- [ ] **Step 1: Write the failing tests** — `node --test`: `getTermPosts(EIN)` contém `o-que-e-o-ein` e tem ≤ 6. Playwright: página lista 4 termos em letras E/I/L/S; filtro "llc" deixa 2; "xyz" mostra a mensagem; sem JS mostra os 4; página `/glossario/ein` mostra definição e o post de exemplo; post `o-que-e-o-ein` tem `a.bs-term` para EIN e LLC uma vez cada; hover e Tab mostram o balão com a definição, Esc fecha; balão no termo mais à direita em 390px não gera `scrollWidth > 390`; toque (hasTouch) segue o link.
- [ ] **Step 2: Run** — Expected: FAIL.
- [ ] **Step 3: Implement** páginas, componente, JSON-LD e DS.
- [ ] **Step 4: Run** — Expected: PASS; checagem de a11y do `audit3/a11y.cjs` sem problemas nas páginas novas.
- [ ] **Step 5: Commit** `feat: glossário e balão de definição (DS TermTip)`.

### Task 5: Séries no site + DS SeriesBar

**Files:**
- Create: `app/series/page.jsx`, `app/series/[slug]/page.jsx`, `components/SeriesBar.jsx`
- Modify: `components/Article.jsx` (SeriesBar abaixo da byline; botão "Próxima parte: <título>" / "Ver a série completa" antes do `PostNav`), `app/posts/[slug]/page.jsx` (JSON-LD `isPartOf` → `CreativeWorkSeries`), `lib/jsonld.js` (`seriesGraph`), DS CSS
- Create (DS): `components/SeriesBar/README.md`, `components/SeriesBar/preview.html`
- Test: `scratchpad/glossary/test.cjs`

**Interfaces:** `SeriesBar({ series })` usa `series` do Task 1: `<details class="bs-seriesbar">` com `<summary>Parte {index} de {total} · {title}</summary>` e `<ol>` das partes (atual com `aria-current="page"`, sem link).

- [ ] **Step 1: Write the failing test** — `/series` mostra 1 cartão "3 partes"; `/series/abrir-empresa-nos-eua` lista 3 partes numeradas; post `o-que-e-o-ein` mostra "Parte 2 de 3", abre a lista, atual marcada; botão "Próxima parte: Receber em dólar…"; último post mostra "Ver a série completa"; post fora de série sem faixa; 390px sem rolagem lateral.
- [ ] **Step 2: Run** — Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** — Expected: PASS.
- [ ] **Step 5: Commit** `feat: séries e faixa da série no post (DS SeriesBar)`.

### Task 6: Navegação, sitemap e documentação

**Files:**
- Modify: `components/Footer.jsx` + `components/Shell.jsx` (recebe `getContentCounts()`; acrescenta "Séries"/"Glossário" à coluna "Blog" só quando > 0), `app/sitemap.js` (`/glossario`, termos, `/series`, séries), `README.md` (como criar termos e séries), DS `README.md` (linhas de TermTip e SeriesBar)
- Test: `tests/glossary-series.test.mjs` (sitemap contém as 4 rotas novas com amostras), Playwright (rodapé mostra os dois links com amostras)

- [ ] **Step 1: Write the failing tests.**
- [ ] **Step 2: Run** — Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** todos os testes (`node --test tests/` e Playwright) — Expected: PASS.
- [ ] **Step 5: Commit** `feat: rodapé, sitemap e documentação do glossário e das séries`; publicar o DS e mandar ao usuário: build, push, `cd studio && npm run deploy`.
