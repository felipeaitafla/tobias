/*
 * Formulário de contato: manda o que a pessoa escreveu para o escritório, sem
 * passar pelo FormSubmit.
 *
 * Mesmo desenho de `servidor/apresentacao.ts` — TEXTO fixo (o assunto vem do
 * Sanity, mas o corpo do e-mail é montado aqui, nunca com HTML que o
 * navegador mandou pronto) e nada de terceiro gratuito guardando dado de
 * quem procura advogado.
 *
 * A lógica mora aqui, sozinha, e cada hospedagem entra por um arquivo de
 * poucas linhas (`api/` na Vercel, `netlify/functions/` na Netlify).
 */

const SANITY = 'https://b4ibcfka.api.sanity.io/v2024-01-01/data/query/production';

/* Mesma variável de ambiente do bloco da apresentação — é o mesmo domínio
   verificado no Resend, então é o mesmo remetente. */
const REMETENTE = process.env.EMAIL_REMETENTE ?? '';
const CHAVE = process.env.RESEND_API_KEY ?? '';

/* Freio de mão contra abuso — mesmo número de `servidor/apresentacao.ts`. */
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

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const escapar = (t: string) =>
  t
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export interface Pedido {
  nome?: unknown;
  email?: unknown;
  telefone?: unknown;
  area?: unknown;
  caso?: unknown;
}

export interface Resultado {
  status: number;
  corpo: { ok: boolean; erro?: string };
}

export async function enviarContato(pedido: Pedido, ip: string): Promise<Resultado> {
  const nome = typeof pedido?.nome === 'string' ? pedido.nome.trim() : '';
  const email = typeof pedido?.email === 'string' ? pedido.email.trim() : '';
  const caso = typeof pedido?.caso === 'string' ? pedido.caso.trim() : '';
  const telefone = typeof pedido?.telefone === 'string' ? pedido.telefone.trim() : '';
  const area = typeof pedido?.area === 'string' ? pedido.area.trim() : '';

  /* Nome, e-mail e caso são obrigatórios no formulário (ver Formulario.astro);
     telefone e área não são — o servidor repete a mesma regra do HTML. */
  if (!nome || !EMAIL.test(email) || !caso) {
    return { status: 400, corpo: { ok: false, erro: 'campos' } };
  }

  if (excedeu(ip)) return { status: 429, corpo: { ok: false, erro: 'limite' } };

  if (!CHAVE || !REMETENTE) {
    return { status: 503, corpo: { ok: false, erro: 'configuracao' } };
  }

  const config = await buscarConfig();
  if (!config?.destino || !config?.assunto) {
    return { status: 503, corpo: { ok: false, erro: 'configuracao' } };
  }

  try {
    await enviar({
      para: config.destino,
      assunto: config.assunto,
      html: montarEmail({ nome, email, telefone, area, caso }),
      /* Quem recebe responde direto para quem preencheu — sem copiar e-mail
         de dentro do corpo. */
      responderPara: email,
    });
  } catch (erro) {
    console.error('[contato] envio falhou:', erro);
    return { status: 502, corpo: { ok: false, erro: 'envio' } };
  }

  return { status: 200, corpo: { ok: true } };
}

/* O dataset é público, então ler não pede token. */
async function buscarConfig() {
  const consulta = `*[_id == "configuracoes"][0]{ "destino": formulario.destino, "assunto": formulario.assunto }`;
  const url = `${SANITY}?query=${encodeURIComponent(consulta)}`;
  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error(`Sanity respondeu ${resposta.status}`);
  return (await resposta.json()).result as { destino?: string; assunto?: string };
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

/* HTML de e-mail, mesma restrição de `servidor/apresentacao.ts`: tabela,
   estilo em atributo, nenhuma imagem. */
function montarEmail(dados: {
  nome: string;
  email: string;
  telefone: string;
  area: string;
  caso: string;
}) {
  const linha = (rotulo: string, valor: string) =>
    `<tr>
      <td style="padding:4px 12px 4px 0;font:700 14px/1.5 Helvetica,Arial,sans-serif;color:#000000;white-space:nowrap;vertical-align:top">${escapar(
        rotulo,
      )}</td>
      <td style="padding:4px 0;font:400 14px/1.5 Helvetica,Arial,sans-serif;color:#000000">${escapar(
        valor || '—',
      )}</td>
    </tr>`;

  return `<!doctype html>
<html lang="pt-BR"><body style="margin:0;padding:24px;background:#eef6f4">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff">
  <tr><td style="padding:40px">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      ${linha('Nome', dados.nome)}
      ${linha('E-mail', dados.email)}
      ${linha('Telefone', dados.telefone)}
      ${linha('Área', dados.area)}
    </table>
    <p style="margin:16px 0 0;font:400 14px/1.5 Helvetica,Arial,sans-serif;color:#000000;white-space:pre-wrap">${escapar(
      dados.caso,
    )}</p>
  </td></tr>
</table>
</body></html>`;
}
