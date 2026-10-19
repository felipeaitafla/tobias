/*
 * O conteúdo da landing de postos de combustível (`/postos-de-combustivel/`).
 *
 * PROVISÓRIO, e contra a regra do projeto — que é "o Sanity é a fonte de tudo".
 * Decisão de 2026-10-08: a página fecha com o texto aqui, e a migração para o
 * Studio vem depois, de uma vez, quando a estrutura parar de mudar. Por isso o
 * arquivo já tem o formato de uma projeção GROQ (`_key` em toda lista): quando
 * a origem mudar, os componentes recebem as mesmas props e não mudam.
 *
 * Origem do texto: `copy-tobias-postos.md`, com três tipos de desvio —
 *
 *   - onde o FIGMA reescreveu a copy (hero e credenciais), vale o Figma, que é a
 *     revisão mais recente. O único desvio do próprio arquivo é o espaço depois
 *     dos dois-pontos do título, que lá está colado ("combustível:Prepare");
 *   - o prazo do relatório é **15 dias** em todo lugar. A copy dizia "24 horas"
 *     no CTA final e na última pergunta do FAQ, contra os 15 dias do passo a
 *     passo; o cliente confirmou 15 (2026-10-08);
 *   - os chapéus estão em caixa de frase ("IBS, CBS e o novo modelo
 *     tributário"), e não na caixa de título da copy — a mesma correção que o
 *     Figma fez no título do hero e que o cliente pediu no resto do site em
 *     2026-08-06.
 */

/*
 * As capas dos artigos, do Pexels (2026-10-08; licença livre, sem crédito
 * obrigatório). Recortadas em 16:9 e reduzidas a 1600px antes de entrar aqui —
 * os originais tinham de 5 a 8 MB. Escolhidas sem texto legível e sem nada de
 * fora do Brasil (preço em dólar, formulário americano), que é o que eliminou
 * quase todas as outras candidatas:
 *
 *   - o-que-muda: bicos de abastecimento, Engin Akyurt (pexels.com/photo/12377480);
 *   - creditos: notas de R$ 100, Daniel Dan (pexels.com/photo/7542641);
 *   - preparar: posto Ipiranga numa rua de cidade, com etanol e gasolina em
 *     reais, Marcio Skull (Pexels, publicada em 2021-09-15; o link da página
 *     não foi achado). Foi o cliente quem escolheu e mandou o arquivo
 *     (`posto.jpg`, na raiz, 6720×4480). Trocada em 2026-10-15, junto com o
 *     título — a anterior, de caixas de seleção, prometia um checklist que o
 *     artigo não tem. É a exceção às duas regras acima, por escolha dele: tem
 *     texto legível e tem marca de distribuidora. As placas dos quatro carros
 *     foram borradas aqui.
 */
import capaOQueMuda from '../assets/fotos/artigos/o-que-muda.jpg';
import capaCreditos from '../assets/fotos/artigos/creditos.jpg';
import capaPreparar from '../assets/fotos/artigos/preparar.jpg';

