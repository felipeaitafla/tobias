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

const CONSULTA = defineQuery(/* groq */ `{
  "pagina": *[_type == "pagina" && language == $idioma][0]{
    seo,
    navegacao[]{ _key, texto, href },
    whatsappTexto,
    hero{ titulo, aparte, link, foto ${IMAGEM} },
    manifesto{ chamada, paragrafos },
    clientesRotulo,
    historia{ titulo, texto, fotoAlt, materiaFormato, foto ${IMAGEM} },
    socios[]{
      _key, nome, destaque, paragrafos, cor, imagemPrimeiro, foto ${IMAGEM},
      apresentacao
    },
    areas{ rotulo, grupos[]{ _key, titulo, itens[]{ _key, titulo, descricao } } },
    faleConosco{ rotulo, titulo, atendimento, mapaTitulo },
    formulario{ titulo, eixos, campos, enviar, estados },
    rodape{
      navegacao[]{ _key, texto, href },
      contatoTitulo, redesTitulo, topo, marca, copyright,
      legais[]{ _key, texto, href }
    }
  },
  "config": *[_id == "configuracoes"][0]{
    email, endereco, mapaEmbed, whatsapp, instagram, linkedin, cnpj, oab,
    telefonePrincipal, telefoneRodape,
    clientes[]{ _key, nome, largura, ajusteOptico, logo ${IMAGEM} },
    materia{
      veiculo, chamada, paginas,
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
