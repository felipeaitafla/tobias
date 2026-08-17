/*
 * Envio do formulário e as três faixas de estado.
 *
 * O destino e os textos vêm do Sanity, renderizados no `data-config` do
 * `<form>` — script de cliente não recebe prop, e as frases mudam de idioma.
 * Aqui só tem o fluxo: valida, mostra "enviando", faz o POST e conta como foi.
 *
 * Sem JS o formulário não envia — e não finge que envia: o botão é `submit`
 * de um `<form>` sem `action`, então o navegador recarregaria a página. É o
 * pior caso conhecido, e some no dia em que existir um endpoint próprio para
 * pôr no `action` (aí o JS vira melhoria e o `<noscript>` continua enviando).
 */
export function iniciarEnvioFormulario() {
  const forma = document.querySelector<HTMLFormElement>('.campos');

  if (forma) {
    const aviso = forma.querySelector<HTMLElement>('.aviso')!;
    const botao = forma.querySelector<HTMLButtonElement>('.campos__enviar')!;
    const rotulo = forma.querySelector<HTMLElement>('.campos__rotulo')!;
    const { envio, estados, campos, enviar } = JSON.parse(forma.dataset.config!);

    const nomeDoCampo: Record<string, string> = {
      nome: campos.nome,
      telefone: campos.telefone,
      email: campos.email,
      area: campos.area,
      caso: campos.caso,
    };

    // A busca da lista de países também é `input`, e não é campo do formulário.
    const controles = () =>
      [...forma.querySelectorAll<HTMLInputElement>('input, select, textarea')].filter(
        (c) => c.type !== 'hidden' && !c.closest('.paises'),
      );

    const limpar = () => {
      aviso.hidden = true;
      delete aviso.dataset.estado;
      aviso.textContent = '';
      for (const celula of forma.querySelectorAll<HTMLElement>('[data-invalido]')) {
        delete celula.dataset.invalido;
      }
    };

    const aplicar = (estado: string, campo?: string) => {
      limpar();
      botao.disabled = estado === 'enviando';
      rotulo.textContent = estado === 'enviando' ? estados.enviando : enviar;

      if (estado === 'sucesso') {
        aviso.dataset.estado = estado;
        aviso.textContent = estados.sucesso;
        aviso.hidden = false;
      }

      if (estado === 'erro') {
        aviso.dataset.estado = estado;
        aviso.textContent = estados.erro.replace('{campo}', campo ?? campos.nome);
        aviso.hidden = false;
      }

      if (estado === 'falha') {
        // O e-mail vira link: quem já tentou e não conseguiu não vai tentar de
        // novo, mas clica.
        const [antes, depois = ''] = estados.falha.split('{email}');
        const link = document.createElement('a');
        link.href = `mailto:${envio.destino}`;
        link.textContent = envio.destino;
        aviso.dataset.estado = estado;
        aviso.append(antes, link, depois);
        aviso.hidden = false;
      }
    };

    /*
     * Encenação para conferir os estados: `?formulario=sucesso|erro|falha|
     * enviando`. Com qualquer um deles nada é enviado — nem no carregamento,
     * nem no clique.
     */
    const encenado = new URLSearchParams(location.search).get('formulario');
    const encenavel = ['sucesso', 'erro', 'falha', 'enviando'].includes(encenado ?? '');

    const encenar = () => {
      const primeiro = controles().find((c) => c.required);
      if (encenado === 'erro' && primeiro) {
        primeiro.closest<HTMLElement>('.campo')?.setAttribute('data-invalido', '');
        aplicar('erro', nomeDoCampo[primeiro.name]);
        primeiro.closest<HTMLElement>('.campo')?.setAttribute('data-invalido', '');
      } else {
        aplicar(encenado!);
      }
    };

    if (encenavel) encenar();

    forma.addEventListener('submit', async (evento) => {
      evento.preventDefault();

      if (encenavel) {
        encenar();
        return;
      }

      limpar();

      // `checkValidity` já sabe de `required` e do formato de e-mail; não há
      // por que reescrever isso à mão.
      const invalido = controles().find((c) => !c.checkValidity());
      if (invalido) {
        invalido.closest<HTMLElement>('.campo')?.setAttribute('data-invalido', '');
        aplicar('erro', nomeDoCampo[invalido.name] ?? invalido.name);
        invalido.closest<HTMLElement>('.campo')?.setAttribute('data-invalido', '');
        invalido.focus();
        return;
      }

      aplicar('enviando');

      const dados = new FormData(forma);
      // Chaves em português porque viram os rótulos do e-mail que chega.
      const corpo = {
        _subject: envio.assunto,
        _template: 'table',
        _captcha: 'false',
        Nome: dados.get('nome'),
        'E-mail': dados.get('email'),
        Telefone: dados.get('telefone') || '—',
        'Telefone (E.164)': dados.get('telefoneE164') || '—',
        'Área de atuação': dados.get('area') || '—',
        Caso: dados.get('caso'),
      };

      try {
        const resposta = await fetch(envio.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(corpo),
        });
        if (!resposta.ok) throw new Error(String(resposta.status));
        aplicar('sucesso');
        forma.reset();
      } catch {
        aplicar('falha');
      }
    });
  }
}
