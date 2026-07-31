/*
 * Porta da Vercel. A Vercel serve qualquer arquivo de `api/` como função, sem
 * adaptador do Astro e sem mexer na saída estática do site — que é exatamente o
 * que se quer aqui: o `dist/` continua um monte de arquivo parado.
 *
 * A regra inteira mora em `servidor/apresentacao.ts`. Isto aqui só traduz o
 * formato do pedido.
 */
import { pedirApresentacao } from '../servidor/apresentacao';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, erro: 'metodo' });
    return;
  }

  /* A Vercel já entrega JSON pronto quando o `Content-Type` diz JSON; a string
     é o caso de quem mandou sem cabeçalho. */
  const corpo = typeof req.body === 'string' ? seguroJSON(req.body) : (req.body ?? {});

  /* Atrás do proxy da hospedagem, `remoteAddress` é o proxy. Quem tem o IP de
     verdade é o primeiro nome do `x-forwarded-for`. */
  const ip =
    String(req.headers['x-forwarded-for'] ?? '')
      .split(',')[0]
      .trim() ||
    req.socket?.remoteAddress ||
    'desconhecido';

  const { status, corpo: resposta } = await pedirApresentacao(corpo, ip);
  res.status(status).json(resposta);
}

function seguroJSON(texto: string) {
  try {
    return JSON.parse(texto);
  } catch {
    return {};
  }
}
