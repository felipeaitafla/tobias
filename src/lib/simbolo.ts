/*
 * Aciona a montagem do símbolo (src/styles/simbolo.css) na primeira vez que
 * ele aparece na tela — compartilhado porque o manifesto e o fim de cada
 * grupo das Áreas de atuação usam exatamente o mesmo comportamento. Duas
 * cópias divergiriam na primeira vez que alguém acertasse uma só, do mesmo
 * jeito que a montagem em si já é folha de CSS comum.
 *
 * `seletor` pode casar com mais de um elemento — as Áreas chegam a ter dois
 * `.grupo__simbolo` ao mesmo tempo, um por grupo com número ímpar de itens —
 * e cada um ganha o próprio observador, independente dos outros.
 */
const PRONTA = 'simbolo-monta--pronta';
const MONTANDO = 'simbolo-monta--montando';

export function montarSimboloAoAparecer(seletor: string) {
  // Sem observador não há quem tire a classe `--pronta` depois: melhor nunca
  // fechar o símbolo do que fechá-lo sem promessa de reabrir.
  if (!('IntersectionObserver' in window)) return;

  // Com movimento reduzido nenhuma das duas classes anima nada (ver
  // simbolo.css) — pelo mesmo motivo, o script nem entra em cena, e o símbolo
  // fica no estado final de sempre, sem depender do observador para chegar lá.
  if (!matchMedia('(prefers-reduced-motion: no-preference)').matches) return;

  document.querySelectorAll<SVGElement>(seletor).forEach((simbolo) => {
    // Fecha ASSIM QUE O SCRIPT RODA, não quando a seção aparece: é o que
    // evita o símbolo nascer montado e piscar para fechado no instante em
    // que o observador dispara. Quem chega rolando até aqui já encontra o
    // quadro 0 pronto.
    simbolo.classList.add(PRONTA);

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        observador.disconnect();
        simbolo.classList.remove(PRONTA);
        simbolo.classList.add(MONTANDO);

        /*
         * A classe de montagem sai no fim, do mesmo jeito que no hover: se
         * ficasse, as barras congelariam com a mesma animação aplicada (parada
         * no último quadro) e o `:hover` não teria o que reiniciar — o
         * navegador só recomeça quando as propriedades da animação mudam.
         */
        const barras = simbolo.querySelectorAll('polygon').length;
        let terminadas = 0;
        simbolo.addEventListener('animationend', () => {
          if (++terminadas >= barras) simbolo.classList.remove(MONTANDO);
        });
      },
      // O símbolo inteiro na tela: ele é pequeno, e assim ninguém vê a
      // montagem acontecendo cortada na borda.
      { threshold: 1 },
    );

    observador.observe(simbolo);
  });
}
