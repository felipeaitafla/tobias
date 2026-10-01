import type { Config, Pagina } from './conteudo';

/*
 * JSON-LD (schema.org) — o que buscador e IA leem como FATO sobre o escritório:
 * nome, endereço, telefone, sócios, áreas. Sem isto eles deduzem do texto corrido,
 * e deduzir é onde "Tobias" vira pessoa, o telefone vira o do rodapé errado e o
 * endereço some.
 *
 * Quase tudo vem do Sanity, pela mesma consulta que desenha a página — o cliente
 * edita no Studio e o JSON-LD acompanha no próximo build. As exceções estão em
 * `FATOS`, logo abaixo.
 *
 * `@id` fixos (`/#escritorio`, `/#site`) e iguais nos dois idiomas: é o que diz ao
 * buscador que a página portuguesa e a inglesa falam da MESMA organização, e não
 * de duas.
 */

/*
 * O que NÃO tem campo no Sanity. Cada um está escrito na página, mas como prosa
 * (a história, o horário "Seg a Sex / 9h às 18h", o copyright) — e tirar dado
 * estruturado de prosa editável é frágil. Se algum destes mudar no Studio, muda
 * aqui junto: é a mesma armadilha dos dois lugares da OAB (ver CLAUDE.md).
 */
const FATOS = {
  razaoSocial: 'Tobias Sociedade Individual de Advocacia',
  fundacao: '2006',
  socios: [
    { nome: 'Thiago Tobias Bezerra', formacao: 'Universidade Católica de Pernambuco' },
    { nome: 'Marjorye Tobias', formacao: 'Pontifícia Universidade Católica do Rio Grande do Sul' },
  ],
  horario: { dias: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], abre: '09:00', fecha: '18:00' },
};

/*
 * O endereço no Sanity é um texto só ("Av. Augusto Meyer, 40 - Sala 501 -
 * Auxiliadora, Porto Alegre - RS, 90550-110"). O formato é o dos Correios, então
 * dá para desmontar — e se um dia não bater, sai o texto inteiro como
 * `streetAddress`, que é menos útil mas nunca errado.
 */
function endereco(texto: string) {
  const partes = texto.match(/^(.+),\s*([^,]+?)\s*-\s*([A-Z]{2}),\s*(\d{5}-?\d{3})$/);
  if (!partes) return { '@type': 'PostalAddress', streetAddress: texto, addressCountry: 'BR' };
  const [, rua, cidade, uf, cep] = partes;
  return {
    '@type': 'PostalAddress',
    streetAddress: rua,
    addressLocality: cidade,
    addressRegion: uf,
    postalCode: cep,
    addressCountry: 'BR',
  };
}

export interface ContextoPagina {
  site: URL;
  canonical: string;
  idioma: string;
  titulo: string;
  descricao: string;
}

const ids = (site: URL) => ({
  escritorio: new URL('/#escritorio', site).href,
  site: new URL('/#site', site).href,
});

function paginaWeb({ site, canonical, idioma, titulo, descricao }: ContextoPagina, extra = {}) {
  const id = ids(site);
  return {
    '@type': 'WebPage',
    '@id': `${canonical}#pagina`,
    url: canonical,
    name: titulo,
    description: descricao,
    inLanguage: idioma,
    isPartOf: { '@id': id.site },
    publisher: { '@id': id.escritorio },
    ...extra,
  };
}

/* A one page: o escritório inteiro, os sócios, o site e a página. */
export function grafoInicio(
  base: ContextoPagina,
  pagina: NonNullable<Pagina>,
  config: NonNullable<Config>,
) {
  const { site, idioma, descricao } = base;
  const id = ids(site);
  const url = (caminho: string) => new URL(caminho, site).href;

  const escritorio = {
    '@type': ['LegalService', 'Organization'],
    '@id': id.escritorio,
    name: 'Tobias Advogados',
    legalName: FATOS.razaoSocial,
    taxID: config.cnpj,
    url: url('/'),
    /*
     * PNG em `public/`, e não o SVG de `src/assets/`: o Vite embute SVG pequeno
     * como `data:` (saía assim até 2026-09-28), e o buscador precisa de uma URL
     * que ele possa baixar. Quadrado de 600px, a assinatura vertical em petróleo
     * sobre branco — o Google recorta logo largo demais. Gerado uma vez com o
     * `sharp` que já vem do `npm run bandeiras`.
     */
    logo: url('/logo.png'),
    image: url('/social-image.png'),
    description: descricao,
    telephone: config.telefonePrincipal.href,
    email: config.email,
    address: endereco(config.endereco),
    areaServed: { '@type': 'Country', name: 'Brasil' },
    foundingDate: FATOS.fundacao,
    founder: FATOS.socios.map((_, i) => ({ '@id': url(`/#socio-${i + 1}`) })),
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: FATOS.horario.dias,
      opens: FATOS.horario.abre,
      closes: FATOS.horario.fecha,
    },
    knowsAbout: pagina.areas.grupos.flatMap((grupo) => grupo.itens.map((item) => item.titulo)),
    sameAs: [config.instagram, config.linkedin].filter(Boolean),
  };

  const socios = FATOS.socios.map((socio, i) => ({
    '@type': 'Person',
    '@id': url(`/#socio-${i + 1}`),
    name: socio.nome,
    alumniOf: { '@type': 'CollegeOrUniversity', name: socio.formacao },
    worksFor: { '@id': id.escritorio },
  }));

  const siteWeb = {
    '@type': 'WebSite',
    '@id': id.site,
    url: url('/'),
    name: 'Tobias Advogados',
    inLanguage: ['pt-BR', 'en'],
    publisher: { '@id': id.escritorio },
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [escritorio, ...socios, siteWeb, paginaWeb(base, { about: { '@id': id.escritorio } })],
  };
}

/* As páginas legais: só a página, amarrada ao site e ao escritório pelos `@id`. */
export function grafoLegal(base: ContextoPagina, atualizadoEm: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [paginaWeb(base, { dateModified: atualizadoEm })],
  };
}
