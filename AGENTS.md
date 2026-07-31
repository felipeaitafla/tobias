# Tobias Advogados — one page

Site institucional de página única. Astro 7, saída estática, sem framework de UI.

## Contexto do projeto

- **O cliente edita o conteúdo sozinho**, e desde 2026-07-31 o **Sanity é a fonte
  de tudo**: texto e imagens. Não existe mais `src/data/site.ts` — a promessa que
  estava escrita aqui ("muda a origem do dado e os componentes ficam iguais") foi
  cumprida: os componentes não mudaram de marcação, só passaram a receber
  conteúdo por props. Ver a seção do Sanity, abaixo.
- **Hospedagem: Vercel ou Netlify**, não cPanel. O build é estático, então uma edição
  no CMS só aparece depois de rebuild — isso exige webhook, que o cPanel não tem.
  Desde 2026-07-31 existe **uma** função de servidor (o pedido da apresentação,
  em [`servidor/apresentacao.ts`](servidor/apresentacao.ts)), e ela está escrita
  para rodar nas duas — a escolha continua em aberto. A saída do site não mudou:
  o `dist/` segue estático.

## Estado

A página, na ordem em que aparece — cada nome é um componente em
[`src/components/`](src/components/):

`Abertura` → `Cabecalho` → `Hero` → `Manifesto` → `Clientes` → `Sobre` →
`Areas` (que já traz a `Divisoria` verde no meio) → `Divisoria` vermelha →
`FaleConosco` → `Formulario` → `Rodape`

A página está inteira. **Faltam as duas páginas que o rodapé aponta**,
`/termos-de-uso` e `/politica-de-privacidade` — os links já existem e hoje dão
404. Falta também o `og:image`, com TODO em
[`Base.astro`](src/layouts/Base.astro).

O formulário **envia** (FormSubmit, ver a seção dele) e tem as três faixas de
estado do arquivo. O destino de hoje é de teste.

O repositório ainda **não tem nenhum commit**.

### Bloqueios de lançamento

Nada aqui é defeito de código — é conteúdo que depende de resposta do cliente
antes de o site ir ao ar. Tudo renderiza bonito e está mentindo:

- **dois telefones diferentes** no arquivo (ver a seção do Fale conosco, abaixo);
- **o formulário envia para `felipe@aita.studio`**, que é endereço de teste do
  desenvolvedor, via FormSubmit — um serviço gratuito de terceiros. Trocar o
  destino é uma string; decidir se dado de quem procura advogado pode passar por
  terceiro é LGPD, e é conversa (ver a seção do formulário);
- **três coisas na parede de logos** (os 36 chegaram em 2026-07-31, ver a seção
  dos clientes): o Eko Residence aparece duas vezes no slide 3, a Ambev aparece
  no slide 1 e de novo no slide 3 (no arquivo do Cargnelutti, que é co-marcado),
  e Sayerlack e Minuano vêm com fundo colorido, lendo como azulejo na grade;
- **WhatsApp, Instagram e LinkedIn** apontam para URLs de exemplo, com TODO em
  [`site.ts`](src/data/site.ts);
- **`OAB/RS 00.000` no copyright do rodapé** é marcador do designer, não número
  de inscrição. O CNPJ ao lado, esse, parece real;
- **a apresentação institucional tem 63 MB.** É o arquivo que o cliente mandou, e
  está no ar como veio. Ninguém baixa isso de celular — vale pedir uma versão
  comprimida antes do lançamento (a troca é no Studio, sem mexer em código);
- **o e-mail da apresentação ainda não sai.** A função está escrita e testada,
  mas depende de conta no Resend, de `RESEND_API_KEY` e `EMAIL_REMETENTE` no
  painel da hospedagem e — o que costuma demorar — do **domínio verificado** lá.
  Sem isso ela responde 503, e o bloco avisa que o e-mail não saiu; o download
  continua acontecendo.

## Sanity

Projeto **`b4ibcfka`** ("Tobias"), dataset **`production`**, ACL **pública**.

**O build do site não usa token.** ACL pública significa que ler conteúdo
publicado não pede credencial: `src/lib/sanity.ts` cria o cliente sem token, o
`dist/` não pode conter segredo e a hospedagem não precisa de variável secreta.
Só o Studio (que autentica por login) e a migração inicial precisaram de token.

### A divisa que sustenta o i18n

Dois documentos, e a regra para saber onde um campo mora é uma pergunta: **a
resposta em inglês seria exatamente a mesma?**

| documento | traduzido? | o que guarda |
|---|---|---|
| `configuracoes` | não | telefones, endereço, CNPJ, URL do mapa, os 36 logos de clientes, PDF e chamada da matéria, PDF da apresentação institucional, destino do formulário |
| `pagina` (`pagina-pt-BR`, `pagina-en`) | sim | todo o texto, mais as fotos do hero, da história e dos sócios |

Sem essa divisa, traduzir a página duplicaria os 36 logos junto — trabalho
repetido para o cliente e duas listas para sair de sincronia. Cuidado com os
casos que **parecem** dado de contato e são texto: "Seg a Sex" e o nome acessível
do mapa moram na `pagina`, não em `configuracoes`.

Duas decisões de modelagem que valem lembrar:

- **os clientes são uma lista achatada**, sem os quatro grupos. Grupo é
  apresentação: `Clientes.astro` fatia de 9 em 9, e o 37º cliente cria um quinto
  grupo e uma quinta divisória sozinho;
- **o dropdown do formulário não tem campo próprio.** As opções são as próprias
  áreas de atuação, derivadas. Uma segunda lista foi exatamente o que um dia pôs
  "Tributário" duas vezes lá.

### O Studio mora em `studio/`, não embutido

`@sanity/astro` aceita Astro 7, mas arrasta React 19, `react-dom`,
`styled-components` e o `sanity` inteiro como peers — num site cuja identidade é
"sem framework de UI". A documentação da Sanity recomenda publicar separado, e
embutir em saída estática ainda exige regra de reescrita na hospedagem para
`/admin/*` não dar 404 ao recarregar. Aqui o React fica todo do lado do Studio; o
site ganhou só `@sanity/client`, `@sanity/image-url` e `groq`.

```
npm run studio                   # sobe o Studio local (localhost:3333)
npm --prefix studio run deploy   # publica em tobias-adv.sanity.studio
```

Existe também `npm run studio:publicar`, que faz o mesmo passando o robot token
do `.env` — é a saída para quando a máquina estiver logada na conta errada (ver
a armadilha abaixo). **Em 2026-07-31 esta máquina passou a estar logada na conta
certa**, então o comando de cima funciona direto e o script é só rede de
segurança.

**No ar: https://tobias-adv.sanity.studio**

#### Publicar o Studio tem duas armadilhas, e as duas custaram tempo

- **`sanity deploy` NÃO usa o token do `.env`.** Ele usa a credencial do `sanity
  login`, guardada **por máquina** — e esta aqui estava logada como *outra
  conta* (`sitecesargenehr@outlook.com`), que não é membro do projeto. O sintoma
  é `User is missing required grant sanity.project.read`, que parece falta de
  permissão do token e não é: **é a conta errada**. Resolvido em 2026-07-31 com
  `sanity login` na conta administradora, `sitetobias@outlook.com` (id
  `pGYhb8BFY`) — e quem é membro dá para conferir sem adivinhar:

  ```
  GET https://api.sanity.io/v2021-06-07/projects/b4ibcfka   (com o robot token)
  ```

  O provedor dessa conta é **e-mail/senha**, então o login é
  `npx sanity login --provider sanity`. Entrar pelo Google ou GitHub com o mesmo
  endereço cria uma conta *diferente*, e o erro volta igual.

  Duas armadilhas dentro da armadilha, as duas custaram uma tentativa cada:

  - **o callback do login usa a porta 4321**, a mesma do `astro dev`. No Windows
    o Astro pode estar segurando só o `[::1]` e o CLI só o `0.0.0.0`: os dois
    "sobem", `localhost` resolve para IPv6 primeiro e o retorno do login cai no
    servidor errado. Feche o `astro dev` antes;
  - **não teste a porta com `curl`.** Qualquer requisição a `/callback` sem os
    parâmetros do fluxo é lida como o retorno, e o CLI morre com
    `Login failed: Missing callback URL`;

  Se a máquina voltar a ficar na conta errada, `npm run studio:publicar`
  ([`scripts/publicar-studio.mjs`](scripts/publicar-studio.mjs)) publica com o
  robot token em `SANITY_AUTH_TOKEN`, sem depender de login nenhum;

- **O `studioHost` é global entre TODOS os usuários da Sanity**, não por projeto.
  `tobias` puro já estava tomado por outra pessoa. E **não há API para consultar
  disponibilidade** — testei os endpoints óbvios e todos devolvem 404 para
  qualquer nome, inclusive os tomados, então o único teste real é tentar
  publicar. Não confie em sondar `https://<nome>.sanity.studio`: um hostname
  livre também responde 404.

Os idiomas vivem em `studio/idiomas.ts` e no bloco `i18n` do `astro.config.mjs`.
**Os dois têm que concordar**: é o que faz `pagina.language` casar com a rota.

### Roteamento i18n

Português na **raiz**, inglês em **`/en/`** (`prefixDefaultLocale: false`). A
documentação da Sanity prefere prefixar os dois por causa de casos de borda de
SEO; a escolha aqui foi outra, e **quem paga por ela é o `hreflang` + canonical
do `Base.astro`** — sem eles as duas versões competiriam entre si no buscador.
Não remova essas tags achando que são enfeite.

A composição inteira mora em [`Site.astro`](src/layouts/Site.astro), que recebe
`idioma`, faz **uma** consulta e desce tudo por props. Por isso
`src/pages/index.astro` tem três linhas, e a rota inglesa vai ter as mesmas.

### Strings de interface não vão para o Sanity

O que o leitor de tela lê e ninguém vê — "Endereço: ", "Ver o grupo 3 de 4" —
mora em [`src/lib/interface.ts`](src/lib/interface.ts), por idioma. Pôr isso no
Studio encheria o formulário do cliente de campos que ele não sabe para que
servem, e um deles apagado por engano quebraria a leitura da página sem quebrar
nada visível. A divisa: **se some da tela quando o CSS carrega, é do código; se o
cliente leria e diria "esse texto está errado", é do Sanity.**

Corolário para scripts de cliente: eles não recebem props. O formulário leva os
textos e o destino num `data-config` JSON, e os botões da passagem levam o rótulo
num `data-rotulo` — sem isso as frases em português entrariam no bundle e a
página inglesa herdaria os avisos errados.

### Imagens: saiu o `<Image>`, entrou a CDN

[`src/lib/imagem.ts`](src/lib/imagem.ts) faz à mão o que o componente do Astro
fazia sozinho, e **as três coisas são obrigatórias**:

1. **`width`/`height` no atributo.** Sem eles volta o salto de layout. Vêm de
   `asset->metadata.dimensions`, pedido na consulta;
2. **`srcset` com mais de um candidato.** Antes era `widths={[...]}`; agora é um
   `.width(n)` por candidato;
3. **`auto('format')`**, para a CDN servir webp/avif a quem aceita.

A **armadilha do flex continua valendo**: imagem com `width`/`height` não estica
em flex, então a moldura `position: relative` com a foto `absolute; inset: 0`
segue necessária. O pipeline mudou, o motivo não.

Os assets de **marca** ficam em `src/assets/`: símbolo, assinatura, selo,
elementos, divisórias, ícones e o sprite de bandeiras. São design, não conteúdo,
e vários dependem de serem inlinados para o `fill="currentColor"` pegar o token
de cor.

