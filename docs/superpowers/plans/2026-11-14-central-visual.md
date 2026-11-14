# Central de Conteúdo — visual Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Capa do vídeo no topo do material e grade de cartões em pé (formato reel) na `/central`, com capa opcional no Studio e fundo gerado por tipo.

**Architecture:** Campo `cover` no tipo Material; `lib/sanity.js` devolve `cover` pronto (URL de imagem Sanity + alt) ou `null`; `lib/materials.js` dá a cor de fallback por tipo. Visual no DS (MaterialCard em pé, MaterialCover novo) copiado para `public/ds.js`/`styles/ds.css`; páginas `/central` e `/central/[slug]` usam as classes do DS.

**Tech Stack:** Next 15 App Router (JS), Sanity, `node --test`, harness bun + Playwright fora do repo.

**Spec:** `docs/superpowers/specs/2026-11-14-central-visual-design.md`

## Global Constraints

- Topo: capa no formato reel (4:5 no celular) com rótulo do tipo e título sobre ela; ▸ (link para `videoUrl`, nova aba) só com `videoUrl` válido; sem botão; sem linha de minutos/contagem.
- Cartão: tipo, título, resumo; sem botão; sem minutos/contagem; o cartão inteiro é um único `<a>`; selo "▸ DD/MM" só com `videoDate`.
- Grade: 1 coluna até 720px; 2 colunas de 721 a 1023px; 3 colunas a partir de 1024px.
- Fallback sem capa: Guia e Passo a passo `--volt` (#e1fa03), Prompt ciano `#4fd8ff`, Checklist magenta `#ff5fa8` — degradê radial sobre fundo escuro, como nos mockups.
- Efeitos: sombra em todos os cartões; `data-spotlight` na grade e `bs-spotlight` em cada cartão; OrbitGlow (`div.bs-orbit`) só em volta do primeiro cartão; nada disso em movimento reduzido além do brilho parado.
- Texto sobre a capa sobre degradê escuro com contraste AA; foco com anel volt; sem rolagem lateral em 360px; pt-BR.
- Commits no Mac com `-c user.name="Bruno Silva" -c user.email="$(git log -1 --format=%ae)" -c core.hooksPath=/dev/null` e as linhas de atribuição.

## Review Focus

- Capa sem `alt` no Studio — imagem decorativa (`alt=""`), o título já está em texto (Task 1).
- Capa muito clara (foto branca) — título continua legível pelo degradê (Task 3, screenshot com imagem clara).
- Título longo (80 caracteres) no cartão — quebra sem estourar o cartão nem cortar no meio da palavra (Task 2).
- Tipo desconhecido — cai na cor volt e rótulo "Material" (Task 1).
- Um único material — OrbitGlow e grade não deixam o cartão esticado nem sozinho de largura total no desktop (Task 2: máximo de largura por coluna).

---

### Task 1: Dados e Studio — capa

**Files:**
- Modify: `studio/schemaTypes/material.js`, `lib/sanity.js`, `lib/materials.js`, `content/sample-materials.js`
- Test: `tests/central.test.mjs`

**Interfaces:**
- Produces: `MaterialCard.cover: { url: string, alt: string } | null` em `getMaterials()` e `getMaterial()`; `url` = imagem Sanity com `?w=900&h=1125&fit=crop&auto=format` (respeita hotspot). `kindAccent(kind): string` em `lib/materials.js` (valores da Global Constraints; desconhecido → volt).
- Studio: campo `cover` ("Capa", image, `hotspot: true`, subcampo `alt` string "Texto alternativo"), opcional, depois de `summary`.

- [ ] **Step 1: Failing tests** — `kindAccent('prompt') === '#4fd8ff'`, `kindAccent('checklist') === '#ff5fa8'`, `kindAccent('guia') === '#e1fa03'`, `kindAccent('x') === '#e1fa03'`; amostras: um material com `cover` devolve `{ url, alt }`, os demais `null`; com groq-js, documento com `cover.asset._ref` gera URL `https://cdn.sanity.io/images/<project>/<dataset>/<id>-<w>x<h>.<ext>?w=900&h=1125&fit=crop&auto=format` e sem `alt` devolve `alt: ''`.
- [ ] **Step 2: Run** `node --test tests/*.test.mjs` — FAIL.
- [ ] **Step 3: Implement** (montar a URL do `_ref` como já for feito para posts em `lib/sanity.js`, se houver helper; reutilizar).
- [ ] **Step 4: Run** — PASS (todos).
- [ ] **Step 5: Commit** `feat: capa opcional nos materiais`.

### Task 2: DS — cartão em pé e grade; página `/central`

**Files:**
- DS (fora do git): `ds-export/project/components/MaterialCard/{README.md,preview.html}`, `bundle.css`
- Modify: `app/central/page.jsx`, `public/ds.js`, `styles/ds.css`

**Interfaces:**
- Consumes: `cover`, `kindAccent`, `MATERIAL_KINDS`.
- Produces: `.bs-matlist` (grade conforme Global Constraints, `data-spotlight`), `a.bs-material.bs-spotlight` em pé (aspect 9:14 no desktop; no celular altura pelo conteúdo com capa 4:5), `--accent` por cartão via `style`, `.bs-material__media` (img `object-fit: cover` ou fallback), `.bs-material__date` ("▸ DD/MM"), `.bs-material__body` (tipo, título, resumo). Primeiro cartão embrulhado em `div.bs-orbit`.

- [ ] **Step 1: Implement** no DS (README e prévia com 3 cartões: com capa, sem capa Prompt, sem capa Checklist com título de 80 caracteres); remover minutos do cartão; filtro mantido.
- [ ] **Step 2: Copy** bundle para o blog (mesma regra da Task 4 anterior).
- [ ] **Step 3: Implement** `/central` com a grade nova; colunas com `max-width` para um material só não ocupar a largura toda.
- [ ] **Step 4: Verify** Playwright no harness: 360/390px 1 coluna, 800px 2, 1280px 3; um só `<a>` por cartão e área clicável = cartão; sem rolagem lateral; `.bs-orbit` só no primeiro; filtro ainda funciona; prévia do DS sem erro no console. Testes unitários PASS.
- [ ] **Step 5: Commit** `feat: grade de vídeos na Central`.

### Task 3: Topo do material e imagem de compartilhamento

**Files:**
- DS: `ds-export/project/components/MaterialCover/{README.md,preview.html}`, `bundle.css`
- Modify: `app/central/[slug]/page.jsx`, `app/og/central/[slug]/route.js`, `styles/page.css` (só se precisar), `public/ds.js`, `styles/ds.css`

**Interfaces:**
- Consumes: `getMaterial(slug).cover`, `kindAccent`, `safeHref`.
- Produces: `.bs-matcover` (capa 4:5 até 720px, 16:9 com largura máxima no desktop), `.bs-matcover__play` (link ▸ 48px, `aria-label="Assistir ao vídeo"`), `.bs-matcover__over` (chip do tipo + h1).

- [ ] **Step 1: Implement** o componente no DS (prévia com capa clara, capa escura e sem capa) e copiar o bundle.
- [ ] **Step 2: Implement** no topo do material: "‹ Central", depois `.bs-matcover` com h1; remover a linha de tipo + minutos de cima; o resto da página igual.
- [ ] **Step 3: OG:** com `cover`, usar a capa como fundo da imagem 1200×630 com o título por cima; sem capa, como hoje.
- [ ] **Step 4: Verify** Playwright 390px e 1280px: título legível sobre capa clara e escura (contraste do texto sobre o degradê ≥ 4.5:1 na área do título), ▸ só com vídeo, sem rolagem lateral; `node --test` PASS.
- [ ] **Step 5: Commit** `feat: capa do vídeo no topo do material`.
