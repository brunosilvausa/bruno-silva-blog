# Adoção incremental completa do Vibe Coding Toolkit

Data: 2026-11-17. Estado: design aprovado pelo usuário nesta conversa; implementação concluída conforme evidências e pendências em `../../setup.md`. O conteúdo abaixo preserva a proposta aprovada, não exige nova aprovação.

## Intenção e decisões

Preparar o blog existente para desenvolvimento assistido por IA, com contexto confiável, ferramentas compatíveis, comandos reproduzíveis e evidências de validação. O usuário não indicou uma dor prioritária e escolheu adoção incremental completa.

Fonte única do toolkit: revisão `7ef68dd7b00ddfc5cd464458855e4ab66dd2128f`, obtida fora do projeto. Guias, templates e prompts usados no setup serão dessa revisão. Fontes externas de skills e APIs terão suas próprias revisões/versões registradas.

## Estado observado

- Checkout alvo: `bruno-silva-blog`; Git inicialmente limpo.
- Site Next.js 15, React 19, JavaScript, App Router e CSS próprio; Sanity Studio em `studio/`, com manifesto e lockfile npm independentes.
- Node observado: 22.23.4; npm 10.9.9. Ambas as instalações locais de dependências existem; versões efetivas ainda serão inventariadas.
- Scripts do site: dev, build e start. Studio: dev, build e deploy. Existem testes `node:test`, incluindo GROQ avaliado localmente com dependência do Studio.
- README descreve posts, pilares, newsletter, glossário, séries, Central de Conteúdo, SEO, redirecionamentos e webhook. Há specs e planos históricos em `docs/superpowers/`.
- Não foi encontrada configuração de CI nem AGENTS.md versionado na busca inicial. Instruções globais recebidas exigem Ponytail full.
- Baseline de testes/build ainda não executado. Nenhuma configuração ou dependência foi modificada nesta fase.

## Abordagens

1. **Adoção incremental completa, escolhida:** avaliar todo o catálogo, reutilizar equivalentes disponíveis e implementar componentes aplicáveis em entregas verificáveis. Mais cobertura, mantendo mudanças pequenas por etapa.
2. Fundação documental e comandos primeiro, integrações depois: menor mudança inicial, mas adia parte do pedido. Não escolhida.

## Objetivos e critérios de aceite

- Cada componente do catálogo recebe decisão, justificativa, escopo, estado e evidência em `docs/setup.md`.
- Comandos canônicos verificam o site e o Studio sem publicar, enviar newsletter ou depender de credenciais de produção.
- Testes existentes permanecem preservados; falhas anteriores ficam separadas de regressões introduzidas.
- Lint e regras do toolkit são adaptados ao JavaScript/Next existente, com self-check. Novas severidades seguem contagem inicial de violações, sem enfraquecer proteções.
- Documentação de produto, arquitetura, design, onboarding, qualidade e manutenção corresponde ao comportamento observado e possui mapa de leitura curto.
- Verificação local cobre páginas e interações críticas com fixtures: listagem/post, Central e cópia de prompt, glossário/série e newsletter em modo sem provedor. Endpoints sensíveis recebem revisão e testes proporcionais ao diff.
- Integrações distinguem presença, configuração, descoberta e execução real. Não se declara teste em cliente reiniciado sem observação.
- Revisão independente do diff, correções e checks afetados encerram a implementação.

## Limites e antiobjetivos

Preservar JavaScript, Next.js 15, npm, Sanity, design system, URLs, contratos e dados. Não migrar para TypeScript, Tailwind, PostgreSQL, shadcn ou outro framework. Não publicar, fazer push, criar hooks Git, impor branch/worktree, acessar produção, aplicar migrações, enviar mensagens nem criar custos/agendamentos. Não executar o laboratório oficial Harness2. Não atualizar ferramentas globais sem autorização específica. Mudança incompatível ou arquitetural vira proposta separada.

Antes de alterar configuração existente, guardar backup recuperável fora do repositório sem expor segredos. Não ler nem registrar valores de credenciais. Executar ambiente local isolando as variáveis de serviços; revisar previamente scripts e fluxos de leitura de `.env*`. Não renomear ou modificar arquivos locais de segredos como mecanismo de isolamento.

## Matriz de cobertura proposta

Estados abaixo são decisões de design, não resultados de instalação ou validação. A implementação detalhará versões, dependências e bloqueios comprovados.

