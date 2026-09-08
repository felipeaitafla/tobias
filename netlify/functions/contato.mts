/*
 * Porta da Netlify. Ver `netlify/functions/apresentacao.mts` — mesma ideia,
 * outro arquivo de regra (`servidor/contato.ts`). O caminho público é
 * `/api/contato`, e quem faz isso na Netlify é o redirecionamento do
 * `netlify.toml`.
 */
import { enviarContato } from '../../servidor/contato';

export default async (request: Request, contexto: { ip?: string }) => {
  if (request.method !== 'POST') {
    return Response.json({ ok: false, erro: 'metodo' }, { status: 405 });
  }

  const corpo = await request.json().catch(() => ({}));
  const ip =
    contexto?.ip ||
    (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() ||
    'desconhecido';

  const { status, corpo: resposta } = await enviarContato(corpo, ip);
  return Response.json(resposta, { status });
};
