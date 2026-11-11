# Bruno Silva USA — Blog (Next.js + Sanity)

O blog de Bruno Silva USA: Next.js (App Router, JavaScript) com o design system da marca, e os posts escritos no Sanity, um editor online. Enquanto o Sanity não estiver ligado, o blog mostra posts de exemplo, com uma faixa "Exemplo" no topo.

## O que tem

| Endereço | Página |
| --- | --- |
| `/` | Lista de posts (o mais novo em destaque), 9 por página, e a newsletter |
| `/pagina/2`, `/pagina/3`… | Posts mais antigos |
| `/posts/<slug>` | O post, com barra de leitura, índice "Neste post" (com 3 ou mais subtítulos H2), botão Compartilhar, post anterior e próximo, caixa do autor, newsletter e três posts relacionados |
| `/pilar/tecnologia`, `/pilar/empreendedorismo`, `/pilar/inovacao`, `/pilar/impacto-global` | Posts de cada pilar |
| `/newsletter` | Inscrição na newsletter e os últimos posts |
| `/sobre` | Quem escreve o blog, como os posts são escritos, links de trabalho e contato (texto em `content/about.js`) |
| `/privacidade`, `/termos` | Política de privacidade e termos de uso, que valem para todos os sites Bruno Silva USA |
| `/rss.xml`, `/sitemap.xml`, `/robots.txt` | Feed de RSS com o texto completo dos 20 posts mais novos, e mapa do site para o Google |
| `/manifest.webmanifest` | Nome e ícones para "Adicionar à tela de início" no celular |
| `/og`, `/og/pilar/<pilar>`, `/og/posts/<slug>` | Imagem de prévia (WhatsApp, redes) gerada no visual da marca, para páginas e posts sem capa |

No celular, a barra do topo esconde os pilares; no lugar dela, a página inicial e as dos pilares mostram uma faixa rolável com "Todos" e os quatro pilares. O botão Compartilhar abre a tela de compartilhar do celular (WhatsApp, Instagram…); no computador, copia o link.

## Como rodar o site

```bash
npm install
npm run dev
```

Abra http://localhost:3000. Para testar a versão de produção: `npm run build` e `npm start`.

## Ligar o Sanity (uma vez)

1. Crie uma conta e um projeto em https://www.sanity.io/manage (o plano gratuito basta). Anote o **Project ID** e use o dataset `production`, que já vem **público** (o site lê os posts sem senha).
2. Instale e abra o editor:
   ```bash
   cd studio
   cp .env.example .env      # preencha SANITY_STUDIO_PROJECT_ID
   npm install
   npm run dev               # abre o editor em http://localhost:3333
   ```
3. Publique o editor na internet para escrever de qualquer lugar: `npm run deploy` (dentro de `studio/`). Ele já está em https://bruno-silva-blog.sanity.studio (o endereço fica gravado em `studio/sanity.cli.js`).
4. No site, preencha `NEXT_PUBLIC_SANITY_PROJECT_ID` (e `NEXT_PUBLIC_SANITY_DATASET`, se não for `production`) no `.env.local` e na Vercel (Settings → Environment Variables), e faça um novo deploy. A faixa "Exemplo" some e os posts passam a vir do Sanity.

O site busca os posts no servidor, então não precisa configurar CORS.

## Escrever um post

No editor: Posts → Create. Preencha título, endereço (botão Generate), pilar, data, resumo e texto, e clique em **Publish**. O post aparece no site a partir da data de publicação.

- O texto aceita títulos (H2, H3), listas, negrito, itálico, código, links, imagens com legenda, uma citação, a caixa "Dica / Atenção" e o **Prompt para copiar**.
- Checklist: no texto, **+** → Checklist. Título opcional (ex.: "Teste de sete dias") e até 12 itens curtos. O leitor marca no site, vê "2 de 7" e pode recomeçar; o navegador dele lembra o que foi marcado. No RSS, vira uma lista.
- Prompt para copiar: no texto, clique em **+** (Insert) → Prompt. Escreva o prompt exatamente como o leitor deve usar; as quebras de linha são mantidas. O título é opcional (ex.: "Peça assim"); rótulos de prompts anteriores continuam funcionando. No site ele vira um cartão com o botão "Copiar prompt"; no RSS, texto com título e quebras de linha.
- SEO (opcional, grupo fechado no fim do post): **Título para o Google** (até 60 caracteres), **Descrição para o Google** (até 160) e **Imagem de compartilhamento** (1200 × 630). Mudam só a aba do navegador, o Google e os links compartilhados; o título do post continua o mesmo. Sem eles, o site usa o título, o resumo e a capa (ou a imagem gerada com a marca).
- Mudar o endereço de um post é seguro: ao publicar, o Studio guarda o endereço antigo em **Endereços antigos** (grupo SEO), e quem abrir o link antigo vai direto para o novo (redirecionamento permanente, que o Google também segue). Para desfazer, apague o endereço da lista e publique.
- Capa é opcional. Sem ela, o cartão usa a bandeira e o ícone do pilar. A capa aparece colorida na lista de posts e dentro do post.
- Crie um Autor (nome, foto e bio) e escolha-o em cada post. Sem autor, o site usa o texto de `author` em `content/site.js`.

### Inserir um prompt para o leitor copiar