| Componente | Necessidade / estado atual | Ação e escopo | Dependência / risco | Critério de validação |
| --- | --- | --- | --- | --- |
| Superpowers | Disponível nesta sessão | Reutilizar; rotear processo em AGENTS | Aprovações de design e plano | Plano, evidências e revisão observáveis |
| Subagentes | Ferramenta disponível | Usar por necessidade; revisão independente somente leitura | Mesmo provedor/autenticação; coordenação pelo agente principal | Brief delimitado, diff integrado e revisão registrada |
| Ponytail full | Ativo por instrução do usuário | Preservar e referenciar sem copiar skill inteira | Evitar instruções duplicadas | AGENTS curto e mudanças proporcionais |
| Caveman | Disponibilidade ainda não verificada | Verificar fonte/discovery; instalar localmente se necessário | Sem duplicar global/plugin | Fonte/licença e descoberta; prosa normal nos documentos |
| ESLint/Biome | Sem script de lint no site | Adotar ESLint compatível e perfil Next leve; regras e self-check da revisão fixa | Peers, runtime, avisos legados | Contagem por regra, lint e self-check; sem migração TS |
| RTK | Não verificado | Reutilizar mecanismo oficial existente; sem interceptores duplicados | Instalação global ausente exige decisão separada | Execução observada ou bloqueio explícito |
| Graphify | Plugin disponível no catálogo da sessão | Verificar capacidade local; grafo determinístico com exclusões | Não enviar código/grafo a serviço externo | Cobertura/frescor e consulta local; sem semântica paga |
| Obsidian | Sem necessidade identificada | Inaplicável; sem vault/exportação | Nenhuma | Justificativa documentada |
| Memória do cliente | Disponível globalmente | Reutilizar leitura sob demanda; conhecimento do projeto em docs | Não escrever memória global sem pedido explícito | Mapa, fonte, data e gatilhos de invalidação |
| Hooks de cliente | Não verificados | Reutilizar apenas mecanismo necessário e suportado | Sem hooks Git ou configuração global nova | Sem duplicações; efeito testado se adotado |
| agent-browser | Não verificado | Reutilizar se instalado; alternativa local com capacidade existente | Navegador isolado, sem sessão pessoal | Fluxos locais, erros e resultados registrados |
| Context7 | Plugin disponível | Consulta real; evitar servidor duplicado | Só conceitos públicos, sem código privado | Resolve + consulta de API da versão relevante |
| Artefatos/skill creation | Skills globais disponíveis | Reutilizar; sem criar skill isolada sem necessidade | Nenhuma necessidade de artefato novo identificada | Decisão por capacidade no catálogo |
| Chrome DevTools MCP | Não verificado | Avaliar lacunas de console/rede; reutilizar equivalente | Configuração global nova requer autorização | Evidência local ou limite registrado |
| Codex | Cliente atual | AGENTS curto, docs sob demanda e descoberta local | Preservar permissões/modelo/login | Smoke de instruções, comandos e contexto |
| Vercel web skills + find-skills | Algumas globais/plugins disponíveis | Conferir upstream; reutilizar equivalentes e instalar faltantes no projeto | Fonte/licença, nomes e links portáveis; sem deploy | Lockfile quando instalado; inventário e descoberta separada |
| Next dev loop | Next 15 observado | Inaplicável se confirmado requisito 16.3+; usar loop local existente | Não atualizar Next para satisfazer skill | Preflight documentado e alternativa testada |
| Next bundle optimizer | Suporte não verificado | Verificar analyzer instalado; não forçar adoção | Sem mudar bundler ou instalar analisador sem necessidade | Ajuda/preflight e resultado ou incompatibilidade |
| PostgreSQL skill | Aplicação usa Sanity HTTP | Inaplicável salvo evidência nova de PostgreSQL | Sem trocar persistência | Arquitetura observada documentada |
| gh-fix-ci | Nenhum workflow encontrado inicialmente | Verificar uso de Actions e acesso; adotar somente se aplicável | Sem criar CI remoto nem acessar contas sem necessidade | Descoberta/consulta autorizada ou justificativa |
| Differential review / prompt 13 | APIs e configuração de qualidade merecem revisão | Registrar invocação versionada; skill se compatível e útil | Escopo exato; relatório sensível privado | Rastreamento de fronteiras e revisão do diff |
| shadcn | UI própria, sem adoção observada | Inaplicável | Preservar componentes e tokens | Sem introdução de UI kit |
| Sentry MCP | Serviço/projeto não escolhido | Não selecionado; nenhuma conexão ou SDK novo | OAuth depende de escolha futura | Motivo e condição para reavaliar |
| Harness2 nativo / prompt 15 | Parte obrigatória deste setup | Método adaptado com smoke cases; um candidato só se houver falha concreta | Preservar cliente/modelo/login; fixtures descartáveis | Baseline comparável, evidência e idempotência; sem alegar benchmark |
| Extras/aia-harness/plugins | Necessidade não identificada | Conferir catálogo completo e registrar decisão por item adicional | Evitar duplicação e serviços não autorizados | Nenhum item omitido na matriz final |

## Entregas propostas

1. **Baseline e contexto:** inventário efetivo, leitura de guias restantes e scripts, checks seguros, registro de falhas existentes e mapa documental.
2. **Ferramentas:** reutilização e instalações locais compatíveis; exclusões do grafo; consulta Context7; disponibilidade real de runtime/navegador. Componentes com requisito global ficam pendentes sem bloquear trabalho independente.
3. **Qualidade:** scripts canônicos, lint leve e regras com self-check, testes e ajustes incrementais estritamente necessários. Atualizações compatíveis são decididas com changelog, peers e lockfile; nenhuma atualização ampla automática.
4. **Integração e manutenção:** execução local isolada, smoke do harness e reexecução segura de configurações; revisão independente; documentação final de evidências, recuperação e pendências.

## Mapa documental

Preservar o README como guia editorial e acrescentar mapa curto. Criar PRODUCT.md, AGENTS.md, CLAUDE.md (ponte para AGENTS), docs/architecture.md, docs/design.md, docs/onboarding.md, docs/quality.md e docs/setup.md com fatos específicos do blog. Reutilizar specs/planos históricos sem tratá-los como prova de execução atual. Configurações e scripts ficam nos caminhos convencionais existentes; não reorganizar o código por estética.

## Decisões deixadas ao implementador

Escolher versões estáveis compatíveis, nomes exatos de scripts, fontes atuais das skills e menores ajustes necessários depois dos preflights. Escolher porta livre e fixtures locais. Não adicionar CI remoto por ausência de workflow; se existir configuração não encontrada inicialmente, integrar os mesmos checks preservando seus contratos. Separar checagem estática JavaScript de TypeScript, que não se aplica à stack atual. Registrar intervenções externas precisas quando algo não puder ser validado.

## Estado final

Abordagem, design e plano foram aprovados nesta conversa. Plano executado diretamente, com revisão independente e correções dos achados; resultados e limites em `../../setup.md`. Não reiniciar etapas de aprovação já concluídas.
