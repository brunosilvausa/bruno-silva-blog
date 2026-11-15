# Central de Conteúdo — visual (capa e grade de vídeos)

Aprovado pelo usuário em 14/11/2026 a partir dos mockups (artifact "Central — opções de visual"): Topo C e Lista C.

## Intenção
A Central ficou "muito simples": topo sem impacto e lista sem graça. A nova cara liga visualmente cada material ao reel de onde a pessoa veio.

## Abordagens consideradas
- Topo A (painel com "o que você leva"), B (prompt em terminal), **C (capa do vídeo) — escolhido**.
- Lista A (destaque + grade), B (prateleiras por tipo), **C (grade de vídeos) — escolhida**.

## Decisões do usuário
- **Topo do material:** capa grande no formato do reel com o rótulo do tipo e o título sobre ela; ▸ abre o vídeo quando houver `videoUrl`. Sem botão. Sem linha "min · prompts · checklists".
- **Lista:** cartões em pé (formato reel) com tipo, título e resumo; sem botão e sem linha de minutos/contagem; o cartão inteiro é o link. Celular: 1 coluna. Desktop: até 3 colunas.
- **Capa:** campo novo opcional `cover` (imagem com `alt`, hotspot) no tipo Material. Sem capa: fundo gerado pela cor do tipo — Guia volt, Prompt ciano, Checklist magenta, Passo a passo volt.
- O filtro por tipo continua.

## Decisões de Claude (o usuário pode trocar)
- **Contagem automática não entra:** a linha que a mostraria foi removida.
- **Efeitos, dentro das regras do DS:** todos os cartões com sombra e Spotlight (`data-spotlight` na grade, `bs-spotlight` nos cartões; só mouse, desligado em movimento reduzido). OrbitGlow só no primeiro cartão (o mais novo), porque o DS proíbe OrbitGlow em vários cartões e em imagens; o cartão tem fundo sólido próprio.
- **Data do vídeo:** aparece como selo "▸ DD/MM" no canto do cartão quando `videoDate` existir.
- **Capa no OG:** a imagem de compartilhamento do material usa a capa quando houver; senão segue a gerada.
- **Componente no DS:** MaterialCard vira a variante em pé; nova peça MaterialCover para o topo; README e prévia atualizados e o bundle copiado para o blog.
- **Acessibilidade:** o texto sobre a capa fica sobre um degradê escuro com contraste AA; alvo de toque é o cartão inteiro; foco com anel volt visível.

## Fora do escopo
Busca, destaque separado, contagem de prompts, menu de celular.

## Testes
Unidade: `getMaterials`/`getMaterial` trazem `cover` (URL + alt) ou `null`; cor de fallback por tipo. Navegador (harness, 390/1280px): 1 coluna no celular, 3 no desktop, cartão inteiro clicável, sem rolagem lateral em 360px, título legível sobre a capa com e sem imagem, OrbitGlow só no primeiro cartão.

## Ajuste aprovado em 14/11/2026 — formato único 4:5

A capa tinha três cortes (cartão 9:14 no desktop, topo 16:9 no desktop, imagem baixada 4:5). Decisão do usuário: **4:5 em tudo**, celular e desktop.
- Cartão da lista: mídia 4:5 em todas as larguras; o texto fica abaixo/sobre a parte inferior como hoje; o cartão não força 9:14.
- Topo do material no desktop (≥721px): capa 4:5 à esquerda (até ~360px de largura) e, à direita, tipo, título (h1) e o ▸ do vídeo; no celular segue como está (capa 4:5 com o texto por cima).
- A URL da imagem continua 900×1125 (4:5) com o ponto de foco; o `object-position` do ponto de foco vale nos dois lugares.
- Imagem de compartilhamento (1200×630) não muda.
