# Aprendizados

## Guia de Setup: ESLint + Prettier + Husky

Passo a passo para configurar linting, formatação e git hooks em um novo projeto.

---

### 1. npm / package.json

- Gerencia dependências do projeto
- `package-lock.json` - arquivo que trava versões das dependências
- `-D` ou `--save-dev` - instala como dependência de desenvolvimento
- Dependências de dev não são incluídas na build de produção

### 2. ESLint

**O que faz:** Análise estática de código JavaScript/TypeScript - identifica padrões problemáticos e aplica estilo de código.

**Comandos:**
```bash
npm install -D eslint@8.46.0
npx eslint --init
npx eslint .
```

**Configuração:** `.eslintrc.json`

---

### 3. Prettier

**O que faz:** Formatador de código que garante estilo consistente - foca em formatação, não em qualidade de código.

**Comandos:**
```bash
npm install -D prettier
npx prettier index.js --write
```

**Configuração:** `.prettierrc.json`

---

### 4. Husky

**O que faz:** Permite configurar hooks do Git hooks de forma simples.

**Comandos:**
```bash
npm install -D husky
npx husky install
npx husky add .husky/pre-commit "comando"
```

---

### 5. Hooks Git (pre-commit)

**O que faz:** Scripts que rodam automaticamente antes de um commit - útil para rodar linting, testes, etc.

**Arquivo:** `.husky/pre-commit`

**Exemplo de conteúdo:**
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx eslint .
npx prettier --write .
```

---

### Instalar versão específica de um pacote

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

---

### Setup Completo em 7 Passos

```bash
# 1. Inicializa npm (se necessário)
npm init -y

# 2. Instala ESLint
npm install -D eslint@8.46.0

# 3. Inicializa ESLint
npx eslint --init
# Escolher: To check syntax, find problems, and enforce code style
# Escolher: JavaScript modules (import/export)
# Escolher: Framework: Unstyled / React / Vue / etc.
# Escolher: Does your project use TypeScript? > No / Yes
# Escolher: Where does your code run? > Browser / Node
# Escolher: Use a popular style guide > Airbnb / Standard / Google
# Escolder: What format do you want your config file? > JSON

# 4. Instala Prettier
npm install -D prettier

# 5. Cria .prettierrc.json
echo '{\n  "semi": true,\n  "singleQuote": true,\n  "trailingComma": "es5",\n  "printWidth": 80,\n  "tabWidth": 2\n}' > .prettierrc.json

# 6. Instala Husky e inicializa
npm install -D husky
npx husky install

# 7. Cria pre-commit hook
npx husky add .husky/pre-commit "npx eslint . && npx prettier --write ."
```