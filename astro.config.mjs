// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

/*
 * Range latino padrão do Google Fonts. Precisa ser declarado explicitamente:
 * a opção `subsets` não restringe o que o provider devolve, então sem isto a
 * Noto Serif KR emite 373 @font-face e ~6 MB de glifos hangul.
 *
 * Atenção: este range NÃO cobre a seta → (U+2192). Se precisar de setas ou
 * outros símbolos no texto, use SVG — senão o navegador baixa um subset CJK
 * inteiro só por causa de um caractere.
 */
const LATINO =
  'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,' +
  'U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,' +
  'U+2212,U+2215,U+FEFF,U+FFFD';

// https://astro.build/config
export default defineConfig({
  site: 'https://tobias.adv.br',

  /*
   * Roteamento i18n nativo do Astro.
   *
   * `prefixDefaultLocale: false` põe o português na RAIZ e o inglês em `/en/`.
   * A documentação da Sanity prefere prefixar os dois por causa de casos de
   * borda de SEO; aqui a decisão foi outra, e o que a paga é `hreflang` +
   * canonical no `Base.astro` — sem eles as duas versões competiriam entre si
   * no buscador.
   *
   * Estes `locales` têm que bater com os `id` de `studio/idiomas.ts`: é o que
   * faz `pagina.language` casar com a rota.
   */
  i18n: {
    locales: ['pt-BR', 'en'],
    defaultLocale: 'pt-BR',
    routing: { prefixDefaultLocale: false },
  },

  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Noto Serif KR',
      cssVariable: '--fonte-display-astro',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      unicodeRange: [LATINO],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--fonte-corpo-astro',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      unicodeRange: [LATINO],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],
});
