# Regras locais de qualidade

Fonte: soumatheusgomes/vibe-coding-toolkit, revisão `7ef68dd7b00ddfc5cd464458855e4ab66dd2128f`, `templates/eslint/eslint-rules/` e `templates/eslint/verify.mjs`. Licença MIT em LICENSE. Módulos e self-check preservados; o perfil externo foi adaptado em `../eslint.config.mjs` para JavaScript e Next 15 via FlatCompat, sem importar o perfil TypeScript/Next 16.

Somente max-lines está ativo: limite de referência 350, inicialmente warn pelos dois arquivos existentes acima do limite. As regras de console e banco ficam disponíveis e verificadas pelo self-check, mas não são ativadas: o projeto não tem logger próprio nem cliente PostgreSQL/Drizzle. Não criar essas dependências apenas para satisfazer regras.

Atualização: obter uma revisão fixa do toolkit fora do projeto, revisar os três módulos e o self-check juntos, reaplicar adaptações de configuração e executar `npm run check:rules` e `npm run check`. Não substituir arquivos por versões de revisões diferentes.