### Conferido na troca

Comparação em pixel da página inteira, build contra build, em 1446px: **0,078% de
diferença**, e as fatias das Áreas, contato, formulário e rodapé saíram
**idênticas**. O que difere está só onde há imagem, e o mapa de diferença mostra
a assinatura de recompressão (contornos coincidentes), não de deslocamento
(blocos duplicados). Se um dia alguém mexer no pipeline de imagem, é este o
teste a repetir.

## Figma

Arquivo `hJuV9y2PAHLZdOsrrW0n5X`. Nós usados com frequência:

| nó | o que é |
|---|---|
| `51:12` | frame "One Page" (o site inteiro) |
| `35:93` | hero |
| `62:2` | manifesto |
| `54:177` | prova social (grade `76:197`) |
| `186:126`, `69:140`, `69:156` | Sobre: as 3 faixas (menta, petróleo, terracota) |
| `185:108` | componente da 1ª faixa — variante `185:107` normal, `185:109` com a foto trocada (é o hover da matéria) |
| `212:78` | componente da faixa do Thiago — `212:77` Default, `212:79` com o campo de e-mail, `212:110` com o e-mail escrito e o botão aceso |
| `54:179`, `105:191` | áreas de atuação: um frame por grupo, com a faixa verde entre eles |
| `161:433` | divisória-loop verde, ENTRE os dois grupos de áreas |
| `194:158` | divisória-loop vermelha (`194:159`, a espelhada), entre áreas e contato |
| `161:439` | Fale conosco — `161:440` a coluna do rótulo, `161:442` o conteúdo |
| `161:446` | o card de infos: `181:26` são os três blocos, `181:22` o mapa |
| `63:79` | formulário — `76:248` título mais eixos, `85:376` a instância do card de campos (componente `85:312`) |
| `52:21` | rodapé — `52:48` a navegação, `157:427` a assinatura gigante |
| `155:385` | header |
| `62:10`, `138:55`, `138:81`, `138:294` | abertura: 4 quadros da animação |

### Armadilha: o run só carrega o que ele sobrescreve

Um nó de texto tem o `textStyle` **base** e os **runs** (`ts1`, `ts2`…) em
`GLOBAL_VARS`. O run lista **apenas as propriedades que mudam**; o resto continua
vindo da base. O estilo real de um trecho é `base + run`, e ler só uma das camadas
erra.

O manifesto (`62:3`) é o caso: a base diz `Noto Serif KR` **Medium 500**, os runs
dizem `Inter` e nada sobre peso. O certo é **Inter Medium 500** — nem a serifada da
base, nem o Regular que se supõe ao ler "Inter". Confira as duas camadas antes de
tirar fonte, peso ou cor.

### Armadilha: `gap` de frame com um filho só

O frame do texto do manifesto (`105:225`) declara `gap: 20px`, mas tem **um único
filho**: os dois parágrafos são um nó de texto só, separados por `\n\n`. O gap
nunca chega a ser aplicado — quem separa os parágrafos é a linha em branco, 40px,
uma `line-height` inteira. Antes de virar `gap` no CSS, veja quantos filhos o frame
tem de verdade.

## Escala fluida — sem breakpoints

O Figma foi desenhado em **1446px** com base 16px. `16 ÷ 1446 = 1.1065vw`, e é essa
razão que governa tudo:

```css
:root { font-size: clamp(0.75rem, 1.1065vw, 1.75rem); }
```

Consequência prática: **todo valor do Figma vira `rem` dividindo por 16** e escala
sozinho. 64px de gutter → `4rem`. 337px de bloco → `21.0625rem`. Não use `px` para
medidas de layout, e não adicione media query para "arrumar" tamanho — quebra a
proporção que o cliente pediu (mesma estética de 720p a 2K).

Os limites do `clamp` estão em `rem` de propósito: em `px` o zoom do navegador
quebraria.

Quando algo precisa reagir à largura sem breakpoint, use `flex-wrap` (o hero faz
isso) ou `min()` pontual.

### Exceção: o que é fração da tela vai em `%`, não em `rem`

A regra de dividir por 16 vale para medida de conteúdo. Onde o desenho diz "metade
da tela", o certo é `50%` — converter o número do arquivo quebra fora da largura
de projeto. No Sobre, a foto tem 722px numa faixa e 724 na outra (arredondamento
dos 723 que são metade de 1446): em `rem` cada divisa cai num x diferente assim
que o `clamp` para de acompanhar a tela, e as faixas vizinhas deixavam de se
encontrar — 30px de degrau num monitor 2K. Com `50%` a emenda cai no meio exato
em qualquer largura.

Detalhe que morde junto: `%` em item de flex mede a **caixa de conteúdo do
container**. Se a faixa tiver `padding` ou `gap`, os 50% já não são meia tela —
o respiro tem que morar dentro da coluna de texto.

## Fontes — não trocar o provider

```js
provider: fontProviders.fontsource()   // NÃO google()
```

Com `fontProviders.google()` a Noto Serif KR sai com **373 `@font-face`, 122
arquivos e 6.1 MB**, hangul incluído. `subsets: ['latin']` não adianta (já é o
padrão) e `unicodeRange` também não. Fontsource resolve: 6 arquivos, 128 KB.

E o `preload` do componente `<Font>` **precisa ser filtrado**:

```astro
<Font cssVariable="--fonte-display-astro" preload={[{ subset: 'latin', weight: 400 }]} />
```

Com `preload` booleano o navegador baixa tudo, ignorando `unicode-range`.

### Armadilha: caracteres fora do subset latino

O range latino tem `↑` (U+2191) mas **não tem `→` (U+2192)**. Uma seta dessas no
texto faz o navegador baixar um arquivo CJK inteiro. Use SVG para setas e símbolos.

## Animações

Em CSS, sem JS. O hero já está no DOM desde o início — a abertura é camada por
cima, então nada de conteúdo depende de script.

**Sete exceções, e o critério para todas é o mesmo:** só entra JS quando o
efeito **não existe** em CSS, e sem ele a página tem que continuar inteira.
(Três não são animação: o campo de telefone, na seção do formulário, o pulo
pelos traços da passagem de clientes, na seção da parede de logos, e o
destravamento do download da apresentação, na faixa do Thiago — nas três o que
entra é interação, não movimento. A sétima, o ornamento que segue o ponteiro, é
movimento e está na seção do formulário.)

**1. O símbolo do manifesto** monta sozinho na primeira vez que aparece na tela.
Não dá em CSS — `animation-timeline` amarra a animação à barra de rolagem, e a
montagem congelaria no meio se a pessoa parasse de rolar; aqui ela precisa
correr no tempo dela, igual à abertura. São ~15 linhas de
`IntersectionObserver` em [`Manifesto.astro`](src/components/Manifesto.astro):
sem JS o símbolo já está montado e o `:hover` roda igual. Se for preciso outro
gatilho de "apareceu, toque uma vez", reaproveite esse padrão em vez de arrastar
animação por rolagem.

**2. O Lenis**, para a rolagem suave, em [`Base.astro`](src/layouts/Base.astro).
Também não dá em CSS: o navegador não expõe a inércia da roda do mouse. Sem JS
volta a rolagem nativa e os âncoras caem no `scroll-behavior: smooth` do reset.

O que **não** pode mudar aqui: o Lenis rola de verdade — o `setScroll` dele
chama `wrapper.scrollTo({ behavior: 'instant' })` a cada quadro. É só por isso
que `position: sticky` e `animation-timeline` continuam lendo a posição certa e
o parallax inteiro sobrevive (conferido comparando capturas com régua, antes e
depois: pixel a pixel iguais). Biblioteca que translada o `body` — Locomotive v4
e afins — derruba a página inteira. Confira isso **antes** de trocar.

**3. A aceleração das esteiras da divisória**, em
[`Divisoria.astro`](src/components/Divisoria.astro). Nenhuma propriedade de CSS
lê a **velocidade** da rolagem: `animation-timeline` amarra a animação à
**posição**, e aí o movimento pararia junto com a pessoa — o oposto do pedido.
O CSS é quem anima; o script só mexe no `playbackRate`. Sem JS a faixa corre na
velocidade de repouso e nada mais muda. Detalhes na seção da divisória.

Dois detalhes do ajuste:

- é `lerp`, não `duration`. `lerp` vira `damp(λ = lerp × 60)`, independente de
  frame rate: começa a responder no primeiro quadro e desacelera. `duration`
  transforma cada clique da roda num tween de tamanho fixo, e é isso que dá a
  sensação de travar. Hoje está em **0.09**, que assenta em ~0.56s;
- **`wheelMultiplier: 0.7`** — a rolagem "pesada" que o cliente pediu em
  2026-07-31: cada clique da roda anda **70px** onde o navegador andaria 100
  (medido: 99 antes, 69,8 depois, na média de 10 cliques).

  **Peso e inércia são coisas diferentes, e é fácil mexer na errada.** `lerp` é
  TEMPO de assentar; `wheelMultiplier` é DISTÂNCIA por gesto. O pedido era de
  distância, então o tempo de assentar não mudou (~0,8s num clique, medido antes
  e depois). Mexer no `lerp` ainda arrastaria junto a esteira da divisória, que
  se amortece com o λ daqui para pousar junto com a página.

  **Só a roda.** `touchMultiplier` fica em 1: no toque a página é o objeto que a
  mão segura, e dedo que arrasta 100px com página que anda 70 não parece peso,
  parece defeito;
- `html.lenis-smooth { scroll-behavior: auto }` no reset. O `smooth` continua
  sendo a base para o caso sem JS, mas com os dois ligados uma URL com hash faz
  o navegador iniciar a própria rolagem suave na carga, brigando com o rAF.

### Hover que revela algo interativo: graça na saída

Na primeira faixa do Sobre, passar o mouse na faixa preta da matéria troca a foto
pelo PDF do Valor Econômico ([`Sobre.astro`](src/components/Sobre.astro)). Como a
pessoa precisa **rolar** o PDF, o gatilho e o alvo ficam em metades opostas da
tela — e um `mouseleave` imediato fecharia o visor no meio do caminho.

Por isso a volta ao normal espera **0,4s** depois que o ponteiro sai. O número é
pedido do cliente (era 1,5s; encurtado em 2026-07-30 porque a travessia leva bem
menos que isso e a espera longa parecia travamento). O que vale como regra para
qualquer hover do mesmo tipo é a forma, não o número: **a revelação é imediata, o
atraso é só na saída.**

Não precisa de JS. O truque é onde mora o `transition-delay`:

- no estado **normal** vai `transition: opacity .3s .4s, visibility 0s .7s` — é
  ele que segura o visor aberto na saída, e o segundo tempo é sempre o primeiro
  mais a duração do apagamento;
- no estado **hover** os dois tempos vão a zero, então a entrada é imediata;
- quem casa o hover é `:has()`, porque gatilho e visor são irmãos;
- o visor também reage ao **próprio** `:hover`/`:focus-within`: é isso que o
  mantém aberto enquanto a pessoa está lendo o PDF.

`visibility` no par não é enfeite: sem ela o iframe continua capturando ponteiro
e roda do mouse mesmo transparente. E a regra toda vive dentro de
`@media (hover: hover) and (pointer: fine)` — no toque o hover gruda no primeiro
toque e o visor ficaria preso por cima da foto. Lá o link abre o PDF em outra
aba, que é o comportamento certo (e é por isso que o gatilho é `<a>`, não
`<button>`).

