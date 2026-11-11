# Bloco Prompt

Desenho aprovado pelo usuário em 11 de novembro de 2026.

Objetivo: permitir ao autor inserir prompts prontos para o leitor copiar e colar em uma IA.

Abordagens consideradas: acrescentar um tipo à caixa Dica/Atenção ou criar um bloco separado. O usuário escolheu o bloco separado, que tem uma ação própria de copiar.

No Sanity, o conteúdo do artigo oferece o bloco Prompt com título opcional e texto obrigatório. No blog, a caixa segue o design existente, preserva parágrafos e quebras de linha e usa o rótulo Prompt quando não houver título. O botão Copiar prompt copia apenas o texto original, confirma com Copiado! e permite tentar novamente se houver falha.

Decisões de implementação propostas: usar texto simples, sem dependências novas; incluir o conteúdo no RSS sem botão e na extração de texto para tempo de leitura; suportar teclado e anunciar o resultado da cópia. Não alterar artigos existentes nem publicar artigos para testar.
