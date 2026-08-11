import { CogIcon, DocumentIcon, DocumentTextIcon } from '@sanity/icons';
import type { StructureResolver } from 'sanity/structure';
import { IDIOMAS } from './idiomas';

/*
 * As páginas legais que o rodapé aponta.
 *
 * A `chave` é metade do id do documento (`legal-<chave>-<idioma>`) e a outra
 * metade da rota do site — quem casa as duas é `buscarLegal()`, em
 * `src/lib/conteudo.ts`. Acrescentar os termos de uso aqui é uma linha, mas ela
 * só vale acompanhada: primeiro o documento publicado, depois a rota. O build
 * do Astro lê só documento publicado, e rota apontando para rascunho é build
 * vermelho, não 404.
 */
const PAGINAS_LEGAIS = [
  { chave: 'privacidade', title: 'Política de privacidade' },
  { chave: 'termos', title: 'Termos de uso' },
] as const;

/*
 * Três entradas e nada mais: "Página" (uma por idioma), "Páginas legais" e
 * "Configurações".
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

      S.listItem()
        .title('Páginas legais')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title('Páginas legais')
            .items(
              PAGINAS_LEGAIS.map((legal) =>
                S.listItem()
                  .id(legal.chave)
                  .title(legal.title)
                  .icon(DocumentTextIcon)
                  .child(
                    S.list()
                      .title(legal.title)
                      .items(
                        IDIOMAS.map((idioma) =>
                          S.listItem()
                            .id(`${legal.chave}-${idioma.id}`)
                            .title(idioma.title)
                            .icon(DocumentTextIcon)
                            .child(
                              S.document()
                                .schemaType('paginaLegal')
                                .documentId(`legal-${legal.chave}-${idioma.id}`)
                                .title(`${legal.title} (${idioma.title})`),
                            ),
                        ),
                      ),
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