O PDF fica em `public/`, não em `src/assets/`: é documento para abrir e baixar
como está, não imagem para o Astro reprocessar.

**O logo do Valor não muda de tamanho no hover**, e isso é para continuar assim.
As duas variantes do componente (`185:101` e `185:117`) declaram 105×36, que é a
medida nativa do PNG — daí o CSS pedir `width: 105px` com `flex-shrink: 0` e
nenhuma regra de hover que toque no tamanho. Medido nos dois estados: 104,98 ×
35,98 em ambos. A única diferença que sobra entre as variantes é o respiro até a
chamada (32px no normal, 24 no hover); parece sobra de edição, não desenho, e
aqui ficam 32 nos dois.

### O bloco de download da apresentação, na faixa do Thiago

Componente `212:78`, três variantes, e as três são o mesmo bloco preto colado na
base da faixa: `212:77` só a chamada e o botão; `212:79` com o campo de e-mail à
mostra; `212:110` com o e-mail escrito e o botão em branco. Pedido do cliente em
2026-07-31: **o campo aparece no hover, e o botão só libera o PDF depois de um
e-mail válido.**

Ele vive em [`Sobre.astro`](src/components/Sobre.astro) junto com as faixas dos
sócios, e é o Sanity que decide onde ele aparece: o texto mora em
`socios[].apresentacao` (traduz) e o PDF em `configuracoes.apresentacao`
(não traduz — é o mesmo arquivo nos dois idiomas). **Sem título ou sem arquivo,
não há bloco** — nenhuma faixa precisa saber que ele existe.

Quatro coisas que custaram medição ou tempo:

- **a base é que fica fixa, e o bloco cresce para cima.** Os 704px de topo do
  Default contra os 645 das outras duas variantes são consequência da altura,
  não medida para reproduzir: `bottom: 0` e a gaveta abrindo dão os dois números
  sozinhos. Medido: 104,83px fechado (o arquivo desenha 106) e 163,42 aberto
  (165);

- **a gaveta é uma fileira de grade, e o `0fr` puro não fecha.** `0fr` é
  `minmax(auto, 0fr)`, e esse `auto` devolve o mínimo automático da fileira —
  que inclui padding e borda do que está dentro. Com ele o bloco nascia 9px mais
  alto que o arquivo (113,81 em vez de 104,83). O certo é `minmax(0, 0fr)`, dos
  dois lados da transição. O respiro de 32px vai em `margin-top`, e não no `gap`
  do bloco: ele tem que fechar **junto** com a gaveta, senão sobra na altura do
  estado fechado;

- **o atraso mora no estado fechado**, como no visor da matéria, e pelo mesmo
  motivo: é o que faz a espera valer só na saída. E a gaveta **não se fecha mais
  depois de escrita** (`:has(input:not(:placeholder-shown))`) — quem digitou
  precisa poder conferir o que digitou, e um botão aceso sem o e-mail à vista não
  explica por que acendeu;

- **aberta é o estado base, fechada é a exceção com ponteiro.** No toque não
  existe hover, e um campo que nunca aparece deixaria o download travado para
  sempre. Mesmo princípio do "nunca deixe o estado apagado como base";

- **o foco não desenha moldura** (pedido do cliente, 2026-07-31: o retângulo
  branco destoava). Quem acusa o foco é o **traço do campo**, que vai a branco e
  a 2px — e o `padding-bottom` devolve o pixel que a borda engordou, senão a
  linha sobe 1px ao receber foco (conferido: campo e bloco medem o mesmo com e
  sem foco). Foco visível não é enfeite, é WCAG 2.4.7, e este campo é o único
  caminho para o download; o que saiu foi a caixa, não a indicação. A moldura
  padrão do site também não serviria: a folga dela fica FORA da caixa, e a
  gaveta recorta o que transborda.

O gate é a **sexta exceção ao "sem JS"** e não é animação: desativar um link é
atributo, não estilo — `pointer-events: none` só o esconde do ponteiro e o deixa
no Tab, anunciado como clicável. Sem script a gaveta nem aparece (`hidden` na
origem, como o botão de país do formulário) e o botão baixa direto, que é a
variante Default. Por isso o ícone **nasce cinza**: cinza é a cor do Default, o
estado em que a página vive antes de alguém passar o mouse.

E o **`?dl=`** na URL não é enfeite: o PDF vem da CDN da Sanity, que é outro
domínio, e entre domínios o navegador **ignora** o atributo `download` e navega
para o arquivo em vez de baixá-lo. Quem manda a CDN responder
`Content-Disposition: attachment` é esse parâmetro. Conferido no cabeçalho da
resposta.

#### O clique faz duas coisas, e uma delas não pode esperar a outra

Decisão do cliente, 2026-07-31: o clique **baixa na hora e manda o link para o
e-mail preenchido**. As duas, não uma ou outra — o lead é o ponto, e fazer quem
preencheu esperar a caixa de entrada para ver um arquivo que já está pronto
seria cobrar duas vezes pelo mesmo dado.

**O download não passa pelo JS**, e isso é deliberado: o `click` do botão **não**
leva `preventDefault` quando está liberado. Quem baixa é o navegador, seguindo o
link como faria sozinho, e o envio sai em paralelo do mesmo tratador. Disparar o
download depois do `await` do envio custaria o gesto do usuário — download
programático fora de gesto é coisa que o navegador bloqueia — e ainda amarraria
o arquivo à sorte de um servidor.

Daí a regra que vale para as frases: **falha de envio não trava o download.** As
três (enviando, deu certo, não saiu) ocupam o **lugar do campo**, uma de cada
vez — pedido do cliente. Por isso o campo se esconde em vez de sair do DOM: é o
valor dele que segura a gaveta aberta e o botão liberado. Medido: o bloco fica em
163,42px nos três estados, sem pulo.

Para conferir as frases sem envio nenhum: `?apresentacao=enviando`,
`?apresentacao=sucesso`, `?apresentacao=falha` — mesma encenação do formulário.

#### A função ([`servidor/apresentacao.ts`](servidor/apresentacao.ts))

É o primeiro pedaço de servidor do projeto, e ele **não muda a saída estática**:
o `dist/` continua um monte de arquivo parado, e a função vive ao lado.

- **a regra mora num módulo só, e cada hospedagem entra por uma porta de cinco
  linhas** — [`api/apresentacao.ts`](api/apresentacao.ts) na Vercel,
  [`netlify/functions/apresentacao.mts`](netlify/functions/apresentacao.mts) na
  Netlify. Nada no módulo conhece `req`, `res` ou `Request`: entra um objeto,
  sai um objeto. É o que deixa a escolha de hospedagem em aberto (ela ainda não
  foi feita) e o que deixa testar sem subir servidor. O caminho público é
  `/api/apresentacao` nas duas — na Netlify quem faz isso é o redirecionamento
  do `netlify.toml`;

- **o texto do e-mail NUNCA vem do navegador.** Assunto, corpo e link são
  buscados no Sanity dentro da função; quem pede só diz o e-mail e o idioma. Sem
  isso, qualquer um escolheria o que sai assinado pelo domínio do escritório;

- **o e-mail leva o link, não o anexo.** O PDF tem 63 MB e o teto do Gmail é 25;

- **duas defesas contra abuso**, porque um endpoint que manda e-mail para quem
  pedir é máquina de spam esperando: um campo-armadilha escondido (robô preenche,
  gente não — e o pedido com ele escrito recebe 200 mudo, para o robô não
  aprender) e um teto de 5 por IP por hora. O teto é memória do processo, não
  banco: numa hospedagem serverless cada instância tem a sua. Segura script
  bobo, não ataque distribuído — para isso, o dia em que doer, é o WAF da
  hospedagem;

- **sem chave, ela responde 503** em vez de fingir que enviou. O bloco trata como
  falha de envio, e o download acontece igual.

`RESEND_API_KEY` e `EMAIL_REMETENTE` são do servidor, não do build (ver
`.env.example`): elas precisam existir **no painel da hospedagem**. E o remetente
tem que ser de domínio verificado no Resend — remetente de domínio não
verificado é recusado no envio ou cai no spam de quem receber. **Enquanto o
domínio não estiver verificado, nada sai.**

Nenhuma dependência nova: o Resend entra por `fetch` na API HTTP dele, não por
SDK.

Testado com o `fetch` interceptado (16 casos: caminho feliz, e-mail inválido,
robô, idioma inventado, teto por IP, provedor fora) e o fluxo inteiro no
navegador, com a função encenada — o download começa (registrado em
`Page.downloadWillBegin`) no mesmo clique em que o POST sai.

### Abertura ([`Abertura.astro`](src/components/Abertura.astro))

As quatro barras do símbolo giram a partir da posição da barra 1. Cada uma tem
`translate` **além** do `rotate`, porque as bases não coincidem (derivam ~11 unidades
ao longo do leque).

**Não desincronize o letreiro do símbolo.** A borda esquerda do `clip-path` acompanha
a borda direita do símbolo — ambas vão de 214,22 a 69,32 com a mesma duração, atraso
e curva. Se divergirem, as letras aparecem por cima das barras. Já aconteceu.

Ritmo todo em variáveis CSS no topo do bloco (`--giro`, `--montagem`, `--transicao`…).

O símbolo do manifesto refaz essa mesma montagem (só as barras, sem letreiro nem
deslize) em dois momentos: quando aparece na tela pela primeira vez e a cada
`:hover`. Roda uma vez e só recomeça se o ponteiro sair e voltar — comportamento
que vem de pendurar a animação no próprio `:hover`: ela nasce na entrada, termina
no estado normal e é descartada na saída.

**Desde 2026-07-31 são dois símbolos com esse hover**: o do manifesto e o do fim
das áreas de atuação (pedido do cliente). A montagem saiu do `<style>` do
Manifesto e virou folha comum,
[`src/styles/simbolo.css`](src/styles/simbolo.css), com a classe
`simbolo-monta` — quem usa dá só o tamanho. Duas cópias de noventa linhas de
pivô e keyframe divergiriam na primeira vez que alguém acertasse uma só.

Folha comum resolve de quebra o escopo: dentro de um componente, cada regra
precisaria de `:global()`, porque o Astro não carimba os polígonos que ele
inlina de dentro do SVG. Fora dele, nenhuma precisa. Conferido nos dois: mesmas
quatro animações (`simbolo-surgir` + três `simbolo-abrir`), mesmos pivôs.

Três detalhes para não tropeçar:

- a classe da primeira aparição **sai** quando a animação acaba. Se ficasse, as
  barras seguiriam com a mesma animação aplicada (parada no último quadro) e o
  `:hover` não teria o que reiniciar — o navegador só recomeça quando as
  propriedades mudam, e seriam idênticas;

- os números não são chute nem cópia da abertura: pivô, ângulo e translado saem
  da geometria do `simbolo-positivo.svg` (cada barra gira em torno do meio da
  própria base, e o leque abre em passos exatos de 40°);
- o seletor precisa de `:global(polygon)`. O Astro escopa a raiz do SVG, que está
  no template, mas não os polígonos que ele inlina de dentro do arquivo — sem o
  `:global` a regra não casa com nada.

### Parallax e revelação por rolagem

Usam `animation-timeline` (`scroll()` no hero, `view()` no manifesto). Sem suporte
(Firefox hoje), o CSS base precisa ser o **estado final**:

- hero: fica só `sticky`, perde o movimento lento mas o empilhamento continua certo;
- manifesto: o texto já nasce na cor escura e opaca; o gradiente que o apaga só
  existe dentro do `@supports`;
