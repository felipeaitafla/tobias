/*
 * Gera o sprite de bandeiras do seletor de país do formulário.
 *
 * Por que sprite e não um SVG por bandeira: os arquivos do `flag-icons` somam
 * 2,4 MB — a Espanha sozinha tem 81 KB de brasão, e num quadradinho de 24px
 * nada disso aparece. Rasterizadas a 48×36 (2× do tamanho de tela) e juntas num
 * WebP só, as 245 cabem em poucas dezenas de KB e custam UMA requisição, em vez
 * de 245 quando a lista abre.
 *
 * Roda sob demanda, não no build:  node scripts/gerar-bandeiras.mjs
 *
 * Saídas (as duas versionadas):
 *   src/assets/bandeiras.webp  — o sprite, uma bandeira por fileira
 *   src/data/bandeiras.ts      — de código de país para o índice da fileira
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import sharp from 'sharp';
import { getCountries } from 'libphonenumber-js/min';

const require = createRequire(import.meta.url);
const FLAG_ICONS = require.resolve('flag-icons/package.json').replace(/package\.json$/, '');

// 2× do tamanho de tela (24×18), que é o suficiente para telas retina.
const LARGURA = 48;
const ALTURA = 36;

const paises = [...getCountries()].sort();
const fileiras = [];
const semBandeira = [];

for (const pais of paises) {
  const arquivo = `${FLAG_ICONS}flags/4x3/${pais.toLowerCase()}.svg`;
  try {
    const png = await sharp(readFileSync(arquivo), { density: 300 })
      .resize(LARGURA, ALTURA, { fit: 'fill' })
      .png()
      .toBuffer();
    fileiras.push({ pais, png });
  } catch {
    semBandeira.push(pais);
  }
}

const sprite = await sharp({
  create: {
    width: LARGURA,
    height: ALTURA * fileiras.length,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite(fileiras.map((f, i) => ({ input: f.png, top: i * ALTURA, left: 0 })))
  // 70 é o joelho da curva: de 88 para 70 caem 21 KB sem diferença visível num
  // quadrado de 24px; abaixo disso a economia vira migalha e o desenho suja.
  .webp({ quality: 70 })
  .toBuffer();

writeFileSync(new URL('../src/assets/bandeiras.webp', import.meta.url), sprite);

const indice = Object.fromEntries(fileiras.map((f, i) => [f.pais, i]));
writeFileSync(
  new URL('../src/data/bandeiras.ts', import.meta.url),
  `/*
 * Gerado por scripts/gerar-bandeiras.mjs — não editar à mão.
 *
 * Cada país aponta para a fileira dele em src/assets/bandeiras.webp. O sprite
 * tem ${LARGURA}×${ALTURA} por fileira (2× do tamanho de tela).
 */
export const ALTURA_BANDEIRA = ${ALTURA / 2};

export const bandeiras: Record<string, number> = ${JSON.stringify(indice, null, 2)};
`,
);

console.log(`sprite: ${LARGURA}×${ALTURA * fileiras.length}, ${(sprite.length / 1024).toFixed(1)} KB`);
console.log(`bandeiras: ${fileiras.length} de ${paises.length}`);
if (semBandeira.length) console.log(`sem arquivo no flag-icons: ${semBandeira.join(', ')}`);
