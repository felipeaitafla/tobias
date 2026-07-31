/*
 * Pedido da apresentação institucional: registra o lead e manda o link para
 * quem preencheu.
 *
 * Por que existe uma função, e não mais um POST para o FormSubmit: aqui o
 * e-mail sai do domínio do escritório, em HTML, e o endereço de quem visita não
 * passa por terceiro nenhum — que é a decisão de LGPD que o formulário ainda
 * tem pendente. Quando ele migrar, é este arquivo que ele reaproveita.
 *
 * A lógica mora aqui, sozinha, e cada hospedagem entra por um arquivo de cinco
 * linhas (`api/` na Vercel, `netlify/functions/` na Netlify). Nada aqui conhece
 * `req`, `res` ou `Request`: entra um objeto, sai um objeto. É o que deixa
 * trocar de hospedagem sem reescrever regra — e testar sem subir servidor.
 *
 * O TEXTO NUNCA VEM DO NAVEGADOR. Assunto, corpo e link são buscados no Sanity
 * aqui dentro: quem pede só diz o e-mail e o idioma. Sem isso, qualquer um
 * escreveria o que quisesse num e-mail assinado pelo domínio do escritório.
 */

const SANITY = 'https://b4ibcfka.api.sanity.io/v2024-01-01/data/query/production';

/* O e-mail sai deste endereço, e ele tem que ser de um domínio verificado no
   provedor de envio — por isso é variável de ambiente, e não campo do Studio:
   trocá-lo sem verificar o domínio faz TODO envio passar a falhar. */
const REMETENTE = process.env.EMAIL_REMETENTE ?? '';
const CHAVE = process.env.RESEND_API_KEY ?? '';

/*
 * Freio de mão contra abuso: o endpoint manda e-mail para o endereço que
 * receber, então sem nada ele vira máquina de spam assinada pelo escritório.
 *
 * É memória do processo, não banco: numa hospedagem serverless cada instância
 * tem a sua, e uma instância nova começa zerada. Segura o script bobo, não um
 * ataque distribuído — para isso, o dia em que doer, é o WAF da hospedagem.
 */
const JANELA = 60 * 60 * 1000;
const TETO = 5;
const historico = new Map<string, number[]>();

function excedeu(ip: string) {
  const agora = Date.now();
  const recentes = (historico.get(ip) ?? []).filter((t) => agora - t < JANELA);
  recentes.push(agora);
  historico.set(ip, recentes);
  return recentes.length > TETO;
}

/* O mesmo formato que o `type="email"` do navegador cobra, para o servidor não
   recusar o que o campo aceitou (nem o contrário). */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const escapar = (t: string) =>
  t
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export interface Pedido {
  email?: unknown;
  idioma?: unknown;
  /* Campo-armadilha: fica escondido no formulário, então gente não preenche.
     Robô preenche tudo que encontra. */
  assunto?: unknown;
}

export interface Resultado {
  status: number;
  corpo: { ok: boolean; erro?: string };
}

export async function pedirApresentacao(pedido: Pedido, ip: string): Promise<Resultado> {
  if (typeof pedido?.assunto === 'string' && pedido.assunto !== '') {
    /* Robô: responde 200 para ele não aprender que a armadilha existe, e não
       manda nada. */
    return { status: 200, corpo: { ok: true } };
  }

  const email = typeof pedido?.email === 'string' ? pedido.email.trim() : '';
  if (!EMAIL.test(email)) return { status: 400, corpo: { ok: false, erro: 'email' } };

  const idioma = pedido?.idioma === 'en' ? 'en' : 'pt-BR';

  if (excedeu(ip)) return { status: 429, corpo: { ok: false, erro: 'limite' } };

  if (!CHAVE || !REMETENTE) {
    /* Sem chave não há envio — e mentir que houve é pior que falhar. O bloco
       trata isso como falha de envio, e o download acontece do mesmo jeito. */
    return { status: 503, corpo: { ok: false, erro: 'configuracao' } };
  }

  const conteudo = await buscarConteudo(idioma);
  if (!conteudo?.arquivo || !conteudo?.texto?.assunto) {
    return { status: 503, corpo: { ok: false, erro: 'conteudo' } };
  }

  const link = `${conteudo.arquivo}?dl=${encodeURIComponent(conteudo.nomeArquivo ?? '')}`;

  const envios = await Promise.allSettled([
    enviar({
      para: email,
      assunto: conteudo.texto.assunto,
      html: paraQuemPediu(conteudo.texto, link),
    }),
    /* O aviso do escritório é interno: ninguém de fora lê, então ele mora no
       código e não no Studio. Se o destino não estiver preenchido, o pedido de
       quem visita continua valendo — só o escritório fica sem o aviso. */
    conteudo.destino
      ? enviar({
          para: conteudo.destino,
          assunto: `Apresentação institucional pedida por ${email}`,
          html: paraOEscritorio(email, idioma),
          responderPara: email,
        })
      : Promise.resolve(),
  ]);

  /* Só o primeiro decide o resultado: quem está esperando é quem preencheu. O
     aviso interno que falhou vira log, não erro na tela de ninguém. */
  if (envios[0].status === 'rejected') {
    console.error('[apresentacao] envio falhou:', envios[0].reason);
    return { status: 502, corpo: { ok: false, erro: 'envio' } };
  }
  if (envios[1].status === 'rejected') {
    console.error('[apresentacao] aviso interno falhou:', envios[1].reason);
  }

  return { status: 200, corpo: { ok: true } };
}

