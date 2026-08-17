/*
 * Telefone: seletor de país com bandeira e máscara conforme o país.
 *
 * Quarta exceção ao "animação em CSS, sem JS" — e a primeira que não é
 * animação. O critério é o mesmo: não existe em CSS (formatar enquanto se
 * digita é lógica, e `<option>` não aceita imagem, então bandeira em
 * `<select>` nativo está fora), e sem o script a página continua inteira — o
 * botão de país nasce `hidden` e o campo segue um `type="tel"` comum, que é
 * o que o Figma desenha.
 *
 * O formato vem do `libphonenumber-js` (metadados `min`, ~25 KB comprimidos):
 * é a biblioteca do Google, a mesma que está por trás de qualquer campo de
 * telefone decente. Escrever máscara à mão só cobriria os países que eu
 * lembrasse, e erraria os planos de numeração que mudam.
 *
 * Os nomes dos países saem do `Intl.DisplayNames` do próprio navegador, em
 * pt-BR — zero byte de tabela.
 */
export function iniciarTelefoneFormulario() {
  const celula = document.querySelector<HTMLElement>('.campo--telefone');

  if (celula) {
    /*
     * A biblioteca entra por `import()` dinâmico, não no topo: são ~35 KB
     * comprimidos para um campo que vive no fim de uma página longa. Assim o
     * pedaço só é buscado quando o formulário chega perto da tela — ou no
     * primeiro foco do campo, para quem chegar de Tab antes disso.
     *
     * Enquanto não carrega, o campo é um `type="tel"` comum. É o mesmo estado
     * de quem está sem JS, então não há um terceiro comportamento para manter.
     */
    const disparo = celula.querySelector<HTMLInputElement>('.campo__telefone')!;
    let montado = false;

    const montar = async () => {
      if (montado) return;
      montado = true;
      const [{ AsYouType, getCountries, getCountryCallingCode }, { bandeiras }] = await Promise.all([
        import('libphonenumber-js/min'),
        import('../../data/bandeiras'),
      ]);
      iniciar(AsYouType, getCountries, getCountryCallingCode, bandeiras);
    };

    new IntersectionObserver(
      (entradas, observador) => {
        if (!entradas[0].isIntersecting) return;
        observador.disconnect();
        montar();
      },
      { rootMargin: '300px' },
    ).observe(celula);

    disparo.addEventListener('focus', montar, { once: true });

    function iniciar(
      AsYouType: typeof import('libphonenumber-js/min').AsYouType,
      getCountries: typeof import('libphonenumber-js/min').getCountries,
      getCountryCallingCode: typeof import('libphonenumber-js/min').getCountryCallingCode,
      bandeiras: Record<string, number>,
    ) {
    const gatilho = celula!.querySelector<HTMLButtonElement>('.pais')!;
    const bandeira = celula!.querySelector<HTMLElement>('.pais__bandeira')!;
    const ddi = celula!.querySelector<HTMLElement>('.pais__ddi')!;
    const entrada = celula!.querySelector<HTMLInputElement>('.campo__telefone')!;
    const e164 = celula!.querySelector<HTMLInputElement>('.campo__e164')!;
    const painel = celula!.querySelector<HTMLElement>('.paises')!;
    const busca = celula!.querySelector<HTMLInputElement>('.paises__busca')!;
    const lista = celula!.querySelector<HTMLElement>('.paises__lista')!;
    const vazio = celula!.querySelector<HTMLElement>('.paises__vazio')!;

    const PADRAO = 'BR';
    const soDigitos = (t: string) => t.replace(/\D/g, '');
    // Busca sem acento: quem digita "sao tome" tem que achar "São Tomé".
    const simplificar = (t: string) =>
      t.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

    const nomes = new Intl.DisplayNames(['pt-BR'], { type: 'region' });
    const comparar = new Intl.Collator('pt-BR');
    const paises = getCountries()
      .map((codigo) => ({
        codigo,
        nome: nomes.of(codigo) ?? codigo,
        ddi: getCountryCallingCode(codigo),
      }))
      .sort((a, b) => comparar.compare(a.nome, b.nome));

    let pais: string = PADRAO;
    let ultimoBom = '';
    let ativa = -1;
    let visiveis: HTMLElement[] = [];
    let destacada: HTMLElement | null = null;

    /* --- Bandeira --- */

    // O sprite tem uma fileira por país; `--i` é a fileira, e o CSS desce até
    // ela. Andorra é a fileira 0, então país sem bandeira precisa APAGAR a
    // imagem — deixar `--i` sem valor mostraria a bandeira errada.
    const pintar = (alvo: HTMLElement, codigo: string) => {
      const fileira = bandeiras[codigo];
      if (fileira === undefined) {
        alvo.style.backgroundImage = 'none';
        return;
      }
      alvo.style.setProperty('--i', String(fileira));
    };

    /* --- A lista --- */

    const opcoes = paises.map((p) => {
      const item = document.createElement('li');
      item.className = 'pais__opcao';
      item.id = `pais-${p.codigo}`;
      item.setAttribute('role', 'option');
      item.dataset.codigo = p.codigo;
      item.dataset.busca = `${simplificar(p.nome)} ${p.ddi} ${p.codigo.toLowerCase()}`;

      const marca = document.createElement('span');
      marca.className = 'pais__opcao-bandeira';
      pintar(marca, p.codigo);

      const nome = document.createElement('span');
      nome.className = 'pais__opcao-nome';
      nome.textContent = p.nome;

      const codigo = document.createElement('span');
      codigo.className = 'pais__opcao-ddi';
      codigo.textContent = `+${p.ddi}`;

      item.append(marca, nome, codigo);
      return item;
    });

    lista.append(...opcoes);

    const destacar = (indice: number) => {
      if (destacada) delete destacada.dataset.ativa;
      ativa = indice;
      destacada = visiveis[indice] ?? null;
      if (!destacada) {
        busca.removeAttribute('aria-activedescendant');
        return;
      }
      destacada.dataset.ativa = '';
      busca.setAttribute('aria-activedescendant', destacada.id);
      destacada.scrollIntoView({ block: 'nearest' });
    };

    const filtrar = (termo: string) => {
      const alvo = simplificar(termo).trim();
      visiveis = [];
      for (const item of opcoes) {
        const casa = !alvo || item.dataset.busca!.includes(alvo);
        item.hidden = !casa;
        if (casa) visiveis.push(item);
      }
      vazio.hidden = visiveis.length > 0;
      destacar(visiveis.length ? 0 : -1);
    };

    /* --- Máscara --- */

    // Formata no plano do país escolhido — ou no que o próprio texto disser,
    // quando alguém cola um número internacional começando com "+".
    const formatar = (bruto: string) => {
      const internacional = bruto.trimStart().startsWith('+');
      const maquina = internacional ? new AsYouType() : new AsYouType(pais as never);
      const texto = maquina.input(bruto);
      const detectado = maquina.getCountry();
      if (internacional && detectado && detectado !== pais) escolherPais(detectado);
      e164.value = maquina.getNumber()?.number ?? '';
      return texto;
    };

    // Posição logo depois do n-ésimo dígito: é assim que o cursor volta para
    // onde estava depois de o texto ser reescrito com os separadores.
    const depoisDoDigito = (texto: string, n: number) => {
      if (n <= 0) return 0;
      let vistos = 0;
      for (let i = 0; i < texto.length; i++) {
        if (texto[i] >= '0' && texto[i] <= '9' && ++vistos === n) return i + 1;
      }
      return texto.length;
    };

    const escrever = (texto: string, digitosAntes: number) => {
      entrada.value = texto;
      ultimoBom = texto;
      const posicao = depoisDoDigito(texto, digitosAntes);
      entrada.setSelectionRange(posicao, posicao);
    };

    entrada.addEventListener('input', (evento) => {
      const apagando = (evento as InputEvent).inputType?.startsWith('delete') ?? false;
      const cursor = entrada.selectionStart ?? entrada.value.length;
      let contados = soDigitos(entrada.value.slice(0, cursor)).length;

      let bruto = entrada.value;
      let texto = formatar(bruto);

      /*
       * Apagou um separador: os dígitos não mudaram, a máscara devolve o
       * separador e a tecla parece travada. Some com um dígito junto, que é o
       * que a pessoa quis dizer.
       */
      if (apagando && soDigitos(bruto) === soDigitos(ultimoBom)) {
        bruto = soDigitos(bruto).slice(0, -1);
        texto = formatar(bruto);
        contados = Math.max(0, contados - 1);
      }

      /*
       * Passou do plano de numeração do país: o formatador desiste e devolve os
       * dígitos crus, e a máscara "some" na cara de quem digita. Recusar o
       * dígito a mais é menos surpreendente. (Se o país não usa separador
       * nenhum, `ultimoBom` já é só dígitos e a guarda não dispara.)
       */
      if (!apagando && ultimoBom && texto === soDigitos(texto) && ultimoBom !== soDigitos(ultimoBom)) {
        escrever(ultimoBom, Math.max(0, contados - 1));
        return;
      }

      escrever(texto, contados);
    });

    /* --- Estado do país --- */

    function escolherPais(codigo: string) {
      pais = codigo;
      pintar(bandeira, codigo);
      ddi.textContent = `+${getCountryCallingCode(codigo as never)}`;
      for (const item of opcoes) {
        item.setAttribute('aria-selected', String(item.dataset.codigo === codigo));
      }
    }

    const selecionar = (codigo: string) => {
      escolherPais(codigo);
      fechar(false);
      // Reaproveita os dígitos já digitados no plano do país novo.
      escrever(formatar(soDigitos(entrada.value)), Number.MAX_SAFE_INTEGER);
      entrada.focus();
    };

    /* --- Abrir e fechar --- */

    const abrir = () => {
      painel.hidden = false;
      gatilho.setAttribute('aria-expanded', 'true');
      busca.value = '';
      filtrar('');
      busca.focus();
      const atual = visiveis.findIndex((item) => item.dataset.codigo === pais);
      destacar(atual < 0 ? 0 : atual);
    };

    function fechar(devolverFoco = true) {
      if (painel.hidden) return;
      painel.hidden = true;
      gatilho.setAttribute('aria-expanded', 'false');
      busca.removeAttribute('aria-activedescendant');
      if (devolverFoco) gatilho.focus();
    }

    gatilho.addEventListener('click', () => (painel.hidden ? abrir() : fechar()));

    busca.addEventListener('input', () => filtrar(busca.value));

    busca.addEventListener('keydown', (evento) => {
      const ultimo = visiveis.length - 1;
      switch (evento.key) {
        case 'ArrowDown':
          evento.preventDefault();
          destacar(Math.min(ativa + 1, ultimo));
          break;
        case 'ArrowUp':
          evento.preventDefault();
          destacar(Math.max(ativa - 1, 0));
          break;
        case 'Home':
          evento.preventDefault();
          destacar(0);
          break;
        case 'End':
          evento.preventDefault();
          destacar(ultimo);
          break;
        case 'Enter': {
          evento.preventDefault();
          const alvo = visiveis[ativa];
          if (alvo) selecionar(alvo.dataset.codigo!);
          break;
        }
        case 'Escape':
          evento.preventDefault();
          fechar();
          break;
        case 'Tab':
          fechar(false);
          break;
      }
    });

    lista.addEventListener('click', (evento) => {
      const alvo = (evento.target as HTMLElement).closest<HTMLElement>('.pais__opcao');
      if (alvo) selecionar(alvo.dataset.codigo!);
    });

    // `pointerdown` e não `click`: fecha antes de o clique chegar no que estava
    // embaixo, então a lista não some depois de já ter engolido o gesto.
    document.addEventListener('pointerdown', (evento) => {
      if (!celula!.contains(evento.target as Node)) fechar(false);
    });

    /* --- Começa --- */

      escolherPais(PADRAO);
      filtrar('');
      gatilho.hidden = false;
    }
  }
}
