import { DocumentTextIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { IDIOMAS } from '../idiomas';

/*
 * As páginas de texto corrido que o rodapé aponta: política de privacidade e,
 * quando chegar a vez dela, termos de uso.
 *
 * Por que documento próprio, e não mais um campo dentro de `pagina`: a `pagina`
 * é a one page inteira, e o editor já a percorre por grupos (Topo, Sobre,
 * Áreas…). Enfiar duas peças jurídicas de trinta parágrafos ali dentro
 * misturaria duas coisas com ritmo de edição completamente diferente — o
 * manifesto muda quando o designer pede, a política muda quando a lei ou o
 * tratamento de dados mudam, e quem mexe numa raramente é quem mexe na outra.
 *
 * Os ids são fixos e seguem `legal-<chave>-<idioma>` — `legal-privacidade-pt-BR`,
 * `legal-termos-en`. É o mesmo padrão de singleton localizado da `pagina`
 * (`pagina-pt-BR`), e é o que deixa a rota do site pedir o documento pelo nome
 * em vez de depender de slug, ordem ou de um campo que o editor pode apagar.
 * A outra ponta dessa convenção é `buscarLegal()`, em `src/lib/conteudo.ts`:
 * mudar o formato aqui sem mudar lá tira a página do ar.
 *
 * ATENÇÃO ao criar a segunda: o build do Astro lê SÓ documento publicado. Uma
 * rota nova apontando para um documento em rascunho não dá 404 elegante, dá
 * build vermelho. Publique primeiro, crie a rota depois.
 */
export const paginaLegal = defineType({
  name: 'paginaLegal',
  title: 'Página legal',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    /* Gerido pelo @sanity/document-internationalization — quem troca isto é o
       seletor de idioma, não o editor. */
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),

    defineField({
      name: 'seo',
      title: 'Busca e compartilhamento',
      type: 'object',
      fields: [
        defineField({
          name: 'titulo',
          title: 'Título da aba',
          type: 'string',
          validation: (r) => r.required().max(65).warning('Acima de ~65 o Google corta.'),
        }),
        defineField({
          name: 'descricao',
          title: 'Descrição',
          type: 'text',
          rows: 3,
          validation: (r) => r.required().max(160).warning('Acima de ~160 o Google corta.'),
        }),
      ],
    }),

    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      description: 'O título grande no alto da página. É o único `h1` dela — no texto, comece em Seção.',
      validation: (r) => r.required(),
    }),

    /*
     * A data não é enfeite: um documento de privacidade sem data não diz ao
     * titular qual versão ele está lendo, e é a primeira coisa que se procura
     * ao comparar com o que foi aceito. Vale a pena mexer nela SEMPRE que o
     * texto mudar — por isso fica logo abaixo do título, e não escondida.
     */
    defineField({
      name: 'atualizadoEm',
      title: 'Última atualização',
      type: 'date',
      options: { dateFormat: 'DD/MM/YYYY' },
      description:
        'Aparece embaixo do título. Atualize sempre que mudar o texto: é por esta data que alguém sabe se está lendo a versão que aceitou.',
      validation: (r) => r.required(),
    }),

    defineField({
      name: 'corpo',
      title: 'Texto',
      type: 'textoLegal',
      validation: (r) => r.required(),
    }),
  ],

  preview: {
    select: { titulo: 'titulo', language: 'language', atualizadoEm: 'atualizadoEm' },
    prepare: ({ titulo, language, atualizadoEm }) => {
      const idioma = IDIOMAS.find((i) => i.id === language);
      return {
        title: idioma ? `${titulo ?? 'Sem título'} (${idioma.title})` : (titulo ?? 'Sem título'),
        subtitle: atualizadoEm ? `Atualizada em ${atualizadoEm}` : 'sem data',
      };
    },
  },
});
