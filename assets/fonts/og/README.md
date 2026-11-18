# Fontes exclusivas das imagens OG

TTFs estáticos oficiais: Orbitron ExtraBold 800 (17.768 bytes) e Barlow Condensed SemiBold 600 (86.636 bytes). Obtidos sem alteração pela API CSS do Google Fonts em 2026-11-17; os URLs exatos, pesos, tamanhos e hashes SHA-256 estão em `sources.json`. Não são os arquivos variáveis do repositório google/fonts.

As tabelas SFNT não contêm `fvar`; OS/2 registra os pesos 800 e 600. A tabela cmap cobre os caracteres listados no manifesto, incluindo maiúsculas/minúsculas portuguesas acentuadas. Isso não promete cobertura de todo Unicode.

Cada família mantém seu aviso de copyright e licença SIL OFL 1.1 integral: `orbitron-OFL.txt` e `barlowcondensed-OFL.txt`. Os arquivos não foram convertidos, renomeados internamente ou modificados.

`lib/og-card.js` lê estes arquivos no runtime Node via caminhos locais estáticos. Não carregar por HTTP, não usar assets internos do Next e não remover estes arquivos do pacote publicado. Falha de leitura deve propagar erro; nunca devolver uma lista vazia. As fontes do site, next/font e design system são independentes e não foram alteradas.
