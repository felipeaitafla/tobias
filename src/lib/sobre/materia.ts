/*
 * O visor do PDF da matéria (a primeira faixa do Sobre).
 *
 * O `loading="lazy"` do iframe não segurava nada: o navegador não adia um iframe
 * escondido, e o PDF baixava na carga de toda visita — inclusive no celular,
 * onde o visor nunca aparece. Agora ele nasce `hidden` e sem `src`, e este
 * script o monta quando a faixa está para entrar na tela, só onde existe hover.
 *
 * Sem JS não há visor, e o link continua abrindo o PDF em outra aba.
 */
export function montarVisorDaMateria() {
  const visor = document.querySelector<HTMLElement>('.materia__visor');
  const pdf = visor?.querySelector<HTMLIFrameElement>('.materia__pdf');
  const faixa = visor?.closest('.sobre__faixa');
  if (!visor || !pdf?.dataset.src || !faixa) return;

  // A mesma condição que o CSS usa para revelar o visor (ver Sobre.astro).
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const montar = () => {
    pdf.src = pdf.dataset.src!;
    visor.hidden = false;
  };

  if (!('IntersectionObserver' in window)) return montar();

  const observador = new IntersectionObserver(
    ([entrada]) => {
      if (!entrada.isIntersecting) return;
      observador.disconnect();
      montar();
    },
    // Meia tela de antecedência: o PDF chega pronto para o primeiro hover.
    { rootMargin: '50% 0px' },
  );
  observador.observe(faixa);
}
