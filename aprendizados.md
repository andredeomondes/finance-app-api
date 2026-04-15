# Aprendizados

## ESLint

- Ferramenta de análise estática de código JavaScript
- Identifica padrões problemáticos e aplica estilo de código
- `npm install -D eslint@8.46.0` - instala como dependência de desenvolvimento
- `npx eslint --init` - inicializa configuração (interativo)
- `.eslintrc.json` - arquivo de configuração do ESLint
- `npx eslint .` - executa o ESLint no projeto

## Prettier

- Formatador de código que garante estilo consistente
- Foca em formatação, não em qualidade de código
- `.prettierrc.json` - arquivo de configuração do Prettier
- `npx prettier index.js --write` - formata e salva o arquivo

## Husky

- Permite configurar hooks do Git
- `npm install -D husky` - instala como dependência de desenvolvimento
- `npx husky install` - inicializa o Husky no projeto
- `npx husky add .husky/pre-commit "comando"` - adiciona um hook pre-commit

## Hooks Git (pre-commit)

- Scripts que rodam automaticamente antes de um commit
- Útil para rodar linting, testes, etc. antes de commitar
- Exemplo: `.husky/pre-commit` com `npx eslint .`

## npm / package.json

- `package-lock.json` - arquivo que trava versões das dependências
- `-D` ou `--save-dev` - instala como dependência de desenvolvimento
- Dependências de dev não são incluídas na build de produção

## Instalar versão específica de um pacote

```bash
# Instalar versão específica
npm install <pacote>@<versão>
npm install eslint@8.46.0

# Versão mais recente (latest)
npm install eslint@latest

# Versão específica como dependência de desenvolvimento
npm install -D husky@8.0.3

# Atualizar para última versão de uma major (ex: 8.x -> 9.x)
npm install <pacote>@latest

# Verificar versão instalada de um pacote
npm list <pacote>
npm list eslint
```
