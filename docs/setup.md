# Setup do desenvolvimento assistido

Data: 2026-11-17. Escopo aprovado: adoção incremental completa, execução direta e revisão independente final. Projeto: Bruno Silva Blog. Referências: [design](superpowers/specs/2026-11-17-vibe-toolkit-design.md), [plano](superpowers/plans/2026-11-17-vibe-toolkit.md), [comandos](quality.md).

Estado atual: o lote PostCSS aprovado foi aplicado localmente. A seção [Aplicação do PostCSS](#aplicação-do-postcss-8533) registra a instalação efetiva, os checks e as limitações; as evidências do setup inicial abaixo permanecem históricas.

## Fontes e ambiente

Toolkit obtido fora do projeto, revisão `7ef68dd7b00ddfc5cd464458855e4ab66dd2128f`. O Prompt 12, catálogo, templates, regras, self-check e avaliador são dessa revisão. Guias 17–23 foram consultados para as decisões de compatibilidade. Não copiar o toolkit inteiro para a aplicação.

HEAD inicial: `b6e0fae2d6704fc5fbfb320624c9aeae1b0c6080`; checkout inicialmente limpo. Design/plano foram os primeiros arquivos novos. Nenhum commit, push, deploy ou mudança global de configuração faz parte desta entrega.

Coordenador: Codex nesta sessão, Node 22.23.4 e npm 10.9.9 em macOS arm64. Modelo principal/effort exatos não são expostos pelo runtime; nenhuma troca foi solicitada. Delegações declararam gpt-6.2-sol/medium para fixtures mecânicas e gpt-6.2-astra/high para revisão, pelo mecanismo nativo, sem provider/API/proxy novos. Os trabalhadores não conseguem confirmar o nome comercial; tratar o parâmetro de despacho como solicitado, não medição independente. Um trabalhador observou Node 24 em seu shell; o baseline da aplicação usa Node 22.

Versões efetivas iniciais: Next 15.5.29, React/ReactDOM 19.3.1, Sanity e Vision 6.22.0, styled-components 6.6.0. Atualização compatível: Sanity/Vision 6.24.0 e faixa styled-components reconciliada. Peers do pacote Sanity Node >=22.12 e React ^19.2.2 foram conferidos; o lockfile atualizado exige piso efetivo Node 22.22.2 (ou Studio Node 24.15+/26+), reconciliado nos engines; release notes oficiais da 6.24.0 revisadas. Não atualizar Next 16 ou ESLint 10 à força. DevDependencies adicionadas: ESLint 9.39.5, eslint-config-next 15.5.29 e @eslint/eslintrc 3.3.7.

Backups dos manifestos/lockfiles, README e gitignore foram guardados no workspace privado temporário deste setup. Segredos não foram lidos ou copiados. Builds usam cópia por allowlist de código/manifestos, sem arquivos de credenciais, .npmrc, links de origem, .sanity, `.env*` reais, outputs e caches; env de subprocesso limitado, Sanity do site vazio, Studio sintético e provedor none. Dependências instaladas são reutilizadas por links locais. O procedimento reproduzível fica em onboarding.

## Matriz completa do catálogo

Legenda: **validado** = execução observada; **reutilizado** = capacidade existente preservada (limites na coluna final); **configurado** = arquivos presentes sem prova em cliente reiniciado; **inaplicável** = necessidade ausente/incompatível; **bloqueado** = requisito externo comprovadamente ausente.

| Guia/componente | Necessidade e ação / escopo | Estado e validação / dependência, risco ou próxima ação |
| --- | --- | --- |
| 01 Superpowers | Reutilizar plugin da sessão, sem instalação duplicada | Validado: brainstorming, design revisado/aprovado, plano aprovado e execução; reinício não observado |
| 02 Subagentes | Nativos, tarefas de fixture isoladas; um escritor, coordenador nos lockfiles/docs | Validado nas três fixtures; revisão final registrada abaixo; sem painel recorrente ou savings inventados |
| 03 RTK | Binário existente 1.1.0; comando explícito, sem init/hook novo | Validado `rtk git status`; hook automático não observado; saída original disponível |
| 04 Ponytail | Reutilizar skill global full e preferência do usuário | Ativo nesta execução, roteado em AGENTS; sem duplicar skill global |
| 05 Caveman | Skill local faltante, instalar só caveman | Configurado e lido; comunicação concisa, sem proxy/provider; descoberta após restart pendente |
| 06 ESLint/Biome | ESLint compatível, FlatCompat e regras/self-check locais MIT | Validado: check e RuleTester; 18 avisos legados; Biome/formatter e typed lint inaplicáveis à necessidade atual |
| 07 Graphify | CLI existente 0.9.96; exclusions e extração AST code-only | Validado: CLI local extração/query; conector remoto disponível mas não usado; skill standalone não descoberta, AGENTS roteia CLI equivalente; sem LLM, upload ou hook; grafo ignorado, cobertura parcial para docs/CSS |
| 08 Obsidian | Nenhum vault/destino solicitado | Inaplicável: docs versionadas e memória do cliente bastam; sem exportação |
| 09 Memória Claude | Ponte CLAUDE importa AGENTS; índice curto e docs detalhadas | Configurado; Claude não executado, nenhuma memória global alterada |
| 10 Hooks | Nenhuma lacuna que exija interceptor novo | Reutilização conservadora; não instalar hooks; ausência de execução automática não declarada como sucesso |
| 11 agent-browser | CLI ausente no PATH; já há Playwright e Chrome locais | Reutilizado equivalente: perfil descartável, clipboard/forms/mobile testados; sem instalação global |
| 12 Context7 | Plugin ativo, sem servidor duplicado | Validado resolve Next e query `/vercel/next.js/v15.5.28` sobre FlatCompat; configuração aplicada ao patch 15.5.29 |
| 13 Artefatos/skill creation | Equivalentes globais documents, pdf, spreadsheets, presentations e skill-creator; webapp-testing atendido por Playwright existente; sem artefato novo solicitado | Reutilizadas sob demanda; nenhuma instalação/skill nova só para checklist |
| 14 Chrome DevTools MCP | MCP não disponível; diagnóstico básico via Playwright existente | Equivalente validado para page errors/rede; performance tracing DevTools não executado, requer integração futura se houver necessidade |
| 15 Codex | AGENTS e mapa de contexto; preservar modelo/login/permissões | Configurado e leitura em contexto novo via avaliação; cliente reiniciado não observado |
| 16 Vercel web | Oito skills web upstream instaladas no projeto; find-skills global reutilizada | Configurado e listagem CLI validada; sem instalação mobile; detalhes de licença/origem abaixo |
| 17 Next dev loop | Fonte exige Next >=16.3 e agent-browser >=0.31.1; app é Next 15 | Inaplicável por incompatibilidade; alternativa local passou; não migrar framework/bundler |
| 17 Bundle optimizer | CLI Next 15 não oferece analyze/analyze export | Inaplicável ao analyzer exigido; bundle de build disponível, sem alegar otimização medida |
| 18 PostgreSQL | Sanity HTTP, sem PostgreSQL/ORM | Inaplicável; não introduzir Supabase/Drizzle ou migrations |
| 19 gh-fix-ci | Não existe `.github/workflows` nem PR/CI alvo no escopo | Inaplicável agora; comandos locais canônicos, sem criar CI remoto; reavaliar quando Actions for adotado |
| 20 Segurança | Prompt 13 fixo e rastreamento manual das fronteiras | Reutilizado sem skills differential-review/audit-context-building (não disponíveis); contexto e rastreamento manuais como fallback; revisão do diff de tooling, auditorias npm e API sintética; produção não sondada |
| 21 shadcn | CSS e componentes próprios | Inaplicável; nenhuma inicialização/substituição de UI |
| 22 Sentry MCP | Serviço/org/projeto não escolhido | Inaplicável neste setup; sem SDK/OAuth; reavaliar se o serviço for solicitado |
| 23 Harness2 nativo | Método padrão em quality, prompts 14/15 fixos | Validado smoke descartável; um candidato de integridade das skills validado; framework oficial/lab e benchmarks não selecionados |
| aia-harness | Onboarding já documentado, sessão Codex e integrações existentes | Inaplicável: geraria contexto/agentes/hooks duplicados; não rodar init Claude |
| ui-ux-pro-max | Nenhum redesign solicitado, design próprio preservado | Inaplicável; skills de UI existentes atendem a necessidade |
| hookify | Nenhum hook novo necessário | Inaplicável; não adicionar interceptores |
| pr-review-toolkit / code-review | Revisão nativa independente atende diff local | Reutilizado equivalente; não enviar código a serviço de revisão externo |
| commit-commands | Nenhum commit/push autorizado neste lote | Inaplicável; não criar automações de Git |
| claude-code-setup / claude-md-management | Ponte documental criada, Claude não é cliente executado | Inaplicável instalar plugin de outro cliente; validação Claude pendente se adotado |
| feature-dev | Processo Superpowers e plano já atendem ao setup | Inaplicável duplicar workflow |
| Jev/Prompt 17 | Avaliação opt-in separada, não componente obrigatório | Não selecionado; nenhum recurso do produto requer classificador novo |
| Auditoria avançada/Prompt 16 | Opt-in separado do setup | Não selecionado; esta entrega não declara auditoria avançada completa |

## Skills: fontes, licenças e manutenção

`skills-lock.json` v2 registra hashes, paths e commits. Vercel upstream: `1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62`; Caveman: `3a0d376c1c1065f84bfae3b7518667defb394ff9`. Instalação pela CLI skills 1.9.0 do npm, no projeto, somente agente codex. Nove skills em `.agents/skills/`, sem links absolutos a caches pessoais. find-skills já existe globalmente e não foi copiada.

Oito web: vercel-react-best-practices, vercel-composition-patterns, web-design-guidelines, writing-guidelines, vercel-react-view-transitions, vercel-optimize, deploy-to-vercel e vercel-cli-with-tokens. O plugin Vercel existente contém um checklist de TSX, não a coleção completa destas skills; por isso a instalação local não é tratada como cópia equivalente. Transições, métricas e publicação não foram executadas.

Licenças/frontmatter foram inspecionados e atribuição preservada. Algumas skills Vercel declaram MIT no frontmatter; a árvore upstream dessa revisão não oferece LICENSE próprio, e nem todos os arquivos declaram licença. Antes do envio público, o fechamento conferiu o README da revisão exata `1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62`: sua seção License declara MIT para o repositório. A fonte, a revisão e o aviso de permissão ficam em `.agents/skills/NOTICE-vercel.md`, fora das pastas cujo hash é verificado; sem inventar copyright/ano ou modificar skills. O aviso LICENSE upstream de Caveman fica em `.agents/skills/LICENSE-caveman.txt`, fora da pasta cujo hash é verificado. As regras ESLint preservam a licença MIT do toolkit. A ausência de LICENSE separado não foi tratada como autorização para relicenciar; a atribuição usa a declaração MIT explícita do README upstream.

Verificar instalação: `npx --yes skills@latest list --agent codex --json`. Restauração segura: `npx --yes skills@latest experimental_install --dry-run --frozen-lockfile --agent codex`; nesta execução informou nove já instaladas, sem reinstalar. A listagem do catálogo usa --list sem --json, pois a CLI rejeita a combinação. Atualizar deliberadamente: conferir help, `npx --yes skills@latest update --project --yes`, revisar hashes/diff/licenças e repetir checks afetados. A opção latest consulta versões futuras; não é instalação reproduzível por si só, preserve lockfile e registre a revisão efetiva. Abrir nova sessão é a próxima validação de descoberta automática; não foi simulada.

## Contexto e memória em camadas

Entrada do Codex: AGENTS.md, carregamento nativo do cliente por caminho do projeto. CLAUDE.md é ponte documental não testada no Claude. Detalhes: PRODUCT e cinco documentos de docs, com mapa no README. Fonte: código atual e evidências deste setup, verificados em 2026-11-17. Specs/planos históricos são decisões anteriores, não prova de runtime atual.

O índice fica em [Contexto sob demanda](../AGENTS.md#contexto-sob-demanda). Use uma linha por lição selecionada, com descrição e link para a fonte. O conteúdo detalhado fica na documentação versionada e é consultado por assunto.

Salve apenas lições verificadas que poupem uma descoberta difícil em outra sessão: correções recorrentes de rumo, decisões cuja razão não aparece no código, regras de negócio implícitas ou referências externas aprovadas. Deixe fatos recuperáveis pelo código ou Git, receitas de depuração e dados temporários em suas fontes. Registre objetivo, arquivos, checks, bloqueios e próximo passo no plano da tarefa.

Reutilize o documento responsável pelo assunto: [arquitetura](architecture.md), [qualidade](quality.md), [design](design.md), [produto](../PRODUCT.md), [README](../README.md) ou este setup. Para decisões de design, consulte as specs em `docs/superpowers/`. Use links relativos e preserve a estrutura do destino. Se nenhum documento comportar a lição, abra uma nota em `docs/` com este frontmatter:

```yaml
---
name: nome-em-kebab-case
description: resumo em uma linha
metadata:
  type: feedback | architecture | business-rule | reference
source: caminho ou referência aprovada
evidence: observação que sustenta a lição
last_verified: YYYY-MM-DD
invalidate_when: mudança que exige revalidação
---
```

Escolha um único tipo. Registre os mesmos dados junto à seção pertinente ao reutilizar um documento. Antes de aplicar uma lição, confira a fonte e a condição de invalidação. Revalide ou marque a entrada como desatualizada, apontando a sucessora quando houver. Use apenas evidências e datas observadas. Mantenha credenciais, valores de configuração, dados pessoais e conteúdo privado fora da memória versionada. A memória global continua sob controle do usuário.

Antes de incluir uma entrada, conte as linhas não vazias de todo o `AGENTS.md`. Se a inclusão ultrapassar 130 linhas, priorize as lições por recência, especificidade e chance de evitar um erro real. Para cada lição a retirar do índice, procure o assunto no destino, siga sua estrutura, registre ou complemente o conteúdo e releia o resultado. Só então retire a linha e, se houver, a nota dedicada que ficou redundante, após conferir e ajustar referências. Preserve comandos, acordos, documentos canônicos e evidências. Se não houver migração segura, preserve a origem e adie a inclusão.

Para verificar o carregamento, abra um novo chat do Codex na raiz e peça uma revisão documental simples sem mencionar a memória. Confira se o índice aparece nas instruções carregadas e se a sessão abre esta seção antes do primeiro trabalho da tarefa. A presença do link comprova a configuração. A leitura precisa ser observada no novo chat, separadamente para cada cliente.

Em 18/11/2026, o novo chat do Codex `01a1ef63-9b3e-7643-8a44-b0709d1ddcfb`, aberto na raiz do projeto, recebeu um pedido de revisão documental sem menção à memória. O histórico de comandos mostra que a primeira leitura abriu esta seção inteira em `docs/setup.md`. As leituras de `PRODUCT.md` e `docs/architecture.md` ocorreram depois, nessa ordem. A evidência cobre a ordem de leitura nesse chat do Codex. O Claude e o reinício do aplicativo ficaram fora da verificação.

## Evidências e limites do setup inicial

Baseline: 36/36 testes, build blog e build Studio passaram. Não havia comando de lint; tipos não se aplicam. Avisos anteriores: package sem type em Node e faixa styled-components incompatível no manifesto, apesar da versão instalada compatível. Test runner agora declara default-type=module; faixa Studio reconciliada. Resultados finais e limites estão registrados abaixo.


| Verificação | Antes | Depois |
| --- | --- | --- |
| node:test | 36/36, exit 0 | 36/36, exit 0; runner offline e sem aviso de tipo |
| Lint | Sem comando | 0 erros, 18 avisos de adoção, exit 0 |
| Self-check de regras | Ausente | Três grupos RuleTester aprovados, exit 0 |
| Check combinado | Ausente | Exit 0 em 2,77 s no runner local |
| Build blog | Exit 0 | Exit 0 em 10,86 s; first-load compartilhado 102 kB, sem alegar ganho |
| Build Studio | Exit 0 com aviso de faixa styled-components | Exit 0 em 3,85 s, sem esse aviso |
| Audit site completo | 2: 1 high, 1 moderate | 15: 14 high, 1 moderate, incluindo novas ferramentas de lint |
| Audit site omit=dev | 2: 1 high, 1 moderate | 2: 1 high, 1 moderate; sem redução de risco de produção comprovada |
| Audit Studio | 33: 26 high, 7 moderate | 30: 25 high, 5 moderate |

Os números npm contam pacotes na árvore, não falhas exploráveis independentes. O acréscimo no site vem das ferramentas ESLint/Next e suas transitivas; não foi omitido por serem devDependencies. Pacotes de lint não entram no bundle publicado, mas afetam o ambiente de desenvolvimento/CI. Os comandos audit retornam exit 1 pelos alertas, não são checks verdes.

Na conclusão do setup inicial, as pendências eram PostCSS transitivo do Next e picomatch/cadeias das ferramentas e Studio. A remediação local de PostCSS foi validada e aplicada posteriormente, conforme a seção abaixo. Existe PostCSS mais novo, mas o Next 15 fixa sua versão transitiva; o solver sugere salto de Next ou downgrades de configurações/Sanity. Não aplicar essas sugestões automaticamente. Picomatch publicado foi conferido até 4.0.7, ainda abrangido pelo advisory. Próxima ação: acompanhar patches upstream e avaliar remediação específica com compatibilidade e regressão antes de qualquer override ou migração. ESLint 9 depreciado também precisa de reavaliação quando peers compatíveis com ESLint 10 estiverem disponíveis. Segurança absoluta não foi declarada.

Browser: Chrome 157.0.8103.79 controlado por Playwright existente, contexto isolado sem sessão pessoal, modo reduced-motion. O Chromium empacotado do Playwright não estava instalado; o canal Chrome existente funcionou sem baixar navegador. Passaram home, Central, glossário/séries e detalhes, artigo, cópia literal e erro de clipboard, formulário vazio com foco/aria-invalid e newsletter demonstrativa com foco no status. Em 390 × 844 não houve overflow horizontal na Central. Nenhum pageerror ou requisição externa do browser observado. API local: content-type inválido 415, origem externa 403, webhook desabilitado 404. Isso não testa provedor real, assinatura aceita em produção ou edição autenticada do Studio.

Grafo final: 110 arquivos de código considerados, 565 nós e 1508 arestas; consulta subscribe retorna cadeia route → validação/limite → adaptador. Code-only pula documentos/imagens e não modela CSS; tokens.css foi excluído pelo classificador de sensibilidade. Quatro arquivos de configuração/dados não produziram símbolos, sem alegar cobertura integral. Gerados e segredos estão excluídos; nenhuma exportação ao Graphify remoto ocorreu.

Harness descartável, avaliador da revisão fixa: três baselines confirmaram 5/7 (duas falhas esperadas da fixture). Boundary fix e stale handoff passaram 7/7 após mudanças só em access.mjs, conferidas novamente pelo coordenador. O caso stale verificou os testes reais antes de rejeitar o relato histórico. A revisão somente leitura identificou as duas falhas e preservou hashes dos três arquivos originais; seu avaliador continua 5/7 porque o caso não autoriza correção. Esses resultados pertencem às fixtures, não são vulnerabilidades descobertas no blog. Tempos completos por agente não foram medidos; nenhum ganho de confiabilidade/custo foi inferido.

Harness2 permanece adaptação nativa. Uma rechecagem revelou divergência de hash após adicionar LICENSE dentro de caveman; o dry-run retornou 0, mas informou a diferença. Um candidato mínimo moveu o aviso para fora da pasta da skill. Com o mesmo comando, lock e fontes, o dry-run passou a informar nove já instaladas, sem divergência ou reinstalação. Essa comparação de integração foi a única rodada nativa; a lição e seu gatilho de invalidação estão em quality. Listagem e restore dry-run validaram inventário; não provam reaplicação integral do setup. Links locais, unicidade de arquivos de instrução, manifestos/lockfiles e identidade dos módulos/self-check com upstream foram conferidos. Reinício de cliente, Claude, pause/resume, conflitos concorrentes e reinstalação limpa de node_modules não foram executados. Dependências existentes foram reutilizadas.

Em 17/11/2026, no checkout `b34cfa8`, a rechecagem da fixture intacta com o avaliador da revisão fixada confirmou o baseline de 5/7. As duas falhas esperadas foram isolamento entre tenants e identidade inválida.

Em um novo chat do Codex, segundo o relato enviado pelo usuário, o agente identificou as regras de `AGENTS.md`, localizou e leu a skill `vercel-react-best-practices` e encontrou `npm run check` e `docs/quality.md`. A evidência disponível é a resposta final do agente. A descoberta das outras oito skills e o carregamento após reinício do cliente continuam sem verificação independente.

## Decisões de execução e recuperação

- O plano aprovado prevalece sobre defaults de skill que criariam worktree, commits e hooks; tudo permanece em diff no checkout. Risco: ainda cabe ao usuário integrar/versionar depois da revisão.
- FlatCompat substitui somente o formato de configuração Next 16 do template. Sem migração TypeScript ou atualização major; a linha ESLint compatível tem depreciação registrada.
- Regras novas com violações existentes começam warn com contagem, sem alterar código do design system. Risco: dívida visível não bloqueia check; reduzir por mudanças concretas conforme quality.
- Skills --list não aceita --json; catálogo foi listado em texto, inventário instalado em JSON. Nenhum efeito de produto.
- Playwright reutiliza Chrome isolado por ausência do binário empacotado; não usa perfis pessoais. Testes de DevTools/performance permanecem fora da evidência.

Backups e logs completos ficam temporariamente fora do repositório; não são fonte durável garantida após limpeza do sistema. Este documento preserva resultados sanitizados. Para repetir, seguir onboarding e a revisão fixa do Prompt 12, conferir estado real e preservar customizações; não reinstalar tudo ou iniciar trials automaticamente. Não reverter arquivos alheios nem apagar os lockfiles para tentar corrigir um check.

## Próximas validações úteis

Abrir nova sessão Codex para conferir descoberta automática das nove skills e carregamento de AGENTS; usar Claude só se esse cliente for adotado. Reavaliar advisories com patches compatíveis quando publicados. Provedores de newsletter, Sanity remoto, publicação, métricas Vercel e Sentry exigem tarefas próprias e destino autorizado. Nenhuma pendência autoriza produção, custos ou publicação.


## Revisão independente e correções

Um passe independente, somente leitura, revisou HEAD + alterações unstaged e arquivos novos, os documentos e lockfiles, isolamento, skills/licenças e evidências. Nenhum crítico; três importantes e um item documental foram verificados e tratados pelo coordenador:

1. Cópia por denylist podia levar `.npmrc`, credenciais e links externos, além do runtime `.sanity` gerado. A regressão sintética falhou com “project npmrc copied” antes da correção. O trecho reproduzível agora copia somente fontes/manifestos explicitamente permitidos e exclui credenciais, links e gerados; a mesma fixture passou. ESLint/Graphify/Git ignoram `.sanity`. Reexecutado o trecho completo de onboarding: check e ambos os builds exit 0.
2. O mínimo Node anunciado não cobria os novos lockfiles: na linha 22, uma dependência do lint exige 22.13 e 36 entradas obrigatórias do Studio rejeitam 22.12. Os dois projetos foram alinhados ao piso comum 22.22.2. Studio mantém alternativas compatíveis ^24.15.0 ou >=26. Todas as entradas obrigatórias foram conferidas via semver contra os pisos declarados; runtime realmente executado continua 22.23.4, não foi trocado.
3. Artigo/série/termo tinham smoke fraco (só h1, também presente em 404). Reexecutado com status HTTP 200 e texto exato das três fixtures; controle negativo confirmou 404 com h1 e mostrou por que o assert anterior não bastava. Interações completas foram repetidas e passaram.
4. Design e plano ainda traziam estados de aprovação pendente. Os registros foram conciliados com aprovações e execução reais; pendências externas continuam explícitas, sem declarar serviços validados.

O revisor também localizou AGENTS, comandos, docs e skill React em contexto novo, sem alegar reinício/descoberta automática do cliente. A auditoria estática do catálogo por outro contexto não encontrou instalação aplicável omitida; explicitou equivalentes para artefatos/webapp-testing, CLI Graphify versus skill standalone e fallback manual de audit-context-building.

As correções receberam checks do coordenador, não um segundo passe independente completo. Não houve minor técnico adiado pelo revisor; os riscos de dependências e validações externas listados acima permanecem. Instalação limpa, produção e explorabilidade dos advisories ficaram fora da revisão.


## Aplicação do PostCSS 8.5.33

Lote autorizado em 2026-11-17, após spike descartável. Plano breve executado: conferir patch/estado e salvar backup externo; aplicar somente os dois arquivos de dependências; reconciliar instalação e revalidar em cópia segura; documentar e revisar o lote incremental. O plano detalhado e os logs ficam no workspace privado da execução, sem criar novos arquivos de processo no projeto.

Alterações deste lote: `package.json`, `package-lock.json`, este documento e `docs/quality.md`. Código do produto, design system, lint, Next, React e Studio não foram alterados. O patch foi conferido contra o baseline do spike e passou em `git apply --check` antes da aplicação, sem divergência material. O índice Git foi preservado; alterações anteriores não foram revertidas.

O manifesto contém `overrides.next.postcss = "8.5.33"`. No lockfile, somente o bloco `node_modules/postcss` mudou de versão, integridade/URL e faixas transitivas declaradas; nenhum outro pacote instalado mudou de versão. `npm ci --no-audit --no-fund` foi executado no checkout com HOME/configurações npm descartáveis e sem credenciais. A resolução a partir de `next/package.json` confirmou **Next 15.5.29, React 19.3.1 e PostCSS 8.5.33** na instalação local. Não se inferiu instalação apenas pela edição do lockfile.

| Verificação pós-aplicação | Resultado |
| --- | --- |
| Instalação limpa na cópia segura | Site e Studio, exit 0; diretórios independentes de dependências |
| `npm run check` | Exit 0; 36/36 testes, self-check das três regras e lint com 0 erros/18 avisos existentes |
| Build blog / Studio | Ambos exit 0, com amostras/Studio sintético e provedor none |
| Regressões dos quatro advisories PostCSS | Os quatro casos inseguros reproduzidos no baseline do spike não ocorreram na nova cópia |
| CSS | Três arquivos gerados idênticos em bytes ao baseline do spike |
| Browser | Home/Central/artigo/série/termo, cópia e negação de clipboard, formulário inválido/foco, newsletter demonstrativa, teclado/mobile e APIs 415/403/404 passaram |
| Comparação visual controlada | Quatro telas, mesma geometria e zero pixels diferentes frente ao baseline do spike |
| RSS/sitemap/robots | HTTP 200 local |
| OG com fonte local de teste | HTTP 200, PNG válido e bytes idênticos ao baseline com a mesma fixture |
| Audit site completo | 13 alertas altos, exit 1; antes no spike:15 (14 high / 1 moderate) |
| Audit site omit=dev | Zero alertas, exit 0; antes no spike:2 (1 high / 1 moderate) |

As auditorias foram repetidas nesta aplicação com cópias atuais dos manifestos/lockfile e npm sem credenciais. A auditoria do Studio não foi repetida neste lote: seus manifestos e lockfile permanecem byte a byte iguais aos anteriores. Os 13 alertas das ferramentas de lint, os 18 avisos de lint e a depreciação da linha ESLint 9 não foram ocultados nem tratados como resolvidos. Zero alertas em omit=dev não é prova de segurança ou de validação de produção.

Os testes de segurança usam apenas arquivos e marcadores fictícios, resolvendo o PostCSS efetivamente instalado sob Next. Cobrem os caminhos descritos nos advisories: leitura por sourceMappingURL, traversal de .map, .map absoluto sem from e parse/stringify com fechamento de style. A chamada sem plugins que retorna o CSS original não é sanitizador e permanece fora de alegação de correção geral. Os fixtures e resultados completos do spike são temporários; a interpretação e os critérios duráveis estão em `docs/quality.md`.

**Limitação OG preservada:** no spike, bloquear todas as fontes externas provocou “No fonts are loaded” tanto no baseline quanto no candidato. A falha foi reproduzida novamente na cópia pós-aplicação. Com a mesma fonte Noto local de teste distribuída com Next, ambos geram PNG idêntico; isso não valida fontes externas reais nem corrige o fallback sem fontes. O código de OG não foi alterado. Testes de runtime bloquearam fetch externo; nada foi enviado a provedores reais.

A primeira captura longa da home no spike apresentou composição inconsistente; a comparação aceita usa página nova, scroll zero, fontes prontas e viewport controlado. Esses mesmos critérios foram repetidos após aplicar. Não se declara igualdade de todo bundle JavaScript: identificadores de entrada gerados pelo build podem variar, sem diferença observada nos fluxos testados.

Backups persistentes dos quatro arquivos anteriores ao lote ficam em diretório privado fora do repositório; o caminho é entregue no fechamento da execução. Recuperação: se os quatro arquivos não receberam edições após este lote, restaurar somente esses arquivos a partir do backup. Se houver edições posteriores, comparar backup, diff deste lote e estado atual; reverter apenas os trechos deste lote, mantendo as edições posteriores. Depois reconciliar node_modules pelo lock resultante e repetir checks seguros. Não usar reset/checkout global nem reverter o setup anterior. Na próxima atualização de Next/PostCSS, revisar a necessidade do override e repetir validações: compatibilidade demonstrada para Next 15.5.29 / Node 22.23.4, não para versões futuras.

Revisão independente do lote incremental concluída: nenhum crítico ou importante. Três ajustes documentais foram tratados pelo coordenador (recuperação com edições posteriores, espaçamento e fechamento do registro), com nova verificação de escopo, links e diff; sem segundo passe independente completo. Sem commit, push, deploy, mudança global ou acesso a produção.


## OG sem fontes externas — lote de 2026-11-17

Correção posterior e independente do PostCSS: `ogFonts()` lê TTFs estáticos locais Orbitron 800 e Barlow Condensed 600, exclusivos do OG, por caminhos literais em `assets/fonts/og/`. Foram removidas as buscas Google do carregador, mantendo renderizadores, rotas, cache e estilos existentes. Falhas de arquivo propagam erro; não há fallback silencioso para `fonts: []`. Layout do site, next/font, design system, Studio, dependências, lockfiles e override PostCSS foram preservados.

Os arquivos oficiais têm 17.768 e 86.636 bytes, pesos OS/2 800/600 e nenhuma tabela variável `fvar`. A cmap cobre os caracteres portugueses maiúsculos/minúsculos registrados no manifesto. `assets/fonts/og/sources.json` guarda origem, URLs, data e SHA-256; OFLs e copyrights integrais acompanham as fontes. Não houve conversão de formato ou uso de fontes internas do Next.

Validação com Node 22.23.4 / Next 15.5.29, sem envs reais ou credenciais, em cópia por allowlist com assets e dependências em cópias APFS independentes (sem links para a instalação original):

| Check | Resultado |
| --- | --- |
| Regressão anterior | Quatro testes falharam com o carregador antigo; o cartão sem fontes reproduziu “No fonts are loaded” |
| `npm run check` | Exit 0; 41 testes, RuleTester aprovado, 18 warnings de lint preexistentes e zero erros |
| `npm run build` | Exit 0; fontes de next/font fornecidas por fixtures locais somente no ambiente de build |
| Renderizadores | Normal e com capa, três títulos, falhas externas total/parcial/timeout sintético: PNGs completamente decodificados 1200×630, zero requisições de fontes |
| Ausência de arquivos/imagens | TTF ausente rejeita com ENOENT; capa indisponível retorna null e rota usa cartão simples; monograma ausente não impede PNG |
| Tracing | Os cinco route.js.nft.json de OG incluem ambos os TTFs e os arquivos existem nos caminhos resolvidos |
| Navegador local | Seis URLs OG HTTP 200, PNG integral decodificado por sharp e Chrome, 1200×630; quatro páginas com og:image local correspondente |
| Visual | Seis pares normal/capa, títulos curto/acentuado/longo: zero diferenças nos canais de pixels; inspeção visual confirmou famílias, acentos e composição |

Comparação controlada: baseline usa o carregador antigo com respostas Google simuladas contendo os mesmos TTFs completos; candidato lê esses arquivos diretamente. Não é comparação contra resposta Google viva ou subset por título. As capas são fictícias locais; nenhum Sanity real foi consultado. O primeiro build parou por diferença de encoding na chave da fixture externa Barlow Condensed; corrigir a fixture, sem editar o projeto, permitiu completar o build.

A limitação histórica do spike permanece como evidência daquele estado, mas este lote corrige a dependência de fontes externas do OG. Não garante todo Unicode, arquivos locais ausentes/corrompidos ou disponibilidade de capas remotas. Títulos longos continuam sujeitos ao lineClamp já existente, observado igualmente nas duas versões. O build habitual do site ainda usa next/font/google; tornar esse build offline está fora deste lote. Não houve deploy ou teste de empacotamento de provedor; foi conferido o tracing local do Next.

O plano está em `superpowers/plans/2026-11-17-og-local-fonts.md`. Evidências, diff e backups ficam fora do repositório, com caminhos entregues no fechamento. Recuperar somente os arquivos modificados deste lote; excluir apenas seus novos assets/teste/plano se não receberam alterações posteriores. Comparar hashes antes de restaurar, preservando o índice e quaisquer edições posteriores. A receita de onboarding agora inclui assets na allowlist.
