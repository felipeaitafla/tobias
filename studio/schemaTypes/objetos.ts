import { defineArrayMember, defineField, defineType } from 'sanity';

/*
 * Objetos reaproveitados por mais de um documento, ou grandes o bastante para
 * atrapalhar a leitura do documento que os usa.
 */

/* Um número aparece de duas formas: como se lê e como se disca. Derivar uma da
   outra dá errado (o +55 some, o 0 do DDD sobra), então são dois campos. */
export const telefone = defineType({
  name: 'telefone',
  title: 'Telefone',
  type: 'object',
  fields: [
    defineField({
      name: 'texto',
      title: 'Como aparece',
      type: 'string',
      description: 'Ex.: 51 3076 3466',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'href',
      title: 'Como disca',
      type: 'string',
      description: 'Formato E.164, com o +55 e sem espaços. Ex.: +555130763466',
      validation: (r) =>
        r.required().regex(/^\+[1-9]\d{6,14}$/, { name: 'E.164' }).error(
          'Precisa começar com + e ter só dígitos depois. Ex.: +555130763466',
        ),
    }),
  ],
  preview: { select: { title: 'texto', subtitle: 'href' } },
});

export const cliente = defineType({
  name: 'cliente',
  title: 'Cliente',
  type: 'object',
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'nome',
      title: 'Nome da empresa',
      type: 'string',
      description: 'Vira o texto alternativo do logo. Nome de empresa não se traduz.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'largura',
      title: 'Largura (rem)',
      type: 'number',
      description:
        'Tamanho óptico dentro da célula. Cuidado: é a largura do ARQUIVO, e vários logos vêm com margem transparente enorme — o Araupel tem 1000×600 de arquivo para 772×126 de desenho. A regra usada foi pôr a TINTA em 56px de altura com teto de 168px de largura, e converter de volta pela razão entre as duas caixas.',
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: 'ajusteOptico',
      title: 'Ajuste óptico',
      type: 'string',
      description:
        'Raro. Só quando o logo parece descentrado apesar de estar no centro da célula. Formato: `-0.319rem, -0.271rem`.',
    }),
  ],
  preview: {
    select: { title: 'nome', subtitle: 'largura', media: 'logo' },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: subtitle ? `${subtitle}rem` : 'sem largura',
      media,
    }),
  },
});

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({ name: 'texto', title: 'Texto', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'href',
      title: 'Destino',
      type: 'string',
      description: 'Âncora da própria página (`#historia`) ou caminho (`/termos-de-uso`).',
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: 'texto', subtitle: 'href' } },
});

