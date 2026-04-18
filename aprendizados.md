# Aprendizados

## Setup: ESLint + Prettier + Husky + Commitlint

### Comandos Essenciais

```bash
# Inicializar projeto
npm init -y

# Instalar ferramentas
npm install -D eslint prettier husky @commitlint/cli @commitlint/config-conventional lint-staged

# Configurar Husky
npx husky install
npm pkg set scripts.prepare="husky"

# Adicionar hooks
npx husky add .husky/pre-commit "npx lint-staged"
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

### Configurações

**package.json**

```json
{
    "type": "module",
    "scripts": { "prepare": "husky" },
    "lint-staged": {
        "*.js": "eslint",
        "*.{js,json}": "prettier --write"
    }
}
```

**.eslintrc.json**

```json
{
    "env": { "es2021": true, "node": true },
    "extends": "eslint:recommended",
    "parserOptions": { "ecmaVersion": "latest", "sourceType": "module" }
}
```

**.prettierrc.json**

```json
{ "tabWidth": 4, "semi": false, "singleQuote": true }
```

**commitlint.config.cjs**

```javascript
module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            ['feat', 'fix', 'chore', 'docs', 'style', 'refactor', 'test'],
        ],
    },
}
```

### Conventional Commits

```
<tipo>(<escopo>): <descrição>

Exemplos:
feat: adiciona login
fix: corrige bug
chore: atualiza deps
docs: atualiza docs
```

### Testar

```bash
npx eslint .
npx prettier --check .
echo "feat: test" | npx commitlint
```
