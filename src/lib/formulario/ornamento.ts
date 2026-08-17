/*
 * O ornamento acompanha o ponteiro — pedido do cliente, 2026-07-31: "um
 * movimento pesado, que se mova um pouco, mas permanecendo naquela região".
 *
 * Sétima exceção ao "sem JS", e o critério é o de sempre: não existe em CSS
 * (nenhuma propriedade lê a posição do ponteiro fora do elemento sob ele), e
 * sem o script a página continua inteira — o desvio nasce zero e o ornamento
 * fica exatamente onde o Figma o desenha.
 *
 * PESADO é o ponto, e ele mora em dois números: a amplitude é pequena (16px
 * de desvio máximo, contra os 713 de largura da figura) e o λ é baixo, então
 * a figura chega ao alvo devagar e sempre atrás do ponteiro. Amplitude maior
 * ou λ alto viram "elemento grudado no mouse", que é o oposto de peso.
 *
 * Fica dentro da região porque o desvio é limitado E porque a seção já tem
 * `overflow: hidden` — o ornamento sangra por baixo dela de propósito.
 */
export function iniciarOrnamentoFormulario() {
  const secao = document.querySelector<HTMLElement>('.formulario');
  const ornamento = secao?.querySelector<HTMLElement>('.formulario__elemento');
  const fino = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* No toque não há ponteiro para seguir, e com movimento reduzido a figura
     simplesmente não se move. Nos dois casos o CSS já basta. */
  if (secao && ornamento && fino && !calmo) {
    /*
     * 44px de desvio máximo — eram 16, e o cliente pediu mais expressivo no
     * mesmo dia. Continua pequeno perto dos 713 de largura da figura, e o
     * `overflow` da seção segue cortando o que passar da região.
     */
    const AMPLITUDE = 44;
    /* λ do amortecimento, e é ELE o peso: 2.5 leva ~1,2s para assentar. Ficou
       onde estava de propósito — a amplitude é que subiu. Acima de ~8 a
       figura cola no ponteiro, que é o oposto do que foi pedido. */
    const LAMBDA = 2.5;
    /* Abaixo de meio pixel ninguém enxerga, e o laço pode dormir. */
    const REPOUSO = 0.5;

    let alvoX = 0;
    let alvoY = 0;
    let x = 0;
    let y = 0;
    let ultimoT = 0;
    let laco = 0;
    let visivel = false;

    const quadro = (agora: number) => {
      const dt = ultimoT ? Math.min((agora - ultimoT) / 1000, 0.05) : 1 / 60;
      ultimoT = agora;

      /* `damp` e não passo fixo: independente de frame rate, e é a mesma
         conta da esteira da divisória. */
      const passo = 1 - Math.exp(-LAMBDA * dt);
      x += (alvoX - x) * passo;
      y += (alvoY - y) * passo;

      ornamento.style.setProperty('--ornamento-x', `${x.toFixed(2)}px`);
      ornamento.style.setProperty('--ornamento-y', `${y.toFixed(2)}px`);

      if (visivel && (Math.abs(alvoX - x) > REPOUSO || Math.abs(alvoY - y) > REPOUSO)) {
        laco = requestAnimationFrame(quadro);
        return;
      }

      /* Assentou: crava no alvo antes de dormir. Um damp nunca CHEGA ao
         destino, e sem isto o ornamento ficaria meio pixel fora do lugar do
         arquivo depois que o ponteiro saísse — invisível, mas errado. */
      x = alvoX;
      y = alvoY;
      ornamento.style.setProperty('--ornamento-x', `${x.toFixed(2)}px`);
      ornamento.style.setProperty('--ornamento-y', `${y.toFixed(2)}px`);
      laco = 0;
      ultimoT = 0;
    };

    const acordar = () => {
      if (!laco && visivel) laco = requestAnimationFrame(quadro);
    };

    /*
     * O alvo sai da posição do ponteiro DENTRO da seção, normalizada em
     * −1..1 a partir do centro. Fora da seção o ponteiro não move nada: a
     * figura fica no último lugar e volta ao centro quando ele sai.
     */
    secao.addEventListener('pointermove', (evento) => {
      if (evento.pointerType !== 'mouse') return;
      const caixa = secao.getBoundingClientRect();
      alvoX = ((evento.clientX - caixa.left) / caixa.width - 0.5) * 2 * AMPLITUDE;
      alvoY = ((evento.clientY - caixa.top) / caixa.height - 0.5) * 2 * AMPLITUDE;
      acordar();
    });

    /* Ponteiro fora: a figura volta para o lugar do arquivo, no mesmo ritmo
       pesado da ida. */
    secao.addEventListener('pointerleave', () => {
      alvoX = 0;
      alvoY = 0;
      acordar();
    });

    /* Nada de rAF girando com a seção fora da tela — mesma economia do laço
       da divisória. */
    new IntersectionObserver((entradas) => {
      visivel = entradas[0].isIntersecting;
      if (visivel) acordar();
      else if (laco) {
        cancelAnimationFrame(laco);
        laco = 0;
        ultimoT = 0;
      }
    }).observe(secao);
  }
}
