# FIT.AI — Frontend

Frontend do projeto **FIT.AI** (bootcamp), responsável por:

- Tela de **login** com Google OAuth
- **Dashboard** com treino do dia, streak e consistência semanal
- Visualização de **Planos de Treino** com dias e exercícios
- **Iniciar e completar** sessões de treino
- Navegação inferior com acesso rápido às principais seções

Este README serve como referência: quando você voltar aqui no futuro, deve conseguir entender **como o projeto está organizado, como roda localmente e quais decisões de arquitetura foram tomadas**.

---

## Stack e tecnologias

- **Next.js** `16.x` (App Router)
- **React** `19.x`
- **TypeScript** (strict mode, module resolution `bundler`)
- **Tailwind CSS** `v4` para estilização
- **shadcn/ui** (estilo `new-york`) como biblioteca de componentes UI
- **Radix UI** para primitivos de acessibilidade
- **Lucide React** para ícones
- **Better Auth** (`better-auth/react`) para autenticação (Google OAuth)
- **Orval** para geração automática de funções e tipos da API
- **Day.js** para manipulação de datas
- **ESLint + Prettier** para lint e formatação

---

## O que é o Orval?

[Orval](https://orval.dev/) é uma ferramenta que gera automaticamente código TypeScript (funções de fetch e tipos) a partir de um schema OpenAPI/Swagger. No projeto, ele:

1. Lê o schema da API em `${NEXT_PUBLIC_API_URL}/swagger.json`
2. Gera funções tipadas (ex: `getHomeData`, `startWorkoutSession`, `listWorkoutPlans`) e interfaces (tipos de request/response)
3. Salva tudo em `app/_lib/api/fetch-generated/index.ts`

As funções geradas usam um `customFetch` (`app/_lib/fetch.ts`) que injeta automaticamente os cookies de sessão e monta a URL base da API, permitindo que o data fetching funcione tanto em Server Components quanto em Server Actions.

### Regenerar as funções da API

Sempre que a API adicionar ou alterar endpoints, execute:

```bash
npx orval
```

Isso regenera o arquivo `app/_lib/api/fetch-generated/index.ts` com as funções e tipos atualizados.

---

## Estrutura de pastas

```
.
├─ app/
│  ├─ globals.css              # Tema (variáveis CSS, cores, fontes)
│  ├─ layout.tsx               # Layout raiz (fontes, metadata)
│  ├─ page.tsx                 # Home / Dashboard
│  ├─ _components/             # Componentes compartilhados do app
│  │  ├─ bottom-nav.tsx        # Barra de navegação inferior
│  │  ├─ consistency-square.tsx # Quadrado de consistência individual
│  │  ├─ consistency-tracker.tsx # Grid de consistência semanal
│  │  └─ workout-day-card.tsx  # Card de dia de treino
│  ├─ _lib/
│  │  ├─ auth-client.ts        # Instância do Better Auth (cliente)
│  │  ├─ fetch.ts              # Custom fetch com cookies e URL base
│  │  └─ api/
│  │     └─ fetch-generated/
│  │        └─ index.ts        # Funções geradas pelo Orval (NÃO editar)
│  ├─ auth/
│  │  └─ page.tsx              # Página de login (Google OAuth)
│  └─ workout-plans/
│     └─ [id]/
│        ├─ page.tsx           # Lista de dias do plano de treino
│        ├─ _components/
│        │  └─ rest-day-card.tsx
│        └─ days/
│           └─ [dayId]/
│              ├─ page.tsx     # Detalhe do dia de treino
│              ├─ _actions.ts  # Server Actions (iniciar/completar treino)
│              └─ _components/
│                 ├─ back-button.tsx
│                 ├─ start-workout-button.tsx
│                 └─ complete-workout-button.tsx
├─ components/
│  └─ ui/                      # Componentes shadcn/ui instalados
│     ├─ avatar.tsx
│     ├─ badge.tsx
│     ├─ button.tsx
│     ├─ card.tsx
│     └─ input.tsx
├─ lib/
│  └─ utils.ts                 # Utilitário cn() (clsx + tailwind-merge)
├─ public/                     # Assets estáticos (imagens, ícones)
├─ orval.config.ts             # Configuração do Orval
├─ next.config.ts              # Configuração do Next.js
├─ components.json             # Configuração do shadcn/ui
└─ tsconfig.json
```

### `app/layout.tsx`

Layout raiz da aplicação. Configura as fontes do Google (Geist, Geist Mono, Inter Tight, Anton) e define o metadata (`title: "FIT.AI"`).

### `app/page.tsx`

Página principal (Dashboard). Server Component que:

- Verifica a sessão do usuário (redireciona para `/auth` se não autenticado)
- Busca dados do dia via `getHomeData()` (server-side)
- Exibe: banner, consistência semanal, streak de treinos e treino do dia

### `app/_lib/auth-client.ts`

Cria a instância do Better Auth Client apontando para a API (`NEXT_PUBLIC_API_URL`). Usado para:

- `authClient.getSession()` — verificar sessão nos Server Components
- `authClient.useSession()` — hook para Client Components
- `authClient.signIn.social()` — login com Google

### `app/_lib/fetch.ts`

Custom fetch usado pelo Orval. Responsabilidades:

- Monta a URL completa da API
- Injeta cookies da requisição (SSR) via `next/headers`
- Retorna `{ status, data, headers }` no formato esperado pelo Orval

### `app/_lib/api/fetch-generated/index.ts`

Arquivo **gerado automaticamente** pelo Orval. Contém todas as funções de chamada à API e tipos TypeScript correspondentes. **Não editar manualmente** — use `npx orval` para regenerar.

---

## Páginas

| Rota                               | Descrição                                       | Tipo             |
| ---------------------------------- | ----------------------------------------------- | ---------------- |
| `/`                                | Dashboard (treino do dia, streak, consistência) | Server Component |
| `/auth`                            | Login com Google OAuth                          | Client Component |
| `/workout-plans/[id]`              | Lista de dias do plano de treino                | Server Component |
| `/workout-plans/[id]/days/[dayId]` | Detalhe do treino (exercícios, sessão)          | Server Component |

---

## Como rodar localmente

### Pré-requisitos

- Node.js
- A **API** rodando localmente (ver README da API)
- npm

### 1) Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:8081
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2) Instalar dependências

