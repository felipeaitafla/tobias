import type { APIRoute } from 'astro';

/*
 * Endpoint, e não arquivo em `public/`, só para a linha do sitemap sair do
 * `site` do `astro.config.mjs` — o domínio já mudou uma vez.
 *
 * Cada robô de busca e de IA ganha a PRÓPRIA diretiva: robô que encontra o nome
 * dele no arquivo ignora o bloco `*`, então liberar só no `*` deixa a decisão
 * implícita para quem lê. Hoje todos estão liberados, inclusive os que coletam
 * para treino (GPTBot, ClaudeBot). Para barrar só o treino sem sair da busca, é
 * trocar `Allow: /` por `Disallow: /` nesses dois — os de busca (OAI-SearchBot,
 * Claude-SearchBot, PerplexityBot) e os que buscam a pedido do usuário
 * (ChatGPT-User) são outros nomes e continuam de fora da troca.
 */
const ROBOS = [
  'Googlebot',
  'Bingbot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'GPTBot',
  'Claude-SearchBot',
  'ClaudeBot',
  'PerplexityBot',
  '*',
];

export const GET: APIRoute = ({ site }) => {
  const blocos = ROBOS.map((robo) => `User-agent: ${robo}\nAllow: /`).join('\n\n');
  const texto = `${blocos}\n\nSitemap: ${new URL('/sitemap.xml', site).href}\n`;

  return new Response(texto, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
