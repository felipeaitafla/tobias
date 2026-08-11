import { createClient } from '@sanity/client';

/*
 * Cliente do Sanity, usado só em tempo de build.
 *
 * SEM TOKEN, e isso é de propósito: o dataset `production` tem ACL pública,
 * então ler conteúdo publicado não pede credencial. O build do site não carrega
 * segredo nenhum, o `dist/` não pode conter segredo nenhum, e a hospedagem não
 * precisa de variável de ambiente secreta. Só o script de migração usa token.
 *
 * `useCdn: false` porque a saída é estática: o build roda uma vez por publicação
 * e precisa do dado recém-publicado, não do cache de borda. A CDN valeria se as
 * consultas acontecessem a cada visita.
 */
/*
 * Prévia de rascunho — DESLIGADA por padrão, e só para desenvolvimento.
 *
 * O protocolo de edição do projeto (ver CLAUDE.md) manda gravar rascunho antes
 * de publicar, para dar a chance de ver e recusar. Só que o cliente daqui lê
 * apenas documento publicado, então até então não havia como VER o rascunho —
 * a única forma era publicar, que é exatamente a decisão que o rascunho existe
 * para adiar. Mordeu em 2026-08-11, na primeira página legal: a página aparecia
 * enquanto um patch temporário estava no lugar e sumia quando ele saía.
 *
 * `SANITY_RASCUNHOS=true` no `.env` e `npm run dev` passa a mostrar rascunho
 * sobreposto ao publicado. A variável NÃO é `PUBLIC_`, então o Astro não a
 * expõe ao navegador, e o token continua vindo do `.env` — nenhum segredo
 * escrito neste arquivo.
 *
 * Ela é uma alavanca de desenvolvimento, não de produção: com ela ligada num
 * build, o `dist/` sai com texto não publicado E carregando um token no
 * processo. Por isso o padrão é desligado e por isso ela não entra no painel da
 * hospedagem. Se um dia entrar prévia de verdade, é rota sob demanda, não isto.
 */
const rascunhos = import.meta.env.SANITY_RASCUNHOS === 'true';

/*
 * E a alavanca não pode ser esquecida ligada: num build ela produziria um
 * `dist/` com texto que ninguém aprovou, e nada no site denunciaria isso — a
 * página sai bonita, com o parágrafo errado. Um aviso em comentário não
 * impediria; parar o build, sim. `import.meta.env.PROD` é o que o Astro liga em
 * `astro build` e deixa desligado em `astro dev`.
 */
if (rascunhos && import.meta.env.PROD) {
  throw new Error(
    'SANITY_RASCUNHOS=true num build de produção: o site sairia com conteúdo ' +
      'não publicado. Esvazie a variável no .env (ela é só para `npm run dev`).',
  );
}

export const sanity = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  apiVersion: '2026-02-01',
  useCdn: false,
  ...(rascunhos
    ? { token: import.meta.env.SANITY_WRITE_TOKEN, perspective: 'drafts' as const }
    : {}),
});