```bash
npm install
```

### 3) Gerar funções da API (Orval)

Certifique-se de que a API está rodando, então:

```bash
npx orval
```

### 4) Rodar o servidor de desenvolvimento

```bash
npm run dev
```

O frontend sobe em `http://localhost:3000`.

---

## Scripts (package.json)

| Comando         | Descrição                                      |
| --------------- | ---------------------------------------------- |
| `npm run dev`   | Inicia o Next.js em modo de desenvolvimento    |
| `npm run build` | Gera o build de produção                       |
| `npm run start` | Inicia o servidor de produção                  |
| `npm run lint`  | Executa o ESLint                               |
| `npx orval`     | Regenera as funções da API a partir do Swagger |

---

## Autenticação

- Implementada com **Better Auth** (Google OAuth)
- A sessão é gerenciada pela API via cookies (`credentials: "include"`)
- Verificação de sessão feita diretamente nas páginas (sem middleware)
- Páginas protegidas redirecionam para `/auth` se não houver sessão
- A página `/auth` redireciona para `/` se o usuário já estiver logado

---

## Estilização e tema

- **Tailwind CSS v4** com variáveis CSS customizadas definidas em `app/globals.css`
- Cores do tema em formato **OKLCh** (cor primária verde, streak laranja)
- Suporte a **dark mode** (via classe `.dark`)
- Componentes da **shadcn/ui** (estilo `new-york`) com Radix UI
- Fontes: **Inter Tight** (heading), **Geist** (sans), **Geist Mono** (mono), **Anton** (display)
- Ícones via **Lucide React**

---

## Convenções

- **Server Components** para data fetching sempre que possível
- **Client Components** apenas para interatividade (formulários, hooks, eventos)
- **Server Actions** (`"use server"`) para mutações (iniciar/completar treino)
- Path alias `@/` para imports absolutos
- Invalidação de cache com `revalidatePath()` após mutações
- `dayjs` para manipulação de datas (nunca manipulação manual de strings)
- Componentes do **shadcn/ui** (`Button`, `Card`, etc.) em vez de elementos HTML nativos
