import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/*
 * Os artigos da landing de postos (`/postos-de-combustivel/<slug>/`).
 *
 * Markdown no repositório, e não Sanity — pela mesma decisão PROVISÓRIA que
 * pôs o texto da landing em `src/data/postos.ts` (2026-10-08): a página fecha
 * assim e migra para o Studio depois, de uma vez. Markdown porque é o formato
 * em que o texto chega, e porque o Astro já transforma tabela em `<table>`
 * sem dependência nova — o que o esquema fechado do `TextoLegal` não faz.
 *
 * O nome do arquivo é o slug da URL.
 */
const artigos = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/artigos' }),
  schema: z.object({
    titulo: z.string(),
    /* O `<title>` e a descrição de busca, que o redator escreve à parte do
       título da página. */
    seo: z.object({ titulo: z.string(), descricao: z.string() }),
    /* `YYYY-MM-DD`, escrito por extenso na página — ver o layout. */
    publicado: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    /* Só quando o CONTEÚDO for revisado (lei nova, correção de mérito): aparece
       na página, vira o `dateModified` do JSON-LD e o `lastmod` do sitemap. */
    atualizado: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    /*
     * O `_key` do cartão deste artigo em `postos.artigos.itens`. É dele que vêm
     * a capa e o "Ler artigo" da landing: com o arquivo aqui, o cartão de lá
     * vira link sozinho (ver `src/lib/artigos.ts`).
     */
    cartao: z.string(),
    /* As fontes citadas, no fim do artigo e no `citation` do JSON-LD. */
    fontes: z.array(z.object({ autor: z.string(), obra: z.string(), nota: z.string() })),
  }),
});

export const collections = { artigos };
