# Central de Conteúdo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tipo Material no Studio e páginas `/central` e `/central/[slug]` para os materiais curtos ligados aos vídeos, com copiar prompt, próximo material e chamadas finais.

**Architecture:** Dados por GROQ em `lib/sanity.js` com amostras locais sem Sanity (mesmo padrão de termos e séries). Páginas App Router reutilizam `PortableText` (PromptBlock, Checklist, TermTip) e o shell atual. O cartão da lista é o componente novo do DS **MaterialCard**, criado no design system e copiado para o bundle (`public/ds.js` / `styles/ds.css`, fonte em `ds-export/project/components/`).

**Tech Stack:** Next 15 App Router (JS), Sanity Studio, GROQ via fetch, `node --test` (+ groq-js de `studio/node_modules`), Playwright fora do repo (harness `scratchpad/next/harness/render-blog.jsx`).

**Spec:** `docs/superpowers/specs/2026-11-14-central-de-conteudo-design.md`

## Global Constraints

- Textos em português do Brasil; títulos em maiúsculas via CSS (DS); sem emoji.
- Material: `title` até 80, `summary` até 160, `minutes` 1–30, `kind` ∈ `prompt | passo-a-passo | checklist | guia` (rótulos: Prompt, Passo a passo, Checklist, Guia), `body` obrigatório, `publishedAt` obrigatório.
- Sem cadastro, pop-up ou e-mail antes do conteúdo; nenhum quarto passo de newsletter agora.
- Materiais nunca aparecem em lista do blog, pilar, paginação, posts relacionados nem RSS.
- `/central` dá 404 enquanto vazio; link "Central" no rodapé só com conteúdo; menu de cima mostra "Central" sempre que houver conteúdo (mesma contagem).
- Linha "Siga para os próximos vídeos" só com `NEXT_PUBLIC_URL_INSTAGRAM` válido (via `safeHref`).
- JSON-LD `CreativeWork` + `BreadcrumbList` (Blog › Central › Material); sem `HowTo`.
- Alvos de toque ≥ 44px; sem rolagem lateral em 360px; movimento reduzido respeitado.
- Commits no Mac com `-c user.name="Bruno Silva" -c user.email="$(git log -1 --format=%ae)" -c core.hooksPath=/dev/null`, terminando com as linhas de atribuição.

## Review Focus

- Material com data futura (agendado) — não aparece na Central, não abre pela URL, não conta para o rodapé (Task 1).
- `next` apontando para material não publicado ou para o próprio — cai no fallback (mais recente diferente deste); com um único material, sem "Próximo" (Task 1).
- `videoUrl` com esquema inválido (`javascript:`) — linha do vídeo some (Task 3, via `safeHref`).
- Slug antigo de material redireciona para `/central/<novo>`, e slug antigo de post continua indo para `/posts/<novo>` (Task 1 e Task 3).
- Filtro sem resultado para um tipo — botão do tipo não aparece quando não há material dele (Task 4).

---

### Task 1: Dados — materiais e amostras

**Files:**
- Create: `content/sample-materials.js`
- Modify: `lib/sanity.js`
- Test: `tests/central.test.mjs` (mesmo `registerHooks` e `withDataset` de `tests/glossary-series.test.mjs`)

**Interfaces:**
- Produces (todas `async`, em `lib/sanity.js`):
  - `getMaterials(): MaterialCard[]` — `{ id, title, slug, kind, summary, minutes|null, publishedAt }`, só publicados, mais novos primeiro.
  - `getMaterial(slug): (MaterialCard & { body: Block[], videoUrl|null, videoDate|null, next: { title, slug } | null }) | null` — `next`: campo se publicado e diferente do próprio; senão o material publicado mais recente diferente deste; `null` se não houver outro.
  - `getMaterialRedirect(slug): string | null` — slug atual de material com `$slug in oldSlugs`.
  - `getContentCounts()` passa a devolver `{ terms, series, materials }`.