- header: nasce **visível**. Ele só deve aparecer depois que o hero sai inteiro da
  tela (`animation-range: 100svh calc(100svh + 8rem)`), mas quem esconde é a
  animação. Se o escondido fosse a base, sem suporte ele não apareceria nunca.

Nunca deixe o estado apagado como base — sem suporte o texto ficaria ilegível.

### Armadilha: o âncora mira num alvo que ainda vai se mexer

Os links do menu **não** usam o `anchors: true` do Lenis desde 2026-07-31, e o
motivo só existe numa página com parallax: **o alvo se move durante a rolagem**.

Clicando "Manifesto" no rodapé, o manifesto está pintado 65vh abaixo do lugar
dele no layout, porque a camada em que ele vive está freada (o `transform` das
camadas, logo abaixo). O Lenis mira ali e começa a rolar; conforme a página
sobe, o freio se desfaz e o alvo sobe junto. A rolagem termina onde o alvo
**estava**. Medido: o manifesto parava 502px abaixo do topo dele — ou seja,
mostrando a parede de clientes — e o Sobre, 585px, que são os 65vh cravados de
uma tela de 900.

A correção, em [`Base.astro`](src/layouts/Base.astro), é mirar no **layout**, que
nenhum `transform` altera: somar os `offsetTop` da cadeia e mandar o Lenis para
lá. E é o destino certo, não um chute: quando a seção chega ao topo da tela, a
camada dela ainda não começou a ser coberta, então o freio vale exatamente zero
ali. Conferido nos quatro links do rodapé — todos param com o topo da seção em
0px.

Duas coisas que o tratador precisa ter, e que o `anchors: true` dava de graça:
ignorar clique com modificador (Ctrl, Cmd, Shift — "abrir em outra aba" não é
nosso) e escrever o hash na URL com `pushState`.

**Sem desconto para o header fixo**, e isso foi testado: com 72px de respiro, o
manifesto — que começa exatamente onde o hero acaba — passava a mostrar uma
faixa da foto do hero por cima. Sem desconto nada fica escondido: o header é
translúcido e toda seção abre com respiro ou fundo, então o que cai sob ele é
margem, não texto.

Com `prefers-reduced-motion` nada disso existe: o freio mora dentro de
`@media (prefers-reduced-motion: no-preference)`, então não há transform e o
âncora nativo já cai no lugar certo.

### A pilha de camadas

Cada seção entra por cima da anterior: hero (`z-index: 0`) → bloco branco (1) →
Sobre (2) → Áreas (3, com a faixa verde dentro) → contato (4, começa na faixa
vermelha). O header fica em 50,
num patamar à parte — com 2 ele empatava com o Sobre e perdia no desempate por
ordem de DOM. Só a abertura (100) fica acima.

O rodapé está **fora dessa pilha**: mora fora do `main`, depois dele, e não se
sobrepõe a ninguém. A sensação de que o formulário passa por cima dele vem do
recorte, não do empilhamento (ver a seção do rodapé).

**O contato é a exceção: ele não entra por cima de ninguém.** A passagem das
Áreas para ele é rolagem linear (conferido: a divisória anda 1:1 com a página em
três posições), e quem marca a virada entre as duas seções brancas é o movimento
das esteiras da divisória, não um freio. Por isso `.camada-contato` não publica
`view-timeline` e o `z-index: 4` fica só para o empilhamento — sem `transform`
em jogo, as duas nem chegam a se sobrepor. Decisão do cliente, 2026-07-30.

As camadas do meio (bloco branco e Sobre) fazem os dois papéis: publicam a
própria `view-timeline` (para a de baixo frear contra ela) e usam a da seguinte
(para serem freadas). Por isso o `timeline-scope` do `main` lista as duas — um
elemento só enxerga timeline de ancestral ou de irmão **anterior**, e aqui todo
mundo precisa olhar para a frente. Transformar a camada não desregula a timeline
que ela publica: o `translate` do freio é de pintura, a faixa `entry` continua
saindo do layout (conferido com o Sobre freando e servindo de linha do tempo ao
mesmo tempo).

Quem "segura" a camada de baixo **não é `sticky`**, fora o hero. Tentei
`sticky: bottom: 0` no bloco branco e não serve: o navegador começa a prender o
elemento na base da tela desde a rolagem zero, então o branco cobria o hero
desde o início. Com `top` só funcionaria sabendo a altura do bloco, que é
conteúdo.

O que funciona é contra-deslocamento: a faixa `entry` de quem está cobrindo dura
exatamente 100vh de rolagem, então empurrar a camada de baixo 65vh para baixo
nesse intervalo faz ela subir a 35% da velocidade da página — a mesma conta do
hero, por outro caminho. É `timeline-scope: --sobre` no `main` que deixa o bloco
branco enxergar a timeline do irmão seguinte.

### Armadilha: elemento grudado dentro de camada freada

Não há nenhum caso ativo hoje — o rótulo das Áreas era o único, e ele deixou de
ser freado quando o contato virou rolagem linear. Fica registrado porque volta a
morder na primeira vez que alguém puser um `sticky` dentro de camada com freio.

O freio é `transform`, e `transform` é pintura: ele desloca **tudo** que está
dentro da camada, inclusive um `position: sticky` que deveria estar parado. O
`sticky` calcula contra a tela, ignorando o transform do ancestral, e aí o
resultado pintado vira `top + freio`. O rótulo das Áreas descia meia tela
enquanto o resto da seção subia — parecia defeito, não parallax.

A correção era pendurar no elemento a animação **inversa** (`translateY(-65vh)`),
na mesma timeline e na mesma faixa (`entry`). As duas se cancelam e ele fica onde
estava. Quando o sticky se solta, no fim da seção, o contrapeso continua e é ele
que faz o elemento subir e sair pelo topo — que é o que um sticky faz mesmo ao
acabar. A mesma armadilha do minificador vale aqui: `animation` e
`animation-timeline` em regras separadas.

Cuidado ao herdar isso: só faz sentido para quem é `sticky`. Qualquer outro
filho da camada **deve** andar junto com o freio.

### Armadilha: `<Image>` do Astro não estica em flex

O componente escreve `width`/`height` como atributo, e isso conta como altura
própria: `align-self: stretch` é ignorado, a imagem volta à proporção do arquivo
e é ela quem passa a mandar na altura da faixa (a primeira do Sobre ia a 1083px
em vez de 810; sem `height` no CSS, aos 3100px do arquivo). A saída é uma moldura
`position: relative` que estica, com a imagem `position: absolute; inset: 0`
dentro — fora do fluxo, senão ela estica a moldura de volta.

O inverso morde do outro lado: **SVG esticado não deforma, centraliza.** Um
`<svg>` que vira item de flex herda o `stretch` padrão e a caixa cresce, mas o
`preserveAspectRatio` mantém o desenho no tamanho certo e o joga no meio da
caixa nova. O selo do Fale conosco saiu do canto e foi parar no centro da coluna
de 306px assim — e nada no inspetor grita, porque o elemento está exatamente
onde deveria; é o conteúdo dele que não está. Em SVG dentro de flex, declare
`align-self`.

### Armadilha: keyframe que falta vira o valor do CSS normal

Se um `@keyframes` não declara a propriedade em `100%`, o navegador inventa esse
keyframe usando **o valor que o elemento tem na cascata** — e não o último valor
declarado. Na passagem dos clientes isso fez o primeiro grupo (que nasce visível)
reacender sozinho no resto do ciclo, atrás dos outros. Feche sempre em `100%`.

### A frente do manifesto é um gradiente, não um atraso por palavra

A revelação varre o bloco na diagonal a 45°, saindo do canto superior esquerdo
(mesma ideia do bymonolog.com, que escalona 0.1s por caractere e atrasa 0.3s por
linha — medi 46° na nossa e ~45° na deles). Isso depende de **onde** a palavra caiu
na caixa, não da posição dela na frase, e a quebra de linha só se sabe depois de
renderizar. Sem JS, quem resolve é um `linear-gradient` recortado no texto com
`background-clip: text`, deslocado por um `@property --revelacao` animado.

Duas consequências: não volte a fatiar o texto em `<span>` por palavra (perde a
diagonal e atrapalha o rich text do Sanity), e mantenha o `@media screen` — na
impressão o fundo não sai, e texto recortado sobre fundo ausente é texto invisível.

### A divisória é ladrilho, não imagem esticada

São **duas** faixas, cada uma um frame de 64px de respiro em cima e embaixo em
volta de um desenho de 2304×300: a verde (`161:433`, petróleo) e a vermelha
(`194:158` → `194:159`).

**Elas não são mais vizinhas.** Na revisão de 2026-07-30 a verde subiu para
**entre os dois grupos de Áreas**, e só a vermelha continua abrindo o contato —
antes as duas vinham juntas depois das Áreas, com 128px entre elas. Por isso o
componente desenha **uma** faixa e recebe qual (`<Divisoria cor="verde" />`), e
o `gap` do container antigo deixou de existir: cada faixa traz o seu
`padding-block: 4rem`, que é o respiro do frame dela no arquivo. Medido: 428px
de altura cada uma (64 + 300 + 64), e é `box-sizing: content-box` que faz a
conta fechar, porque a altura declarada é a da tinta.

A vermelha é o **espelho horizontal** da verde: mesmos `y`, `x` refletidos em
torno de 2304. E **diverge do Figma** na cor: no arquivo ela é `#C1503B`, um
tijolo mais claro que não aparece em nenhum outro lugar do site; aqui usa a
terracota da marca (`#7A3225`, a mesma da faixa do Thiago). As duas cores moram
dentro dos SVGs porque eles entram como `background-image`, e imagem externa
não herda `currentColor` nem enxerga variável de CSS — se um token de cor
mudar, os arquivos têm que ser editados junto.

Cada arquivo traz seis cópias do leque de barras posicionadas **à mão** — o
passo entre elas varia de 375,6 a 384,1px. Como a faixa é sangrada e a tela
quase nunca tem 1446px, `width: 100%` mudaria a inclinação das barras junto com
a janela. O nome que o arquivo já traz, "divisória-**loop**", diz o que fazer:
repetir.

`divisoria-verde-loop.svg` e `divisoria-vermelho-loop.svg` são uma cópia só, no
passo da primeira para a segunda (382,912px), usadas como
`background-repeat: repeat-x`. Cada ladrilho carrega o desenho **duas vezes**
(em 0 e em −382,912) porque a figura tem 402,92px e transborda a célula em
~20px: a emenda só fecha se o que sai por um lado já estiver desenhado do outro.

No ladrilho espelhado, o espelho é de **cada leque dentro da própria caixa**
(`translate(402.916) scale(-1 1)`), não do ladrilho inteiro: espelhar o ladrilho
deixa a faixa 20px fora de fase, porque a figura transborda a célula e as duas
bordas não coincidem. Conferido em diferença de pixel contra o render do nó.

Isso normaliza o passo irregular do arquivo. É de propósito: a irregularidade é
imprecisão de quem duplicou, não ritmo — e um ladrilho uniforme é o que permite
a faixa existir fora de 1446px. Para refazer os ladrilhos, o que importa é
pegar a **segunda** cópia do arquivo (é a que está a um passo exato da primeira)
e desenhá-la em 0 e em −passo dentro de um `clipPath` da largura do passo.

#### As esteiras: laço infinito que a rolagem acelera

A verde corre para a esquerda e a vermelha para a direita — mesma animação com
`animation-direction: reverse`, para as duas terem exatamente o mesmo período.

