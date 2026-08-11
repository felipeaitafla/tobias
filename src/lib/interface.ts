/*
 * Strings de INTERFACE, por idioma — o que o leitor de tela lê e ninguém vê.
 *
 * Por que não vão para o Sanity junto com o resto: "Ver o grupo 3 de 4" e
 * "Endereço: " não são conteúdo, são acessibilidade. Pôr isso no Studio enche o
 * formulário do cliente de campos que ele não sabe para que servem, e um deles
 * apagado por engano quebra a leitura da página sem quebrar nada visível — o
 * pior tipo de defeito. Aqui elas viajam com o código que as usa.
 *
 * A divisa é essa: se some da tela quando o CSS carrega, é daqui. Se o cliente
 * leria e diria "esse texto está errado", é do Sanity.
 */
const DICIONARIO = {
  'pt-BR': {
    'rodape.aria': 'Rodapé',
    'clientes.grupo': (n: number, total: number) => `Ver o grupo ${n} de ${total}`,
    'contato.endereco': 'Endereço: ',
    'contato.telefone': 'Telefone: ',
    'contato.email': 'E-mail: ',
    'contato.atendimento': 'Atendimento: ',
    'form.pais': 'País',
    'form.buscarPais': 'Buscar país',
    'socio.alt': (nome: string) => `${nome} Tobias`,
    /* O botão de download só tem o ícone: sem isto ele não tem nome nenhum
       para o leitor de tela. O aviso do travamento é a segunda frase, e some
       do anúncio assim que o e-mail vale. */
    'apresentacao.baixar': 'Baixar a apresentação institucional em PDF',
    'apresentacao.travado': 'Disponível depois de preencher o e-mail',
    'idioma.escolher': 'Escolher idioma',
    /* O rótulo é fixo; a DATA vem do Sanity, porque é ela que o cliente
       atualiza a cada revisão do texto. */
    'legal.atualizado': 'Última atualização: ',
  },
  en: {
    'rodape.aria': 'Footer',
    'clientes.grupo': (n: number, total: number) => `Show group ${n} of ${total}`,
    'contato.endereco': 'Address: ',
    'contato.telefone': 'Phone: ',
    'contato.email': 'Email: ',
    'contato.atendimento': 'Office hours: ',
    'form.pais': 'Country',
    'form.buscarPais': 'Search country',
    'socio.alt': (nome: string) => `${nome} Tobias`,
    'apresentacao.baixar': 'Download the firm profile as PDF',
    'apresentacao.travado': 'Available once you fill in your email',
    'idioma.escolher': 'Choose language',
    'legal.atualizado': 'Last updated: ',
  },
} as const;

export type Idioma = keyof typeof DICIONARIO;

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

export function textos(idioma: string) {
  return DICIONARIO[idioma as Idioma] ?? DICIONARIO[IDIOMA_PADRAO];
}