export const socio = defineType({
  name: 'socio',
  title: 'Sócio',
  type: 'object',
  fields: [
    defineField({ name: 'nome', title: 'Nome', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'foto',
      title: 'Foto',
      type: 'image',
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'destaque',
      title: 'Frase de destaque',
      type: 'text',
      rows: 2,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'paragrafos',
      title: 'Parágrafos',
      type: 'array',
      of: [defineArrayMember({ type: 'text' })],
      validation: (r) => r.min(1),
    }),
    defineField({
      name: 'cor',
      title: 'Cor da faixa',
      type: 'string',
      options: {
        list: [
          { title: 'Petróleo', value: 'petroleo' },
          { title: 'Terracota', value: 'terracota' },
        ],
        layout: 'radio',
      },
      description: 'A cor é da marca, não escolha livre — o CSS casa por este valor.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'imagemPrimeiro',
      title: 'Lado da foto',
      type: 'string',
      options: {
        list: [
          { title: 'Foto à esquerda', value: 'sim' },
          { title: 'Foto à direita', value: 'nao' },
        ],
        layout: 'radio',
      },
      description: 'As faixas alternam: se as duas ficarem do mesmo lado, o desenho quebra.',
      validation: (r) => r.required(),
    }),
    /*
     * O bloco de download da apresentação (#212:78) mora na faixa do Thiago, e
     * é o TÍTULO que decide se ele aparece: sem título, não há bloco.
     *
     * Fica dentro do sócio, e não solto na página, porque é assim que o editor
     * enxerga a decisão — "esta faixa tem o bloco". Só o texto está aqui; o PDF
     * é o mesmo nos dois idiomas e mora em Configurações.
     */
    defineField({
      name: 'apresentacao',
      title: 'Bloco de download da apresentação',
      type: 'object',
      description:
        'Aparece na base desta faixa, sobre a coluna de texto. Deixe o título vazio para não mostrar o bloco. O PDF fica em Configurações › Documentos.',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: 'titulo',
          title: 'Chamada',
          type: 'string',
          description: 'Ex.: "Quer conhecer a Tobias a fundo?"',
        }),
        defineField({
          name: 'descricao',
          title: 'Descrição',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'campo',
          title: 'Rótulo do campo de e-mail',
          type: 'string',
          description:
            'Serve de placeholder E de `<label>` para o leitor de tela. O campo só aparece quando o ponteiro passa pelo bloco, e é ele que destrava o botão.',
        }),
        /* As três frases ocupam o LUGAR do campo, uma de cada vez — pedido do
           cliente. Por isso são curtas: elas vivem numa linha só. */
        defineField({
          name: 'estados',
          title: 'O que a linha do campo diz depois do clique',
          type: 'object',
          description: 'Cada uma toma o lugar do campo de e-mail enquanto vale.',
          fields: [
            defineField({ name: 'enviando', title: 'Enviando', type: 'string' }),
            defineField({
              name: 'sucesso',
              title: 'Deu certo',
              type: 'string',
              description: 'Ex.: "Download realizado, também enviamos para o seu e-mail."',
            }),
            defineField({
              name: 'falha',
              title: 'O e-mail não saiu',
              type: 'string',
              description:
                'O download acontece de qualquer jeito — esta frase fala só do e-mail. Use `{email}` para oferecer o endereço do escritório como saída.',
              validation: (r) =>
                r.custom((v) =>
                  !v || String(v).includes('{email}') ? true : 'Precisa conter `{email}`.',
                ),
            }),
          ],
        }),
        /*
         * O e-mail que chega para quem preencheu. Fica no Sanity, e não no
         * código da função, porque é texto que o cliente lê e diria "está
         * errado" — e porque muda de idioma junto com a página.
         *
         * A função busca isto sozinha no Sanity. NUNCA aceite este texto vindo
         * do navegador: quem manda o formulário escolheria o que sai assinado
         * pelo domínio do escritório.
         */
        defineField({
          name: 'email',
          title: 'E-mail que quem preencheu recebe',
          type: 'object',
          options: { collapsible: true, collapsed: true },
          fields: [
            defineField({ name: 'assunto', title: 'Assunto', type: 'string' }),
            defineField({
              name: 'texto',
              title: 'Texto',
              type: 'text',
              rows: 4,
              description: 'Uma linha em branco separa parágrafos. O link vai no botão, abaixo.',
            }),
            defineField({
              name: 'botao',
              title: 'Texto do botão do e-mail',
              type: 'string',
              description: 'Ex.: "Baixar a apresentação". O endereço é o do PDF em Configurações.',
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'nome', subtitle: 'destaque', media: 'foto' },
  },
});

export const areaAtuacao = defineType({
  name: 'areaAtuacao',
  title: 'Área de atuação',
  type: 'object',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'descricao',
      title: 'Descrição',
      type: 'text',
      rows: 4,
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: 'titulo', subtitle: 'descricao' } },
});

export const grupoAreas = defineType({
  name: 'grupoAreas',
  title: 'Grupo de áreas',
  type: 'object',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'itens',
      title: 'Áreas',
      type: 'array',
      of: [defineArrayMember({ type: 'areaAtuacao' })],
      description:
        'Grade de duas colunas. Com número ímpar, a célula que sobra recebe o símbolo da marca.',
      validation: (r) => r.min(1),
    }),
  ],
  preview: {
    select: { title: 'titulo', itens: 'itens' },
    prepare: ({ title, itens }) => ({ title, subtitle: `${itens?.length ?? 0} áreas` }),
  },
});

/*
 * O parágrafo do hero alterna peso no meio da frase. É Portable Text, e não uma
 * lista de `{texto, forte}`, porque negrito É marca dentro do texto — e porque na
 * tradução o trecho forte cai em outro lugar da frase, coisa que uma lista de
 * pedaços posicionais não acompanha.
 *
 * Só `strong`, e nenhum estilo de bloco: o desenho não prevê título nem lista
 * aqui, e oferecer isso ao cliente é convidar a quebrar a seção.
 */
export const textoComEnfase = defineType({
  name: 'textoComEnfase',
  title: 'Texto com ênfase',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{ title: 'Normal', value: 'normal' }],
      lists: [],
      marks: { decorators: [{ title: 'Forte', value: 'strong' }], annotations: [] },
    }),
  ],
});

/*
 * A chamada da matéria do Valor (#185:104) tem TRÊS pesos numa frase só, e por
 * isso não cabe no `textoComEnfase` acima:
 *
 *   "Representando o Sulpetro,"  → Medium 500, o estilo base do nó
 *   "Thiago Tobias Bezerra"      → negrito
 *   "colabora para reduzir…"     → Regular 400
 *
 * Os dois decoradores abaixo são os dois desvios em relação a esse base. O
 * arquivo escreve o nome em Bold ITÁLICO; o site não usa o itálico, por decisão
 * do cliente — ver o comentário de `.materia__nome` em `Sobre.astro` para a
 * medição que motivou isso.
 *
 * O `leve` é o mais fácil de perder numa edição futura, e o custo de perdê-lo é
 * pequeno (o trecho renderiza a 500 em vez de 400, ~2px numa linha de 320).
 * Conferido em pixel contra o render do nó antes de existir: sem ele a linha 2
 * sai 4,2px mais larga que o arquivo; com ele, 1,6px.
 */
export const chamadaMateria = defineType({
  name: 'chamadaMateria',
  title: 'Chamada da matéria',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{ title: 'Normal', value: 'normal' }],
      lists: [],
      marks: {
        decorators: [
          { title: 'Nome (negrito)', value: 'nome' },
          { title: 'Leve', value: 'leve' },
        ],
        annotations: [],
      },
    }),
  ],
});
