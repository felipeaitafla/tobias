/*
 * O gate do download da apresentação: o e-mail destrava o botão.
 *
 * Exceção ao "sem JS" pelo mesmo critério das outras (ver AGENTS.md): não
 * existe em CSS — desativar um link é atributo, não estilo, e `pointer-events`
 * só o esconde do ponteiro, deixando-o no Tab e anunciado como clicável — e
 * sem o script a página continua inteira: a gaveta nem aparece e o botão
 * baixa direto, que é exatamente a variante Default do arquivo.
 *
 * O clique faz DUAS coisas, e essa é a decisão do cliente: o download começa
 * na hora e o mesmo e-mail recebe o link, por
 * [`servidor/apresentacao.ts`](servidor/apresentacao.ts). Se o envio falhar,
 * o download acontece do mesmo jeito — quem preencheu fez a parte dele.
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
          /* O download já aconteceu; o que falhou foi só o e-mail, e a frase
             fala disso. */
          mostrar('falha');
        });
    };

    baixar.addEventListener('click', (evento) => {
      if (!liberado()) {
        evento.preventDefault();
        entrada.focus();
        return;
      }
      /*
       * SEM `preventDefault` aqui: quem baixa é o navegador, seguindo o link
       * como faria sozinho. Disparar o download depois do `await` do envio
       * custaria o gesto do usuário — download programático fora de gesto é
       * coisa que o navegador bloqueia —, e ainda faria quem preencheu esperar
       * a resposta de um servidor para receber um arquivo que já está pronto.
       */
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
