import { defineQuery } from 'groq';
import { sanity } from './sanity';

/*
 * A consulta que alimenta a página inteira — uma só, com as duas raízes.
 *
 * `pagina` traz o que muda de idioma; `config` o que não muda. Buscar as duas
 * numa consulta em vez de duas evita uma ida e volta por seção, e é o que deixa
 * o build de uma página estática custar exatamente uma requisição.
 *
 * Tudo é projetado (`{...}` explícito) em vez de trazer o documento inteiro:
 * `_rev`, `_createdAt` e o resto do metadado não servem a ninguém aqui.
 */

/* Uma imagem precisa de mais que o `_ref`: sem `dimensions` não dá para escrever
   `width`/`height` no HTML, e sem eles volta o salto de layout. */
const IMAGEM = /* groq */ `{
  ...,
  "dimensoes": asset->metadata.dimensions
}`;

/*
 * O que se repete no alto e no pé de TODA página do site — a one page e as
 * páginas legais.
 *
 * Extraído em fragmento, e não copiado, porque as duas consultas alimentam os
 * MESMOS dois componentes (`Cabecalho` e `Rodape`). Duas listas de campos
 * divergiriam na primeira vez que alguém acrescentasse um item numa só, e o
 * sintoma seria um rodapé com um bloco a menos só nas páginas legais — nada
 * quebra, ninguém repara.
 */
const CHROME_PAGINA = /* groq */ `
  navegacao[]{ _key, texto, href },
  whatsappTexto,
  rodape{
    navegacao[]{ _key, texto, href },
    contatoTitulo, redesTitulo, topo, marca, copyright,
    legais[]{ _key, texto, href }
  }
`;

const CHROME_CONFIG = /* groq */ `
  email, whatsapp, instagram, linkedin, telefoneRodape
`;

const CONSULTA = defineQuery(/* groq */ `{
  "pagina": *[_type == "pagina" && language == $idioma][0]{
    seo,
    ${CHROME_PAGINA},
    hero{ titulo, aparte, link, foto ${IMAGEM} },
    manifesto{ chamada, paragrafos },
    clientesRotulo,
    historia{ titulo, texto, fotoAlt, materiaFormato, materiaChamada, foto ${IMAGEM} },
    socios[]{
      _key, nome, destaque, paragrafos, cor, imagemPrimeiro, foto ${IMAGEM},
      apresentacao
    },
    areas{ rotulo, grupos[]{ _key, titulo, itens[]{ _key, titulo, descricao } } },
    faleConosco{ rotulo, titulo, atendimento },
    formulario{ titulo, campos, enviar, estados }
  },
  "config": *[_id == "configuracoes"][0]{
    ${CHROME_CONFIG},
    endereco, cnpj, oab,
    telefonePrincipal,
    clientes[]{ _key, nome, largura, ajusteOptico, logo ${IMAGEM} },
    materia{
      veiculo, paginas,
      logo ${IMAGEM},
      "arquivo": arquivo.asset->url
    },
    // O nome do arquivo vem junto porque a CDN da Sanity é outro domínio, e o
    // atributo 'download' do HTML é ignorado entre domínios: quem força o
    // download lá é o '?dl=' da própria URL.
    apresentacao{
      "arquivo": arquivo.asset->url,
      "nomeArquivo": arquivo.asset->originalFilename
    },
    formulario
  }
}`);

export async function buscarConteudo(idioma: string) {
  const dados = await sanity.fetch(CONSULTA, { idioma });

  if (!dados?.pagina) {
    throw new Error(
      `Não há documento "pagina" com language == "${idioma}" no Sanity. ` +
        `Crie-o no Studio (npm run studio) antes de publicar esta rota.`,
    );
  }
  if (!dados?.config) {
    throw new Error('Não há documento "configuracoes" no Sanity. Rode `npm run migrar`.');
  }

  return dados;
}

export type Conteudo = Awaited<ReturnType<typeof buscarConteudo>>;
export type Pagina = Conteudo['pagina'];
export type Config = Conteudo['config'];

/*
 * --- As páginas legais ---
 *
 * Política de privacidade e, quando chegar a vez dela, termos de uso. Elas não
 * são a one page: não têm hero, camada, parallax nem seção nenhuma da lista
 * acima. O que compartilham com ela é só o alto e o pé — e é exatamente isso
 * que os dois fragmentos `CHROME_*` trazem.
 *
 * Por isso a consulta é OUTRA, e não a de cima com campos a mais: buscar os 36
 * logos de clientes, as fotos dos sócios e o PDF da apresentação para desenhar
 * uma página de texto corrido seria pagar a one page inteira por uma página que
 * não mostra nada disso.
 *
 * O `$id` segue `legal-<chave>-<idioma>` — a convenção que a estrutura do Studio
 * escreve do outro lado (`studio/estrutura.ts`). É a única amarra entre os dois
 * repositórios, e é de propósito que ela seja uma string previsível: assim a
 * rota pede o documento pelo nome, sem depender de slug nem de ordem.
 */
const CONSULTA_LEGAL = defineQuery(/* groq */ `{
  "legal": *[_id == $id][0]{ seo, titulo, atualizadoEm, corpo },
  "pagina": *[_type == "pagina" && language == $idioma][0]{ ${CHROME_PAGINA} },
  "config": *[_id == "configuracoes"][0]{ ${CHROME_CONFIG} }
}`);

export async function buscarLegal(chave: string, idioma: string) {
  const id = `legal-${chave}-${idioma}`;
  const dados = await sanity.fetch(CONSULTA_LEGAL, { id, idioma });

  /*
   * Erro, e não uma página vazia: o build lê SÓ documento publicado, então a
   * causa quase certa é rascunho não publicado — e uma página legal publicada
   * em branco é pior que build vermelho. O rodapé já aponta para ela.
   */
  if (!dados?.legal) {
    throw new Error(
      `Não há documento "paginaLegal" com _id == "${id}" PUBLICADO no Sanity. ` +
        `Se ele existe como rascunho, publique-o no Studio (npm run studio) — ` +
        `o build não enxerga "drafts.*".`,
    );
  }
  if (!dados?.pagina) {
    throw new Error(
      `Não há documento "pagina" com language == "${idioma}" no Sanity, e as ` +
        `páginas legais reaproveitam o cabeçalho e o rodapé dele.`,
    );
  }
  if (!dados?.config) {
    throw new Error('Não há documento "configuracoes" no Sanity.');
  }

  return dados;
}

export type ConteudoLegal = Awaited<ReturnType<typeof buscarLegal>>;
export type Legal = ConteudoLegal['legal'];
