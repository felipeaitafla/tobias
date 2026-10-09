import { IDIOMAS, caminhoDe, type Idioma } from './idioma';

/*
 * Todas as páginas do site, cada uma com o caminho dela em cada idioma.
 *
 * Mora aqui, e não escrita em cada rota, porque TRÊS lugares precisam da mesma
 * lista: o `rotas` de cada página legal (que vira canonical e `hreflang` no
 * `Base.astro`), o `sitemap.xml` e — pelo sitemap — o `robots.txt`. Página nova
 * que não entrar aqui existe no build e some do sitemap, sem nada avisar.
 *
 * Barra no fim em TODOS os caminhos: o build gera `pasta/index.html`, e a Netlify
 * responde ao caminho sem barra com 301 para o com barra. Declarar o sem barra no
 * canonical é apontar o buscador para um redirecionamento. `trailingSlash:
 * 'always'`, no `astro.config.mjs`, é o que segura isso do lado do Astro.
 */
export const PAGINAS = {
  inicio: Object.fromEntries(IDIOMAS.map((id) => [id, caminhoDe(id)])) as Record<Idioma, string>,
  privacidade: { 'pt-BR': '/politica-de-privacidade/', en: '/en/privacy-policy/' },
  termos: { 'pt-BR': '/termos-de-uso/', en: '/en/terms-of-use/' },
  /* Só português: é uma landing para revenda de combustível no Brasil, e não
     há tradução prevista. Uma entrada só é como o `Base.astro` deixa de
     declarar `hreflang` para o inglês. */
  postos: { 'pt-BR': '/postos-de-combustivel/' },
} satisfies Record<string, Partial<Record<Idioma, string>>>;
