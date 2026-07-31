/*
 * Porta da Netlify. Existe para a escolha de hospedagem continuar em aberto: a
 * regra é a mesma de `servidor/apresentacao.ts`, e o que muda entre as duas é
 * só o formato do pedido — aqui é `Request`/`Response` do padrão web.
 *
 * O caminho público é `/api/apresentacao` nas duas, e quem faz isso na Netlify
 * é o redirecionamento do `netlify.toml`.
 */
import { pedirApresentacao } from '../../servidor/apresentacao';

export default async (request: Request, contexto: { ip?: string }) => {
  if (request.method !== 'POST') {
    return Response.json({ ok: false, erro: 'metodo' }, { status: 405 });
  }

  const corpo = await request.json().catch(() => ({}));
  const ip =
    contexto?.ip ||
    (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() ||
    'desconhecido';

  const { status, corpo: resposta } = await pedirApresentacao(corpo, ip);
  return Response.json(resposta, { status });
};
