/*
 * Porta da Vercel. Ver `api/apresentacao.ts` — mesma ideia, outro arquivo de
 * regra (`servidor/contato.ts`).
 */
import { enviarContato } from '../servidor/contato';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, erro: 'metodo' });
    return;
  }

  const corpo = typeof req.body === 'string' ? seguroJSON(req.body) : (req.body ?? {});

  const ip =
    String(req.headers['x-forwarded-for'] ?? '')
      .split(',')[0]
      .trim() ||
    req.socket?.remoteAddress ||
    'desconhecido';

  const { status, corpo: resposta } = await enviarContato(corpo, ip);
  res.status(status).json(resposta);
}

function seguroJSON(texto: string) {
  try {
    return JSON.parse(texto);
  } catch {
    return {};
  }
}
