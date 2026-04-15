# Aprendizados

## Guia de Setup: ESLint + Prettier + Husky + Commitlint

Passo a passo para configurar linting, formatação e git hooks em um novo projeto.

---

### 1. npm / package.json

**O que faz:** Gerencia dependências do projeto.

**Comandos úteis:**

```bash
npm init -y              # Inicializa package.json básico
npm install -D <pacote>  # Instala como dependência de desenvolvimento
npm list <pacote>        # Verifica versão instalada
```

**Configuração típica:**

```json
{
    "name": "nome-projeto",
    "version": "1.0.0",
    "type": "module",
    "scripts": {
        "prepare": "husky"
    },
    "devDependencies": {}
}
```

**Scripts úteis:**

- `"prepare": "husky"` - instala husky automaticamente ao fazer npm install
- `"postinstall": "npx husky install"` - alternativa (opcional, pode usar só prepare)

**Configs útiles:**

```json
"lint-staged": {
  "*.js": "eslint",
  "*.{js,json}": "prettier --write"
}
```

---

### 2. ESLint

**O que faz:** Análise estática de código - identifica padrões problemáticos e aplica estilo de código.

**Comandos:**

```bash
npm install -D eslint@8.46.0
npx eslint --init     # Configuração interativa
npx eslint .          # executa lint em todo projeto
```

**Configuração (.eslintrc.json):**

```json
{
    "env": {
        "es2021": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {}
}
```

---

### 3. Prettier

**O que faz:** Formatador de código que garante estilo consistente.

**Comandos:**

```bash
npm install -D prettier
npx prettier index.js --write    # Formata e salva
npx prettier . --write           # Formata todo projeto
```

**Configuração (.prettierrc.json):**

```json
{
    "tabWidth": 4,
    "semi": false,
    "singleQuote": true
}
```

---

### 4. Husky + Git Hooks

**O que faz:** Permite configurar hooks do Git que rodam automaticamente em eventos git.

**Comandos:**

```bash
npm install -D husky
npx husky install                    # Inicializa husky
npx husky add .husky/pre-commit "..."    # Cria hook pre-commit
npx husky add .husky/commit-msg "..."    # Cria hook commit-msg
```

**Arquivos criados:**

- `.husky/pre-commit` - roda antes de cada commit
- `.husky/commit-msg` - roda após mensagem de commit

**Tornar executável:**

```bash
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

---

### 5. commitlint

**O que faz:** Valida a mensagem do commit是否符合Conventional Commits padrão.

**Comandos:**

```bash
npm install -D @commitlint/cli@17.7.1 @commitlint/config-conventional
npx commitlint --init
```

**Configuração (commitlint.config.cjs):**

```javascript
module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat',
                'fix',
                'chore',
                'docs',
                'style',
                'refactor',
                'test',
                'build',
                'ci',
                'perf',
                'revert',
            ],
        ],
        'subject-full-stop': [0, 'never', '.'],
    },
}
```

Nota: Use `.cjs` se o projeto tiver `"type": "module"` no package.json.

**Conventional Commits padrão:**

```
<tipo>(<escopo>): <descrição>

Exemplos:
feat: adiciona novo botão
fix: corrige bug de login
chore: atualiza dependências
docs: atualiza documentação
refactor: refatora função X
test: adiciona testes unitários
```

---

### 6. lint-staged

**O que faz:** Roda lint apenas em arquivos staged (prontos para commit), muito mais rápido.

**Comandos:**

```bash
npm install -D lint-staged
```

**Configuração (package.json):**

```json
{
    "lint-staged": {
        "*.js": "eslint .",
        "*.{js,json}": "prettier --write"
    }
}
```

---

### Setup Completo em 10 Passos

```bash
# 1. Inicializa npm
npm init -y

# 2. Instala ESLint
npm install -D eslint@8.46.0

# 3. Inicializa ESLint
npx eslint --init
# Escolhas interativas:
# > To check syntax, find problems, and enforce code style
# > JavaScript modules (import/export)
# > Unstyled / React / Vue / etc.
# > Does your project use TypeScript? > No / Yes
# > Where does your code run? > Browser / Node
# > Use a popular style guide > Airbnb / Standard / Google
# > What format do you want your config file? > JSON

# 4. Instala Prettier
npm install -D prettier

# 5. Cria .prettierrc.json
echo '{}' > .prettierrc.json
# Editar com configurações desejadas

# 6. Instala Husky
npm install -D husky

# 7. Inicializa Husky
npx husky install

# 8. Adiciona script prepare no package.json
npm pkg set scripts.prepare="husky"

# 9. Instala commitlint
npm install -D @commitlint/cli@17.7.1 @commitlint/config-conventional

# 10. Cria commitlint.config.js
echo "module.exports = { extends: ['@commitlint/config-conventional'] }" > commitlint.config.js

# 11. Cria hook pre-commit
npx husky add .husky/pre-commit "npx lint-staged"

# 12. Cria hook commit-msg
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'

# 13. Configura lint-staged no package.json
npm pkg set lint-staged='{"*.js": "eslint", "*.{js,json}": "prettier --write"}'
```

**Arquivos de configuração finais:**

```
projeto/
├── .eslintrc.json      # ESLint config
├── .prettierrc.json   # Prettier config
├── commitlint.config.js
├── package.json
└── .husky/
    ├── pre-commit
    └── commit-msg
```

---

### Instalar versão específica de pacotes

```bash
# Versão específica
npm install <pacote>@<versão>
npm install eslint@8.46.0

# Versão mais recente
npm install <pacote>@latest

# Como dependência de desenvolvimento
npm install -D husky@8.0.3
```

---

### Verificar semuanya está funcionando

```bash
# Testa ESLint
npx eslint .

# Testa Prettier
npx prettier --check .

# Testa commitlint (opcional)
echo "feat: test" | npx commitlint

# Testa hooks (simula commit)
npx husky run pre-commit
```