- Export `MATERIAL_KINDS = [{ value: 'prompt', label: 'Prompt' }, { value: 'passo-a-passo', label: 'Passo a passo' }, { value: 'checklist', label: 'Checklist' }, { value: 'guia', label: 'Guia' }]` em `lib/materials.js` (usado também pelo Studio).
- Amostras `SAMPLE_MATERIALS`: 3 materiais — `logo-da-llc-com-ia` (prompt, com bloco de prompt e `videoUrl`), `nome-da-llc-com-ia` (prompt, `next` → logo), `checklist-abrir-llc` (checklist).

- [ ] **Step 1: Write the failing tests** — sem Sanity: `getMaterials()` tem 3, mais novo primeiro; `getMaterial('nome-da-llc-com-ia').next.slug === 'logo-da-llc-com-ia'`; `getContentCounts().materials === 3`; `getPosts()` e `getFeedPosts()` não contêm nenhum slug de material. Com groq-js: material com `publishedAt` futuro fica fora de `getMaterials`, `getMaterial` dá `null` e não conta; `next` para não publicado ou para si mesmo cai no fallback; único material → `next === null`; `getMaterialRedirect('antigo')` devolve o slug atual e `getRedirect('antigo')` (posts) devolve `null` para ele.
- [ ] **Step 2: Run** `node --test tests/central.test.mjs` — Expected: FAIL (funções não existem).
- [ ] **Step 3: Implement** em `lib/sanity.js` com filtro `_type=="material" && defined(slug.current) && publishedAt <= now()`; revalidate 60, tag `sanity`.
- [ ] **Step 4: Run** `node --test tests/*.test.mjs` — Expected: PASS (todos, incluindo os 19 existentes).
- [ ] **Step 5: Commit** `feat: dados da Central de Conteúdo`.

### Task 2: Studio — tipo Material

**Files:**
- Create: `studio/schemaTypes/material.js`
- Modify: `studio/schemaTypes/index.js`, `studio/sanity.config.js`, `README.md`

**Interfaces:**
- Consumes: `MATERIAL_KINDS` (copiar os valores para o schema; o Studio não importa de `lib/`).
- Produces: documentos `_type: "material"` com os campos da spec mais `oldSlugs` (somente leitura, oculto se vazio).

- [ ] **Step 1: Implement** o schema com as regras da Global Constraints; `next` com filtro que exclui o próprio documento; preview título + rótulo do tipo; `orderings` por `publishedAt desc`.
- [ ] **Step 2: Implement** em `sanity.config.js`: entrada "Central" na `structure` (lista de `material` ordenada por `publishedAt desc`) e `keepOldSlug` aplicado quando `schemaType` for `post` ou `material`.
- [ ] **Step 3: README:** seção "Central de Conteúdo" (como criar um material, endereço para o vídeo, `NEXT_PUBLIC_URL_INSTAGRAM`) e filtro do webhook `_type in ["post", "author", "term", "series", "material"]`.
- [ ] **Step 4: Verify** `node -e "import('./studio/schemaTypes/index.js')"` não é possível sem bundler; em vez disso confirmar com `grep -n material studio/schemaTypes/index.js studio/sanity.config.js` e deixar a validação para `cd studio && npm run deploy` do usuário (Ruling da rodada anterior).
- [ ] **Step 5: Commit** `feat: tipo Material no Studio`.

### Task 3: Página do material

**Files:**
- Create: `app/central/[slug]/page.jsx`, `components/MaterialEnd.jsx`
- Modify: `app/sitemap.js`, `content/site.js` (`URL_INSTAGRAM` com `safeHref(process.env.NEXT_PUBLIC_URL_INSTAGRAM, null)`)

**Interfaces:**
- Consumes: `getMaterial`, `getMaterialRedirect`, `getMaterials` (Task 1); `PortableText`; `safeHref`; `URL_IA_DO_ZERO`, `URL_CONSULTORIA`.
- Produces: rota `/central/[slug]`; `MaterialEnd({ next, instagram })`.

