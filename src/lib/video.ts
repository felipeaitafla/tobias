/*
 * Os vídeos de fundo dos dois heros (o da one page e o da landing de postos) só
 * começam a baixar DEPOIS que a página carregou (2026-11-26, SEO).
 *
 * Com `autoplay`, o vídeo (2 MB no celular) disputava banda com as fontes e a
 * imagem do topo desde o primeiro instante, e quem pediu sem movimento o baixava
 * do mesmo jeito, só para ele ficar escondido. Não há como adiar isso no HTML:
 * `autoplay` passa por cima do `preload="none"`.
 *
 * O preço é que sem JS o vídeo não toca — fica a foto, que já está por baixo.
 */
export function tocarDepoisDaCarga(seletor: string) {
  // Com movimento reduzido o CSS esconde o vídeo: não há por que baixá-lo.
  if (!matchMedia('(prefers-reduced-motion: no-preference)').matches) return;

  const videos = [...document.querySelectorAll<HTMLVideoElement>(seletor)];

  const tocar = () => {
    if (document.hidden) return;
    // Recusa do navegador (modo de economia de energia): fica a foto.
    videos.forEach((video) => video.paused && video.play().catch(() => {}));
  };

  const iniciar = () => {
    tocar();
    // Quem abriu a página numa aba de fundo só a vê depois.
    document.addEventListener('visibilitychange', tocar);
  };

  if (document.readyState === 'complete') iniciar();
  else addEventListener('load', iniciar, { once: true });
}
