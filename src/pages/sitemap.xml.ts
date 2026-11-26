import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { PAGINAS } from '../lib/rotas';
import { caminhoArtigo } from '../lib/artigos';

/*
 * O sitemap, gerado a cada build a partir de `PAGINAS` — sem arquivo fixo para
 * esquecer de atualizar, e sem `@astrojs/sitemap`: seis URLs não justificam uma
 * dependência (ver "Dependências do site" no CLAUDE.md).
 *
 * Cada URL leva as versões nos outros idiomas (`xhtml:link`), o mesmo par que o
 * `hreflang` do `Base.astro` declara no HTML. O Google aceita os dois lugares; ter
 * os dois não conflita enquanto os dois saem da mesma lista, que é o caso.
 *
 * Os artigos da landing de postos entram pela coleção, e não por `PAGINAS`:
 * publicar um é criar o Markdown, e um segundo lugar para lembrar de registrá-lo
 * é o que deixaria o artigo fora do sitemap sem nada avisar.
 */
export const GET: APIRoute = async ({ site }) => {
  const url = (caminho: string) => new URL(caminho, site).href;

  const colecao = await getCollection('artigos');
  const artigos = colecao.map((artigo) => ({ 'pt-BR': caminhoArtigo(artigo.id) }));

  /* `lastmod` só nos artigos, que são quem tem data de verdade: a do build
     marcaria toda página como alterada a cada edição de qualquer uma. */
  const datas = new Map(
    colecao.map(({ id, data }) => [caminhoArtigo(id), data.atualizado ?? data.publicado]),
  );

  const entradas = [...Object.values(PAGINAS), ...artigos].flatMap((versoes) => {
    const pares = Object.entries(versoes);
    const alternativas = pares
      .map(([id, caminho]) => `    <xhtml:link rel="alternate" hreflang="${id}" href="${url(caminho)}"/>`)
      .join('\n');
    return pares.map(([, caminho]) => {
      const data = datas.get(caminho);
      const lastmod = data ? `\n    <lastmod>${data}</lastmod>` : '';
      return `  <url>\n    <loc>${url(caminho)}</loc>${lastmod}\n${alternativas}\n  </url>`;
    });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entradas.join('\n')}
</urlset>
`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
