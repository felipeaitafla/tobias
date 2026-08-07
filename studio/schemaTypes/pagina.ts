import { DocumentIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { IDIOMAS } from '../idiomas';

/*
 * A página, um documento por idioma.
 *
 * Tudo aqui é TEXTO que muda de língua. O que não muda — telefone, endereço,
 * logos de clientes, PDF da matéria — mora em `configuracoes`, e é essa divisa
 * que faz traduzir custar uma tradução, e não uma recatalogação dos 36 logos.
 *
 * Os ids são fixos (`pagina-pt-BR`, `pagina-en`): é o padrão de singleton
 * localizado da documentação, e é o que deixa a consulta do site achar a página
 * pelo idioma sem depender de ordem ou de slug.
 *
 * NÃO existe campo com as opções do formulário: elas são as próprias áreas de
 * atuação, derivadas na consulta. Manter uma segunda lista foi exatamente o que
 * um dia pôs "Tributário" duas vezes no dropdown.
 */
export const pagina = defineType({
  name: 'pagina',
  title: 'Página',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    { name: 'topo', title: 'Topo', default: true },
    { name: 'sobre', title: 'Sobre' },
    { name: 'areas', title: 'Áreas' },
    { name: 'contato', title: 'Contato' },
    { name: 'rodape', title: 'Rodapé' },
  ],
  fields: [
    /* Gerido pelo @sanity/document-internationalization — quem troca isto é o
       seletor de idioma, não o editor. */
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),

    // --- Topo ---
    defineField({
      name: 'seo',
      title: 'Busca e compartilhamento',
      type: 'object',
      group: 'topo',
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
      name: 'navegacao',
      title: 'Menu do topo',
      type: 'array',
      group: 'topo',
      of: [defineArrayMember({ type: 'link' })],
    }),
    defineField({
      name: 'whatsappTexto',
      title: 'Texto do botão de WhatsApp',
      type: 'string',
      group: 'topo',
      description: 'A URL fica em Configurações; aqui é só o que se lê.',
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'topo',
      fields: [
        defineField({
          name: 'titulo',
          title: 'Título',
          type: 'text',
          rows: 3,
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'aparte',
          title: 'Parágrafo de apoio',
          type: 'textoComEnfase',
          description:
            'O negrito é do desenho: os trechos fortes são o que a frase quer que fique. Marque com Forte.',
        }),
        defineField({ name: 'link', title: 'Link', type: 'link' }),
        defineField({
          name: 'foto',
          title: 'Foto de fundo',
          type: 'image',
          options: { hotspot: true },
          description:
            'Ocupa a tela inteira atrás do título. É decorativa — não recebe texto alternativo, porque o título ao lado já diz o que a seção diz.',
        }),
      ],
    }),
    defineField({
      name: 'manifesto',
      title: 'Manifesto',
      type: 'object',
      group: 'topo',
      fields: [
        defineField({
          name: 'chamada',
          title: 'Chamada',
          type: 'text',
          rows: 2,
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'paragrafos',
          title: 'Parágrafos',
          type: 'array',
          of: [defineArrayMember({ type: 'text' })],
          description:
            'Texto simples de propósito: as quebras de linha do manifesto são desenho, e um editor de rich text convidaria a criar mais blocos do que a seção aguenta.',
          validation: (r) => r.min(1),
        }),
      ],
    }),
    defineField({
      name: 'clientesRotulo',
      title: 'Rótulo da parede de clientes',
      type: 'string',
      group: 'topo',
      description: 'Os logos ficam em Configurações — nome de empresa não se traduz.',
    }),

    // --- Sobre ---
    defineField({
      name: 'historia',
      title: 'História',
      type: 'object',
      group: 'sobre',
      fields: [
        defineField({
          name: 'titulo',
          title: 'Título',
          type: 'text',
          rows: 2,
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'texto',
          title: 'Texto',
          type: 'text',
          rows: 5,
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'foto',
          title: 'Foto',
          type: 'image',
          options: { hotspot: true },
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'fotoAlt',
          title: 'Texto alternativo da foto',
          type: 'string',
          description: 'Quem está na foto e o que ela mostra. Isto se traduz.',
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'materiaFormato',
          title: 'Aviso do formato da matéria',
          type: 'string',
          description:
            'Só o leitor de tela lê, antes do link da matéria. Use `{paginas}` para o número, que vem de Configurações. Ex.: "PDF, {paginas} páginas — abre em nova aba".',
          validation: (r) =>
            r.custom((v) =>
              !v || String(v).includes('{paginas}') ? true : 'Precisa conter `{paginas}`.',
            ),
        }),
        defineField({
          name: 'materiaChamada',
          title: 'Chamada da matéria',
          type: 'chamadaMateria',
          description:
            'A frase da faixa preta, sobre a matéria do Valor. Use aspas curvas e hífen normal — o texto do site do jornal vem com espaços incolapsáveis e hífen invisível. ' +
            'Marque o nome do sócio com "Nome" e o trecho depois dele com "Leve": é o que o desenho pede. ' +
            'Cuidado com o comprimento: a faixa é desenhada para DUAS linhas, e uma frase mais longa a faz crescer.',
        }),
      ],
    }),
    defineField({
      name: 'socios',
      title: 'Sócios',
      type: 'array',
      group: 'sobre',
      of: [defineArrayMember({ type: 'socio' })],
    }),

    // --- Áreas ---
    defineField({
      name: 'areas',
      title: 'Áreas de atuação',
      type: 'object',
      group: 'areas',
      fields: [
        defineField({ name: 'rotulo', title: 'Rótulo da seção', type: 'string' }),
        defineField({
          name: 'grupos',
          title: 'Grupos',
          type: 'array',
          of: [defineArrayMember({ type: 'grupoAreas' })],
          description:
            'A faixa verde da divisória entra ENTRE o primeiro e o segundo grupo. Estes títulos e áreas também alimentam o dropdown do formulário.',
          validation: (r) => r.min(1),
        }),
      ],
    }),

    // --- Contato ---
    defineField({
      name: 'faleConosco',
      title: 'Fale conosco',
      type: 'object',
      group: 'contato',
      fields: [
        defineField({ name: 'rotulo', title: 'Rótulo da seção', type: 'string' }),
        defineField({ name: 'titulo', title: 'Título', type: 'string' }),
        defineField({
          name: 'atendimento',
          title: 'Horário de atendimento',
          type: 'array',
          of: [defineArrayMember({ type: 'string' })],
          description: 'Uma linha por item. Ex.: "Seg a Sex" e "9h - 18h". Isto se traduz.',
        }),
      ],
    }),
    defineField({
      name: 'formulario',
      title: 'Formulário',
      type: 'object',
      group: 'contato',
      fields: [
        defineField({ name: 'titulo', title: 'Título', type: 'string' }),
        defineField({
          name: 'campos',
          title: 'Rótulos dos campos',
          type: 'object',
          description:
            'Servem de placeholder E de `<label>` para o leitor de tela — placeholder some quando a pessoa digita.',
          fields: [
            defineField({ name: 'nome', title: 'Nome', type: 'string' }),
            defineField({ name: 'telefone', title: 'Telefone', type: 'string' }),
            defineField({ name: 'email', title: 'E-mail', type: 'string' }),
            defineField({ name: 'area', title: 'Área de atuação', type: 'string' }),
            defineField({ name: 'caso', title: 'Mensagem', type: 'string' }),
          ],
        }),
        defineField({ name: 'enviar', title: 'Texto do botão', type: 'string' }),
        defineField({
          name: 'estados',
          title: 'Faixas de estado',
          type: 'object',
          fields: [
            defineField({ name: 'enviando', title: 'Enviando', type: 'string' }),
            defineField({ name: 'sucesso', title: 'Sucesso', type: 'text', rows: 2 }),
            defineField({
              name: 'erro',
              title: 'Campo inválido',
              type: 'text',
              rows: 2,
              description: 'Use `{campo}` onde entra o nome do campo que barrou.',
              validation: (r) =>
                r.custom((v) =>
                  !v || String(v).includes('{campo}') ? true : 'Precisa conter `{campo}`.',
                ),
            }),
            defineField({
              name: 'falha',
              title: 'Falha no envio',
              type: 'text',
              rows: 2,
              description:
                'Rede fora ou serviço fora. Use `{email}` para oferecer o endereço como saída.',
              validation: (r) =>
                r.custom((v) =>
                  !v || String(v).includes('{email}') ? true : 'Precisa conter `{email}`.',
                ),
            }),
          ],
        }),
      ],
    }),

    // --- Rodapé ---
    defineField({
      name: 'rodape',
      title: 'Rodapé',
      type: 'object',
      group: 'rodape',
      fields: [
        defineField({
          name: 'navegacao',
          title: 'Navegação',
          type: 'array',
          of: [defineArrayMember({ type: 'link' })],
          description: 'Não é a mesma do topo: tem lista e ordem próprias.',
        }),
        defineField({ name: 'contatoTitulo', title: 'Título da coluna de contato', type: 'string' }),
        defineField({ name: 'redesTitulo', title: 'Título da coluna de redes', type: 'string' }),
        defineField({ name: 'topo', title: 'Texto do "Voltar ao topo"', type: 'string' }),
        defineField({
          name: 'marca',
          title: 'Nome da marca',
          type: 'string',
          description: 'Texto alternativo da assinatura gigante.',
        }),
        defineField({
          name: 'copyright',
          title: 'Copyright',
          type: 'text',
          rows: 3,
          description:
            'A quebra de linha é do desenho — são duas frases. CNPJ e OAB vêm de Configurações; escreva-os aqui como devem aparecer.',
        }),
        defineField({
          name: 'legais',
          title: 'Links legais',
          type: 'array',
          of: [defineArrayMember({ type: 'link' })],
        }),
      ],
    }),
  ],
  preview: {
    select: { language: 'language', titulo: 'seo.titulo' },
    prepare: ({ language, titulo }) => {
      const idioma = IDIOMAS.find((i) => i.id === language);
      return {
        title: idioma ? `Página (${idioma.title})` : 'Página',
        subtitle: titulo ?? 'sem título',
      };
    },
  },
});
