# Central no padrão do blog — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** A Central usa os componentes do blog (topo dos pilares, pílulas, BlogCard, cabeçalho do Article), com capa 4:5 como único sotaque.

**Architecture:** Reaproveitar `components/PostList.jsx` (topo), `components/PillarTabs.jsx`/`.blog-pillars` (visual das pílulas), `components/BlogCard.jsx` (nova variante reel), `components/Article.jsx` (cabeçalho e "Neste post"). Extrair o que precisar ser compartilhado em vez de copiar.

**Tech Stack:** Next 15 App Router (JS), DS bundle (`public/ds.js`, `styles/ds.css`, fonte em `ds-export/project/components`), `node --test`, harness bun + Playwright fora do repo.

**Spec:** `docs/superpowers/specs/2026-11-16-central-padrao-blog-design.md`

## Global Constraints
- Capa 4:5 (900×1125 Sanity, `object-position` do ponto de foco); fallback pela cor do tipo (`kindAccent`).
- Títulos Orbitron como nos posts; nenhuma palavra quebrada no meio de 360 a 1440px; sem rolagem lateral em 360px.
- Sem OrbitGlow na Central; Spotlight como na grade do blog.
- Nada muda nos posts nem nas páginas de pilar (comparar HTML do post e do pilar antes/depois: idêntico).
- pt-BR; alvos ≥44px; foco volt; movimento reduzido respeitado.
- Commits com `-c user.name="Bruno Silva" -c user.email="$(git log -1 --format=%ae)"` e as linhas de atribuição.

## Review Focus
- Post e pilar continuam idênticos (Task 1 e 2 comparam o HTML renderizado antes/depois).
- Material sem vídeo: cartão sem "▸ Vídeo", cabeçalho sem link (Task 2, 3).
- Material sem capa: fallback com cor, mesma altura dos vizinhos (Task 2).
- Corpo com 0–1 h2: sem índice (Task 3).
- Um único tipo: pílulas aparecem com "Todos 1" e o tipo (Task 2).

---

### Task 1: Topo da Central igual ao dos pilares
**Files:** `components/PostList.jsx` (extrair o topo para um componente reutilizável, p.ex. `components/ListHero.jsx`), `app/central/page.jsx`.
- [ ] Extrair o topo (bandeira, CodeReveal, canvas neural, divisor, SectionHeader, ticker) sem mudar o HTML dos posts/pilares; salvar o HTML renderizado de `/` e `/pilar/tecnologia` antes e comparar depois (idêntico).
- [ ] Usar na `/central` com título `{ before:'Central de ', em:'Conteúdo', after:'' }` e o texto atual.
- [ ] Verificar no harness 390/1280: `canvas.bs-terrain[data-neural]` presente, divisor e ticker; `node --test` PASS.
- [ ] Commit `feat: topo da Central igual ao dos pilares`.

### Task 2: Pílulas e cartões do blog na lista
**Files:** `components/BlogCard.jsx` (variante reel), `app/central/page.jsx`, CSS em `styles/page.css` ou DS (BlogCard) + cópia do bundle; teste em `tests/central.test.mjs`.
- [ ] Teste: função pura de contagem por tipo (`{ all, [kind]: n }`), e linha do cartão: data formatada como `formatDate` + "· ▸ Vídeo" só com vídeo.
- [ ] Variante `reel` no BlogCard: capa 4:5 com ponto de foco/fallback por tipo; selo = tipo; título e linha como posts; sem mudar o BlogCard padrão (HTML de `/` idêntico).
- [ ] Pílulas com o visual `.blog-pillars` e contagem, como botões de filtro (`aria-pressed`), sempre visíveis; sem JS mostra tudo. Ajustar o filtro no DS (`bundle.js`) se necessário e copiar o bundle.
- [ ] Grade `bs-blog` + Spotlight, sem destaque nem OrbitGlow; newsletter no fim se o PostList tiver.
- [ ] Verificar 360/390/800/1280: colunas 1/1/2/3, 4:5, sem rolagem lateral, títulos sem quebra, filtro funciona; `/` idêntico. `node --test` PASS.
- [ ] Commit `feat: Central com pílulas e cartões do blog`.

### Task 3: Página do material com cabeçalho de post
**Files:** `components/Article.jsx` (extrair cabeçalho e índice se preciso), `app/central/[slug]/page.jsx`, CSS.
- [ ] Teste: índice só com 2+ h2.
- [ ] Cabeçalho do Article (selo do tipo, h1, resumo, autor+data, "▸ Assistir ao vídeo" se houver) e capa 4:5 centralizada ≤420px; índice "Neste material"; resto como hoje. HTML de um post idêntico antes/depois.
- [ ] Marcar MaterialCard/MaterialCover no DS como substituídos (README) e remover o CSS que ficou sem uso.
- [ ] Verificar 390/1280 com a capa real (scratchpad `central/real-cover.jpg`, não commitar); `node --test` PASS.
- [ ] Commit `feat: material com cabeçalho de post`.