export const postos = {
  seo: {
    titulo: 'Reforma tributária para postos de combustível | Tobias Advogados',
    descricao:
      'Análise de documentos fiscais e estrutura societária para adequar seu posto às novas regras do IBS e da CBS.',
  },

  /*
   * Os quatro itens do header (#352:206) — e do rodapé, que usa a mesma lista
   * (pedido do cliente, 2026-10-08), como a one page faz com a dela desde
   * 2026-08-06.
   */
  navegacao: [
    { _key: 'reforma', texto: 'A Reforma', href: '#a-reforma' },
    { _key: 'como-funciona', texto: 'Como funciona', href: '#como-funciona' },
    { _key: 'sobre', texto: 'Sobre', href: '#sobre' },
    { _key: 'contato', texto: 'Contato', href: '#contato' },
  ],

  /*
   * Só no rodapé, à frente da `navegacao` (pedido do cliente, 2026-10-15): o
   * header já leva ao topo pela marca. `#topo` é o `<main>` da landing; nos
   * artigos ele ganha o caminho na frente, como os outros itens.
   */
  inicio: { _key: 'inicio', texto: 'Início', href: '#topo' },

  /*
   * O "Agendar diagnóstico" — o mesmo botão no hero e no CTA final.
   *
   * O destino é uma agenda online (decisão de 2026-10-08), e o link ainda não
   * existe. Enquanto `url` for `null`, os dois botões caem no WhatsApp do
   * escritório com a `mensagem` abaixo — funcionam, em vez de ir a lugar
   * nenhum. Quando o link chegar, é preencher `url` aqui e mais nada.
   */
  agendar: {
    texto: 'Agendar diagnóstico',
    url: null as string | null,
    /* Diz de onde a pessoa veio: sem ela, a conversa começa igual à de quem
       clicou no header da one page, e ninguém sabe que é um posto. */
    mensagem: 'Olá! Gostaria de agendar o diagnóstico tributário do meu posto.',
  },

  hero: {
    /* Duas partes porque o peso muda NO MEIO da frase (#352:190): o fim é o
       único trecho em Bold. É o que seria Portable Text com um `strong` no
       Sanity. */
    titulo: {
      texto: 'Reforma tributária para postos de combustível: Prepare seu negócio',
      destaque: 'antes de comprometer sua margem.',
    },
    /* O inverso do título: aqui o trecho em Bold é o COMEÇO (#352:192). */
    resumo: {
      destaque: 'Análise de documentos fiscais e estrutura societária',
      texto: 'para adequar seu posto às novas regras do IBS e da CBS.',
    },
    /*
     * A pílula embaixo do resumo (#373:164). A foto vem do Sanity (a mesma do
     * "Quem conduz"); o texto, daqui.
     *
     * O número da OAB passa a viver em TRÊS lugares: aqui, no
     * `rodape.copyright` da `pagina` e em `configuracoes.oab` (que nenhum
     * componente renderiza — ver "Bloqueios de lançamento" no AGENTS.md).
     * O campo do Studio não serve para esta linha: é prosa ("OAB/RS sob o nº
     * 61.313"), e mora em `configuracoes`, junto do CNPJ do escritório.
     */
    autor: {
      nome: 'Thiago Tobias',
      registro: 'OAB/RS 61.313',
    },
    saibaMais: 'Saiba mais',
    fotoAlt: 'Pista de um posto de combustível iluminada à noite.',
  },

  credenciais: {
    rotulo: 'Credenciais',
    /* A ordem é pedido do cliente (2026-10-08), e não a do arquivo — que põe o
       "Advogado e especialista" por último (#352:226). */
    itens: [
      {
        _key: 'advogado',
        titulo: 'Advogado e especialista',
        texto: 'Planejamento tributário e gestão empresarial, focado em comércio varejista de combustíveis.',
      },
      {
        _key: 'desde-2006',
        titulo: 'Desde 2006',
        texto: 'Assessoria jurídica tributária e fiscal para empresas.',
      },
      {
        _key: 'palestrante',
        titulo: 'Palestrante',
        texto: 'Realiza palestras sobre temas fiscais e tributários para o setor.',
      },
      {
        _key: 'relatorio',
        titulo: 'Relatório completo',
        texto: 'Utilização de tecnologia na análise de dados fiscais e da operação.',
      },
    ],
  },

  reforma: {
    rotulo: 'IBS, CBS e o novo modelo tributário',
    titulo: 'Entenda o que a reforma tributária muda no seu posto',
    texto:
      'A venda na bomba continua no regime monofásico, sem gerar débito na saída. Mas, no novo modelo do IVA Dual, isso faz do posto um credor estrutural de CBS: a operação acumula créditos sobre energia, aluguéis, juros, fretes, taxas de processamento, entre outros — créditos que, sem gestão ativa, ficam parados.',
  },

  perdas: {
    /* "Deixe"/"Passe", no imperativo, e não o infinitivo da copy — pedido do
       cliente (2026-10-08), nos dois chapéus do par. */
    rotulo: 'Deixe de perder',
    titulo: 'Onde o posto perde dinheiro sem perceber',
    itens: [
      {
        _key: 'regime',
        icone: 'bifurcacao',
        titulo: 'Escolha do regime',
        texto:
          'Lojas do Simples Nacional precisam decidir se continuam no recolhimento unificado ou se passam a apurar IBS e CBS pelo regime regular. No unificado, os custos da operação, como energia, aluguel e frete, não geram crédito. Quem não faz a opção no prazo continua no unificado, e a escolha pode ser revista nas janelas seguintes.',
      },
      {
        _key: 'cadastro',
        icone: 'etiqueta',
        titulo: 'Cadastro fiscal',
        texto:
          'Dentro do mesmo posto, combustível, lubrificantes, e itens da conveniência têm tratamentos tributários diferentes. Se o código de Classificação Tributária estiver errado, a nota sai com tributação errada, e nota errada é pagamento a maior ou autuação.',
      },
      {
        _key: 'notas',
        icone: 'tela-codigo',
        titulo: 'Notas e sistema',
        texto:
          'A apuração passa a ser feita a partir do XML das notas. Se o sistema admite nota errada, o crédito do posto trava. Nas vendas para empresas, como transportadoras e frotas, o problema dobra: o cliente depende da sua nota para tomar o crédito dele.',
      },
    ],
  },

  ganhos: {
    rotulo: 'Passe a ganhar',
    titulo: 'O que a reforma abre de oportunidade para o posto',
    itens: [
      {
        _key: 'compensacao',
        icone: 'troca',
        titulo: 'Compensação dentro do posto',
        texto:
          'A venda na bomba não gera débito, mas a conveniência e a troca de óleo geram. Com a apuração bem organizada, os créditos acumulados na pista abatem os débitos dessas atividades, e o dinheiro fica no caixa.',
      },
      {
        _key: 'ressarcimento',
        icone: 'reembolso',
        titulo: 'Ressarcimento mais rápido',
        texto:
          'O crédito que sobra pode ser devolvido em dinheiro. Para empresas aderentes ao Programa Nacional de Conformidade Tributária (PNCT), o prazo é de 30 dias. Fora dele, varia de 60 a 180 dias.',
      },
      {
        _key: 'contratos',
        icone: 'contrato',
        titulo: 'Contratos e estrutura societária',
        texto:
          'A forma como o posto contrata muda o crédito que ele gera. Frete contratado de terceiros gera crédito, mas frete embutido no preço do combustível não gera. Operações como vender um imóvel e alugá-lo de volta (sale and leaseback) agora transformam custo em crédito.',
      },
      {
        _key: 'investimentos',
        icone: 'bomba-combustivel',
        titulo: 'Investimentos',
        texto:
          'Bombas, equipamentos e outros bens do ativo permanente geram crédito integral de CBS no mesmo mês da compra.',
      },
    ],
  },

  passos: {
    rotulo: 'Passo a passo',
    titulo: 'Como funciona o diagnóstico tributário do seu posto',
    /* O número sai do título ("1. Agende…" na copy) e vira campo próprio: na
       tela ele é um degrau acima do título, não parte dele, e numa lista `<ol>`
       o leitor de tela já anuncia a posição. */
    itens: [
      {
        _key: 'agende',
        numero: '01',
        titulo: 'Agende o diagnóstico',
        texto:
          'Uma conversa com o Tobias sobre a operação do posto. Ele faz as perguntas certas e mostra o que o relatório vai cobrir.',
      },
      {
        _key: 'envie',
        numero: '02',
        titulo: 'Envie os documentos',
        texto:
          'Se decidir seguir, você envia arquivos fiscais e documentos da empresa.',
      },
      {
        _key: 'analise',
        numero: '03',
        titulo: 'Análise em até 15 dias',
        texto:
          'Os dados passam pelo sistema de análise do escritório que cruza notas, cadastro e estrutura societária.',
      },
      {
        _key: 'relatorio',
        numero: '04',
        titulo: 'Receba o relatório',
        texto:
          'Um relatório detalhado mostrando o que o posto precisa corrigir e onde tem crédito a usar. A decisão do que fazer é sua, sem compromisso de contratações adicionais.',
      },
    ],
  },

  sobre: {
    rotulo: 'Quem conduz',
    titulo: 'Thiago Tobias, advogado tributarista, especialista no setor de combustíveis',
    paragrafos: [
      'Thiago atua há 20 anos nas questões tributárias do setor de combustíveis, tanto na tributação federal, quanto estadual. Sobre a Reforma Tributária, tem estudado os impactos da transição para o IBS e CBS na revenda, assim como tem levado aos revendedores análises práticas de grande valor.',
      'Trabalha com pragmatismo e honestidade intelectual, sobretudo quando enxerga oportunidades no planejamento tributário.',
      'Formado pela Universidade Católica de Pernambuco e especialista em Gestão Empresarial, assessora empresários na transformação de cenários caóticos em estruturas sólidas, integrando decisões jurídicas e econômicas sob uma ótica realista.',
    ],
  },

  cta: {
    rotulo: 'Seu próximo passo',
    titulo: 'Prepare seu posto para a reforma com quem conhece o setor',
    texto:
      'Na conversa de diagnóstico, o Tobias entende a operação do seu posto e mostra o que o relatório vai cobrir. Se fizer sentido, você envia os documentos e recebe o relatório em até 15 dias.',
  },

  artigos: {
    rotulo: 'Para se aprofundar',
    titulo: 'Reforma tributária no posto, explicada em detalhe',
    /*
     * O "Ler artigo" nasce desativado (decisão de 2026-10-08) e acende sozinho
     * quando o artigo existe em `src/content/artigos/` com o `cartao` igual ao
     * `_key` daqui: o `href` é derivado em `src/lib/artigos.ts`, e o `null`
     * abaixo não precisa ser mexido. O primeiro (`o-que-muda`) saiu em
     * 2026-10-15.
     */
    itens: [
      {
        _key: 'o-que-muda',
        capa: capaOQueMuda,
        titulo: 'O que muda para postos de combustível com a reforma tributária',
        texto:
          'Combustível monofásico, conveniência na regra geral e créditos de CBS: como os dois regimes convivem dentro do mesmo posto.',
        acao: { detalhe: 'Por Thiago Tobias', texto: 'Ler artigo', href: null as string | null },
      },
      {
        _key: 'creditos',
        capa: capaCreditos,
        titulo: 'Quais créditos o posto tem, e não tem, na reforma tributária',
        texto:
          'O que o STJ decidiu sobre PIS e Cofins, de onde vem o crédito de CBS e como transformar o saldo acumulado em dinheiro.',
        acao: { detalhe: 'Por Thiago Tobias', texto: 'Ler artigo', href: null as string | null },
      },
      {
        _key: 'preparar',
        capa: capaPreparar,
        titulo: 'Como preparar seu posto para a reforma tributária: as decisões antes da virada',
        texto:
          'Escolha do regime, cadastro fiscal, sistema e notas: o que revisar na operação para não perder crédito nem gerar autuação.',
        acao: { detalhe: 'Por Thiago Tobias', texto: 'Ler artigo', href: null as string | null },
      },
    ],
  },

  perguntas: {
    rotulo: 'Perguntas frequentes',
    titulo: 'Dúvidas sobre a reforma tributária nos postos',
    /* Também alimentam o `FAQPage` do JSON-LD (ver `grafoPostos`): pergunta e
       resposta saem daqui para a página e para o buscador, sem segunda cópia. */
    itens: [
      {
        _key: 'o-que-muda',
        pergunta: 'O que muda para postos de combustível com a reforma tributária?',
        resposta:
          'A venda de combustível continua monofásica: o imposto é cobrado uma única vez, no início da cadeia. O que muda é o resto da operação. Energia, aluguel, frete e outros custos passam a gerar crédito de CBS e IBS, e a conveniência e a troca de óleo seguem a regra geral. O posto passa a conviver com os dois regimes ao mesmo tempo.',
      },
      {
        _key: 'monofasico',
        pergunta: 'O combustível continua monofásico com o IBS e a CBS?',
        resposta:
          'Sim. A Lei Complementar 214/2025 manteve a tributação monofásica para os combustíveis: o IBS e a CBS são recolhidos uma única vez, por produtores, refinarias e importadores, com alíquota por litro. Na revenda, o posto não recolhe esses tributos de novo. Lubrificantes ficam fora desse regime e seguem a regra geral.',
      },
      {
        _key: 'credito',
        pergunta: 'Posto de combustível tem direito a crédito de IBS e CBS?',
        resposta:
          'Sim, mas não sobre o combustível comprado para revenda. O crédito vem dos custos da operação: energia, aluguel, juros, frete, taxas de cartão e compra de equipamentos, entre outros. Como a venda na bomba não gera débito, esses créditos tendem a se acumular. Por isso o posto passa a ser um credor estrutural de CBS.',
      },
      {
        _key: 'pis-cofins',
        pergunta: 'Posto pode recuperar PIS e Cofins na compra de combustível?',
        resposta:
          'Não. O STJ decidiu, no Tema 1.339, que o comerciante varejista sujeito ao regime monofásico não tem direito a crédito de PIS e Cofins na compra de combustível. Ofertas de recuperação desse crédito devem ser vistas com cautela. Na reforma, a oportunidade real está nos créditos de CBS sobre os custos da operação.',
      },
      {
        _key: 'credito-acumulado',
        pergunta: 'O que fazer com o crédito que o posto acumula e não consegue usar?',
        resposta:
          'Primeiro, usá-lo para abater o imposto da conveniência e da troca de óleo, que geram débito. O que sobrar pode ser pedido de volta em dinheiro. Para empresas aderentes ao Programa Nacional de Conformidade Tributária (PNCT), o prazo é de 30 dias. Fora dele, varia de 60 a 180 dias.',
      },
      {
        _key: 'simples',
        pergunta: 'Conveniência no Simples deve optar pelo regime regular de IBS e CBS?',
        resposta:
          'Depende da operação. No recolhimento unificado do Simples, os custos da loja não geram crédito. No regime regular, geram, mas a apuração fica mais complexa. A conta envolve o volume de custos, o mix de produtos e o perfil dos clientes. A opção é feita em prazos definidos pela Receita e, depois de feita, não volta atrás.',
      },
      {
        _key: 'advogado-contador',
        pergunta: 'Preciso de advogado ou só do contador para preparar o posto para a reforma tributária?',
        resposta:
          'Os dois trabalhos se completam. O contador cuida da apuração e da escrituração. O advogado tributarista entra nas decisões com efeito jurídico: a escolha do regime, a estrutura societária, os contratos que geram ou travam crédito e a defesa em caso de autuação.',
      },
      {
        _key: 'diagnostico',
        pergunta: 'O que é um diagnóstico tributário para posto de combustível?',
        resposta:
          'É uma análise da operação do posto diante da reforma. Começa com uma conversa com um especialista. Se fizer sentido seguir, o posto envia arquivos fiscais e informações da empresa, e em até 15 dias recebe um relatório com o que precisa corrigir e onde tem crédito a usar.',
      },
    ],
  },
};

export type Postos = typeof postos;
