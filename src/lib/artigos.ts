import { getCollection } from 'astro:content';
import { postos } from '../data/postos';

/* Os artigos moram debaixo da landing: é ela que eles aprofundam, e é para
   ela que o leitor volta. */
export const caminhoArtigo = (slug: string) => `/postos-de-combustivel/${slug}/`;

/*
 * Os cartões de `postos.artigos`, com o "Ler artigo" ligado em quem já tem
 * arquivo em `src/content/artigos/`.
 *
 * O link é DERIVADO, e não escrito em `postos.ts`: publicar um artigo é criar o
 * Markdown com o `cartao` dele, e o cartão da landing (e o "Continue lendo" dos
 * outros artigos) acende sozinho. Um `href` à mão seria um segundo lugar para
 * acertar o slug — e o cartão apontaria para um 404 no dia em que um dos dois
 * mudasse.
 */
export async function cartoesDeArtigo() {
  const publicados = await getCollection('artigos');
  const porCartao = new Map(publicados.map((artigo) => [artigo.data.cartao, artigo.id]));

  return postos.artigos.itens.map((item) => {
    const slug = porCartao.get(item._key);
    return slug ? { ...item, acao: { ...item.acao, href: caminhoArtigo(slug) } } : item;
  });
}
