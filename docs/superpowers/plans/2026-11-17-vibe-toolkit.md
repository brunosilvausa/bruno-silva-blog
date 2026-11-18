# Vibe Coding Toolkit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Entregar a adoção incremental completa e verificável do toolkit aplicável ao blog existente.

**Architecture:** Preservar o site Next.js/JavaScript e o Sanity Studio independentes. Acrescentar contexto curto, ferramentas locais compatíveis e verificações existentes consolidadas; executar checks e navegador com fixtures sem carregar credenciais do checkout.

**Tech Stack:** Node 22, npm, Next.js 15, React 19, JavaScript, CSS próprio, Sanity e node:test.

**Spec:** [Design aprovado](../specs/2026-11-17-vibe-toolkit-design.md).

## Global Constraints

- Fonte do toolkit: `7ef68dd7b00ddfc5cd464458855e4ab66dd2128f`; não misturar revisões de templates/guias.
- Preservar JavaScript, Next.js 15, npm, Sanity, design system, URLs, contratos e dados.
- Sem produção, deploy, push, mensagens, migrações, custos, agendamentos, hooks Git ou exigência de branch/worktree.
- Sem instalação global ou mudança fora do projeto, exceto fontes temporárias, backups privados e recursos descartáveis já previstos no design.
- Não atualizar memórias globais, não registrar segredos e não alterar arquivos locais de credenciais.
- Backups de configurações existentes antes de modificá-las; preservar índice Git e mudanças concorrentes. Deixar diff revisável sem commits automáticos.
- Atualizações de dependências somente estáveis e compatíveis, após peers/engines/changelog. Nenhuma migração por requisito opcional.
- Nenhum teste/fixture ou proteção é removido para passar checks. Falhas anteriores e bloqueios externos recebem causa e próxima ação.

## Review Focus

1. `.env*` no checkout ou ambiente herdado: build/smoke devem usar fixtures e nunca consultar o Sanity ou provedores reais; testar isolamento na tarefa 1.
2. Dependências independentes: testes GROQ dependem do Studio; validar ambos os lockfiles e instruir instalação dos dois na tarefa 3.
3. Novas regras encontram legado: contar por regra antes de impor severidade; self-check deve detectar casos válidos/inválidos na tarefa 3.
4. Skills duplicadas e links absolutos: instalação deve preservar fontes/licenças, customizações e portabilidade; testar inventário e reexecução na tarefa 2.
5. Presença confundida com funcionamento: distinguir disco, descoberta, preflight, execução e reinício real; smoke e revisão de evidências na tarefa 4.

## Mapa de arquivos

| Arquivos | Responsabilidade |
| --- | --- |
| `README.md`, `PRODUCT.md`, `AGENTS.md`, `CLAUDE.md` | Entrada, produto, comandos e ponte Claude sem duplicar regras |
| `docs/architecture.md`, `docs/design.md`, `docs/onboarding.md` | Fronteiras observadas, visual existente e execução local |
| `docs/quality.md`, `docs/setup.md` | Comandos, baseline/final, catálogo, versões, fontes, evidências e manutenção |
| `.agents/skills/`, `skills-lock.json`, links relativos requeridos pelo cliente | Somente skills locais faltantes e aplicáveis |
| `.graphifyignore`, `.gitignore` | Exclusões de segredos/gerados; ignorar artefatos locais se necessário |
| `eslint.config.mjs`, `eslint-rules/`, `scripts/verify-quality-rules.mjs` | Perfil Next leve e regras/self-check copiados da mesma revisão |
| `package.json`, `package-lock.json`, `studio/package.json`, `studio/package-lock.json` | Comandos e dependências locais compatíveis; Studio só muda quando necessário |
| `tests/` e arquivos de aplicação já existentes | Somente regressões e correções mínimas justificadas por falhas confirmadas |

Não criar `.codex/config.toml` ou `.mcp.json` para duplicar plugins já disponíveis. Qualquer configuração local adicional precisa de lacuna comprovada e documentação da descoberta.

### Task 1: Baseline seguro e contexto canônico

**Files:** criar os documentos do mapa; modificar README apenas para mapa/comandos; preservar specs e planos históricos.

**Interfaces:** consome checkout, design aprovado e toolkit fixo; produz `docs/setup.md` com baseline e matriz de cobertura, `docs/quality.md` com comandos e mapa documental coerente.

