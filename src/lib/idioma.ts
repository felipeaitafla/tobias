export type Idioma = 'pt-BR' | 'en';

export const IDIOMAS: Idioma[] = ['pt-BR', 'en'];
export const IDIOMA_PADRAO: Idioma = 'pt-BR';

/*
 * O nome de cada idioma, escrito NO próprio idioma — "Português", nunca
 * "Portuguese". Quem procura a versão portuguesa não lê inglês para achá-la.
 *
 * Não vai para o Sanity, e a razão é a mesma de `studio/idiomas.ts`: esta lista
 * não muda sem alguém mexer no roteamento do Astro junto. Um campo editável
 * daria a impressão de que acrescentar um terceiro idioma é tarefa de Studio,
 * quando exige uma rota nova.
 */
export const NOMES_IDIOMA: Record<Idioma, string> = {
  'pt-BR': 'Português',
  en: 'English',
};

/*
 * A rota de cada idioma. `prefixDefaultLocale: false` põe o português na raiz
 * e só o inglês ganha prefixo.
 *
 * Mora aqui, e não no layout, porque DOIS lugares precisam da mesma conta: o
 * `hreflang`/canonical do `Base.astro` e o seletor de idioma do `Cabecalho`.
 * Duas cópias divergiriam na primeira vez que alguém acertasse uma só.
 */
export const caminhoDe = (id: string) => (id === IDIOMA_PADRAO ? '/' : `/${id}/`);
