# OG local fonts implementation plan

> **For agentic workers:** Use superpowers:executing-plans, inline nesta conversa, com revisão independente final somente leitura.

**Goal:** Gerar PNG OG 1200×630 sem depender de fontes externas.

**Architecture:** Empacotar TTFs estáticos Orbitron 800 e Barlow Condensed 600, com licenças e origem. Substituir somente o carregador compartilhado em `lib/og-card.js`, usando leitura local Node; manter os dois renderizadores e chamadores.

**Tech Stack:** Next 15 instalado, React existente, Node 22, node:test e sharp transitivo já instalado para decodificação dos testes.

**Spec:** Design curto aprovado na conversa: fontes exclusivas do OG, mesma identidade, dimensões e conteúdo.

## Global constraints

- Preservar alterações locais e índice Git; backup externo e recuperação apenas deste lote.
- Não alterar dependências, lockfiles, override PostCSS, Studio, layout, next/font ou design system.
- Sem produção, credenciais reais, commit, push ou deploy. Autorizada execução direta após este plano.

## Review focus

- Falha total, parcial e timeout externos: nenhuma busca de fontes em runtime.
- TTF ausente: erro explícito, nunca lista vazia silenciosa.
- Caracteres portugueses e títulos longos: glifos legíveis, mesmos cortes e quebras que baseline equivalente.
- Capa ou monograma ausentes: preservar fallback atual.
- Artefato do build: incluir ambos os TTFs no tracing das rotas.

## Task 1: Fontes locais e regressão

Files: `assets/fonts/og/` (TTFs, OFLs, procedência), `lib/og-card.js`, `tests/og-fonts.test.mjs`.

Interface: `ogFonts()` retorna Promise de duas descrições `{name, data, weight, style}`; chamadas existentes com texto continuam válidas.

- [x] Guardar snapshot, índice e backups externos; ler chamadores e testes.
- [x] Obter TTFs oficiais estáticos, pesos 800/600; conferir cmap, licença e hashes.
- [x] Escrever regressão que exige duas fontes sem rede e PNG completamente decodificado para ambos os cartões; executar e observar falha anterior.
- [x] Validar TTFs no ImageResponse instalado e comparar baseline com mesmos arquivos locais antes de substituir carregador.
- [x] Implementar leitura local por caminhos literais, sem capturar/suprimir erro de arquivo.
- [x] Executar regressão verde e suíte existente.

## Task 2: Integração segura e fechamento

Files: mesmos assets/testes e `docs/setup.md`, `docs/quality.md`; esta lista não autoriza outros arquivos.

- [x] Usar cópia segura sem envs/credenciais, instalações independentes existentes ou limpas; executar check e build.
- [x] Validar rotas representativas e ambos os renderizadores com dados/imagens locais, falhas de capa e monograma; PNG 1200×630 totalmente decodificado.
- [x] Conferir tracing dos TTFs; comparar imagens baseline/candidato com fontes e entradas equivalentes, inspecionar glifos e legibilidade.
- [x] Registrar evidências e limites, revisão independente somente leitura, conferir diff e hashes de arquivos fora do lote e índice.
- [x] Entregar diff, checks e instruções de recuperação; manter evidências externas, sem commit.

## Execution ledger

- Plano registrado; usuário autorizou execução direta e revisão final, sem novo gate de aprovação.

- Ruling: incluir uma linha em docs/onboarding.md para copiar assets na cópia segura — o novo carregador precisa dos TTFs nesse procedimento existente; sem isso a receita documentada falha. Backup incluído, sem mudança de configuração.
- Task 1: TTFs estáticos com cmap/OS2 conferidos; regressões RED 0/4 e GREEN 4/4; nova regressão de ENOENT adicionada. Comparação de seis pares com fontes locais equivalentes: zero diferenças nos canais decodificados; truncamento de títulos longos preexistente preservado.
- Build: primeiro ensaio parou por chave de fixture Barlow%20Condensed versus Barlow+Condensed; corrigida somente a fixture externa, repetindo build.

- Task 2: check final 41/41 com 18 warnings anteriores; build exit 0, ambos os TTFs em cinco tracings; seis URLs PNG decodificadas por sharp/Chrome e quatro páginas com metadata correta; seis pares visuais sem diferenças, inspecionados.
- Revisão independente somente leitura: nenhum achado crítico/importante; único item menor era marcar conclusão deste plano, resolvido. Nenhum menor adiado.
- Fechamento: quatro arquivos anteriores alterados e 409 preservados por SHA-256, índice sem alterações staged; manifesto, patch binário, comparação e logs no backup privado externo. Sem produção, commit, push ou deploy.
