# Bruno Silva Blog

Em cada nova sessão, comece lendo integralmente a seção [Contexto e memória em camadas](docs/setup.md#contexto-e-memória-em-camadas), em uma leitura separada. Só depois consulte o índice abaixo e abra os arquivos da tarefa, incluindo produto e arquitetura.

Node 22.22.2+ na linha 22, Next.js 15 App Router, React 19 e JavaScript; Sanity Studio independente em `studio/`. Leia [produto](PRODUCT.md), [arquitetura](docs/architecture.md) e o código afetado antes de editar.

## Comandos

- Instalar: `npm ci` e `npm --prefix studio ci` (dois lockfiles, sem workspace npm).
- Desenvolver: `npm run dev`; Studio: `npm --prefix studio run dev`.
- Qualidade local: `npm run check` (lint, self-check das regras e 41 testes offline).
- Separados: `npm run lint`, `npm run check:rules`, `npm test`.
- Build: `npm run build` e `npm --prefix studio run build`. Para setup/validação sem produção, use o [ambiente descartável](docs/onboarding.md#validar-sem-serviços-reais).
- Tipos estáticos: não há TypeScript; não inventar um comando typecheck.

## Acordos

- Ponytail full por padrão: menor mudança completa, reutilizando padrões existentes. Não cortar validação, acessibilidade ou tratamento de erros.
- Caveman: conversa concisa no idioma solicitado, com clareza; código e documentação em prosa normal. Respeitar pedido de desativação.
- Use Superpowers proporcionalmente; preserve aprovações já concedidas e conclua trabalho autorizado. Critérios de aceite e checks vêm antes da implementação. Mudanças triviais não exigem testes espelhados; lógica nova exige teste/self-check relevante.
- Preserve alterações locais e índice Git. Não criar exigência de branch/worktree, hooks Git, bloqueios de commit/push ou migrações de stack.
- Não editar `styles/tokens.css`, `styles/ds.css` ou `public/ds.js`: pertencem ao design system. Estilos do blog ficam em `styles/page.css`.
- Preserve URLs, redirecionamentos, blocos Portable Text, regras de publicação e contratos site/Studio/RSS. Leia chamadores e fixtures ao corrigir funções compartilhadas.
- Segredos ficam em arquivos ignorados; nunca registrar valores. Dados externos, assinatura do webhook, entrada da newsletter e URLs exigem validação. Não usar serviços reais para checks de setup.
- Publicação, push, mensagens, custos, ações destrutivas e mudanças globais precisam de autorização específica. Skill instalada não concede essas permissões.
- Responda status e continue trabalho autorizado. Bloqueios afetam apenas dependências; preserve um handoff no plano se houver trabalho pendente. Ao retomar, confira checkout, arquivos e processos antes de confiar no relato anterior.

## Ferramentas e revisão

- Context7 disponível: resolva biblioteca e consulte um conceito público por vez, na versão correta; sem código privado/segredos. Não duplicar o MCP do plugin.
- RTK existente: usar comandos suportados explicitamente se não houver hook ativo; nunca duplicar wrappers. Saída integral pelo comando original ou `rtk proxy`.
- Graphify local: `GRAPHIFY_NO_AUTO_REFRESH=1 graphify extract . --code-only --no-cluster`; consulte o grafo para estrutura e confira frescor/cobertura. Sem extração semântica, upload ou hooks automáticos.
- Skills locais e globais, origens e limites: [setup](docs/setup.md). React/Next: `vercel-react-best-practices`; composição: `vercel-composition-patterns`; revisão visual: `web-design-guidelines`; prosa: `writing-guidelines`. Transições e deploy só quando solicitados; find-skills global para lacuna concreta.
- Delegar quando justificar isolamento/especialização; um escritor por arquivo. Coordenador cuida de lockfiles e integração; revisores trabalham somente leitura. Manter cliente/provedor/autenticação; selecionar capacidade suficiente e respeitar limites da sessão.
- Revisão independente de mudanças não triviais quando disponível, com diff exato, chamadores e checks relevantes. Não confundir instalação, descoberta, execução e reinício do cliente.

## Contexto sob demanda

[Onboarding](docs/onboarding.md) · [design existente](docs/design.md) · [qualidade/segurança/harness](docs/quality.md) · [setup e evidências](docs/setup.md). Specs/planos em `docs/superpowers/` registram decisões; verificar o código atual antes de tratar planos históricos como execução comprovada.
