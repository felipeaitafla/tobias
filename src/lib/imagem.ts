import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { sanity } from './sanity';

const construtor = imageUrlBuilder(sanity);

/*
 * Substitui o `<Image>` do Astro, e a substituição não é de uma linha só.
 *
 * O que o `<Image>` fazia de graça e aqui precisa ser escrito à mão:
 *
 *   1. `width`/`height` no atributo. Sem eles volta o salto de layout que o
 *      componente do Astro evitava — o navegador só sabe reservar espaço se a
 *      proporção estiver no HTML. Vêm de `metadata.dimensions`, pedido na
 *      própria consulta;
 *   2. `srcset` com mais de um candidato. Antes era `widths={[...]}`; agora é um
 *      `.width(n)` por candidato;
 *   3. formato moderno. `auto('format')` deixa a CDN servir webp/avif para quem
 *      aceita, que é o que o Astro fazia ao gerar `.webp`.
 *
 * A armadilha do flex continua valendo (ver AGENTS.md): imagem com `width` e
 * `height` NÃO estica em flex. A moldura `position: relative` com a foto
 * `absolute; inset: 0` segue necessária — o motivo não mudou junto com o
 * pipeline.
 */

export type ImagemSanity = SanityImageSource & {
  dimensoes?: { width: number; height: number; aspectRatio: number };
};

export const urlDe = (fonte: SanityImageSource) => construtor.image(fonte);

interface Opcoes {
  /** Larguras do `srcset`, em px. A primeira é o `src` de fallback. */
  larguras: number[];
  /** O `sizes` do HTML. Sem ele o navegador assume 100vw e baixa demais. */
  sizes?: string;
  /** Recorte fixo, quando o desenho pede proporção e não a do arquivo. */
  altura?: number;
}

/** Devolve o pacote que um `<img>` precisa: src, srcset, width, height. */
export function imagem(fonte: ImagemSanity, { larguras, sizes, altura }: Opcoes) {
  const monta = (largura: number) => {
    let url = urlDe(fonte).width(largura).auto('format').quality(82);
    if (altura) url = url.height(Math.round((altura / larguras[0]) * largura)).fit('crop');
    return url.url();
  };

  const dim = fonte.dimensoes;
  const larguraBase = larguras[0];

  return {
    src: monta(larguraBase),
    srcset: larguras.map((l) => `${monta(l)} ${l}w`).join(', '),
    sizes,
    /* A altura sai da proporção do arquivo, não de um palpite: é o que mantém a
       caixa reservada igual à imagem que vai chegar. */
    width: larguraBase,
    height: altura ?? (dim ? Math.round(larguraBase / dim.aspectRatio) : undefined),
  };
}
