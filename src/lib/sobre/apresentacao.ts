/*
 * O gate do download da apresentação: o e-mail destrava o botão.
 *
 * Exceção ao "sem JS" pelo mesmo critério das outras (ver AGENTS.md): não
 * existe em CSS — desativar um link é atributo, não estilo, e `pointer-events`
 * só o esconde do ponteiro, deixando-o no Tab e anunciado como clicável — e
 * sem o script a página continua inteira: a gaveta nem aparece e o botão
 * baixa direto, que é exatamente a variante Default do arquivo.
 *
 * COM JS, o download só chega pelo e-mail — nunca no clique. Decisão do
 * cliente, 2026-09-23, revertendo a de 2026-07-31 (baixar na hora E mandar
 * por e-mail): sem custo nenhum para clicar, o escritório passou a receber
 * contato de gente que só estava curiosa, nunca virou lead de verdade. Exigir
 * a volta à caixa de entrada é o preço que filtra isso — e só quem tem JS
 * paga esse preço: sem script não há como pedir nada ao servidor, então ali o
 * link continua baixando direto, que é a única saída que não quebra a
 * promessa de a página continuar inteira sem JS.
 */
export function iniciarGateApresentacao() {
  for (const bloco of document.querySelectorAll<HTMLFormElement>('.apresentacao')) {
    const gaveta = bloco.querySelector<HTMLElement>('.apresentacao__gaveta')!;
    const entrada = bloco.querySelector<HTMLInputElement>('.apresentacao__entrada')!;
    const baixar = bloco.querySelector<HTMLAnchorElement>('.apresentacao__baixar')!;
    const aviso = bloco.querySelector<HTMLElement>('.apresentacao__aviso')!;
    const estado = bloco.querySelector<HTMLElement>('.apresentacao__estado')!;
    const { estados, escritorio } = JSON.parse(bloco.dataset.config!);

    const liberado = () => bloco.classList.contains('apresentacao--liberado');

    const sincronizar = () => {
      /* `checkValidity` já sabe de `required` e do formato de e-mail; não há por
         que reescrever isso à mão. */
      const vale = entrada.checkValidity();
      bloco.classList.toggle('apresentacao--liberado', vale);
      baixar.setAttribute('aria-disabled', String(!vale));
      /* Fora da ordem do Tab enquanto trava: link que não leva a lugar nenhum
         não deve receber foco. */
      baixar.tabIndex = vale ? 0 : -1;
      /* A frase viaja no `data-` porque script de cliente não recebe prop, e
         ela muda de idioma. Vazia quando libera: o aviso descreve o botão
         travado, e travado ele deixou de estar. */
      aviso.textContent = vale ? '' : (bloco.dataset.aviso ?? '');
    };

    /* `change` além de `input` por causa do preenchimento automático, que em
       alguns navegadores não dispara o segundo. */
    entrada.addEventListener('input', sincronizar);
    entrada.addEventListener('change', sincronizar);

    /* Uma frase de cada vez, no lugar do campo. */
    const mostrar = (qual: 'enviando' | 'sucesso' | 'falha') => {
      estado.textContent = '';
      estado.dataset.estado = qual;

      if (qual === 'falha') {
        /* O e-mail do escritório vira link: quem não recebeu o arquivo na caixa
           de entrada não vai preencher de novo, mas clica. */
        const [antes, depois = ''] = String(estados.falha ?? '').split('{email}');
        const link = document.createElement('a');
        link.href = `mailto:${escritorio}`;
        link.textContent = escritorio;
        estado.append(antes, link, depois);
      } else {
        estado.textContent = estados[qual] ?? '';
      }

      estado.hidden = false;
      /* O campo sai de cena, mas continua no DOM com o valor: é ele que mantém
         a gaveta aberta e o botão liberado. */
      entrada.hidden = true;
    };

    /*
     * Encenação para conferir as frases sem enviar nada, como no formulário:
     * `?apresentacao=enviando`, `?apresentacao=sucesso` ou
     * `?apresentacao=falha`. Com qualquer uma delas nada é pedido ao servidor.
     */
    const encenado = new URLSearchParams(location.search).get('apresentacao');
    const encenavel = ['enviando', 'sucesso', 'falha'].includes(encenado ?? '');

    let pedido: Promise<void> | null = null;

    const pedirPorEmail = () => {
      if (encenavel) {
        mostrar(encenado as 'enviando' | 'sucesso' | 'falha');
        return;
      }

      /* Uma vez por página: o segundo clique é de quem quer o arquivo de novo,
         não um segundo lead. */
      if (pedido) return;

      mostrar('enviando');
      pedido = fetch('/api/apresentacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: entrada.value.trim(),
          idioma: bloco.dataset.idioma,
          assunto: bloco.querySelector<HTMLInputElement>('.apresentacao__armadilha')!.value,
        }),
      })
        .then((resposta) => {
          if (!resposta.ok) throw new Error(String(resposta.status));
          mostrar('sucesso');
        })
        .catch(() => {
          /* Sem e-mail não há download — a frase manda para o escritório
             direto, já que o link não chegou por lugar nenhum. */
          mostrar('falha');
        });
    };

    baixar.addEventListener('click', (evento) => {
      /* Sempre — com JS, o link nunca navega sozinho. O download vem só pelo
         e-mail (ver o comentário do topo do arquivo). */
      evento.preventDefault();
      if (!liberado()) {
        entrada.focus();
        return;
      }
      pedirPorEmail();
    });

    /* Enter dentro do campo faz o mesmo que o clique. O `submit` é só um atalho
       para o botão: o formulário não tem `action`, e não é para ter. */
    bloco.addEventListener('submit', (evento) => {
      evento.preventDefault();
      if (liberado()) baixar.click();
      else entrada.focus();
    });

    gaveta.hidden = false;
    bloco.classList.add('apresentacao--gate');
    sincronizar();
  }
}