No campo Texto do post, abra o menu de inserir bloco e escolha **Prompt**. Preencha o texto do prompt; o título é opcional e, quando vazio, a caixa mostra "Prompt". O texto é obrigatório e não pode conter apenas espaços. Você pode inserir várias caixas no mesmo post.

No blog, **Copiar prompt** copia somente o texto original da caixa, preservando espaços, parágrafos e quebras de linha, para colar em uma IA. O resultado aparece como "Copiado!". Se o navegador bloquear a cópia, a caixa avisa e o botão permite tentar novamente. A cópia depende do acesso à área de transferência do navegador em HTTPS (ou localhost).

## Atualização na hora (opcional)

Sem configurar nada, as páginas se atualizam sozinhas em até 1 minuto depois de publicar. Para atualizar na hora:

1. Gere um segredo longo (no Terminal: `openssl rand -hex 32 | pbcopy` copia um pronto) e coloque em `SANITY_REVALIDATE_SECRET` na Vercel (e faça um novo deploy).
2. Em sanity.io/manage → API → Webhooks → Create webhook:
   - URL: `https://<seu-blog>/api/revalidate`
   - Dataset: `production`; Trigger on: Create, Update, Delete
   - Filter: `_type in ["post", "author"]`
   - HTTP method: POST; Secret: o mesmo segredo do passo 1.

O endpoint confere a assinatura do Sanity e recusa pedidos sem ela ou com mais de 5 minutos.

## Newsletter

O formulário chama `POST /api/subscribe`, com as mesmas proteções das outras páginas (só JSON do próprio site, limite de tamanho e de tentativas por IP, sem o e-mail nos logs). Sem provedor (`EMAIL_PROVIDER=none`), nada é guardado e aparece um aviso de exemplo. Para receber inscrições de verdade, escolha `kit`, `mailchimp` ou `brevo` e preencha as chaves (veja `.env.example`).

## Movimento

Os efeitos vêm do design system (`public/ds.js` e `styles/ds.css`):
- CodeDivider (o ornamento `</>`) acima do título da home e dos pilares, e antes de "Posts relacionados";
- NeuralNet: no cabeçalho da home e dos pilares, uma rede neural em 3D (WebGL, sem biblioteca): camadas de neurônios ligados por linhas volt, com sinais correndo pelas conexões. A câmera atravessa a rede; ao rolar ela acelera e a rede gira mais, e com o mouse a câmera se inclina. Sem WebGL, volta a bandeira com o CodeReveal. (O design system também tem o Terrain3D, um terreno em wireframe, que este blog não usa.);
- CodeReveal: caracteres hex entre as listras da bandeira, que acendem em volt sob o mouse (no cabeçalho, só quando o navegador não tem WebGL);
- ScrambleText: o título principal de cada página se "decodifica" ao abrir;
- MaskReveal: títulos de seção e subtítulos dos posts sobem ao rolar;
- Ticker: faixa discreta com os quatro pilares, que corre sozinha e acelera com a rolagem;
- Spotlight: nos cartões de post, uma luz volt segue o mouse;
- OrbitGlow: brilho volt girando atrás do botão "Quero receber" da newsletter.

O corpo dos posts não se mexe. Tudo pausa fora da tela, e quem pede "reduzir movimento" no aparelho vê tudo parado. Para mudar um efeito, atualize o design system e copie de novo os dois arquivos.

## Onde editar

- Textos fixos (menu, títulos, newsletter, rodapé, autor padrão): `content/site.js`.
- Topo da página inicial (botões e os três valores): `home.actions` e `home.values` em `content/site.js`.
- Página Sobre: `content/about.js`. Para mostrar números (anos de experiência, alunos…), preencha `facts`; vazio, o bloco não aparece.
- Privacidade e Termos: `content/legal.js` (e-mail de contato, seções e a data `updated`). É um modelo baseado no que os sites fazem hoje: se passar a usar analytics, cookies ou outro serviço que receba dados, atualize o texto. Para uma versão definitiva, peça a revisão de um advogado.
- Ícones do site (aba, tela de início do celular): `app/icon.png`, `app/apple-icon.png` e `public/img/icon-512.png` / `icon-maskable-512.png`, nomes e cores em `app/manifest.js`.
- Pilares: `lib/pillars.js` (site) e `studio/schemaTypes/post.js` (editor). Os valores precisam ser iguais nos dois.
- Posts de exemplo: `content/sample-posts.js` (só aparecem sem o Sanity).
- Estilos próprios do blog: `styles/page.css`. Os arquivos `styles/tokens.css`, `styles/ds.css` e `public/ds.js` são do design system e não devem ser editados.

## Publicar na Vercel

1. Envie o projeto para um repositório no GitHub.
2. Na Vercel, clique em Import Project e selecione o repositório.
3. O framework Next.js é detectado automaticamente. Deixe Root Directory, Build Command, Output Directory e Install Command no padrão (a pasta `studio/` fica fora do deploy do site).
4. Em Settings → Environment Variables, cole as variáveis do `.env.example` que você usa.
5. Cada push na branch `main` publica sozinho.

Depois de criar ou mudar uma variável de ambiente, faça um novo deploy (Deployments → Redeploy): variáveis `NEXT_PUBLIC_*` só valem a partir da próxima publicação.
