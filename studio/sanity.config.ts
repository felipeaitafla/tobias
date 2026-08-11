import { documentInternationalization } from '@sanity/document-internationalization';
import { visionTool } from '@sanity/vision';
import { defineConfig, type Template } from 'sanity';
import { structureTool } from 'sanity/structure';
import { estrutura } from './estrutura';
import { IDIOMAS } from './idiomas';
import { schemaTypes } from './schemaTypes';

/*
 * Studio da Tobias Advogados.
 *
 * Mora em pasta própria, e não embutido no Astro em `/admin`: o `@sanity/astro`
 * arrasta React, react-dom, styled-components e o `sanity` inteiro como peers,
 * num site cuja identidade é "sem framework de UI". A própria documentação da
 * Sanity recomenda publicar o Studio separado, e em saída estática embutir ainda
 * exige regra de reescrita na hospedagem para `/admin/*` não dar 404 ao
 * recarregar. Aqui o React fica todo deste lado da divisa.
 *
 * Publicar: `npm run deploy` (vira tobias.sanity.studio).
 */
export default defineConfig({
  name: 'tobias',
  title: 'Tobias Advogados',

  projectId: 'b4ibcfka',
  dataset: 'production',

  plugins: [
    structureTool({ structure: estrutura }),

    /*
     * Internacionalização NO NÍVEL DO DOCUMENTO: cada idioma é um documento
     * inteiro, não um campo com várias versões dentro.
     *
     * É a escolha certa para uma página: o cliente publica o português sem
     * esperar a tradução, e as duas versões podem divergir em ordem e ênfase sem
     * uma atropelar a outra. Campo a campo faria sentido se fosse catálogo —
     * produto, pessoa, lugar —, onde os idiomas compartilham estrutura.
     *
     * `configuracoes` NÃO entra aqui: é o que não muda de idioma.
     */
    documentInternationalization({
      supportedLanguages: IDIOMAS.map((i) => ({ id: i.id, title: i.title })),
      schemaTypes: ['pagina', 'paginaLegal'],
    }),

    visionTool(),
  ],

  schema: { types: schemaTypes },

  /*
   * Sem isto o menu "Criar novo" ofereceria "Página" solta, sem idioma — e um
   * documento sem `language` fica invisível para a consulta do site e para o
   * seletor de tradução. Cada idioma ganha um template que já nasce marcado.
   *
   * "Página legal" não ganha template nenhum e some do menu de vez: os ids dela
   * são fixos (`legal-privacidade-pt-BR`) e quem os cria é a estrutura, ao abrir
   * a entrada. Um documento criado pelo menu nasceria com id aleatório, e a rota
   * do site — que pede o documento pelo nome — nunca o encontraria.
   */
  document: {
    newDocumentOptions: (anteriores) =>
      anteriores.filter(
        (item) => item.templateId !== 'pagina' && item.templateId !== 'paginaLegal',
      ),
  },
  templates: (anteriores: Template[]): Template[] => [
    ...anteriores,
    ...IDIOMAS.map((idioma) => ({
      id: `pagina-${idioma.id}`,
      title: `Página (${idioma.title})`,
      schemaType: 'pagina',
      value: { language: idioma.id },
    })),
  ],
});
