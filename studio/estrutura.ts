import { CogIcon, DocumentIcon } from '@sanity/icons';
import type { StructureResolver } from 'sanity/structure';
import { IDIOMAS } from './idiomas';

/*
 * Duas entradas e nada mais: "Página" (uma por idioma) e "Configurações".
 *
 * Sem isto o Studio mostraria a lista genérica "Página" com um botão de criar —
 * e um site de uma página só não tem o que criar. Cada idioma aponta para um id
 * fixo, que é o padrão de singleton localizado: o documento existe ou é criado
 * naquele id, nunca em duplicata.
 */
export const estrutura: StructureResolver = (S) =>
  S.list()
    .title('Conteúdo')
    .items([
      S.listItem()
        .title('Página')
        .icon(DocumentIcon)
        .child(
          S.list()
            .title('Página por idioma')
            .items(
              IDIOMAS.map((idioma) =>
                S.listItem()
                  .id(idioma.id)
                  .title(idioma.title)
                  .icon(DocumentIcon)
                  .child(
                    S.document()
                      .schemaType('pagina')
                      .documentId(`pagina-${idioma.id}`)
                      .title(`Página (${idioma.title})`),
                  ),
              ),
            ),
        ),

      S.divider(),

      S.listItem()
        .title('Configurações')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('configuracoes')
            .documentId('configuracoes')
            .title('Configurações'),
        ),
    ]);
