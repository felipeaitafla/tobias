import { CogIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

/*
 * O que NÃO muda de idioma.
 *
 * Esta é a divisa que sustenta o i18n inteiro: traduzir a página duplica o
 * documento, e sem esta separação os 36 logos de clientes seriam duplicados
 * junto — trabalho repetido para o cliente e duas listas para sair de sincronia.
 *
 * A regra para decidir onde um campo mora: se a resposta em inglês seria
 * *exatamente* a mesma, é aqui. Endereço, telefone, CNPJ e logo de cliente são
 * daqui. Já "Seg a Sex" e o nome acessível do mapa são texto, e moram na
 * `pagina`, mesmo parecendo dado de contato.
 */
export const configuracoes = defineType({
  name: 'configuracoes',
  title: 'Configurações',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'contato', title: 'Contato', default: true },
    { name: 'clientes', title: 'Clientes' },
    { name: 'documentos', title: 'Documentos' },
    { name: 'formulario', title: 'Formulário' },
  ],
  fields: [
    // --- Contato ---
    defineField({
      name: 'email',
      title: 'E-mail',
      type: 'string',
      group: 'contato',
      validation: (r) => r.required().email(),
    }),
    defineField({
      name: 'telefonePrincipal',
      title: 'Telefone do card de contato',
      type: 'telefone',
      group: 'contato',
      description:
        'ATENÇÃO: o Figma traz dois números diferentes, este e o do rodapé. Enquanto o cliente não disser qual é o certo, os dois seguem como estão no arquivo.',
    }),
    defineField({
      name: 'telefoneRodape',
      title: 'Telefone do rodapé',
      type: 'telefone',
      group: 'contato',
    }),
    defineField({
      name: 'endereco',
      title: 'Endereço',
      type: 'text',
      rows: 2,
      group: 'contato',
      description:
        'Frase única — a quebra em duas linhas é a largura da coluna, não conteúdo. Não quebre à mão.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'mapaEmbed',
      title: 'Mapa (URL do embed do Google Maps)',
      type: 'url',
      group: 'contato',
      description:
        'Compartilhar › Incorporar um mapa, no perfil do escritório. Só a URL do `src` do iframe. Captura de tela do Maps fere os termos de uso do Google — por isso é embed.',
      validation: (r) =>
        r.required().uri({ scheme: ['https'] }).custom((url) =>
          !url || String(url).includes('google.com/maps/embed')
            ? true
            : 'Precisa ser uma URL de embed do Google Maps (google.com/maps/embed?pb=…)',
        ),
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp (URL)',
      type: 'url',
      group: 'contato',
      description: 'TODO antes do lançamento: hoje é URL de exemplo.',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram (URL)',
      type: 'url',
      group: 'contato',
      description: 'TODO antes do lançamento: hoje é URL de exemplo.',
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn (URL)',
      type: 'url',
      group: 'contato',
      description: 'TODO antes do lançamento: hoje é URL de exemplo.',
    }),
    defineField({
      name: 'cnpj',
      title: 'CNPJ',
      type: 'string',
      group: 'contato',
    }),
    defineField({
      name: 'oab',
      title: 'Inscrição OAB',
      type: 'string',
      group: 'contato',
      description: 'TODO antes do lançamento: `OAB/RS 00.000` é marcador do designer.',
    }),

    // --- Clientes ---
    defineField({
      name: 'clientes',
      title: 'Logos de clientes',
      type: 'array',
      group: 'clientes',
      of: [defineArrayMember({ type: 'cliente' })],
      description:
        'Lista única, na ordem em que aparecem. A passagem fatia de 9 em 9 sozinha: o 37º cliente cria um quinto grupo e uma quinta divisória sem ninguém mexer em código.',
      validation: (r) => r.min(1),
    }),

    // --- Matéria do Valor ---
    defineField({
      name: 'materia',
      title: 'Matéria na imprensa',
      type: 'object',
      group: 'documentos',
      description:
        'Fica aqui, e não na página traduzida, porque a matéria é do Valor Econômico e continua em português na versão inglesa.',
      fields: [
        defineField({ name: 'veiculo', title: 'Veículo', type: 'string' }),
        defineField({
          name: 'chamada',
          title: 'Chamada',
          type: 'string',
          description:
            'Como saiu no jornal. Use aspas curvas e hífen normal — o texto do site do jornal vem com espaços incolapsáveis e hífen invisível.',
        }),
        defineField({
          name: 'logo',
          title: 'Logo do veículo (versão branca)',
          type: 'image',
          description: 'Aparece sobre a faixa preta, então precisa ser a versão clara.',
        }),
        defineField({
          name: 'arquivo',
          title: 'PDF da matéria',
          type: 'file',
          options: { accept: 'application/pdf' },
        }),
        defineField({
          name: 'paginas',
          title: 'Número de páginas',
          type: 'number',
          description: 'Entra no aviso lido por leitor de tela.',
          validation: (r) => r.integer().positive(),
        }),
      ],
    }),

    // --- Apresentação institucional ---
    defineField({
      name: 'apresentacao',
      title: 'Apresentação institucional',
      type: 'object',
      group: 'documentos',
      description:
        'O PDF que o bloco da faixa do Thiago entrega. Fica aqui, e não na página traduzida, porque é o mesmo arquivo nos dois idiomas — o texto do bloco é que mora em Página › Sobre › Sócios. Os pedidos chegam no MESMO endereço do formulário (aba Formulário): um destino só para não haver dois para trocar no lançamento.',
      fields: [
        defineField({
          name: 'arquivo',
          title: 'PDF da apresentação',
          type: 'file',
          options: { accept: 'application/pdf' },
          description:
            'Sem arquivo, o bloco não aparece na página. ATENÇÃO ao peso: o que está no ar tem 63 MB, e quem baixar do celular paga por isso — vale pedir uma versão comprimida antes do lançamento.',
        }),
      ],
    }),

    // --- Envio do formulário ---
    defineField({
      name: 'formulario',
      title: 'Envio do formulário',
      type: 'object',
      group: 'formulario',
      description:
        'ATENÇÃO antes do lançamento: o destino é endereço de teste do desenvolvedor, e passar dado de quem procura advogado por um terceiro gratuito é decisão de LGPD, não de código.',
      fields: [
        defineField({
          name: 'destino',
          title: 'E-mail de destino',
          type: 'string',
          validation: (r) => r.email(),
        }),
        defineField({
          name: 'endpoint',
          title: 'Endpoint',
          type: 'url',
          description: 'Trocar de provedor é trocar esta string: o script só faz POST de JSON.',
        }),
        defineField({ name: 'assunto', title: 'Assunto do e-mail', type: 'string' }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Configurações', subtitle: 'Dados que não mudam de idioma' }),
  },
});