- [x] Inventariar versões efetivas com `npm ls --depth=0` e `npm --prefix studio ls --depth=0`, HEAD, scripts, instruções específicas, arquivos grandes e configurações. Ler integralmente os guias obrigatórios restantes e manifest/templates antes de adaptar conteúdo. Registrar versões inválidas ou ausentes sem forçar instalação.
- [x] Revisar imports/efeitos dos cinco testes e comandos de build. Criar cópia temporária do código sem `.git`, `.env*` reais, caches, outputs, skills vendorizadas ou credenciais; manter apenas exemplos públicos necessários. Reutilizar dependências instaladas por links temporários e usar ambiente de subprocesso com allowlist de PATH/variáveis de runtime. Definir site fictício local, Sanity do site vazio e `EMAIL_PROVIDER=none`; Studio usa ID sintético `test-project`. Desabilitar telemetria suportada.
- [x] Antes dos checks, afirmar na cópia: nenhum arquivo de ambiente real, nenhum segredo herdado e configuração do site em modo amostra. Registrar o método sem valores sensíveis. Não usar o build no checkout principal se ele puder carregar `.env.local`.
- [x] Rodar `node --test tests/*.test.mjs`, `npm run build` e `npm --prefix studio run build` na cópia isolada, serializando builds. Capturar exit code, contagem de testes e duração. Se a análise mostrar requisito de flag Node, registrar e usar a flag mínima no comando canônico. Não confundir ausência de lint/types com sucesso.
- [x] Escrever PRODUCT e arquitetura a partir do README/código: site lê conteúdo público, Studio é responsável pela edição, APIs subscribe/revalidate têm fronteiras próprias. Documentar tokens/CSS protegidos e fluxos existentes, sem redesenhar UI.
- [x] Escrever AGENTS curto com comandos, restrições e links; CLAUDE importa AGENTS. Documentar memória de projeto sob demanda em docs, sem duplicar memória global.
- [x] Validar caminhos dos links, inexistência de placeholders e diff de documentação. Registrar baseline antes de avançar.

### Task 2: Ferramentas e skills aplicáveis

**Files:** `docs/setup.md`, `AGENTS.md`, `.graphifyignore`, `.gitignore` se necessário; skills locais e seu lockfile quando faltantes.

**Interfaces:** consome matriz da tarefa 1 e ferramentas observáveis da sessão; produz tabela por componente com fonte/versão, escopo, ação e estado verificável.

- [x] Descobrir ferramentas disponíveis e consultar CLI help antes de comandos mutáveis. Usar Context7 para resolver Next.js e consultar um conceito público relevante à versão 15; registrar resultado real e limitação de versão, se houver.
- [x] Conferir catálogo upstream Vercel/find-skills, frontmatter/licenças e equivalentes globais/plugins. Instalar apenas faltantes no projeto via mecanismo oficial, com lockfile e links relativos/cópias portáveis. Preservar autenticação e cliente atuais; não instalar duplicatas pelo simples nome do pacote.
- [x] Avaliar cada guia 01–23 e extras do catálogo; registrar decisões específicas para RTK, Caveman, artefatos, hooks, memória, aia-harness e plugins. Ausência de ferramenta global vira pendência com comando e efeito, sem instalação implícita.
- [x] Fazer preflight de Next dev loop/analyzer contra versão efetiva; incompatibilidade com Next 15 fica documentada, sem upgrade/bundler novo. PostgreSQL e shadcn não se aplicam; Sentry permanece não selecionado. gh-fix-ci depende de CI realmente adotada, sem inventar PR/workflow.
- [x] Inspecionar Graphify disponível e mecanismo determinístico local. Configurar exclusões de env/segredos/dependências/skills/caches/outputs antes de gerar grafo. Consultar relação real do código; registrar cobertura/frescor ou bloqueio do modo seguro. Não enviar código a serviço externo.
- [x] Verificar navegador isolado disponível sem usar sessão pessoal. Reutilizar capacidade existente; não instalar globalmente para preencher catálogo. Registrar lacunas de console/rede.
- [x] Verificar fontes, licenças, links e descoberta separadamente da presença em disco. Reexecutar listagem/configuração segura e confirmar ausência de duplicações/customizações perdidas; não reinstalar tudo como teste.

### Task 3: Comandos de qualidade e correções incrementais

**Files:** `package.json`, lockfile raiz, `eslint.config.mjs`, `eslint-rules/`, `scripts/verify-quality-rules.mjs`, `docs/quality.md`; Studio e testes existentes só se a evidência justificar.

**Interfaces:** produz `npm test`, `npm run lint`, `npm run check:rules` e `npm run check`; `check` combina lint, self-check e testes sem publicar. Builds do site/Studio permanecem comandos separados documentados por exigirem ambiente local isolado.

