# ProntoMed — Frontend

Interface web do sistema de prontuário eletrônico **ProntoMed**, construída com **React + TypeScript + Vite**.

> Backend disponível em [prontomed-api](https://github.com/devmlima/prontomed-api) — deploy em produção: [prontomed-api-production.up.railway.app](https://prontomed-api-production.up.railway.app)

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | React 19 |
| Linguagem | TypeScript 6 |
| Build tool | Vite 8 |
| Roteamento | React Router DOM 7 |
| HTTP | Axios |
| Linting | ESLint + TypeScript ESLint |

---

## Funcionalidades

- Cadastro e login de médicos com autenticação JWT
- Listagem, cadastro, edição e exclusão (LGPD) de pacientes
- Listagem, cadastro, atualização e cancelamento de agendamentos
- Validação de conflito de horários na agenda
- Rotas protegidas — acesso negado sem autenticação

---

## Pré-requisitos

- [Node.js 20+](https://nodejs.org)
- Backend ProntoMed rodando (local ou em produção)

---

## Instalação e execução

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd prontomed-fe
```

### 2. Variáveis de ambiente

```bash
cp .env.example .env
```

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base da API (ex: `http://localhost:3000/api`) |

Em desenvolvimento, se `VITE_API_URL` não estiver definido, o Vite usa o proxy configurado em `vite.config.ts` apontando para `http://localhost:3000`.

### 3. Instalar dependências

```bash
npm install
```

### 4. Iniciar em modo desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em: **`http://localhost:5173`**

---

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia com hot-reload |
| `npm run build` | Gera build de produção em `dist/` |
| `npm run preview` | Pré-visualiza o build de produção |
| `npm run lint` | Verifica erros de lint |

---

## Arquitetura

```
src/
├── core/
│   ├── dtos/          # Tipos de request/response da API
│   ├── http/          # Cliente Axios centralizado com interceptor de token
│   └── interfaces/    # Contratos dos serviços
├── services/          # Implementações que consomem a API
├── contexts/          # AuthContext — estado global de autenticação
├── pages/
│   ├── loginPage/     # Tela de login e cadastro de médico
│   ├── homePage/      # Tela inicial pós-login
│   ├── patientsPage/  # CRUD de pacientes
│   └── appointmentsPage/ # Gestão de agendamentos
├── components/
│   └── layout/        # Shell da aplicação (sidebar, header)
├── Routes.tsx         # Definição das rotas com proteção por autenticação
└── main.tsx           # Entry point
```

O cliente HTTP (`src/core/http/client.ts`) injeta automaticamente o token JWT em todas as requisições via interceptor do Axios.

---

## Deploy (Vercel)

1. Importe o repositório no [Vercel](https://vercel.com) — detecta Vite automaticamente
2. Adicione a variável de ambiente:

| Nome | Valor |
|---|---|
| `VITE_API_URL` | `https://prontomed-api-production.up.railway.app/api` |

3. Clique em **Deploy**

O arquivo `vercel.json` já está configurado com as regras de rewrite necessárias para o React Router funcionar com URLs diretas.