- [ ] **Step 1: Implement** a página na ordem da spec: "‹ Central", rótulo do tipo + "N min", título, linha "Do vídeo de DD/MM ▸ assistir" (só com `safeHref(videoUrl)` válido; `target="_blank" rel="noopener"`), corpo, `MaterialEnd`. Sem autor, tempo de leitura nem pilar. `generateStaticParams` de `getMaterials`; slug inexistente → `getMaterialRedirect` → `permanentRedirect('/central/<novo>')`, senão `notFound()`.
- [ ] **Step 2: Implement** `generateMetadata` (título, `summary`, OG como nos posts) e JSON-LD `CreativeWork` + `BreadcrumbList`.
- [ ] **Step 3: Implement** `MaterialEnd`: "Próximo: <título> →" (se `next`), "Siga para os próximos vídeos" (se `instagram`), linha "Quer aprender do zero? IA do Zero → · Quer que eu faça? Consultoria →".
- [ ] **Step 4: Sitemap** inclui `/central` (se houver materiais) e cada material.
- [ ] **Step 5: Verify** com o harness Playwright em 390px: no `logo-da-llc-com-ia` o botão Copiar do primeiro prompt está visível sem rolar além de uma tela; clicar copia o texto; `videoUrl` `javascript:alert(1)` some; sem rolagem lateral em 360px; `/central/inexistente` → 404. `node --test tests/*.test.mjs` PASS.
- [ ] **Step 6: Commit** `feat: página do material`.

### Task 4: Lista da Central + DS MaterialCard

**Files:**
- Create: `app/central/page.jsx`, `components/MaterialFilter.jsx`; no DS: `ds-export/project/components/MaterialCard/{README.md,preview.html}` e trechos em `bundle.css`/`bundle.js`
- Modify: `public/ds.js`, `styles/ds.css` (cópia do bundle, como nas tarefas anteriores)

**Interfaces:**
- Consumes: `getMaterials`, `MATERIAL_KINDS`.
- Produces: rota `/central`; classe DS `.bs-material` (cartão: `.bs-material__kind`, título, resumo, minutos) e filtro `[data-material-filter]` com botões `[data-kind]`.

- [ ] **Step 1: Implement** MaterialCard no DS (README + prévia) seguindo os cartões existentes; filtro no `bundle.js`: botão "Todos" + um por tipo presente; clicar esconde cartões de outros tipos e marca `aria-pressed`; sem JS tudo visível.
- [ ] **Step 2: Copy** o bundle para `public/ds.js` e `styles/ds.css` (cabeçalho + `bundle.css` sem `@import`).
- [ ] **Step 3: Implement** `/central`: título "Central de Conteúdo", frase "Prompts e passo a passo dos vídeos, prontos para copiar.", filtro (só tipos com material) e cartões; vazio → `notFound()`.
- [ ] **Step 4: Verify** Playwright: filtro "Checklist" mostra 1 cartão; sem JS 3 cartões; 360px sem rolagem lateral; botões ≥ 44px.
- [ ] **Step 5: Commit** `feat: Central de Conteúdo e DS MaterialCard`.

### Task 5: Navegação

**Files:**
- Modify: `content/site.js`, `components/Shell.jsx` (e `NavBar.jsx` se o menu vier de lá)

**Interfaces:**
- Consumes: `getContentCounts().materials`.

- [ ] **Step 1: Write the failing test** em `tests/central.test.mjs`: função pura `navLinks(counts)` (exportada de `content/site.js`) inclui `{ label: 'Central', href: '/central' }` só quando `counts.materials > 0`; o rodapé idem via `site.footer.extra.central`.
- [ ] **Step 2: Run** — Expected: FAIL.
- [ ] **Step 3: Implement** e ligar no `Shell` (já async) para menu e rodapé.
- [ ] **Step 4: Run** `node --test tests/*.test.mjs` PASS; Playwright: menu mostra "Central" no desktop e no menu do celular.
- [ ] **Step 5: Commit** `feat: Central no menu e no rodapé`.