- [x] Conferir dependências/peers/engines estáveis do ESLint e perfil Next 15 com Context7/documentação oficial e registry. Fazer backup privado dos manifestos/configurações antes de alterar. Reutilizar node:test; não introduzir TypeScript/Vitest/Biome sem necessidade.
- [x] Copiar módulos e self-check do perfil Next leve da revisão fixa. Adaptar caminhos do script e escopo JS/JSX/Studio; excluir dependências, gerados e skills vendorizadas, nunca código problemático só para zerar erros.
- [x] Executar primeiro self-check e lint de medição com relatório por regra. Manter erros existentes; regras novas sem violações viram error, legado pode começar warn com contagem e plano. Limite de 350 linhas recebe medição antes de aplicação; não fatiar arquivos artificialmente.
- [x] Adicionar scripts canônicos usando o comando de testes comprovado na tarefa 1. Documentar instalação `npm ci` na raiz e `npm --prefix studio ci`, sem confundir dois projetos com workspace npm. Não prometer tipos estáticos onde não existe TypeScript.
- [x] Para falha de comportamento dentro do escopo: ler todos os chamadores, reproduzir, criar regressão mínima que falha, corrigir causa compartilhada e provar que passa. Não adicionar teste espelhando configuração trivial. Mudança arquitetural/incompatível fica fora do lote e vira proposta.
- [x] Rodar `npm run check` e builds isolados site/Studio; executar `npm audit --json` e `npm --prefix studio audit --json`, separando dev/produção e fixes incompatíveis. Não usar audit fix automático/force.
- [x] Se existir CI descoberto após o inventário, integrar os mesmos checks sem acesso a produção. Se não existir, manter comandos locais e documentar decisão, sem adicionar pipeline remoto por padrão.

### Task 4: Integração local, harness e revisão final

**Files:** `docs/setup.md`, `docs/quality.md`, `docs/onboarding.md`; correções limitadas aos responsáveis das tarefas anteriores.

**Interfaces:** consome comandos e ferramentas das tarefas anteriores; produz evidência final, matriz sem itens omitidos, pendências comprovadas e procedimento de manutenção/reexecução.

- [x] Atualizar a cópia descartável com mudanças finais e executar servidor local em porta livre. Registrar PID próprio; não parar processos de terceiros nem executar build concorrente no mesmo output.
- [x] Validar home/post, Central/material, cópia de prompt, glossário/série e newsletter em modo none. Verificar foco/teclado, feedback de cópia/erro, console/rede quando observáveis e ausência de chamadas aos provedores reais. Checagem HTTP isolada não substitui interação de navegador; registrar qualquer interação não observável.
- [x] Revisar subscribe/revalidate e configurações alteradas, com entradas sintéticas e testes proporcionais. Registrar fonte versionada/invocação do Prompt 13 em quality; qualquer relatório sensível fica privado fora do repositório. Instalar differential-review só se compatível e útil; rastreamento manual é fallback explícito.
- [x] Aplicar avaliação descartável relevante dos prompts 14/15: descoberta de instruções/comandos, leitura de contexto, skill relevante, Context7, RTK e grafo quando disponíveis. Registrar cliente/modelo apenas quando observáveis e diferenciar subagente limpo de reinício do cliente.
- [x] Usar Harness2 como adaptação nativa. Se houver falha concreta, comparar no máximo um candidato de instrução no mesmo caso/estado inicial, mantendo avaliador e critérios; caso passe, não inventar mudança. Não executar CLI oficial ou benchmark pago.
- [x] Solicitar revisão independente somente leitura do diff completo contra HEAD e arquivos novos, com foco em requisitos, regressões, configuração, segurança e documentação. Verificar findings, aplicar correções autorizadas e repetir apenas checks afetados. Registrar escopo e limites da revisão.
- [x] Finalizar matriz com validado, reutilizado, configurado sem execução, inaplicável ou bloqueado; cada bloqueio tem causa e próxima intervenção. Documentar atualização, invalidação, recuperação e rerun sem duplicações.
- [x] Rodar checks finais relevantes, validar links/configuração e `git diff --check`; inspecionar também arquivos não rastreados, que diff comum não inclui. Parar apenas servidor/recursos criados por esta execução.
- [x] Entregar mudanças, comandos/resultados antes/depois, revisão, itens não validados, riscos e próximo passo. Sem commit, push ou publicação automática.

## Aprovação e execução

Design e plano aprovados pelo usuário nesta conversa. Executado diretamente, com revisão independente e correções locais. As caixas indicam etapas tratadas, incluindo decisões explícitas de inaplicabilidade e validações não executadas; não significam que todo serviço foi conectado. Evidências e pendências estão em `../../setup.md`. Não há commits ou publicação.

## Autorrevisão do plano

Cobertura conferida contra o design: catálogo completo nas tarefas 1–2; nove destinos documentais na tarefa 1; qualidade/testes e dependências na tarefa 3; operação local, segurança, harness, idempotência e revisão na tarefa 4. Os cinco riscos de revisão têm checks explícitos nas respectivas tarefas. Caminhos e interfaces de comandos foram mantidos consistentes; decisões de versão dependem de preflight, sem valores comerciais fixos.