O laço fecha porque três medidas são o mesmo número: a célula do ladrilho, a
largura extra da esteira (`calc(100% + var(--passo))`) e a distância percorrida
(`translateX(-1 passo)`). Ao fim do ciclo o desenho está onde estava —
conferido congelando a animação em 0s e em 9s: os dois quadros saem idênticos
byte a byte. Se mexer em um desses três valores, mexa nos três.

`linear` obrigatoriamente: qualquer curva faz um laço contínuo parecer que
engasga a cada volta.

**A aceleração pela rolagem** é a terceira exceção ao "sem JS" (ver Animações).
O CSS anima; o script só mexe no `playbackRate`, com duas ideias:

- o amortecimento é **assimétrico**. Na descida vale o λ do Lenis
  (`lerp 0.09 × 60`), e é isso que dá o pouso sincronizado: a inércia que sobra
  depois que a roda para ainda é rolagem, ainda é medida, e as duas assentam
  juntas. Na subida o λ é alto (≈14) porque a velocidade medida **já vem
  suavizada pelo Lenis** — amortecer de novo com o mesmo λ empilharia dois
  atrasos e a esteira responderia depois da página;
- `updatePlaybackRate()`, nunca `playbackRate =`: a animação roda no compositor,
  e só essa versão troca a velocidade sem dar salto.

O laço de rAF dorme quando a página para (e só existe com a faixa à vista, via
`IntersectionObserver`). Medido num gesto de roda: pico de 2,9× em 440ms,
decaimento acompanhando a inércia do Lenis, de volta a 1 em ~1,8s.