/*
 * O dataset é público, então ler não pede token — a mesma razão pela qual o
 * build do site não tem credencial nenhuma.
 */
async function buscarConteudo(idioma: string) {
  const consulta = `{
    "arquivo": *[_id == "configuracoes"][0].apresentacao.arquivo.asset->url,
    "nomeArquivo": *[_id == "configuracoes"][0].apresentacao.arquivo.asset->originalFilename,
    "destino": *[_id == "configuracoes"][0].formulario.destino,
    "escritorio": *[_id == "configuracoes"][0].email,
    "texto": *[_type == "pagina" && language == $idioma][0]
      .socios[defined(apresentacao.titulo)][0].apresentacao.email
  }`;

  const url = `${SANITY}?query=${encodeURIComponent(consulta)}&$idioma=${encodeURIComponent(
    JSON.stringify(idioma),
  )}`;

  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error(`Sanity respondeu ${resposta.status}`);
  return (await resposta.json()).result as {
    arquivo?: string;
    nomeArquivo?: string;
    destino?: string;
    escritorio?: string;
    texto?: { assunto?: string; texto?: string; botao?: string };
  };
}

async function enviar(carta: {
  para: string;
  assunto: string;
  html: string;
  responderPara?: string;
}) {
  const resposta = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${CHAVE}` },
    body: JSON.stringify({
      from: REMETENTE,
      to: [carta.para],
      subject: carta.assunto,
      html: carta.html,
      ...(carta.responderPara ? { reply_to: carta.responderPara } : {}),
    }),
  });
  if (!resposta.ok) throw new Error(`${resposta.status} ${await resposta.text()}`);
}

/*
 * HTML de e-mail é outro planeta: cliente de e-mail não tem folha externa, não
 * tem flex confiável e o Outlook ignora metade do que sobra. Por isso é tabela,
 * estilo em atributo e nenhuma imagem — as cores são as mesmas do site, escritas
 * à mão porque `var()` não chega até aqui.
 */
function paraQuemPediu(texto: { texto?: string; botao?: string }, link: string) {
  const paragrafos = (texto.texto ?? '')
    .split(/\n{2,}/)
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font:400 16px/1.5 Helvetica,Arial,sans-serif;color:#000000">${escapar(
          p,
        ).replace(/\n/g, '<br>')}</p>`,
    )
    .join('');

  return `<!doctype html>
<html lang="pt-BR"><body style="margin:0;padding:24px;background:#eef6f4">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff">
  <tr><td style="padding:40px">
    ${paragrafos}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="background:#000000">
        <a href="${escapar(link)}" style="display:inline-block;padding:16px 24px;font:400 16px/1.1 Helvetica,Arial,sans-serif;color:#ffffff;text-decoration:none">${escapar(
          texto.botao ?? 'Baixar',
        )}</a>
      </td>
    </tr></table>
  </td></tr>
</table>
</body></html>`;
}

function paraOEscritorio(email: string, idioma: string) {
  return `<p style="font:400 16px/1.5 Helvetica,Arial,sans-serif">
    Pediram a apresentação institucional.<br>
    <strong>E-mail:</strong> ${escapar(email)}<br>
    <strong>Idioma da página:</strong> ${escapar(idioma)}<br>
    <strong>Quando:</strong> ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
  </p>`;
}
