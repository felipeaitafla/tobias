import type { APIRoute } from 'astro';
import { PAGINAS } from '../lib/rotas';

/*
 * O sitemap, gerado a cada build a partir de `PAGINAS` — sem arquivo fixo para
 * esquecer de atualizar, e sem `@astrojs/sitemap`: seis URLs não justificam uma
 * dependência (ver "Dependências do site" no CLAUDE.md).
 *
 * Cada URL leva as versões nos outros idiomas (`xhtml:link`), o mesmo par que o
 * `hreflang` do `Base.astro` declara no HTML. O Google aceita os dois lugares; ter
 * os dois não conflita enquanto os dois saem da mesma lista, que é o caso.
 */
export const GET: APIRoute = ({ site }) => {
  const url = (caminho: string) => new URL(caminho, site).href;

  const entradas = Object.values(PAGINAS).flatMap((versoes) => {
    const pares = Object.entries(versoes);
    const alternativas = pares
      .map(([id, caminho]) => `    <xhtml:link rel="alternate" hreflang="${id}" href="${url(caminho)}"/>`)
      .join('\n');
    return pares.map(
      ([, caminho]) => `  <url>\n    <loc>${url(caminho)}</loc>\n${alternativas}\n  </url>`,
    );
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entradas.join('\n')}
</urlset>
`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