**O `GANHO` subiu para 0.004 em 2026-07-31**, a pedido do cliente ("mais
velocidade enquanto há rolagem"). O mesmo gesto de 6 cliques da roda, medido nos
três momentos do dia:

| | pico da esteira |
|---|---|
| antes de tudo | 2,62× |
| depois da rolagem pesada (`wheelMultiplier: 0.7`) | 2,25× |
| com o ganho novo | **3,51×** |

A queda do meio não é defeito: a esteira lê **velocidade**, e a página passou a
andar 70% do que andava por clique. Quem quiser mexer na força do efeito mexe no
`GANHO`; o `wheelMultiplier` é pedido de rolagem, não de esteira, e mexer nele
para acelerar a faixa quebraria o outro pedido.

**Um controlador por faixa, e isso não é detalhe.** O Astro empacota o `<script>`
de um componente uma vez e roda uma vez, mesmo com o componente repetido — quem
varre a página é o `querySelectorAll('.divisoria')` de dentro dele. Enquanto as
duas faixas eram vizinhas, um controlador só bastava; agora que estão a milhares
de pixels de distância, um `IntersectionObserver` na primeira deixaria a vermelha
acelerando fora da tela e dormindo justamente quando fosse a vez dela. Conferido
com gesto de roda sintetizado: com a vermelha à vista ela vai a 3,9× e a verde
fica **cravada em 1,00**.

## A parede de clientes ([`Clientes.astro`](src/components/Clientes.astro))

Os 36 logos reais chegaram em **2026-07-31**, já separados por slide — uma pasta
cada, `src/assets/clientes/slide-1` a `slide-4`. Até então o mesmo grupo de nove
aparecia 4× só para a passagem rodar.

Duas coisas mudaram no componente por causa disso:

- **o glob varre pastas e extensões**: `../assets/clientes/*/*.{png,jpg,jpeg,webp}`.
  Cada empresa mandou o logo no formato que tinha, e reconverter tudo para um só
  perderia transparência num e qualidade noutro. Por isso o `id` do `site.ts` vem
  **sem extensão** (`slide-2/santa-clara`) e um `Map` resolve o arquivo;
- **cinco arquivos foram renomeados** para o nome da empresa, porque vieram com o
  nome do download: `logo.png` era Santa Clara, `logo.webp` era Brasimet,
  `images.png` era MD Serviços de Segurança, `igreja.jpg` era a Igreja Episcopal
  Anglicana do Brasil, e o ThyssenKrupp trazia o nome inteiro do arquivo da
  Wikipédia. O `alt` é o nome da empresa, então ele precisa existir.

### A largura é a do arquivo, mas quem manda é a tinta

Vários logos vêm com margem transparente enorme — o Araupel tem **1000×600 de
arquivo para 772×126 de desenho**. Declarar a largura do arquivo sem olhar o
desenho deixa o logo minúsculo dentro da célula.

As nove medidas do Figma (`76:197`) continuam mandando onde existem. As outras 27
foram calculadas pondo **a tinta em 56px de altura, com teto de 168px de
largura** — o que amarrar primeiro. Logo largo fica preso pela largura, logo
quadrado pela altura, e a parede fica coerente. Para recalcular, meça a tinta
(não o arquivo) e converta de volta pela razão entre as duas caixas.

**Elas nunca passaram pelo olho do designer.** A regra dá um resultado coerente,
mas ele vai querer acertar caso a caso, como fez com as nove primeiras.

### A passagem só arranca quando a visita chega

Pedido do cliente, 2026-07-31. Sem isso ela roda desde a carga da página: quem
desce até a parede meio minuto depois pega o terceiro grupo, e os nove primeiros
logos nunca foram vistos por ninguém.

O script põe a classe `clientes--espera` (que é só um
`animation-play-state: paused`) e um `IntersectionObserver` a tira na primeira
vez que a seção aparece — **só na primeira**: quem já viu e volta não quer a
contagem reiniciada no meio de um logo.

**O detalhe que quase passou:** parada no quadro zero, a parede fica **em
branco**. A animação vale pelo próprio `from`, que é opacidade 0 nos quatro
grupos — o mesmo tipo de armadilha do keyframe que falta, mais abaixo. Por isso
a espera crava `irPara(0)` com a passagem já parada: isso põe o ponteiro logo
depois do cruzamento de entrada, com o primeiro grupo inteiro na tela. Ao
chegar, a classe sai e a animação segue **dali** — cravar de novo no zero faria
a parede apagar e reacender na cara de quem acabou de chegar.

Consequência de assentar aí: a barra de progresso nasce em ~24% (que é a
duração do cruzamento dividida pela do grupo), e não em zero. É o preço de a
parede nunca ficar vazia, e o mais barato dos dois.

Sem JS a classe nunca entra e a passagem roda como sempre rodou.

### Os traços da passagem são clicáveis (acréscimo ao Figma)

Pedido do cliente em 2026-07-31: clicar no traço `n` pula para o grupo `n`. É
**exceção ao "sem JS" pelo mesmo critério das outras** — clicar é interação, não
animação, e não existe em CSS sem transformar a seção em `<input type="radio">` e
perder a passagem automática.

**Quem anima continua sendo o CSS.** O script não desenha nem cronometra: ele move
o *ponteiro* da linha do tempo que já existe, do mesmo jeito que o da divisória só
mexe no `playbackRate`. Por isso a passagem volta a correr sozinha depois do pulo,
a barra de progresso acompanha sem uma linha a mais, e o cruzamento é o de sempre.

A conta que sustenta isso: as animações dos quatro grupos são **a mesma**,
separadas por `animation-delay` de um grupo cada. O `currentTime` de uma animação
de CSS conta desde o começo do atraso, e as quatro começaram juntas — logo todas
têm o mesmo `currentTime`, e o grupo `i` está no instante
`currentTime − i × porGrupo` da própria animação. Cravar todas em `i × porGrupo`
põe o grupo `i` no quadro zero.

Três coisas que custaram medição, e que voltam a morder se alguém mexer:

- **o ciclo inteiro somado na frente não é enfeite.** Sem ele, pular para o
  primeiro grupo joga o último para tempo negativo, onde ele ainda está no atraso
  e não pinta quadro nenhum: o grupo que devia sair da frente simplesmente não
  está lá, e no lugar do cruzamento aparece um surgimento do branco;
- **parada, a passagem precisa de outro alvo.** Se as animações estiverem
  pausadas, o quadro não avança sozinho — cravar no começo do cruzamento deixa o
  grupo pedido em opacidade zero e o anterior ainda aceso, congelados assim para
  sempre. O sintoma é o pior possível: o clique parece não fazer nada. Por isso o
  alvo ganha o tempo do cruzamento quando `animationPlayState` é `paused`.
  Conferido: sem esse ajuste, Enter num traço mostrava o grupo **anterior**;
- **a pausa por foco teve de virar `:has(:focus-visible)`.** Com `:focus-within`,
  clicar num traço com o mouse dá foco ao botão e a passagem fica parada **para
  sempre** — o pulo funciona uma vez e a barra nunca mais anda. E a regra ficou
  **separada** da pausa por ponteiro: junto na mesma lista, um navegador sem
  `:has()` derrubaria as duas.

Isso ainda divide bem os dois públicos: a pausa por ponteiro é do
`.clientes__trilho`, onde os logos estão, e os traços moram na outra coluna — quem
clica com o mouse não pausou nada e ganha o cruzamento; quem chegou de Tab pausou
(que é o pedido da WCAG 2.2.2) e ganha a resposta imediata.

Dois detalhes de marcação e desenho:

- **os botões nascem inertes** (`aria-hidden` no container, `tabindex="-1"` em
  cada um) e é o script que os promove. Sem JS não há para onde pular, e botão
  morto anunciado pelo leitor de tela é pior que enfeite nenhum;
- **o traço continua com 4px**, mas o alvo de clique tem 24. O respiro vai em
  `padding` com `background-clip: content-box`, e `box-sizing: content-box` é
  obrigatório: com o `border-box` do reset o padding sairia da altura e o traço
  sumiria.

Com `prefers-reduced-motion` não há animação para buscar, então o pulo troca a
opacidade direto, em estilo inline. Sem isso o controle existiria e não faria nada
justamente para quem mais depende dele para ver os outros 27 logos.

### O que ainda está errado na parede

Nada disso é código — é qual arquivo está em qual pasta:

- **Eko Residence duas vezes no slide 3.** `antoniolli-hoteis.png` e `ekko.jpg`
  são o mesmo desenho, conferido abrindo os dois. Um dos dois é o arquivo errado;
- **Ambev duas vezes.** O slide 1 tem a Ambev, e o `cargnelutti.png` do slide 3 é
  um logo co-marcado "Cervejaria Ambev Cargnelutti". Pode ser mesmo o
  distribuidor, mas na grade lê como repetição — e o arquivo do Cargnelutti
  deixou de ser o que o Figma mediu, então a largura de lá já não descreve este;
- **Sayerlack e Minuano têm fundo colorido** (ciano e vermelho, sólidos até a
  borda). Na grade branca eles viram azulejos no meio de marcas recortadas. O
  Sayerlack é ainda um thumbnail de 200×200 — o do Figma era transparente.

## As Áreas de Atuação ([`Areas.astro`](src/components/Areas.astro))

Um componente, **duas seções**, com a faixa verde entre elas — no arquivo são
dois frames irmãos com a divisória no meio (`54:179`, `161:433`, `105:191`). Até
2026-07-30 os dois grupos viviam numa seção só, com 192px de respiro no meio.

Três consequências que valem lembrar antes de mexer:

- **o respiro é assimétrico e espelhado.** O primeiro bloco abre com 128 e fecha
  com 64; o segundo faz o inverso. Somados aos 64+64 da faixa, é isso que dá o
  ritmo do arquivo. Nenhum dos dois usa o `.secao` padrão;
- **o rótulo grudado percorre só o primeiro grupo.** O frame dele (`154:384`)
  vive dentro de `areas-1`, e o segundo bloco não tem coluna à esquerda. Quem
  segura os 980px no lugar certo lá é o `justify-content: flex-end` da seção —
  sem ele o segundo grupo encostaria à esquerda e as duas grades sairiam
  desalinhadas. Conferido: as duas colunas começam em x = 402,03;
- **a marcação dos cartões fica em um lugar só.** As duas seções saem do mesmo
  laço, e o que os índices decidem é o que existe em cada ponta (rótulo e âncora
  no primeiro, faixa antes do segundo). Quando o Sanity entrar, é um ponto de
  troca, não dois.

### As descrições dos cartões se alinham pelo topo

Pedido do cliente, 2026-07-31, e **diverge do Figma**: no arquivo cada descrição
fica ancorada no rodapé do cartão e começa onde o texto dela mandar, então uma
descrição de 3 linhas começava uma linha ABAIXO da vizinha de 4 — a linha branca
sobrava em cima. Medido antes: 210px contra 237px de degrau, no meio da grade.

A correção é uma linha, e não mexe no `space-between`: `min-height: 4lh` na
descrição reserva a altura da mais alta, então todas começam na mesma linha e a
que sobra cai **embaixo**. Medido depois: as nove começam em 209–210px.

Cuidado com o número: ele é "quantas linhas tem a maior descrição". Se o CMS
receber uma de cinco linhas, é ele que sobe — senão a nova volta a começar mais
alto que as vizinhas. O `6em` antes dele é o mesmo valor para navegador sem a
unidade `lh` (4 × 1.5 de entrelinha).

O `letter-spacing` dessas descrições também é próprio: **-0.03em**, contra os
-0.04 do resto do corpo. Mesmo pedido, mesmo dia.

### A célula vazia não desenha traço

Na última fileira do segundo grupo o arquivo desenha **um cartão de 490px
sozinho** (`105:204`): o traço de cima para na metade da grade em vez de
atravessá-la. A célula continua existindo no HTML, mas só para ancorar o símbolo
no canto inferior direito (`105:219`) — medido, ele fica rente à borda direita e
à base da fileira, folga zero nas duas.

Isso mudou em 2026-07-30. Antes a linha atravessava, e era a célula que a
desenhava; se alguém puser de volta um `border-top` ali, a grade volta a divergir
do arquivo.

## O card do Fale conosco (rotulado "Localização")

> O rótulo da seção virou **"Localização"** em 2026-07-31, a pedido do cliente —
> o componente e o id continuam `FaleConosco`/`#contato`, e é o texto do Sanity
> que mudou. O "Localização" do rodapé passou a apontar para `#contato`, a seção
> inteira, em vez de `#localizacao`, que é o mapa e cai no meio dela.


O designer refez o card (`161:446`) em 2026-07-30: o recado que pedia dados de
exemplo saiu, e no lugar entraram três blocos de ícone + texto (`181:26`) e um
mapa (`181:22`). O traço é **só em cima** (`strokeWeight: 1px 0px 0px`) — não é
caixa fechada nem par de réguas, é uma régua só, abrindo o bloco embaixo do
título; embaixo quem fecha é a borda do próprio mapa.

O padding acompanha: só 32px em cima. O recuo lateral que era do card inteiro
passou a ser da fileira de dados (`padding-left` de 32), e o **mapa vai à
largura cheia** da coluna (980px, não os 916 de antes). Os três ícones também
foram redesenhados e cresceram — 40,4px de altura no endereço (`194:157`) e no
horário (`194:151`), 37,59 na agenda (`194:153`) —, e passaram a viver no mesmo
0.7 de opacidade do texto, em vez da cor cheia. Só a **altura** é declarada: os
três têm razão própria no arquivo, e fixar as duas medidas deformaria o desenho.

Mais duas coisas mudaram na segunda leva do mesmo dia:

- o título virou **"Como nos encontrar"** (era "Estamos prontos para servir.");
- **os blocos trocaram de ordem**: endereço → horário → canais. Antes o horário
  fechava a fileira.

### O rótulo mudou de lado

No arquivo a coluna do rótulo (`161:440`) passou a vir **depois** do conteúdo, e
o texto é `textAlignHorizontal: RIGHT` — ou seja, "Fale conosco" gruda na
**direita**. As Áreas mantêm o rótulo à esquerda, então o espelho é deliberado,
não deslize de arquivo. Medido: a borda direita do rótulo cai em 1382,02, que é
exatamente a margem de 64px da seção.

O `position: sticky` e o `top: var(--respiro-secao)` não mudam com isso — o que
faz o rótulo trocar de lado é a ordem dos dois filhos no HTML, e o `text-align`
é que o encosta na margem da seção em vez da divisa com o card.

**Um ponto continua em aberto e é bloqueio de lançamento:** o arquivo traz **dois
telefones diferentes** — `51 3076 3466` no card (`181:24`) e `+55 (51) 3396-6800`
no rodapé (`52:131`). Os dois estão em `site.ts` como estão lá; escolher por
conta própria seria inventar.

### O mapa é o embed do Maps, não a captura do Figma

O Figma desenha uma **captura de tela** do Google Maps, e publicar captura do
Maps em site comercial fere os termos de uso do Google. Desde 2026-07-30 o que
está no ar é o **embed oficial** — "Compartilhar › Incorporar um mapa", que não
pede chave de API —, com a URL que o cliente mandou do perfil do escritório
(`Tobias ADV`). Ela mora em `faleConosco.mapa.src`, no `site.ts`, junto do
`titulo` que vira o nome acessível do iframe; o PNG que servia de placeholder foi
apagado.

Três coisas a saber antes de mexer nele:

- **`display: block` no iframe.** Ele nasce `inline`, e o reset do
  [`global.css`](src/styles/global.css) só endireita `img/picture/svg/video`. Como
  linha de texto ele ganharia o descender embaixo — uma fresta bem onde a borda do
  mapa é quem fecha o card. Conferido: com a regra, a base do iframe e a do
  `.cartao-info` caem no mesmo pixel;
- **as medidas do trecho que o Maps entrega ficam de fora.** O `width="600"`,
  o `height="450"` e o `style="border:0"` não entram: tamanho mora no CSS e em
  `rem`, senão o mapa sai da escala fluida. Medido: 979,98 × 224,98, os 980×225
  do arquivo;
- **a roda do mouse sobre o mapa é do iframe**, então o Lenis não vê o gesto e a
  página anda pelo scroll nativo, sem a inércia — uma faixa de 225px onde a
  rolagem muda de textura. É o padrão de qualquer embed do Maps, e evitar isso
  custaria JS (mapa inerte até o primeiro clique). Decisão do cliente,
  2026-07-30: fica o nativo.

Fica de fora, e some junto com o destino do formulário: o embed carrega scripts
e cookies do Google no navegador de quem visita, que é assunto do aviso de
privacidade quando a `/politica-de-privacidade` entrar.

O rótulo tem a coluna inteira para passear: o **selo dos 20 anos saiu** nessa
mesma revisão. No Figma o frame
dele (`165:473`) continua posicionado, mas **vazio** — nenhum desenho dentro,
conferido renderizando o nó, enquanto o selo do rodapé (`52:111`) continua
inteiro. Decisão do cliente: seguir o que o arquivo desenha. Com ele foi embora
o `.fale-conosco__marcador`, que existia só para o rótulo não descer por cima
do selo.

A coluna do rótulo é `align-self: stretch`, e não os 524px fixos do arquivo:
esses 524 eram a altura que posicionava o selo, e sobraram ~31px maiores que o
conteúdo ao lado. Sem selo para apoiar, reproduzi-los seria congelar espaço
morto — a seção fecha com os 128 de padding e mais nada.

O mapa carrega `id="localizacao"`: é o alvo do "Localização" do rodapé, e a
única âncora da página que não é uma seção inteira.

O traço antes do telefone e do e-mail (`181:73`) é SVG no arquivo e `::before`
aqui: 14×1,09 de retângulo não justifica um arquivo, e em CSS ele acompanha a
cor do texto e a escala fluida.

## O formulário ([`Formulario.astro`](src/components/Formulario.astro))

Rolagem linear, sem freio: a seção mora dentro da `.camada-contato`, que não
publica nem consome `view-timeline` (ver a seção das camadas).

### A coluna da esquerda mudou em 2026-07-30

Os quatro eixos (TEMPO • EMPRESA • PATRIMÔNIO • FAMÍLIA) **subiram**: moravam no
pé da coluna, e agora formam um bloco só com o título (`76:248`), 12px abaixo
dele. O parágrafo de apoio que ficava ali ("Fale conosco preenchendo o
formulário…") **saiu do arquivo** e foi removido junto — os eixos ocuparam o
lugar dele. Eles também afinaram: Regular 400 em vez de Semi Bold, e 0.33 de
preto em vez de 0.59.

A fileira antiga (`63:81`) continua no Figma, mas com **tinta transparente** —
o designer escondeu em vez de apagar. Não é um segundo bloco a desenhar.

O respiro da seção passou de 64 para **96px** em cima e embaixo.

### O ornamento virou um vetor em pé, petróleo

O bege deitado (`116:279`, 1557×409, sangrando pela direita) saiu na segunda leva
de 2026-07-30 e no lugar entrou `201:83`: **713×1277 a partir de (64, 253)**, em
`#3C757C` — que é o `--cor-petroleo` cravado. Ele agora é bem **mais alto** que a
seção e sangra por baixo, então quem corta é o `overflow` dela. Medido contra o
render do nó: posição e tamanho batem em menos de 0,1px.

O SVG entra inlinado e com `fill="currentColor"` — trocado à mão depois de
exportar, porque o Figma escreve a cor no arquivo. É o que deixa a cor vir do
token, ao contrário das divisórias, que entram como `background-image` e por isso
precisam da cor escrita dentro.

O `max-width: none` continua declarado mesmo agora que o desenho cabe na largura:
o reset dá `max-width: 100%` a todo `svg`, e para um absoluto os 100% são a caixa
do ancestral posicionado. Sem ele, qualquer estreitamento da seção achataria as
barras na horizontal e mudaria a inclinação delas.

#### E ele acompanha o ponteiro, pesado

Pedido do cliente, 2026-07-31: "que se mova um pouco de acordo com o mouse, mas
permanecendo naquela região". É a **sétima exceção ao "sem JS"** — nenhuma
propriedade de CSS lê a posição do ponteiro fora do elemento sob ele —, e sem o
script o desvio nasce zero: o ornamento fica exatamente onde o arquivo o desenha.

**O peso mora em dois números, e é fácil errar os dois:**

- **amplitude de 44px**, contra os 713 de largura da figura (eram 16; o cliente
  pediu mais expressivo no mesmo dia). Sobe a amplitude, não o λ: mais λ é
  figura colada no ponteiro, que é o oposto do que ele pediu;
- **λ = 2.5** no amortecimento (o mesmo `damp` da esteira da divisória, também
  independente de frame rate). Medido: aos 100ms a figura andou **3,4px** dos
  15,5 do alvo, e leva ~1,2s para assentar. Com λ alto ela cola no ponteiro, que
  é o oposto de peso.

O deslocamento entra por **variável CSS** (`--ornamento-x/y`) em vez de `style`
direto: assim o `top`/`left` do arquivo continuam sendo a posição de repouso, e o
script mexe só no desvio. Ele fica na região porque o desvio é limitado **e**
porque a seção já tem `overflow: hidden`.

Três cuidados que o laço tem, e que valem para qualquer efeito de ponteiro aqui:

- **dorme quando a seção sai da tela** (`IntersectionObserver`) e quando assenta
  — nada de rAF girando à toa;
- **crava no alvo antes de dormir.** Um `damp` nunca chega ao destino: sem isso
  o ornamento ficava meio pixel fora do lugar do arquivo depois que o ponteiro
  saía. Invisível, e errado;
- **só com ponteiro fino e sem `prefers-reduced-motion`.** No toque não há
  ponteiro para seguir.

Medido nos cantos com a amplitude de 16: +15,6/+15,1 no inferior direito, o
simétrico no superior esquerdo, e **zero cravado** depois que o ponteiro sai da
seção. Com 44 a proporção é a mesma, e o teto continua sendo o número.

### O campo "Mensagem" encolheu de 322 para 190px

`85:306`, e é a diferença que mais pesa: são **133px a menos na seção inteira**.
Com ela, a altura do formulário sai em 718,91px contra os 718 do render do
arquivo — antes eram 851. Se um dia a seção voltar a parecer alta demais, este é
o primeiro número a conferir.

### Armadilha: a caixa do nó de texto é maior que a linha

Os títulos em Noto Serif KR têm no Figma um nó **mais alto que a própria
`line-height`**: 93px para uma linha de 64/1.14 no formulário (`63:89`), 77 para
64/1.1 no Fale conosco (`161:443`). A sobra vem das métricas de CJK da fonte com
o nó em altura fixa, e fica **embaixo** do texto (os dois são
`textAlignVertical: TOP`). O Chrome monta a caixa pela `line-height` declarada e
não tem essa sobra.

Consequência: o `gap` que o Figma declara sai curto. No formulário os 12px
colavam os eixos nas descidas do "Proteja o que é seu" — 4px de folga contra os
23 do arquivo, medidos na tinta.

A correção é `min-height` no título, com a altura do nó — **não** engordar o
`gap`. Assim o número do arquivo continua legível no código, e o bloco ainda
cresce se a frase quebrar em duas linhas. Conferido: com isso os blocos caem nas
mesmas linhas de pixel do render do Figma.

### Envio e as três faixas de estado

O componente tem as três variantes do arquivo (`85:312`): normal, sucesso
(`85:326`, petróleo) e erro (`85:340`, terracota). A faixa fica entre o texto e
o botão.

**Para conferir os estados sem enviar nada**, abra a página com
`?formulario=sucesso`, `?formulario=erro`, `?formulario=falha` ou
`?formulario=enviando`. Com qualquer um deles nada é enviado — nem na carga, nem
no clique.

Site estático não manda e-mail sozinho. O **FormSubmit** foi escolhido por ser o
único que funciona sem criar conta: o endereço vai na URL e o primeiro envio
dispara um e-mail de ativação para ele. Destino, endpoint e os textos das faixas
estão em `formulario.envio` e `formulario.estados`, no `site.ts` — trocar de
provedor é trocar uma string, porque o script só faz POST de JSON e olha se a
resposta veio OK.

Três coisas a resolver antes do lançamento estão anotadas lá: o destino é de
teste, o endereço fica visível no HTML (coletor de spam) e passar dado de quem
procura advogado por um terceiro gratuito é decisão de LGPD. A hospedagem já vai
ser Vercel ou Netlify, então uma função serverless resolve os três de uma vez —
e **ela já existe**: [`servidor/apresentacao.ts`](servidor/apresentacao.ts), do
bloco da apresentação, faz exatamente isso (valida, busca o texto no Sanity,
manda pelo Resend). Migrar o formulário é reaproveitar aquele arquivo, não
escrever um novo.

Duas decisões da validação:

- `novalidate` no `<form>` desliga só as **bolhas** do navegador. Os `required`
  continuam no HTML (é o que o leitor de tela anuncia) e quem checa é
  `checkValidity()` — não há por que reescrever regex de e-mail. Obrigatórios:
  nome, e-mail e o caso; telefone e área são opcionais;
- a variante de erro do Figma engrossa o rótulo de **todos** os campos. Aqui só
  o campo que barrou engrossa, e em terracota: engrossar todos apontaria para o
  lugar errado, e a mensagem fala de um campo só.

**Falha de envio não existe no Figma** e precisou ser inventada: sem ela o único
caminho, com a rede fora, seria mentir que deu certo. Usa a mesma faixa de erro
e traz o e-mail como link, para quem não vai tentar de novo.

### Fontes do formulário (atualizadas em 2026-07-30)

Campos e botão: **Inter Regular 400, 16px**, entrelinha 1.1, `letter-spacing`
−0.04em. Antes eram 18px Medium. A seta do botão encolheu junto — caixa do nó de
32,67 para 25,33, tinta de 17 para 13px.

O botão fica **preto**, e não no `#031E21` que as variantes de sucesso e erro
trazem: é a mesma decisão registrada em `tokens.css`, o petróleo escuro saiu do
projeto.

As variantes ainda divergem entre si: elas escrevem "Área de interesse" onde o
Default diz "Área de atuação", e a de erro põe o botão em Semi Bold. Vale o
Default, que é o estado em que a página vive. O campo do caso, esse, deixou de
divergir — o Default passou a dizer **"Mensagem"** como as outras duas, e é o
que está no site desde 2026-07-30 (era "Descreva seu caso").

Junto com a troca veio um acréscimo ao Figma, por concordância: a faixa de erro
diz "**O campo** {campo} não foi preenchido adequadamente". O arquivo escreve
"[CAMPO] não foi preenchido", que só fecha com rótulo masculino — com
"Mensagem" ou "Área de atuação" sairia "Mensagem não foi preenchido".

### O dropdown é `<select>` nativo com `<optgroup>`

As opções são as próprias áreas de atuação, lidas de `areasAtuacao` — não uma
segunda lista. É por isso que o rótulo repetido se consertou sozinho quando o
segundo "Tributário" virou "Cível": conferido, 10 opções e nenhuma duplicada.
Os títulos dos dois grupos **separam sem serem escolhíveis**, e é
exatamente isso que `<optgroup>` faz: o navegador não deixa selecionar o rótulo,
o leitor de tela anuncia o grupo antes da opção, e teclado e toque já funcionam.

O critério é o mesmo das animações: uma lista montada à mão precisaria de JS e
de um punhado de ARIA para chegar no mesmo lugar, e a página deixaria de
funcionar sem script. **O preço** é que a lista aberta é pintada pelo sistema —
dá para vestir o campo fechado inteiro (fonte, cor, seta, divisas), mas não o
popup. Se algum dia o popup precisar da estética do site, aí sim é componente
com JS, e é uma decisão a tomar, não um detalhe.

Dois detalhes da marcação:

- a seta é **irmã** do campo, porque `<select>` não aceita filho que não seja
  opção. Ela fica por cima da área de padding com `pointer-events: none`, então
  clicar nela abre a lista igual;
- o rótulo "Área de atuação" é uma `<option value="" disabled selected>`. É o
  que mostra o texto no estado vazio sem ele virar resposta — e o
  `:has(option[value=""]:checked)` é quem pinta esse estado de cinza.

### O campo de telefone

Acréscimo ao Figma, pedido pelo cliente: seletor de país com bandeira e máscara
que muda conforme o país. **É a quarta exceção ao "sem JS"** — e a primeira que
não é animação. Formatar enquanto se digita é lógica, e `<option>` não aceita
imagem, então bandeira dentro de `<select>` nativo está fora. Sem o script o
botão de país nem aparece (nasce `hidden`) e o campo continua um `type="tel"`
comum, que é o que o arquivo desenha.

- **O formato vem do `libphonenumber-js`** (metadados `min`). É a biblioteca do
  Google, a mesma por trás de qualquer campo de telefone decente. Máscara
  escrita à mão só cobriria os países que alguém lembrasse.
- **Os nomes dos países saem do `Intl.DisplayNames`** do navegador, em pt-BR —
  zero byte de tabela.
- **Carga adiada.** São ~43 KB comprimidos para um campo no fim de uma página
  longa, então a biblioteca entra por `import()` dinâmico, disparado por
  `IntersectionObserver` (300px de antecedência) ou pelo primeiro foco, para
  quem chegar de Tab antes. O que carrega junto com a página são 2 KB.
- **Um campo escondido guarda o E.164** (`+5551999990000`): o campo visível fica
  com a versão formatada, boa de ler e ruim de processar.
- Colar um número com `+` troca o país sozinho — quem manda é o texto.
- `data-lenis-prevent` na lista rolável, senão a roda do mouse rola a página.

#### As bandeiras são um sprite, não 243 arquivos

`scripts/gerar-bandeiras.mjs` (`npm run bandeiras`) rasteriza os SVGs do
`flag-icons` a 48×36 e junta tudo num WebP só: **59,8 KB e uma requisição**, no
lugar de 2,4 MB e 243 requisições quando a lista abre (a Espanha sozinha tem
81 KB de brasão que ninguém enxerga num quadrado de 24px).

O `flag-icons` é **devDependency**: ele só existe para gerar o sprite. As duas
saídas — `src/assets/bandeiras.webp` e `src/data/bandeiras.ts` — vão
versionadas, então o build normal não depende dele.

Emoji de bandeira (🇧🇷) seria mais leve ainda e está descartado: o Windows não
tem os glifos e mostra as duas letras do país no lugar.

### Armadilha: o Astro não escopa o que o script cria

O `<style>` de um componente vira `.classe[data-astro-cid-xxx]`, e o atributo é
carimbado **no que está no template**. Elemento criado por `document.createElement`
não recebe nada, então nenhuma dessas regras casa com ele — a lista de países
apareceu sem estilo nenhum, texto cru do navegador.

A saída é `:global()` **com um ancestral escopado**:
`.paises__lista :global(.pais__opcao) { … }`. O ancestral segura a regra dentro
do componente; sem ele, `:global` sozinho vazaria para a página inteira.

### Armadilha: `[hidden]` perde para qualquer `display` de classe

`[hidden]` é só `display: none` na folha padrão do navegador, com especificidade
de atributo. Uma regra de classe com `display` ganha dela — e aí `el.hidden =
true` mente: o DOM diz escondido, a tela mostra o elemento.

Mordeu duas vezes no mesmo componente: o botão de país (`display: flex`)
aparecia antes de o script montar, e o filtro da busca escondia opções que
continuavam desenhadas. Quem declara `display` numa classe precisa devolver o
atributo na mão: `.pais[hidden] { display: none }`.

Corolário para testes: `element.hidden` e `!o.hidden` **não** provam que sumiu.
Meça `getComputedStyle(el).display`.

### Armadilha: `opacity` cria contexto de empilhamento

Elemento com `opacity < 1` é pintado na mesma camada de um posicionado, então um
irmão translúcido que venha **depois** no HTML passa por cima de um `sticky`
anterior. O `+351` de cada opção (`opacity: .55`) aparecia por cima da busca fixa
da lista de países. `z-index` no elemento fixo desempata.

### Armadilha: o tamanho do nó não é o tamanho do desenho

A seta do botão Enviar (`85:310`) é declarada 32,67 × 32,67 no Figma, mas o SVG
exportado tem 18 × 18 — e medindo a **tinta** no render do arquivo dá 17px. O
número do nó é a caixa; o desenho mora centrado dentro dela. Desenhar a 32,67
deixa a seta quase o dobro do tamanho certo.

Quando um ícone sair maior que no arquivo, compare o tamanho do nó com o
`viewBox` do SVG exportado: se divergirem, quem manda é a tinta. Aqui a folga
((32,67 − 18) ÷ 2) virou `margin`, porque é ela que dá ao botão os 96,67 de
altura e afasta a seta ~8px a mais da margem direita.

### Armadilha: fileira `auto` de grade não divide a sobra por igual

Não há caso ativo hoje — o card do Fale conosco era o único, e ele deixou de ser
grade quando o designer o redesenhou (ver a seção do contato). Fica registrado
porque a conta volta a valer na próxima grade de fileiras automáticas.

`align-content: stretch` (o padrão) reparte a sobra em partes **iguais** a
partir da altura natural de cada fileira — não iguala as fileiras. No card antigo
a fileira de cima tinha duas linhas de texto e a de baixo uma, e a divisa do meio
descia 12px abaixo do centro. `grid-auto-rows: 1fr` iguala e ainda cede quando o
texto cresce, porque o mínimo de `1fr` é o conteúdo.

Junto com isso: no Figma o traço fica **por dentro** da medida do frame. Um card
de 350px com borda em cima e embaixo tem 348 de miolo. Pôr 175 em cada célula dá
352 e desalinha a emenda com a grade vizinha — a altura tem que morar no
container.

### Armadilha: `text-wrap: pretty` muda as quebras do Figma

O reset aplica `text-wrap: pretty` em todo `<p>`. Ele reequilibra o parágrafo para
evitar linha final curta, e com isso empurra palavras de linha — quebra diferente
da desenhada. Onde as quebras são desenho (o manifesto), anule com `text-wrap: wrap`.

E conte com uma folga na largura: o Chrome mede as mesmas linhas ~4px mais largas
que o Figma, então a caixa do manifesto tem 702px em vez dos 697px do arquivo (em
697 uma palavra caía de linha). Mesma história dos 348px do hero.

## O rodapé ([`Rodape.astro`](src/components/Rodape.astro))

Fora do `main` e **último no documento** — a revelação dele depende disso.
Gutter de 32px, e não os 64 do resto do site: a assinatura gigante (`157:427`)
ocupa a largura toda entre as margens.

### A revelação: recorte mais contra-deslocamento

Pedido do cliente, com o rodapé do bymonolog.com como referência: o rodapé não
entra empurrado pela página, **ele já está ali e o formulário é que sai da
frente**. São dois elementos e nenhuma linha de JS:

- o **palco** (`.rodape-palco`) recorta e publica a `view-timeline`. `clip` e
  não `hidden`, porque `hidden` criaria um contêiner de rolagem;
- o **rodapé** começa em `translateY(-65%)` e chega a zero ao longo da faixa
  `entry`. Andando 65% enquanto a página anda 100%, ele sobe a **35% da
  velocidade dela** — os mesmos 35% do hero e das camadas.

Duas coisas fazem a conta fechar sozinha, e as duas dependem de ele ser o
último elemento:

- a faixa `entry` dura exatamente a altura do rodapé, e **termina no fim do
  documento**: "a base dele encosta na base da tela" e "a página acabou" são o
  mesmo instante. Por isso o desenho assenta no lugar exato, sem sobra;
- a área visível **nunca fica vazia**. Aos X pixels de faixa, o palco mostra
  `[0, X]` e a tinta cobre de `−0,65(H−X)` a `0,35H + 0,65X` — sempre mais que
  X. O fundo bege repetido no palco é só seguro contra meio pixel de
  arredondamento.

Sem `animation-timeline` (Firefox hoje) ou com `prefers-reduced-motion`, o
rodapé nasce no lugar certo e rola junto com a página — conferido: `transform:
none`, zero animações, e o rodapé colado no palco no meio da faixa.

Medido em pixel, que é o único jeito (ver a armadilha do parallax): a linha do
letreiro bate com a previsão dos 35% em cinco posições de rolagem, com erro
máximo de **0,4px**.

### Detalhes do desenho que custaram medição

- **as quatro colunas são fatias da largura**, então vão em `fr`
  (`482fr 338fr 357fr 205fr`, de divisa a divisa no arquivo). Em `rem` elas
  parariam de acompanhar a tela assim que o `clamp` saturasse;
- **`min-width: 0` nas fatias.** Trilha em `fr` não encolhe abaixo do conteúdo,
  e o copyright é mais largo que a fatia **de propósito**: os 439px dele
  começam em 852 e avançam por baixo do "Voltar ao topo", onde não há nada (o
  selo só começa em 1364). Sem o `min-width` as quatro colunas iam 38px para a
  esquerda; preso à fatia, o texto quebrava em quatro linhas em vez de duas;
- **a fileira da navegação tem `padding: 16px 0 15px`**, não 16 dos dois lados:
  no Figma o traço fica por dentro da medida do frame, então a fileira mede
  72,8 com a linha incluída. Com 16+16+1 cada uma ganhava 1px e as cinco
  empurravam a navegação 5px;
- **a seta diagonal mede 12px de tinta contra os 21,21 do nó** — o nó é a caixa
  de um quadrado girado 45°. A do "Voltar ao topo" tem 15 nos dois. As duas
  ficam rentes à borda da coluna; no arquivo a diagonal fica 5px para dentro,
  sobra da rotação, e alinhar as duas vale mais que copiar a sobra.

### A navegação não é a do header

Desde 2026-07-30 ela tem lista e ordem próprias (`52:48`): **Manifesto, Sobre,
Áreas de Atuação, Localização, Contato**. Trocou "Clientes" por "Manifesto",
escreve "Áreas de Atuação" onde o header abrevia para "Serviços", e
"Localização" subiu para antes de "Contato". Os cinco destinos existem —
`#manifesto` já era o id da seção.

Divergência assumida: o arquivo escreve **"Linkedin"**, e aqui está "LinkedIn".
Nome de marca escrito errado no rodapé de um escritório de advocacia lê como
descuido.

### O hover do menu é cor, e nunca foi movimento

O cliente pediu em 2026-07-31 para "remover o movimento do hover, deixando só a
troca de cor". **Não havia transform nenhum** — nem aqui nem no header; o hover
sempre foi só `opacity: 0.6`. O que ele viu é o que a opacidade faz com texto
grande: elemento com `opacity < 1` ganha camada própria e perde a suavização por
subpixel, então os 34px do menu mudam de espessura e as letras parecem se
assentar de novo.

Por isso a correção é trocar `opacity` por uma cor com alfa (`rgba(0,0,0,.6)`,
o mesmo cinza que a opacidade pintava sobre o bege): mesma aparência, sem tirar
o texto da camada de fundo. A `transition` acompanhou — é `color` agora.
Conferido com `:hover` forçado: a cor muda, a opacidade fica em 1 e o retângulo
do link não anda um pixel.

Vale como regra: **para apagar texto em hover, prefira cor a opacidade.** O
efeito é o mesmo e não custa uma camada de composição.

## Verificação visual

Screenshot headless funciona, mas **sempre com `--force-device-scale-factor=1`**:

```
chrome --headless=new --disable-gpu --no-sandbox --force-device-scale-factor=1 \
  --user-data-dir=<pasta única> --hide-scrollbars --virtual-time-budget=12000 \
  --window-size=1440,900 --screenshot=out.png http://localhost:4321/
```

Sem esse flag o viewport real não corresponde ao `--window-size` (já deu
`innerHeight=109` para uma janela de 260). Como o hero é `100svh`, ele encolhe até a
altura do conteúdo e as capturas viram lixo — perdi bastante tempo caçando um bug de
layout que não existia.

Outros detalhes: use `--user-data-dir` único a cada chamada (perfil travado faz a
captura falhar em silêncio), e `--virtual-time-budget` **não** mapeia 1:1 com o tempo
das animações. Para conferir um instante exato, congele com
`document.getAnimations().forEach(a => { a.pause(); a.currentTime = t })`.

### Para medir, e não só olhar: CDP

Abra o Chrome com `--remote-debugging-port` e converse com ele pelo `WebSocket`
global do Node — sem instalar nada. Dá para ler `getBoundingClientRect` e
`getComputedStyle`, preencher campos, sintetizar ponteiro com
`Input.dispatchMouseEvent` e cronometrar transição quadro a quadro. Foi assim que
saíram os números de quase tudo que está documentado aqui.

**Meça na largura de projeto (1446px):** lá `1rem = 16px` cravados, e todo número
sai comparável 1:1 com o Figma sem conta nenhuma.

Duas coisas que custam tempo se você não souber:

- `--window-size` **não** garante o viewport. Force com
  `Emulation.setDeviceMetricsOverride` mais `Emulation.setScrollbarsHidden` logo
  depois do `Page.enable`;
- o `clip` do `Page.captureScreenshot` é em coordenadas do **documento**, não da
  tela. Com a página rolada, passar o `getBoundingClientRect()` direto recorta o
  topo do site. Some `window.scrollY` no `y`.

### Armadilha: não meça parallax com `getBoundingClientRect()`

Animação de rolagem roda no compositor, e a thread principal não vê o resultado:
`getBoundingClientRect()` devolve a posição **sem** o `transform` do freio, e
`getComputedTiming().progress` devolve `0` no meio da faixa. Foi estável em seis
amostras de 100ms a 3s — não é corrida que espera resolva, é medida errada.

Perdi tempo achando que o freio tinha morrido. O que vale é o pixel: ponha uma
régua (`div` de 1px em `position: fixed` na altura esperada) e compare capturas
em rolagens diferentes. Foi assim que confirmei o rótulo cravado nos 126,6px em
três pontos enquanto o conteúdo subia a 35%.

## Convenções

- Classes e variáveis em português, seguindo o vocabulário da marca
  (`--cor-petroleo`, `--cor-terracota`, `.manifesto__aparte`).
- Comentário explica **por quê**, não o quê — sobretudo quando o código foge do
  Figma de propósito (ex.: o bloco do hero tem 348px em vez dos 337px do arquivo
  porque em 337 o parágrafo quebra em 4 linhas no Chrome em vez de 3).
- Assets de marca em `src/assets/` (não `public/`), para o Astro otimizar. Vale
  também para SVG: dentro de `src/` ele é inlinado como componente, e aí um
  `fill="currentColor"` deixa a cor vir do token em vez de ficar escrita no
  arquivo. `public/` hoje tem só os favicons e o PDF da matéria — coisas para
  servir como estão.

## Desenvolvimento

```
npm install         # e, uma vez, `npm --prefix studio install`
cp .env.example .env   # e preencha (só o Studio e a migração pedem token)
npm run dev         # localhost:4321
npm run build
npm run studio          # o Studio, em localhost:3333
npm run studio:publicar # publica o Studio com o token do .env (rede de segurança)
npm run bandeiras       # regera o sprite do seletor de país (só quando mudar)
```

**O `astro dev` não serve `/api/apresentacao`** — a função é da hospedagem, não
do Astro. Em desenvolvimento o POST dá 404 e o bloco mostra a frase de falha, o
que está certo e não é defeito. Para ver as três frases sem servidor nenhum, use
a encenação (`?apresentacao=sucesso`); para exercitar a função de verdade, é
`vercel dev` ou `netlify dev`, com `RESEND_API_KEY` e `EMAIL_REMETENTE` no
`.env`.

Dependências do site, e por quê: **@sanity/client** (lê o conteúdo no build),
**@sanity/image-url** (monta as URLs da CDN), **groq** (`defineQuery`), **lenis**
(rolagem suave), **libphonenumber-js** (formato do telefone por país) e, só de
desenvolvimento, **flag-icons** — fonte dos SVGs que o `npm run bandeiras`
transforma em sprite. Nada mais; o resto é Astro. **React e o `sanity` NÃO são
dependências do site** — vivem em `studio/`, com `package.json` próprio.

Documentação do Astro: https://docs.astro.build
