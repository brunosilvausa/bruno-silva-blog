# Central de Conteúdo — mesma família do blog

Aprovado pelo usuário em 16/11/2026.

## Intenção
A `/central` e a página do material parecem "outro site": topo liso, filtro com botões quadrados, cartão próprio (Barlow Condensed, OrbitGlow), cabeçalho próprio no material. Objetivo: a Central vira uma seção do blog, com um único sotaque — a capa em pé 4:5 que lembra os reels.

## Abordagens
- **Escolhida: reaproveitar os componentes do blog** (topo do `PostList`/pilar, pílulas `blog-pillars`, `BlogCard`, cabeçalho de `Article`). Mudanças no blog passam a valer para a Central.
- Descartada: maquiar MaterialCard/MaterialCover para imitar o blog — duas versões do mesmo cartão voltam a divergir.
- Descartada: Central idêntica aos posts (capa 16:9, destaque horizontal) — perde a ligação com os reels.

## Decisões do usuário
- Opção B: mesma família do blog, com capa em pé 4:5.
- Desenho aprovado: topo igual ao dos pilares; pílulas com contagem; cartão do blog com capa 4:5, selo do tipo, título Orbitron, linha "data · ▸ vídeo"; 3 por linha no computador, 1 no celular, sem destaque horizontal; página do material com cabeçalho de post + capa 4:5 centralizada (~420px) + índice "Neste material".

## Desenho
**/central**
- Topo: mesmo markup/estilo do topo de `PostList` (bandeira, CodeReveal, rede neural `canvas.bs-terrain[data-neural]`, divisor `</>`, título `{ before:'Central de ', em:'Conteúdo' }`, texto atual) e a faixa de pilares (ticker) logo abaixo, como nos pilares.
- Filtro: visual das pílulas `blog-pillars` com contagem ("Todos 3", "Prompt 2"…), só tipos com material, visível mesmo com um tipo. Funciona sem recarregar (botões com `aria-pressed`, JS do DS); sem JS, todos aparecem.
- Cartões: `BlogCard` com variante de capa 4:5 (`variant="reel"` ou equivalente): imagem 900×1125 com ponto de foco, ou fallback com a cor do tipo; selo = rótulo do tipo; título Orbitron como nos posts; linha = data de publicação formatada como nos posts + "· ▸ Vídeo" quando houver vídeo. Grade `bs-blog` com Spotlight, 3/2/1 colunas como a grade do blog; nenhum destaque horizontal; sem OrbitGlow.
- Abaixo da grade, o mesmo bloco de newsletter do fim do `PostList`, se ele já existir lá.

**/central/[slug]**
- Cabeçalho do `Article`: selo do tipo (no lugar do pilar), h1 Orbitron, resumo, linha do autor (avatar, Bruno Silva, data) + link "▸ Assistir ao vídeo" quando houver vídeo.
- Capa 4:5 centralizada, largura máx. ~420px (fallback com cor do tipo).
- Índice "Neste material" gerado dos h2 do corpo, como "Neste post" (só se houver 2+ seções).
- Corpo, "Próximo", chamadas finais e JSON-LD como hoje.

## Fora do escopo
Busca; paginação (entra quando houver muitos materiais); mudar posts.

## Decisões de Claude
- MaterialCard e MaterialCover ficam marcados como "substituídos por BlogCard (variante reel)" no DS, sem apagar.
- Imagem de compartilhamento e sitemap não mudam.
- Sem OrbitGlow na Central (o blog não usa em cartões).

## Testes
Unidade: contagem por tipo; data e "▸ Vídeo" no cartão; índice só com 2+ seções. Navegador (harness, 360/390/800/1280): mesmo topo dos pilares (canvas neural presente), pílulas com contagem, 1/2/3 colunas, capa 4:5, sem rolagem lateral, nenhuma palavra de título quebrada; material com cabeçalho de post, capa ≤420px, índice.
