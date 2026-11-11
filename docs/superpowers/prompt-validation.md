# Validação do bloco Prompt — 11 de novembro de 2026

Branch: feat/prompt-block. Base: 2e40c6e. Implementação: a68700e e 80aea7b.

## Evidências

- Task 1: testes de schema e navegador Chrome com fixture local temporária; ciclo falha/sucesso registrado. Cópia e leitura real de clipboard comparadas literalmente; duas caixas independentes; título opcional; texto vazio; caracteres HTML; quebra de linha; falha/permissão, nova tentativa e API ausente; Enter, Space, Tab e foco visível; sem overflow nas larguras 320, 375, 768 e 1280px.
- Task 1: build do blog e `SANITY_STUDIO_PROJECT_ID=xttuj9bi SANITY_STUDIO_DATASET=production npm run build --prefix studio` passaram.
- Task 2: ciclo TDD com quatro falhas iniciais, isolamento de discrepância do tempo de leitura, cinco testes finais aprovados. GROQ real emitido por getPosts/getPost/getAllPosts/getRelated/getAdjacent avaliado com groq-js e documentos sintéticos.
- Controlador: `node --experimental-default-type=module --test`: cinco testes, zero falhas; `git diff --check 2e40c6e HEAD` sem erros. Testes requerem Node >=22.15 e dependências do Studio instaladas.
- Revisões independentes por etapa: conformidade e qualidade aprovadas, sem problemas bloqueantes.

## Integração com a main atualizada

Merge local `4106846` integra `f371894` de origin/main e preserva os campos de SEO, metadados, conteúdo de exemplo e estilo DS da main. A integração foi revisada; um apontamento menor sobre seletores de ações sem uso foi resolvido removendo somente essas regras.

- `node --experimental-default-type=module --test`: seis testes aprovados. As consultas GROQ reais continuam avaliadas com groq-js; a fixture agora verifica rótulo legado, paridade de minutos e preservação de seoTitle, descrição e ogImage.
- Schema: um único tipo Prompt, título opcional e compatibilidade com o campo anterior label. UI, RSS, extração de texto e preview usam título, depois label, depois "Prompt"; sem migração.
- Chrome: rótulo legado renderizado e copiado literalmente; título tem precedência; falhas continuam visíveis e permitem nova tentativa. O teste aguarda o script DS, chama seu inicializador e confirma exatamente uma escrita no clipboard ao clicar, evitando dois handlers na mesma caixa React.
- Teclado, foco, estados independentes, API ausente e larguras 320, 375, 768 e 1280px passaram novamente. A fixture temporária e os links de dependências foram removidos após verificação.
- Builds do blog (28 páginas) e do Studio (`SANITY_STUDIO_PROJECT_ID=xttuj9bi SANITY_STUDIO_DATASET=production npm run build --prefix studio`) passaram. O build final do blog ocorreu após o ajuste de feedback visível e a remoção da fixture. `git diff --check` passou.

A limpeza posterior remove somente seletores CSS sem uso e atualiza este registro; foi verificada com `git diff --check`, sem repetir builds ou testes de navegador.

## Limites

Os builds emitiram avisos existentes sobre raiz do workspace do Next e versão declarada de styled-components no Studio. Não foram modificadas dependências. Teste de navegador feito em Chrome; não comprova outros navegadores ou leitores de tela reais. A fixture foi removida; não houve escrita de documentos Sanity nem migração de artigos.

## Disponibilização

Implementação local, ainda não publicada. Integrar a branch no fluxo GitHub/Vercel para publicar o blog. Publicar o Studio separadamente com seu comando existente `npm run deploy` dentro de studio, após autorização. Verificar os dois ambientes hospedados antes de informar disponibilidade. Não publicar artigos de teste para validar o código.

Revisão final independente: aprovada para integração, sem achados críticos, importantes ou menores.

## Decisões operacionais

- Worktree criado por Git após rejeição dos argumentos pela ferramenta nativa; main preservada. O worktree precisa ser gerenciado manualmente.
- Dependências existentes reutilizadas por links locais, sem copiar segredos; builds do blog usaram artigos de exemplo, sem certificar consultas ao CMS ao vivo.
- A main remota foi integrada localmente na branch de trabalho; isso não integra o PR na main nem publica o recurso. Push, merge do PR e deploy continuam sujeitos ao fluxo autorizado. A disponibilidade hospedada depende de publicação e verificação.
