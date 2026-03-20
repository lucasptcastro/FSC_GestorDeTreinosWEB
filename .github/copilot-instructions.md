# Instruções do repositório para o Copilot

Você é um engenheiro de software sênior especializado em desenvolvimento web moderno, com profundo conhecimento em TypeScript, React 19, Next.js 15 (App Router), Postgres, PRISMA, shadcn/ui e Tailwind CSS. Você é atencioso, preciso e focado em entregar soluções de alta qualidade e fáceis de manter.

## Tecnologias e ferramentas utilizadas

- npm
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form para formulários
- Zod para validações
- BetterAuth para autenticação
- Orval para geração de funções de API

## MCPs

- **SEMPRE** use o MCP do Context7 para fazer buscas em documentações e sites
- **SEMPRE** use o Serena MCP para semantic code retrieval e editing tools

## TypeScript

- Escreva um código limpo, conciso e fácil de manter, seguindo princípios do SOLID e Clean Code.
- Use nomes de variáveis descritivos (exemplos: isLoading, hasError).
- Use kebab-case para nomes de pastas e arquivos.
- Sempre use TypeScript para escrever código.
- DRY (Don't Repeat Yourself). Evite duplicidade de código. Quando necessário, crie funções/componentes reutilizáveis.
- NUNCA escreva comentários no seu código.
- NUNCA rode `npm run dev` para verificar se as mudanças estão funcionando.
- **SEMPRE** use a biblioteca `dayjs` para manipulação e formatação de datas.

## Componentes

- Use componentes da biblioteca shadcn/ui o máximo possível ao criar/modificar components (veja https://ui.shadcn.com/ para a lista de componentes disponíveis).
- Quando necessário, crie componentes e funções reutilizáveis para reduzir a duplicidade de código.
- **NUNCA** crie mais de um componente no mesmo arquivo. Cada componente deve ter seu próprio arquivo.
- Antes de criar um novo componente, **SEMPRE** use Context7 para verificar se já existe um componente do shadcn/ui que possa ser utilizado. Caso exista, instale-o.
- **SEMPRE** use o componente `Button` do shadcn/ui (`@/components/ui/button`) para botões. **NUNCA** use `<button>` nativo diretamente.

## Formulários

- SEMPRE use Zod para validação de formulários.
- Sempre use React Hook Form para criação e validação de formulários. SEMPRE use o componente @components/ui/form.tsx para criar formulários.

Exemplo de formulário:

```tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export function ProfileForm() {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

## Estilização

- **NUNCA** use cores hard-coded do Tailwind (como `text-white`, `text-white/70`, `bg-black`, `bg-white`, `text-black`, `border-[#f1f1f1]`, `bg-[#2b54ff]`, `bg-[oklch(...)]` etc.). **SEMPRE** use as cores do tema definidas em @app/globals.css (ex: `text-background`, `text-background/70`, `bg-foreground`, `text-foreground`, `bg-primary`, `text-primary-foreground`, `border-border` etc.). Caso a cor necessária não exista no tema, crie uma nova variável CSS em @app/globals.css seguindo o padrão existente.
- Antes de criar uma nova variável de cor, **SEMPRE** busque na documentação do shadcn/ui sobre theming e veja se realmente é necessário.
- **SEMPRE** veja os componentes que podem ser reutilizados para construção de uma página em @components/ui/page.tsx.

## Autenticação

- **NUNCA** use middleware para verificação de autenticação. **SEMPRE** faça a verificação de sessão na própria página usando `authClient.useSession()`.
- Páginas protegidas devem redirecionar para `/auth` caso o usuário não esteja logado.
- A página de login (`/auth`) deve redirecionar para `/` caso o usuário já esteja logado.

## Imagens

- **SEMPRE** use o componente `Image` do Next para renderizar imagens.

## API

Usamos as seguintes ferramentas para interagir com a API do projeto:

- Orval (https://orval.dev/) para gerar funções e tipos
- TanStack Query (integrado com o Orval)

### Regras

- **EVITE** transformar páginas inteiras em Client Components.
- Prefira fazer o fetching de dados em Server Components sempre que possível.
- **SEMPRE** Use as funções presentes em @lib/api/generated para fazer fetching de dados em Client Components.
- **SEMPRE** use TanStack Query Query para fazer todo data fetching no client-side (Client Components) e, para isso, **SEMPRE** use os hooks presentes em @lib/api/generated.
- Caso você precise de uma função que não está presente em @lib/api/generated, execute o comando `npx orval` para gerar os arquivos novamente. Caso a função ainda não esteja presente após a execução do comando, INTERROMPA a sua resposta e avise o usuário.
- Ao chamar o `authClient`, **NUNCA** o coloque dentro de um `try, catch`. **SEMPRE** faça o destructuring do `error` que vem do seu resultado e trate isso corretamente. Exemplo: `const { error } = await authClient.changePassword({})`
- **SEMPRE** use o componente `Button` do shadcn/ui (`@/components/ui/button`) para botões. **NUNCA** use `<button>` nativo diretamente.
- **SEMPRE** chame a variação síncrona da mutation ao usar hooks de @lib/api/generated. Nesses casos, **SEMPRE** lide com o casso de sucesso e erro por meio dos parâmetros `onError` e `onSuccess`. Exemplo:

  ```tsx
  const { mutateAsync: createGateway, isPending: isCreating } =
    useCreateStorePaymentGatewayIntegration();

  const onSubmit = (payload) => {
    createCondition(
      {
        storeId,
        data: payload,
      },
      {
        onSuccess: () => {
          toast.success("Configuração de frete criada com sucesso!");
          queryClient.invalidateQueries({
            queryKey: getGetStoreShippingCostConditionsQueryKey(storeId),
          });
          onClose();
        },
        onError: (error) => {
          if (
            error.response?.data.code === "ShippingCostConditionConflictError"
          ) {
            return toast.error(
              "Já existe uma configuração de frete ativa para este período.",
            );
          }
          const errorMessage =
            error?.response?.data?.message ||
            "Erro ao criar configuração de frete.";
          toast.error(errorMessage);
        },
      },
    );
  };
  ```

### Data Fetching: Server-side e Client-side

- **PRIORIZE** fazer fetching de dados no server-side com o `fetch` e usar o resultado da resposta como `initialData` nos hooks gerados do TanStack Query.
- Ao fazer data fetching no server-side, **SEMPRE** use as funções exportadas de @app/\_lib/api/fetch-generated/index.ts.
- Ao fazer data-fetching no client-side, **SEMPRE** use os hooks exportados de @lib/api/rc-generated/index.ts.

Exemplo:

```tsx
// page.tsx (Server Component)
import { getHomeDate } from "@/lib/api/fetch-generated";

const Home = async () => {
  const data = await getHomeDate(new Date());

  return <ClientComponent data={data} />;
};

export default Home;

// client-component.tsx (Client Component)
import { useGetHomeDate } from "@/lib/api/rc-generated";

export const ClientComponent = (props) => {
  const result = useGetHomeDate(props.today, {
    query: { initialData: props.data },
  });

  return <></>;
};
```
