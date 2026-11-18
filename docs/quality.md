# Verificar qualidade, segurança e comportamento

Referência verificada em 2026-11-17. Objetivo: executar checks locais e distinguir resultado de aplicação, instalação de ferramenta e comportamento do agente. O [plano aprovado](superpowers/plans/2026-11-17-vibe-toolkit.md) define o escopo deste setup.

## Comandos canônicos

| Comando | O que verifica |
| --- | --- |
| `npm run lint` | JS/JSX/MJS/CJS do site e Studio com Next core-web-vitals e regra local de tamanho |
| `npm run check:rules` | Casos válidos/inválidos das três regras do toolkit via RuleTester |
| `npm test` | 41 testes node:test, amostras e consultas GROQ avaliadas localmente |
| `npm run check` | Lint, self-check e testes, sem publicação, migração ou provedor real |
| `npm run build` | Build do blog; carrega ambiente local no checkout original |
| `npm --prefix studio run build` | Build do editor; não testa login, edição nem publicação remota |
| `npm audit --json` | Avisos de dependências do site e ferramentas |
| `npm audit --omit=dev --json` | Dependências de produção do site |
| `npm --prefix studio audit --json` | Dependências do editor, separadas do deploy do blog |

Instale ambos os lockfiles antes de testar: parte dos testes importa `groq-js` da instalação do Studio. `tests/offline.mjs` fixa amostras e provedor none antes dos testes. O comando Node não carrega `.env` automaticamente. Para build/smoke sem serviços reais, siga a [cópia descartável](onboarding.md#validar-sem-serviços-reais).

A stack é JavaScript; não há typecheck nem lint com informação de tipos. Não adicionar TypeScript apenas para habilitar no-floating-promises/no-misused-promises. Não há formatter preexistente: o setup não reformata o repositório nem adiciona Biome redundante.

## Adoção de lint

Next 15 usa FlatCompat; o template Next 16 com arrays flat e perfil TypeScript não é compatível diretamente. ESLint 9.39.5 atende os peers do eslint-config-next 15.5.29, mas sua linha está depreciada upstream. Migrar para ESLint 10 exige reavaliar compatibilidade; não forçar peers.

Medição inicial: cinco violações de navegação interna por `<a>`, dez de img nativo, uma de alt-text no wrapper Img e duas de max-lines. A configuração nova tinha um aviso de export anônimo, corrigido na própria configuração. As 18 violações de aplicação permanecem visíveis como warn; não havia lint anterior com severidades a preservar. Não remover avisos com exclusões genéricas.

Max-lines usa 350 linhas físicas conforme a semântica do módulo copiado: `lib/sanity.js` (392) e `public/ds.js` (745). O segundo pertence ao design system protegido. Reduzir `lib/sanity.js` por responsabilidade quando houver mudança concreta na camada; atualizar o DS somente na fonte responsável. Migrar links/img requer validação de navegação, imagem remota, layout e cache; não executar reforma visual para limpar lint.

As regras de console/Drizzle são verificadas pelo self-check, mas não ativadas: não há logger próprio nem cliente de banco. Não criar wrappers ou bancos para satisfazê-las. Origem/licença e atualização em `eslint-rules/README.md`.

## Fluxos locais

Verificar home/post, Central/material, cópia literal do prompt e seu erro, glossário/série, formulário vazio e sucesso demonstrativo, foco por teclado e tela estreita. Usar navegador com perfil descartável e variáveis de amostra. Capturar erros de runtime/rede; uma resposta HTTP 200 não prova funcionamento do botão ou formulário. Resultado específico e limites ficam em [setup](setup.md).

Revisões visuais e de documentação podem usar as skills locais web-design-guidelines e writing-guidelines. Aplicar ao contexto do blog em português; não transformar exigências do handbook editorial da Vercel em novos campos do produto.

## PostCSS fixado sob Next

Após aprovação do spike, o checkout aplica `overrides.next.postcss = "8.5.33"`, mantendo Next 15.5.29. Somente PostCSS mudou de versão no lockfile. A instalação local foi reconciliada por npm ci em ambiente sem credenciais e a resolução efetiva sob Next foi confirmada; editar manifesto/lockfile sozinho não basta.

A revalidação pós-aplicação passou em instalação limpa isolada do site/Studio, `npm run check` (36 testes, self-check e 18 avisos existentes), ambos os builds, regressões sintéticas e fluxos locais. Os três CSS gerados ficaram idênticos ao baseline do spike; quatro capturas controladas tiveram zero pixels diferentes. Auditorias repetidas: completo com 13 alertas altos / exit 1; omit=dev zero / exit 0. O residual de lint/Studio não foi remediado por este lote. Evidências e recuperação estão em [setup](setup.md#aplicação-do-postcss-8533).

Regressões: [GHSA-6g55-p6wh-862q](https://github.com/advisories/GHSA-6g55-p6wh-862q), [GHSA-r28c-9q8g-f849](https://github.com/advisories/GHSA-r28c-9q8g-f849), [GHSA-fxqj-rqcc-2cmp](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp) e [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93). Usar somente arquivos/marcadores temporários fictícios; resolver a biblioteca a partir do pacote Next; comparar baseline/candidato e controle de CSS normal. O caso XSS deve seguir parse(...).toResult().css do advisory, sem confundir processo sem plugins que devolve a entrada com um sanitizador. Não usar arquivos reais ou produção para reproduzir leitura indevida.

A limitação de OG sem fontes externas foi observada igualmente nas duas cópias do spike e reproduzida após aplicação: “No fonts are loaded”. PNG com fonte local de teste passa; não demonstra funcionamento de Google Fonts ou do fallback sem fontes. Esse comportamento não foi corrigido pelo lote PostCSS e não deve ser descrito como regressão dele.

Ao mudar Next/PostCSS, revisar/remover o override e repetir instalação/check/build, regressões, CSS e browser pertinente. Não ampliar o override, atualizar outros pacotes ou flexibilizar checks para passar auditoria. Preservar a separação entre versão declarada, instalada, comportamento testado e produção não validada.

## Segurança reutilizável

Fonte imutável do Prompt 13: [security-review.md](https://github.com/soumatheusgomes/vibe-coding-toolkit/blob/7ef68dd7b00ddfc5cd464458855e4ab66dd2128f/docs/prompts/13-security-review.md#prompt). Invocação: leia e execute somente o bloco Prompt dessa revisão, declarando baseline de repositório ou base/head exatos e camadas staged/unstaged/untracked. A revisão padrão é somente leitura; relatório privado e redigido fora do repositório. Não executar produção, uploads ou correções automáticas. Atualizar a referência somente após comparar as mudanças do prompt.

Este setup revisa configurações/dependências e rastreia subscribe/revalidate como fronteiras existentes. O diff não altera autenticação ou contratos dessas rotas. Differential-review não foi instalado: o prompt versionado e rastreamento manual atendem a revisão deste diff de tooling; usar a skill quando um diff sensível justificar seu método. Alertas npm não demonstram exploração; produção e desenvolvimento precisam de análise separada. Não usar force, downgrade automático ou override incompatível só para zerar relatório.

## Harness2: adaptação nativa

Modo: método nativo inspirado em Harness2, sem instalar/executar o framework oficial nem reproduzir seus benchmarks. Fontes da revisão fixa: [guia 23](https://github.com/soumatheusgomes/vibe-coding-toolkit/blob/7ef68dd7b00ddfc5cd464458855e4ab66dd2128f/docs/tools/23-harness2.md), [Prompt 15](https://github.com/soumatheusgomes/vibe-coding-toolkit/blob/7ef68dd7b00ddfc5cd464458855e4ab66dd2128f/docs/prompts/15-harness-improvement.md#prompt), [avaliação/Prompt 14](https://github.com/soumatheusgomes/vibe-coding-toolkit/blob/7ef68dd7b00ddfc5cd464458855e4ab66dd2128f/docs/prompts/14-harness-evaluation.md#prompt).

Invocação reutilizável: execute o bloco Prompt 15 dessa revisão no projeto, preservando cliente, modelo, autenticação e permissões. Comece com os casos pertinentes do Prompt 14 em cópias descartáveis. Baseline e avaliador ficam fora dos arquivos graváveis do agente; não copiar credenciais. A fixture deliberadamente falha em duas verificações de autorização. Corrigi-la em uma cópia testa o harness, não corrige um problema deste blog.

Se houver falha concreta de instrução/contexto/ferramenta, definir critérios antes da mudança; comparar um único candidato mínimo com o mesmo caso e entradas. Não alterar o avaliador para passar. Adotar só com evidência, inspecionar diff e reexecutar checks. Sem falha do harness, registrar o procedimento e não inventar otimização. O limite é um candidato; mais rodadas exigem razão e orçamento acordado. Nenhum ensaio pago/repetido começa automaticamente.

Casos iniciais: boundary fix, stale handoff e read-only security review em três cópias. Reaplicação usa inventário/restore dry-run e unicidade de instruções. Novas sessões de cliente, conflitos de recursos e pause/resume não foram simulados como aprovados. Atualizar as evidências quando cliente/modelo, instruções, skills ou integrações mudarem. Registrar runtime, modelo solicitado/observado, resultados, limitações e fonte em setup; não estimar economia de tokens/custo não observada.

### Lição verificada: não modificar fontes de skills

Em 2026-11-17, adicionar LICENSE dentro de caveman alterou o hash esperado. O dry-run retornou exit 0, mas informou “does not match skills-lock.json”: código de saída sozinho não prova integridade. Critério: nove skills já instaladas e nenhuma divergência reportada. Um único candidato moveu o aviso para `.agents/skills/LICENSE-caveman.txt`, preservando fontes e lockfile. O mesmo dry-run passou. Não editar conteúdo vendorizado; guardar notas adicionais fora de cada pasta de skill. Revalidar quando skills CLI, algoritmo de hash, fontes ou avisos mudarem. Esta foi a comparação nativa delimitada do setup; não executou Harness2 oficial ou benchmarks.


## Regressão OG offline

`tests/og-fonts.test.mjs` usa os TTFs de `assets/fonts/og/`, PNG local e dados de amostra. Executa ambos os renderizadores com fontes externas indisponíveis total/parcialmente e timeout sintético (exceção imediata, sem esperar uma rede real). Exige duas famílias/pesos corretos e nenhuma requisição de fonte. Consome o stream inteiro e decodifica o PNG com sharp já transitivo do Next: assinatura PNG, 1200×630 e cache preservado. Não basta HTTP 200.

Cobre títulos curtos, longos e acentuados; monograma ausente; capa indisponível; home, central, pilar, post e materiais com/sem capa, com fallback de imagem. TTF local ausente deve rejeitar ENOENT em processo isolado. Os cinco testes novos elevam a suíte a 41. O check/build seguro de 2026-11-17 passou; permanecem 18 warnings de lint anteriores.

Ao alterar fontes/Next/carregador: repetir check e build em cópia segura incluindo assets, conferir os TTFs nos cinco tracings OG, servir o build localmente e decodificar as respostas no navegador. Comparar normal/capa com baseline usando fontes e imagens locais equivalentes; inspecionar glifos, quebras, cortes e contraste. Em 2026-11-17, seis pares tiveram zero diferenças nos pixels; seis URLs foram decodificados no Chrome e quatro páginas apontaram para seus OGs locais.

As fontes web e next/font permanecem independentes; o build foi testado com fixtures locais externas ao repositório. Tracing local não prova empacotamento de um provedor. Cobertura verificada é a registrada em sources.json, não todo Unicode. O truncamento de títulos longos é anterior e permanece. O erro histórico “No fonts are loaded” do lote PostCSS não foi regressão de PostCSS; esta correção OG foi validada separadamente.
