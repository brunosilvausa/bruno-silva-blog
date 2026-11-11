# Validação do bloco Prompt — 11 de novembro de 2026

Branch: feat/prompt-block. Base: 2e40c6e. Implementação: a68700e e 80aea7b.

## Evidências

- Task 1: testes de schema e navegador Chrome com fixture local temporária; ciclo falha/sucesso registrado. Cópia e leitura real de clipboard comparadas literalmente; duas caixas independentes; título opcional; texto vazio; caracteres HTML; quebra de linha; falha/permissão, nova tentativa e API ausente; Enter, Space, Tab e foco visível; sem overflow nas larguras 320, 375, 768 e 1280px.
- Task 1: build do blog e `SANITY_STUDIO_PROJECT_ID=xttuj9bi SANITY_STUDIO_DATASET=production npm run build --prefix studio` passaram.
- Task 2: ciclo TDD com quatro falhas iniciais, isolamento de discrepância do tempo de leitura, cinco testes finais aprovados. GROQ real emitido por getPosts/getPost/getAllPosts/getRelated/getAdjacent avaliado com groq-js e documentos sintéticos.
- Controlador: `node --experimental-default-type=module --test`: cinco testes, zero falhas; `git diff --check 2e40c6e HEAD` sem erros. Testes requerem Node >=22.15 e dependências do Studio instaladas.
- Revisões independentes por etapa: conformidade e qualidade aprovadas, sem problemas bloqueantes.

## Limites

Os builds emitiram avisos existentes sobre raiz do workspace do Next e versão declarada de styled-components no Studio. Não foram modificadas dependências. Teste de navegador feito em Chrome; não comprova outros navegadores ou leitores de tela reais. A fixture foi removida; não houve escrita de documentos Sanity nem migração de artigos.

## Disponibilização

Implementação local, ainda não publicada. Integrar a branch no fluxo GitHub/Vercel para publicar o blog. Publicar o Studio separadamente com seu comando existente `npm run deploy` dentro de studio, após autorização. Verificar os dois ambientes hospedados antes de informar disponibilidade. Não publicar artigos de teste para validar o código.

Revisão final independente: aprovada para integração, sem achados críticos, importantes ou menores.

## Decisões operacionais

- Worktree criado por Git após rejeição dos argumentos pela ferramenta nativa; main preservada. O worktree precisa ser gerenciado manualmente.
- Dependências existentes reutilizadas por links locais, sem copiar segredos; builds do blog usaram artigos de exemplo, sem certificar consultas ao CMS ao vivo.
- Push, merge e deploy reservados à escolha de integração do usuário; a funcionalidade permanece indisponível no ambiente hospedado até a publicação.
