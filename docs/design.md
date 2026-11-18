# Preservar o visual do blog

O site usa CSS próprio e o design system Bruno Silva USA. Não usa Tailwind ou shadcn. Fonte observada: `styles/`, `public/ds.js`, componentes e README, em 2026-11-17.

`styles/tokens.css`, `styles/ds.css` e `public/ds.js` são artefatos do design system e não devem ser editados aqui. Ajustes específicos do blog ficam em `styles/page.css`; textos fixos em `content/site.js` e `content/about.js`.

Reutilize os componentes existentes, a hierarquia de título, cartões, formulários e blocos Portable Text. Capas, focal point e texto alternativo vêm do conteúdo. Não adicionar biblioteca visual ou animação por causa de uma skill disponível.

Preservar HTML semântico, rótulos, foco visível, navegação por teclado, estados de envio/erro, mensagens de cópia e preferência por movimento reduzido. Mudanças em material devem manter o texto copiado literalmente e renderização legível em telas estreitas.

O setup verificou fluxos locais e uma tela móvel de 390 × 844; isso não constitui auditoria visual de todos os tamanhos ou certificação de acessibilidade. `web-design-guidelines` pode apoiar revisões futuras conforme o diff; consulte os resultados em [setup](setup.md). Atualize este documento quando tokens de origem, componentes ou padrões de interação mudarem.
