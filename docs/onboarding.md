# Rodar e verificar o blog localmente

Use Node 22.22.2 ou superior dentro da linha 22 e npm. A versão verificada foi 22.23.4. O lockfile do Studio exige esse piso efetivo, acima do mínimo declarado pelo pacote Sanity. Instale os dois projetos:

```bash
npm ci
npm --prefix studio ci
npm run check
```

`npm test` carrega `tests/offline.mjs`, usa amostras ou fetch fixtures e não carrega `.env.local`. Não são testes contra Sanity real. Não há TypeScript ou typecheck separado.

Para desenvolvimento habitual, `npm run dev`; Studio, `npm --prefix studio run dev`. Essas formas carregam os arquivos locais de ambiente. O README explica a configuração e os fluxos editoriais; nunca coloque segredos no chat ou Git.

## Validar sem serviços reais

Para setup, auditoria e builds com amostras, use uma cópia descartável, sem `.env*` reais. O trecho abaixo usa Python 3 existente, não instala ferramentas, preserva credenciais do checkout e imprime o caminho dos logs. Execute na raiz, com dependências dos dois projetos instaladas:

```bash
python3 - <<'PYCODE'
from pathlib import Path
import os, shutil, subprocess, tempfile
source = Path.cwd()
sandbox = Path(tempfile.mkdtemp(prefix='blog-check-'))
app = sandbox / 'app'
app.mkdir()
blocked = shutil.ignore_patterns(
    'node_modules', '.next', '.sanity', 'dist', '.env*', '.npmrc',
    'credentials*', 'auth.json', '*.pem', '*.key', '*.p12', '*.pfx')
def exclude(directory, names):
    return set(blocked(directory, names)) | {
        name for name in names if (Path(directory) / name).is_symlink()}
# Copy only the application, checked tools and their manifests, never the whole checkout.
allowed = ('app', 'components', 'content', 'lib', 'public', 'styles', 'assets',
           'tests', 'scripts', 'eslint-rules', 'package.json',
           'package-lock.json', 'next.config.mjs', 'jsconfig.json',
           'eslint.config.mjs', 'studio/package.json',
           'studio/package-lock.json', 'studio/sanity.config.js',
           'studio/sanity.cli.js', 'studio/schemaTypes', 'studio/actions')
for relative in allowed:
    item = source / relative
    if not item.exists() or item.is_symlink():
        continue
    target = app / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    if item.is_dir():
        shutil.copytree(item, target, ignore=exclude)
    else:
        shutil.copy2(item, target)
assert not any(p.is_symlink() for p in app.rglob('*'))
assert not list(app.rglob('.npmrc')) and not list(app.rglob('.sanity'))
for relative in ('node_modules', 'studio/node_modules'):
    target = source / relative
    assert target.is_dir(), f'Instale as dependências: {relative}'
    (app / relative).symlink_to(target, target_is_directory=True)
assert not list(app.rglob('.env*'))
(sandbox / 'home').mkdir()
env = {'PATH': os.environ['PATH'], 'HOME': str(sandbox / 'home'),
       'CI': '1', 'NEXT_TELEMETRY_DISABLED': '1',
       'SANITY_STUDIO_TELEMETRY_DISABLED': '1',
       'NEXT_PUBLIC_SANITY_PROJECT_ID': '', 'EMAIL_PROVIDER': 'none',
       'NEXT_PUBLIC_SITE_URL': 'http://localhost:4317',
       'SANITY_STUDIO_PROJECT_ID': 'test-project',
       'SANITY_STUDIO_DATASET': 'test'}
for label, command in (
    ('check', ['npm', 'run', 'check']),
    ('blog-build', ['npm', 'run', 'build']),
    ('studio-build', ['npm', '--prefix', 'studio', 'run', 'build'])):
    with (sandbox / f'{label}.log').open('w') as log:
        result = subprocess.run(command, cwd=app, env=env,
                                stdout=log, stderr=subprocess.STDOUT)
    print(label, result.returncode, sandbox / f'{label}.log')
    assert result.returncode == 0, 'Leia o log antes de continuar'
print('Cópia descartável:', app)
PYCODE
```

Os links reutilizam dependências locais; isso não substitui validação de uma instalação limpa dos lockfiles. O código e outputs de build ficam na cópia. Para navegar, inicie `next start` nessa cópia com o mesmo ambiente limitado, porta livre e perfil de navegador descartável; não use cookies/sessão pessoal. Pare somente o processo criado para o teste. Remova a pasta temporária somente depois de revisar os logs.

## Diagnosticar e recuperar

Confira Git, Node, os dois `npm ls --depth=0` e o primeiro erro do log. Não rode `audit fix --force`, não apague testes e não desative proteções para limpar uma execução. Os backups deste setup ficaram fora do Git; para reverter, selecione somente os arquivos deste diff, preservando alterações posteriores. Não reverta todo o checkout.

Builds e `npm start` no projeto original podem usar os serviços configurados. `npm --prefix studio run deploy` e push para branch publicada são operações de publicação e não fazem parte de um check. Para novas sessões, comece pelo AGENTS e consulte [setup](setup.md) e [qualidade](quality.md) sob demanda.
