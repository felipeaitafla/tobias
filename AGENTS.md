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

**São duas páginas desde 2026-08-07**, e o build gera as duas: o português em
`/` e o inglês em `/en/`. A composição é a mesma — `src/pages/en/index.astro`
tem as mesmas três linhas do da raiz, com outro `idioma`. O seletor de idioma
vive no `Cabecalho` (ver a seção dele).

As páginas estão inteiras. **Faltam as duas que o rodapé aponta**,
`/termos-de-uso` e `/politica-de-privacidade` — os links já existem e hoje dão
404 **nos dois idiomas** (os `href` não têm prefixo de idioma, então em `/en/`
eles apontam para a raiz). Falta também o `og:image`, com TODO em
[`Base.astro`](src/layouts/Base.astro).

O formulário **envia** (FormSubmit, ver a seção dele) e tem as três faixas de
estado do arquivo. O destino de hoje é de teste.

O repositório está no ar em
[github.com/felipeaitafla/tobias](https://github.com/felipeaitafla/tobias) —
primeiro commit em 2026-07-31. Dois arquivos que o cliente mandou ficaram de
fora, os dois no `.gitignore`: o vídeo bruto da Hero
(`src/assets/video-hero.mov`, 692 MB — o convertido é que vai pro ar, ver a
seção da Hero) e o PDF original da apresentação institucional
(`src/assets/Apresentação Institucional - Tobias ADV.pdf`, 66 MB — não é o que
o site serve, esse vem do Sanity). Nenhum dos dois é referenciado em código;
conferido com `grep` antes de excluir.

### Bloqueios de lançamento

Nada aqui é defeito de código — é conteúdo que depende de resposta do cliente
antes de o site ir ao ar. Tudo renderiza bonito e está mentindo:

- ~~**dois telefones diferentes** no arquivo~~ — **resolvido, e publicado em
  2026-08-07.** Os dois campos (`telefonePrincipal` e `telefoneRodape`) apontam
  para o mesmo número e os dois links levam ao WhatsApp. Faltava o 9 do celular
  (`8194-6082` contra o `98194-6082` do Figma), e sem ele o link montava
  `wa.me/555181946082` — dez dígitos, que não abrem conversa nenhuma. Fica como
  alerta geral: **telefone errado aqui não quebra nada visível**, o link
  continua bonito e clicável, e só quem clica descobre;
- ~~**cinco textos do Sanity divergem do Figma**~~ — **publicados em
  2026-08-07** (título e aparte do hero, os dois parágrafos do manifesto, o
  rótulo dos clientes e o título da história). A descrição de SEO foi acertada
  junto, que estava com a redação antiga do hero;
- **o formulário envia para `felipe@aita.studio`**, que é endereço de teste do
  desenvolvedor, via FormSubmit — um serviço gratuito de terceiros. Trocar o
  destino é uma string; decidir se dado de quem procura advogado pode passar por
  terceiro é LGPD, e é conversa (ver a seção do formulário);
- **três coisas na parede de logos** (os 36 chegaram em 2026-07-31, ver a seção
  dos clientes): o Eko Residence aparece duas vezes, a Ambev aparece no primeiro
  grupo e de novo no arquivo do Cargnelutti (que é co-marcado), e Sayerlack e
  Minuano vêm com fundo colorido, lendo como azulejo na grade;
- **falta o logo do Expresso Palmares.** O cliente pediu a nova ordem do
  primeiro grupo em 2026-08-06 e ele é o 7º da lista — mas não está entre os 36
  do Sanity nem entre os arquivos originais da migração
  (`src/assets/clientes/slide-*`), conferido. A ordem foi aplicada com as oito
  que existem, e o nono lugar ficou com o Magalu, que é quem vem a seguir. Com o
  arquivo em mãos, é subir ao Sanity e inserir na 7ª posição da lista achatada;
- **Instagram e LinkedIn ainda apontam para URLs de exemplo**
  (`instagram.com/`, `linkedin.com/`, sem o perfil) — o WhatsApp já foi
  corrigido para o número real em algum momento da migração. Os três vivem em
  `configuracoes` no Sanity agora, não em código — é o cliente (ou quem edita
  o Studio) quem troca, não é mais um TODO de desenvolvedor;
- ~~**`OAB/RS 00.000` no copyright do rodapé**~~ — **resolvido em 2026-08-07**,
  agora é `OAB/RS sob o nº 61.313`. E o conserto expôs uma armadilha que
  continua de pé: **o número vive em DOIS lugares.** Existe um campo
  `configuracoes.oab` (e um `cnpj` ao lado), mas **nenhum componente os
  renderiza** — a linha visível é um texto livre único, `rodape.copyright`, na
  `pagina`, com o CNPJ e a OAB escritos por dentro. Editar só o campo do Studio
  não muda o site. Ou o rodapé passa a montar a linha a partir dos campos, ou
  eles saem do esquema; enquanto isso, quem mexer tem de mexer nos dois;
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
| `configuracoes` | não | telefones, endereço, CNPJ, os 36 logos de clientes, o **PDF, o veículo e o logo** da matéria, PDF da apresentação institucional, destino do formulário |
| `pagina` (`pagina-pt-BR`, `pagina-en`) | sim | todo o texto — inclusive a **chamada** da matéria —, mais as fotos do hero, da história e dos sócios |

Sem essa divisa, traduzir a página duplicaria os 36 logos junto — trabalho
repetido para o cliente e duas listas para sair de sincronia. Cuidado com os
casos que **parecem** dado de contato e são texto: "Seg a Sex" mora na `pagina`,
não em `configuracoes`.

#### A chamada da matéria já esteve do lado errado, e o sintoma demorou a aparecer

Até 2026-08-07 a `chamada` morava em `configuracoes.materia`, com a
justificativa escrita no esquema de que "a matéria é do Valor Econômico e
continua em português na versão inglesa". **Isso vale para o PDF, não para a
legenda:** a chamada é prosa NOSSA sobre a matéria, e um leitor inglês precisa
dela em inglês.

O defeito só ficou visível quando a página inglesa passou a existir — a página
saía inteira em inglês com **uma única** faixa em português. Varrida a página
`/en/` procurando português, era o único vazamento; todo o resto traduziu.

Hoje ela é `pagina.historia.materiaChamada` (tipo `chamadaMateria`, o mesmo
Portable Text de antes, com os decoradores `nome` e `leve`). O resto da matéria
— `veiculo`, `paginas`, `logo`, `arquivo` — continua em `configuracoes`, porque
aí sim a resposta em inglês é exatamente a mesma.

**A migração teve de ser uma transação atômica.** Com o campo fora de
`configuracoes` e ainda não presente na `pagina`, a legenda simplesmente some da
faixa preta — não existe estado intermediário aceitável. As três mutações
(gravar no pt, gravar no en, apagar de `configuracoes`) foram juntas.

Vale como teste para o próximo campo duvidoso: **se o cliente leria a frase e a
diria "errada" em inglês, ela traduz** — mesmo que o objeto ao redor não
traduza.

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

### Editar conteúdo sem abrir o Studio: rascunho antes, publicar depois

Para os ajustes de texto pedidos direto no chat (o título do formulário, tirar
a quebra de linha do copyright), abrir o Studio manualmente seria o caminho
óbvio — mas dá para editar pela **API HTTP de mutação**
(`https://b4ibcfka.api.sanity.io/v2024-01-01/data/mutate/production`) com o
`SANITY_WRITE_TOKEN` do `.env`, o mesmo token que a migração inicial usou.
Ele nunca entra no site: a leitura do build continua sem token (ACL pública,
ver acima), este token só serve para escrever.

O padrão, em duas etapas nunca fundidas numa só:

1. **rascunho.** Busca o documento publicado inteiro, clona como
   `drafts.<id>` via `createOrReplace` com o campo pedido já trocado. Isso
   não muda nada no ar — o build só lê documentos publicados, e um
   `drafts.*` é invisível para ele. É o momento de mostrar a mudança e
   pedir confirmação;
2. **publicar**, só com confirmação explícita do cliente (na prática, do
   usuário no chat — "publica o sanity", nunca automático). Busca o
   rascunho de volta (autenticado), faz `createOrReplace` **sobre o `_id`
   publicado** e **apaga o `drafts.<id>`** — são duas mutações, não uma.

**O rascunho não some sozinho, e esta seção afirmou o contrário até
2026-08-04.** Quem apaga o rascunho ao publicar é a ação de publicar do
Studio, não a API de mutação: `createOrReplace` sobre o `_id` publicado é
uma escrita comum, e o `drafts.*` fica exatamente onde estava. Conferido na
troca do logo da Gedore — logo depois de publicar,
`defined(*[_id=="drafts.configuracoes"][0]._id)` ainda respondia `true`.
Quem seguir o texto antigo deixa rascunho órfão para trás a cada edição.
Mande as duas na mesma transação:

```json
{"mutations": [
  {"createOrReplace": {"_id": "configuracoes", "...": "..."}},
  {"delete": {"id": "drafts.configuracoes"}}
]}
```

Nunca mutar o documento publicado direto, nem em um passo só — o rascunho é
o que dá ao usuário uma chance de ver e recusar antes de qualquer coisa
ficar visível no site.

Vale notar por que essa rota existiu: a ferramenta MCP do Sanity estava com
a própria autenticação quebrada nesta sessão (`Unauthorized - Session not
found` / "bearer token is invalid or expired"). Se isso for só desta
máquina ou desta sessão, o caminho normal (`mcp__Sanity__patch_documents` /
`publish_documents`) volta a ser mais simples que montar a chamada HTTP à
mão — vale testar primeiro antes de repetir este workaround.

#### Armadilha: abrir o documento no Studio cria rascunho, e rascunho velho ressuscita campo apagado

Em 2026-08-07, logo depois de migrar a chamada da matéria, apareceu um
`drafts.configuracoes` que não existia minutos antes. Ele não tinha edição
nenhuma do usuário — nasceu de **abrir** o documento no Studio, que já basta.

O problema é o que ele carregava: a `materia.chamada` **antiga**, porque foi
tirado do estado anterior à migração. Um Publish nesse rascunho devolveria o
campo órfão a `configuracoes`, desfazendo metade do trabalho — sem quebrar a
página, e por isso mesmo sem ninguém perceber.

Duas lições:

- **depois de qualquer migração estrutural, confira se sobrou rascunho:**
  `*[_id in path("drafts.**")]._id`. Rascunho anterior à mudança é uma bomba
  relógio, não um resto inofensivo;
- **antes de descartar, compare rascunho contra publicado campo a campo.** Aqui
  a única diferença era o campo obsoleto, então descartar não perdeu nada — mas
  isso é conclusão de comparação, não suposição. O `_system.base.rev` do
  rascunho diz de qual revisão ele saiu, e é o jeito rápido de datar.

### Roteamento i18n

Português na **raiz**, inglês em **`/en/`** (`prefixDefaultLocale: false`). A
documentação da Sanity prefere prefixar os dois por causa de casos de borda de
SEO; a escolha aqui foi outra, e **quem paga por ela é o `hreflang` + canonical
do `Base.astro`** — sem eles as duas versões competiriam entre si no buscador.
Não remova essas tags achando que são enfeite.

A composição inteira mora em [`Site.astro`](src/layouts/Site.astro), que recebe
`idioma`, faz **uma** consulta e desce tudo por props. Por isso
`src/pages/index.astro` tem três linhas — e
[`src/pages/en/index.astro`](src/pages/en/index.astro), criada em 2026-08-07,
tem as mesmas três, só trocando o `idioma`. A promessa se cumpriu: a segunda
língua custou uma linha de rota e nada mais.

**A ordem entre publicar e criar a rota não é negociável.** O build lê só
documento publicado, então criar `src/pages/en/index.astro` com o `pagina-en`
ainda em rascunho **quebra o build** — `buscarConteudo('en')` não acha documento
com `language == "en"` e lança. Não é um 404 elegante, é build vermelho.
Publique primeiro.

O `caminhoDe` que monta a rota de cada idioma mora em
[`interface.ts`](src/lib/interface.ts), e não no layout, porque **dois** lugares
precisam da mesma conta: o `hreflang`/canonical do `Base.astro` e o seletor de
idioma do `Cabecalho`. Duas cópias divergiriam na primeira vez que alguém
acertasse uma só.

### O seletor de idioma é `<details>`, e sem uma linha de JS

Nós do Figma: `261:86` é o grupo da direita (seletor + CTA, 32px entre eles),
`155:405` é o seletor — globo `261:53` (11,5px), o rótulo `155:407` e o chevron
`261:88` (7×4). **Cuidado com esses números:** `155:405` e `155:407` ERAM o CTA
de WhatsApp e o designer os reaproveitou para o seletor em 2026-08-06; o CTA
mudou para `261:93`. Não se guie pelo número do nó sozinho.

**O arquivo desenha só o estado fechado.** A lista aberta foi vestida com o que
o header já usa (o mesmo `#e8e8e8` da borda de baixo, o mesmo corpo de 12px), e
o fundo dela é **sólido**, ao contrário do header, que é translúcido com
desfoque: a lista passa por cima do conteúdo da página e a 85% o texto do site
apareceria atrás dos nomes dos idiomas.

`<details>` foi escolha do cliente entre quatro opções, e o critério é o mesmo
do `<select>` do formulário: uma lista montada à mão precisaria de JS e de um
punhado de ARIA para chegar no mesmo lugar. O preço assumido é que **sem JS ela
não fecha ao clicar fora** — fecha no próprio botão, no Esc, ou escolhendo um
idioma.

Os nomes dos idiomas ficam em `NOMES_IDIOMA`, no `interface.ts`, escritos **no
próprio idioma** ("Português", nunca "Portuguese"): quem procura a versão
portuguesa não lê inglês para achá-la. Não vão para o Sanity pela mesma razão de
`studio/idiomas.ts` — a lista não muda sem alguém mexer no roteamento junto.

#### Duas armadilhas do `<details>`, e as duas só apareceram medindo

- **Filho `position: absolute` ESCAPA da ocultação nativa.** A lista pintava por
  cima da página com o seletor fechado, em toda visita — o elemento sai do fluxo
  e deixa de ser recortado junto com o resto do conteúdo. A correção é
  `.idioma:not([open]) .idioma__lista { display: none }`, explícito, que de
  quebra tira os links do Tab. **Não confie no `<details>` fechado para esconder
  um absoluto**; e não confie em olhar a tela, porque com o header ainda no alto
  a lista cai fora da captura.

- **O `align-self: stretch` precisa começar no ancestral certo.** A lista abre a
  partir do rodapé da caixa do `<details>`, e essa caixa tinha a altura do TEXTO
  (14,39px), não da fileira — então a lista nascia 3,22px acima da borda de baixo
  do header e cobria um trecho de 90px dela. Esticar só o `.idioma` não bastou:
  `.cabecalho__acoes` é ele próprio um item centralizado, então o `stretch` do
  filho só alcançava a altura DELE. Com os dois esticados a conta fecha e a lista
  encosta exato (medido: folga 0).

Medido contra o arquivo em 1446px: gap do grupo 32px, gap interno 8px, rótulo
Medium 500 / 12px / −0,48px, cor `rgb(23,23,23)`, globo 11,48px, chevron
6,98×3,98. Fechado, a lista não tem caixa e os links não recebem foco; aberto,
os dois invertem e o chevron vira 180°.

**Para medir o header, role a página antes.** Ele nasce escondido
(`translateY(-100%)`) e só desce depois que o hero sai da tela — na rolagem 0 o
`getBoundingClientRect()` dele devolve `bottom: 0` e todo número relativo sai
errado.

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
| `270:41`, `270:84` | áreas de atuação: um frame por grupo, com a faixa verde entre eles |
| `161:433` | divisória-loop verde, ENTRE os dois grupos de áreas |
| `194:158` | divisória-loop vermelha (`194:159`, a espelhada), entre áreas e contato |
| `161:439` | Fale conosco — `161:440` a coluna do rótulo, `161:442` o conteúdo |
| `161:446` | o card de infos: `181:26` são os três blocos, `181:22` o mapa |
| `63:79` | formulário — `76:248` título mais eixos, `85:376` a instância do card de campos (componente `85:312`) |
| `268:41` | rodapé — `268:42` a navegação, `268:54` a assinatura gigante |
| `155:385` | header |
| `62:10`, `138:55`, `138:81`, `138:294` | abertura: 4 quadros da animação |

### Armadilha: o designer SUBSTITUI o nó em vez de editá-lo, e o antigo fica no arquivo

Quatro nós citados aqui trocaram de id em 2026-08-12, e buscar o antigo devolve
`node not found` — o que parece link quebrado, ou pior, faz alguém concluir que o
nó foi deletado do desenho:

| o que é | id anterior | id de hoje |
|---|---|---|
| rodapé | `52:21` | **`268:41`** |
| áreas, 1º grupo | `54:179` | **`270:41`** |
| áreas, 2º grupo | `105:191` | **`270:84`** |
| faixa do Thiago (instância) | `212:78` (o set) | **`235:30`** |

**O caso do rodapé é o perigoso, porque o `52:21` NÃO deu erro:** ele continua no
arquivo, íntegro, só que **fora** do frame "One Page" — é a versão anterior,
deixada de lado. E como a geometria das quatro colunas (`482/338/357/205`, gutter
32, `min-height` 368) é justamente a única coisa que a leva não mexeu, conferir o
rodapé por ele bate com o código em tudo e responde "nada mudou". Mudou toda a
tipografia, a cor e o ritmo vertical.

A lição vale para a próxima leva: **antes de conferir uma seção por um id
decorado, confirme que ele é filho do `51:12`.** Uma leitura do "One Page" com
`depth: 2` lista os filhos de verdade e custa uma chamada.

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

### A leva de 2026-08-06: o designer padronizou, e três tokens mudaram de natureza

Varredura nó a nó do frame inteiro contra o código. A maior parte da leva não foi
seção por seção — foi **token**, e é por isso que vale registrar aqui e não em
cada componente:

- **`--cor-apoio: #848484` no lugar de `--opacidade-apoio: 0.83`.** Os cinco
  rótulos de apoio (chamada do manifesto `105:228`, rótulo dos clientes
  `152:369`, das duas Áreas `152:372` e `218:128`, do Fale conosco `161:441`)
  passaram a declarar o mesmo fill sólido. O par preto + 0.83 que existia aqui
  pintava ~`#2B2B2B` — escuro demais, e ainda tirava o texto da camada de fundo
  (a mesma razão que já tinha feito o hover do rodapé deixar de ser `opacity`).
  O token de fonte veio junto: `400 20px/1.25`, `-0.04em`, contra os
  `500 20px/1.1`, `-0.05em` de antes;
- **`--cor-cinza-divisa: #ebebeb` é diferente de `--cor-cinza-claro: #dce4e2`,
  e a divisa entre os dois é literal.** O `#dce4e2` é **só** da parede de
  clientes (`76:181`); as divisas dos cartões das Áreas, do card do Fale conosco
  e dos campos do formulário são `#ebebeb`. Usar um pelo outro foi o engano que
  esta leva desfez. `--cor-cinza-borda: #bdbdbd` sobrou para a lista de países
  do telefone, que é acréscimo nosso e não tem nó para copiar;
- **`--cor-preto` virou `#171717`.** Decisão do cliente nesta leva: o arquivo
  usa esse quase-preto em todo texto escuro, na faixa da matéria, no bloco da
  apresentação e no botão Enviar. Era `#000` puro por uma decisão antiga de
  unificar, de quando o arquivo ainda misturava preto com o petróleo escuro
  `#031E21`. Os derivados acompanharam (`--cor-texto-fraco`,
  `--cor-texto-footer`, `--cor-borda-sutil`), e o hover do botão Enviar teve
  que subir de `#1a1a1a` para `#2b2b2b` — contra `#171717` o valor antigo era
  invisível.

Três diferenças que o arquivo tem consigo mesmo e que o código reproduz de
propósito, cada uma com comentário no lugar:

1. **o título do Sobre (`185:95`) ficou em `-0.07em`** enquanto os outros quatro
   títulos de seção desceram para `-0.06`. Por isso `--texto-titulo-secao-ls` é
   `-0.06` e `.sobre__titulo` tem regra local;
2. **o rótulo do Fale conosco tem `opacity: 0.7` além do fill `#848484`**, o que
   o deixaria mais claro que os quatro irmãos. Tratado como sobra de edição;
3. **os dois grupos de Áreas têm `gap` diferente** (32 no primeiro, 64 no
   segundo) e só o primeiro tem os 12px de padding no rótulo.

O que **não** foi revertido, embora o arquivo discorde: o `letter-spacing` de
-0.03em nas descrições dos cartões, a borda na célula vazia das Áreas e todo o
comportamento do breakpoint de 700px. São pedidos do cliente que continuam
valendo — ver cada seção.

### A leva de 2026-08-12: três tokens de tamanho, e o rodapé refeito

Outra varredura nó a nó. De novo a maior parte foi **token**, e de novo isso é o
que faz a leva sair barata: três valores mudaram e desceram sozinhos para dez
lugares, sem tocar em componente nenhum.

| token | era | virou | onde aparece |
|---|---|---|---|
| `--texto-apoio` | 20px | **16px** | chamada do manifesto, rótulo dos clientes, os dois das Áreas, o do Fale conosco |
| `--texto-c2` | 18px | **16px** | as três faixas do Sobre e as descrições dos cartões das Áreas |
| `--texto-menu` | 600 | **400** | só a nav do header (o CTA ao lado não herda, tem peso próprio) |

Os pesos que mudaram fora de token, e vale notar que **dois pares que eram iguais
deixaram de ser** — é o tipo de coisa que se conserta errado por simetria:

- **campo do formulário 500 → 400**, e o botão Enviar **continua** 500. O arquivo
  já mexeu nesse peso em três levas seguidas;
- **"Voltar ao topo" 600 → 500**, enquanto a nav do rodapé continua 600;
- **copyright e links legais 500 → 400.**

E um tamanho pontual: `.dado__item` do Fale conosco, 14px → **16px**.

#### O que aprendi conferindo, e economiza a próxima varredura

- **duas notas daqui estavam desatualizadas em relação ao próprio código**, e não
  por causa desta leva: o `gap` do bloco da apresentação (o texto dizia 10px, o
  código está em 4px, que é o que o arquivo pede) e a seta do `<select>`, que a
  leitura do arquivo sugere à esquerda e que **já está** à esquerda. Fui mexer nos
  dois e descobri que não havia o que mexer. Conferir o código antes de acreditar
  neste arquivo vale para qualquer seção;
- **`.materia__logo` encolheu de novo** (105 → 86 em 2026-08-06, 86 → **81,67**
  agora). São sempre os mesmos três números que precisam andar juntos — `width` no
  CSS, `larguras` e `sizes` no `imagem()`.

O que **não** foi alinhado, por decisão do cliente nesta leva: as divergências
que ele já pediu antes seguem valendo (ls -0.03em nas descrições, nav do header
com 5 itens contra os 4 do arquivo, "LinkedIn" com I maiúsculo, caixa de frase nos
títulos, o vão de 24px da matéria).

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

### A exceção do mobile: um breakpoint, e só onde é comportamento

A regra acima ("sem breakpoint") vale para a faixa que o cliente pediu — 720p
a 2K, todos os valores em `rem` acompanhando o `clamp()`. Ela nunca foi pensada
para celular, e isso apareceu na prática em 2026-07-31: abaixo de **~1084px**
de viewport (onde `1.1065vw` cruza os `0.75rem` do piso), o `clamp()` **para
de encolher** — um tablet de 1000px e um iPhone de 375px renderizam com o
mesmo `rem` em pixel físico, porque nada mais na conta depende da largura da
tela. Medido com CDP (`Emulation.setDeviceMetricsOverride` em 375px, viewport
real, não simulação de DevTools): 269px de estouro horizontal só no
cabeçalho, a parede de 36 logos dos clientes esmagada a 2px de largura
(efetivamente invisível), a dupla telefone/e-mail do formulário inteira fora
da tela.

A correção não é abandonar a regra — é uma exceção pontual, documentada em
cada lugar que a usa: **um único breakpoint, `max-width: 700px`**, reservado
para comportamento que muda (nav que some, coluna que vira empilhada, grade
de 3 colunas que vira 2, rótulo grudado que vira chapéu inline), nunca só
para "ajustar tamanho" — isso continua resolvido com `flex-wrap` e
`min()`/`max()` fluidos, como sempre foi. A maioria dos ajustes do celular,
de fato, não precisou do breakpoint: `flex-wrap: wrap` nas seções que tinham
colunas fixas lado a lado (Manifesto, Clientes, Fale conosco, Formulário)
resolveu sozinho, e `max()` resolveu onde um piso físico importava mais que
a proporção (toque, legibilidade — ver adiante).

`--gutter-mobile: 32px` (`tokens.css`) é o único token novo: o respiro
lateral padrão dentro do breakpoint. **`px`, não `rem`** — dentro de
`max-width: 700px` a fonte-raiz já está travada no piso do clamp (12px), e um
`rem` ali só reproduziria o mesmo problema que o breakpoint existe para
resolver. A mesma lógica vale para qualquer valor exato pedido pelo cliente
nessa faixa (toque de 24px, respiro de 32px): `px` cru, nunca `rem`.

**A exceção da exceção: quando o pedido é "igual ao outro", copie o valor, não
o converta.** No hero (2026-08-12, pedido do cliente) o vão entre título e
descrição passou a ser o mesmo que já separa a descrição do link. Esse outro vão
é o `gap: 2rem` do `.hero__aparte`, e escrever `24px` no `.hero__base` deixaria
os dois iguais só até alguém mexer num deles. O `px` cru existe para valor que o
cliente pediu em pixel; para valor que ele pediu **por igualdade**, o que
preserva o pedido é a mesma expressão.

#### Quando a coluna quebra, o número dela deixa de descrever o desenho

Mesma sessão, mesmo hero: a coluna do aparte tem base de 305px (`35:97`) e o nó
de texto dentro dela, 289 (`35:98`) — os 16px de folga que o designer deixou
**dentro** da coluna. Empilhada pelo `flex-wrap`, essa coluna vira uma faixa
estreita com sobra à direita, e o `max-width` do texto vira um recuo sem razão.
Dentro do breakpoint os dois saem (`flex-basis: 100%` e `max-width: none`), e a
descrição vai até o padding da seção. Medido a 375px: 311px de texto, folga zero
até a borda.

Vale como aviso geral para as outras colunas em `flex`: **medida de fatia não
sobrevive à quebra de linha.** Quando duas colunas viram duas linhas, quem era
proporção passa a ser largura solta.

E sobra uma faixa estreita onde o hero empilha **sem** estar no breakpoint —
medido, de 701 a ~732px: ali o título (base de `30rem`) e o aparte já não cabem
lado a lado, mas as regras de mobile ainda não valem, então a descrição volta a
ficar com os 216,75px. Acima de 733 eles cabem de novo e o desenho é o do
arquivo. São 32px de largura de janela; se um dia incomodar, é subir o teto do
breakpoint desta seção, não mexer nas bases.

#### Quatro armadilhas que morderam de verdade

- **`flex-wrap` não resolve item com `flex: 1` puro.** `flex: 1` é
  `flex-basis: 0%` — um item de base zero nunca "transborda" a ponto de
  precisar quebrar linha, só encolhe ou cresce para caber. A dupla
  telefone/e-mail do formulário (`.campos__dupla`, dois `.campo--metade` com
  `flex: 1`) ficava lado a lado, espremida, em QUALQUER largura, porque o
  `wrap` nunca tinha o que fazer. A correção é `flex-direction: column`
  dentro do breakpoint — força o empilhamento independente da base dos
  filhos;

- **Item de flex sem `min-width: 0` não encolhe abaixo do próprio
  conteúdo — e se o ancestral tiver `overflow: hidden`, a sobra não vira
  barra de rolagem, some cortada, sem aviso.** `.campos` (o card do
  formulário) parava de encolher assim que o script do telefone revelava o
  botão de país (`flex-shrink: 0`); abaixo de ~360px o card ficava mais
  largo que a tela, e como `.formulario` tem `overflow: hidden`, o pedaço
  que sobrava simplesmente desaparecia — sem scroll, sem erro no console,
  só conteúdo perdido. `min-width: 0` no `.campos` resolveu. Sempre que um
  filho de flex tiver um ancestral com `overflow: hidden`, vale checar isso
  antes de confiar que "encolheu";

- **Dois seletores de mesma especificidade, um dentro do breakpoint e um
  fora: quem vem depois no arquivo é quem vale — mas só se a posição no DOM
  não coincidir por acidente com as duas fórmulas ao mesmo tempo.** Em
  `Clientes.astro`, a borda esquerda que marca a 1ª coluna de 3
  (`:nth-child(3n + 1)`, regra de sempre) e a que devia marcar a 1ª coluna
  de 2 no mobile (`:nth-child(2n + 1)`, dentro do breakpoint) têm a MESMA
  especificidade — e a célula 4 bate nas duas fórmulas (4 = 3×1+1, e também
  é par). Escrever a regra mobile como "zera tudo, tira de novo"
  (`.clientes__celula { border-left: 1px }` seguido de `:nth-child(2n+1) {
  none }`) perde para a regra de sempre nessa célula específica, mesmo
  vindo depois no arquivo — porque a classe pura sozinha tem especificidade
  MENOR que `:nth-child(3n+1)`. A saída é escrever a regra positiva com a
  mesma especificidade (`:nth-child(2n)`, não a classe pura): aí sim a
  ordem no arquivo desempata a favor de quem vem depois. Só apareceu porque
  o cliente reparou que faltava uma borda numa fileira específica — não
  dava para prever só lendo o CSS;

- **`0` sem unidade é inválido dentro de `calc()` somado a uma
  porcentagem — e o navegador descarta a declaração INTEIRA, não só o
  termo.** O ornamento do formulário usa `translate: calc(-50% +
  var(--ornamento-x, 0))`; o fallback `0` (sem `px`) é válido como valor
  solto de `translate`, mas dentro do `calc()` somado a uma `%` não é — a
  regra inteira cai, e o elemento renderiza como se o `translate` nunca
  tivesse sido escrito (sem o `-50%`, sem centralizar nada). Só acontece
  antes do primeiro movimento do ponteiro, quando o script ainda não
  escreveu a variável — em produção, é o estado inicial de QUALQUER visita.
  `var(--x, 0px)`, com a unidade dentro do fallback, resolve.

## Fontes — não trocar o provider

```js
provider: fontProviders.fontsource()   // NÃO google()
```

Com `fontProviders.google()` a Noto Serif KR sai com **373 `@font-face`, 122
arquivos e 6.1 MB**, hangul incluído. `subsets: ['latin']` não adianta (já é o
padrão) e `unicodeRange` também não. Fontsource resolve: 6 arquivos, 128 KB.

**Cada família precisa do seu `<Font>` no `Base.astro`.** Configurar em
`astro.config.mjs` e esquecer a linha do layout faz a família existir no build —
o `.woff2` chega a ser copiado para `dist/` — sem que o `@font-face` e a variável
CSS cheguem à página. O sintoma é silencioso: o navegador **sintetiza** o que
falta (inclina a fonte reta para fingir itálico, trava o peso no mais pesado
carregado) e nada no console avisa. Conferir com `document.fonts` no navegador,
não com o número de arquivos em `dist/`.

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

### Atualização do Sobre via API REST do Figma (2026-08-05)

Ajustes de padding, gap e tipografia sincronizados com o Figma `hJuV9y2PAHLZdOsrrW0n5X`
usando a **API REST** (não o MCP, que estava com JSON inválido na config):

- **título da história** (`.sobre__titulo`): `max-width` de 468→444px (27.75rem);
- **faixa preta da matéria** (`.materia`): padding vertical de 24→48px (3rem);
- **chamada da matéria** (`.materia__chamada`): fonte de 14→13px (0.8125rem),
  `max-width` de 232→350px (21.875rem). Texto no Sanity também atualizado:
  *"Representando a Sulpetro, Thiago Tobias Bezerra colabora para reduzir
  carga de ICMS-ST de empresas gaúchas."*;
- **bloco da apresentação** (`.apresentacao`): padding vertical de 24→48px;
- **chamada da apresentação**: `gap` de 32→10px — e **cuidado, isto está velho.**
  Quem tem `gap` é `.apresentacao__texto`, não `.apresentacao__chamada` (que é
  `space-between` e não declara nenhum), e o valor de hoje é **4px**, que é o que o
  arquivo pede (`212:71`). Conferido em 2026-08-12, quando fui "corrigir" o número
  e descobri que não havia o que corrigir;
- **gaveta aberta** (variante ask-email): `margin-bottom: 1rem` (16px extra
  embaixo, que é a diferença entre pB=48 do Default e pB=64 das variantes com
  gaveta) — **e isto saiu em 2026-08-12**, a pedido do cliente: com o campo à
  mostra o respiro de baixo é igual ao de cima, os 48px do padding do bloco. A
  divergência do arquivo é assumida; ver a seção do bloco de download.

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
As duas variantes do componente (`185:101` e `185:117`) declaram a mesma medida,
daí o CSS pedir uma largura fixa com `flex-shrink: 0` e nenhuma regra de hover
que toque no tamanho. **Em 2026-08-06 essa medida encolheu de 105×36 para
86×29,49** — o designer redesenhou o nó, e o número deixou de ser a medida nativa
do PNG. Ele aparece em dois lugares que precisam andar juntos: o `width` do CSS e
o `larguras`/`sizes` do `imagem()` no frontmatter. A conta da chamada ao lado
(468 − 86 − 32 = 350) já era feita com 86; era o CSS que estava fora.

A única diferença que sobra entre as variantes é o respiro até a chamada (32px no
normal, 24 no hover); parece sobra de edição, não desenho, e aqui ficam 24 nos
dois — ver a seção da chamada, logo abaixo, para por que 24 e não 32.

**O arquivo do logo precisa ser maior que a medida de exibição, e o `sizes`
precisa contar a verdade.** Até 2026-08-06 o asset no Sanity tinha 105×36 —
exatamente o tamanho de exibição na largura de projeto —, então qualquer tela 2×
pedia 172px de uma fonte de 105 e a CDN ampliava: o cliente viu como
pixelização. Trocado por um de 164×56.

E o `sizes` dizia `'86px'`, que é falso: `.materia__logo` pede `5.375rem`, e com
a fonte-raiz em `clamp(12px, 1.1065vw, 28px)` o logo mede de **64,5 a 150,5px**
conforme a tela. Numa tela 2K o navegador pedia 86px para desenhar 150 — borrado
mesmo com arquivo bom. Agora é `clamp(64.5px, 5.95vw, 150.5px)`.

Vale para qualquer imagem de largura fixa em `rem` neste site: **`sizes` com um
px cravado está errado por construção**, porque nada aqui tem largura cravada —
tudo escala com o `clamp()` da raiz.

#### A chamada da matéria: três pesos, e a armadilha do run AO CONTRÁRIO

O nó `185:104` é o texto mais denso do site, e cada camada dele custou medição.

**O `letter-spacing` é -0.02em, não os -0.04 que a base declara.** Esta é a
armadilha do run (ver "o run só carrega o que ele sobrescreve", acima) na direção
que ninguém espera: o `textStyle` base do nó diz `-0.04em`, mas os **três** runs
sobrescrevem para `-0.02` — o valor da base nunca chega a ser pintado. Ler só a
base põe a frase 13px mais estreita numa linha de 350. Medido contra o render do
nó: a -0.04 a linha 1 saía com 337,5 contra os 350,7 do arquivo; a -0.02, 350,2.
**Quando TODOS os runs sobrescrevem uma propriedade, o valor da base é ruído.**

**São três pesos numa frase só:**

| trecho | peso |
|---|---|
| "Representando o Sulpetro," | Medium 500 (a base) |
| "Thiago Tobias Bezerra" | negrito (o arquivo pede Bold Italic 700) |
| "colabora para reduzir…" | Regular 400 |

Confirmado no pixel, achando os vãos entre palavras no render exportado: a
abertura termina em x=157,33, e a 500 o Chrome dá 157,1 contra 155,2 a 400. A
linha 2, que é toda Regular, mede 317,67 no arquivo — a 400 dá 319,3, a 500 daria
321,9.

Por isso `historia.materiaChamada` é **Portable Text** (tipo `chamadaMateria` no
Studio), com dois decoradores — `nome` e `leve`, os dois desvios em relação à
base. Mesmo padrão do aparte do hero, e pelo mesmo motivo: peso é marca DENTRO
da frase. (Ela morou em `configuracoes.materia.chamada` até 2026-08-07 — ver "A
chamada da matéria já esteve do lado errado", na seção do Sanity.)

**O itálico saiu, por decisão do cliente (2026-08-06), e a razão é medida.**
Carregar a face itálica de verdade custava pouco (uma entrada própria no
`astro.config.mjs`, 1 arquivo e 28 KB — a API do Astro faz produto cruzado de
pesos × estilos, então pedir 700+itálico na entrada normal geraria 8 arquivos no
lugar de 3). O problema não era o peso do download: **a face itálica do
Fontsource sai 2,91px mais larga que a inclinação sintetizada, e ~1,5px mais
larga do que o Figma desenha** — versões diferentes do Inter. Com ela, "colabora"
não cabia mais na primeira linha, a chamada ia a três linhas e a faixa preta
subia de 128,7px para 145,1 (o arquivo desenha 128). Entre reproduzir o itálico e
reproduzir a quebra em duas linhas, o cliente escolheu a quebra. O nome ficou em
600, que é o `--peso-destaque` que o site já carrega.

**A caixa do texto não tem `max-width`, e o vão até o logo é 24 e não 32.** No
arquivo o nó é `fill` (#185:104): os 350px que já estiveram escritos aqui eram o
RESULTADO da conta (468 − 86 − 32), não medida de desenho — e quando o vão ao
lado mudou, o `max-width` virou gargalo e a caixa não cresceu junto. Os 8px do
vão são o que compra a segunda linha: a conta do Figma não sobra (caixa de 350
para uma tinta de 350,67 — o arquivo roda a linha até passar da borda), o Chrome
precisa de ~2,5px a mais para a mesma frase, e a nossa faixa ainda tem 723px em
vez de 724, que é o preço já conhecido de usar 50%. Saíram do vão porque é o
único valor de puro respiro do grupo: mexer no padding de 96 desalinharia o logo
com a coluna de texto acima, e mexer no logo ou no ícone mudaria medida de
desenho.

**A fonte é 12px, e o arquivo pede 13** (pedido do cliente, 2026-08-06). O
motivo era ganhar largura na zona morta descrita abaixo. Ganhou pouco: o limite
das 2 linhas desceu de 1084px para ~1040 — 44px de faixa a mais. E na largura de
projeto a quebra **deixou de coincidir com a do render**: com a fonte menor,
"para" sobe para a primeira linha, enquanto o arquivo quebra depois de
"colabora". Duas linhas continuam sendo duas linhas, e a faixa mede 127,95
contra os 128 do arquivo.

#### A zona morta entre ~1040 e 700px

A chamada quebra em 3, 4, 5 linhas nessa faixa, e **não é problema da caixa de
texto** — é a assimetria que o `clamp()` cria:

| viewport | caixa tem | texto precisa |
|---|---|---|
| 1084 | 267,5 | 268,8 |
| 1000 | 225,5 | 268,8 |
| 900 | 175,5 | 268,8 |
| 800 | 125,5 | 268,8 |

Abaixo de 1084px a fonte-raiz trava em 12px, então o texto para de encolher —
mas `.materia` continua sendo **50% da viewport** e some largura. Aos 1000px a
faixa inteira tem 500px, e padding (72×2) + logo (64,5) + vãos (42) + ícone (24)
já ocupam 274,5. Não existem 43px para tirar sem desalinhar o logo da coluna de
texto acima, que hoje bate em 0,8px em toda a faixa. Abaixo de 700px o problema
some sozinho: o breakpoint mobile põe a faixa em 100% e sobram 468px.

Aumentar a largura da caixa não resolve, e reduzir a fonte quase não resolve —
os dois já foram tentados e medidos. O que resolve na faixa inteira é **encurtar
a chamada**, que é uma linha de texto no Studio.

**Com o inglês, cada língua tem a sua zona morta**, e a inglesa começa antes
(medido em 2026-08-07, com a chamada de 115 caracteres contra os 107 do
português):

| viewport | PT | EN |
|---|---|---|
| **1446** (projeto) | **2 linhas, faixa 127,95px** | **2 linhas, faixa 127,95px** |
| 1200 | 2 | 2 |
| 1040 | 2 | 3 |
| 900 | 3 | 4 |
| 800 | 5 | 5 |

Na largura de projeto as duas saem idênticas e batem com os 128px do arquivo — a
linha inglesa mais longa mede 307,84px numa caixa de 357,09, com 49px de folga.
O inglês só degrada um degrau antes na descida, o que é o mesmo defeito
estrutural, não uma regressão. **Ao traduzir esta frase para uma terceira
língua, meça as duas coisas:** o número de linhas em 1446px (tem de ser 2) e a
altura da faixa (tem de ser ~128px).

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
  sozinhos. Medido em 2026-08-12: **152,83px fechado, 208,91 com o campo à
  mostra e 211,42 com uma frase de estado no lugar dele** — e a invariante que
  importa é que os TRÊS estados (enviando, sucesso, falha) medem o mesmo, sem
  pulo. Os 104,83/163,42 que este arquivo trazia são de antes de o padding
  vertical subir de 24 para 48px, em 2026-08-05 (104,83 + 48 = 152,83 fecha a
  conta), e os 227,41 são de antes de a margem de baixo da gaveta sair, no mesmo
  2026-08-12 (227,41 − 16 = 211,41);

- **o respiro de baixo é igual ao de cima com o campo à mostra**, e isso é
  divergência assumida do arquivo (que pede pB=64 na variante ask-email contra os
  48 do Default). Pedido do cliente, 2026-08-12. Os 16px que faziam a diferença
  eram `margin-bottom` na gaveta aberta; hoje os dois vãos são o mesmo
  `padding: 3rem` do bloco. Medido: 47,98px do topo até o título e 47,98 da linha
  do campo até a base. **Os 18px do mobile continuam lá** e são só do toque — ver
  o comentário da media query, que explica por que medir isso encolhendo a janela
  do desktop dá outro número;

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

#### A barra não acompanha o freio do Sobre: ela cola na camada de baixo

Pedido do cliente, 2026-08-12. Antes, estando dentro da `.camada-sobre`, a barra
afundava junto com o Sobre e ia sendo **engolida pelas Áreas** (z-index 3 contra 2)
conforme a camada subia — medido desligando o contrapeso: em toda a faixa de
entrada a barra não aparece na tinta, está atrás do branco.

Agora ela leva o **contrapeso** (ver a seção dele, mais abaixo): a animação inversa
do freio, na mesma timeline `--areas` e na mesma faixa `entry`. As duas se cancelam,
a barra fica na posição de layout dela — que é a base da última faixa do Sobre, ou
seja **exatamente a emenda com as Áreas**. Como a `.camada-areas` não é freada,
barra e Áreas passam a andar as duas a 100% da rolagem: a barra fica soldada à borda
de cima das Áreas e, relativamente ao Sobre, sobe — porque é o Sobre que afunda a
35%. A faixa `entry` leva essa borda do rodapé da tela até o topo, então a barra
atravessa a tela inteira à vista.

Medido por pixel (a emenda é preto contra branco, contraste máximo): em **12
amostras**, seis a 1446×900 e seis a 1446×1300, a base da barra na tinta e o topo
das Áreas batem em **0,17px** — que é só o arredondamento de subpixel.

**A DEPENDÊNCIA QUE NINGUÉM ADIVINHA: isto só funciona porque a faixa do Thiago é a
ÚLTIMA do Sobre.** Hoje só o Thiago tem o bloco no Sanity, e é isso que faz a base
da barra coincidir com a emenda entre as duas camadas. Se a Marjorye ganhar o bloco
um dia, o dela vai cancelar o mesmo freio contra uma emenda que **não** é a das
Áreas — vai colar no meio do Sobre. Não é defeito de CSS, é o contrapeso fazendo
exatamente o que se pede dele no lugar errado.

A barra da matéria (`.materia`) **não** leva contrapeso: continua freada junto com o
Sobre, de propósito.

Duas coisas que o `transform` do contrapeso **não** quebrou, conferidas: a gaveta
(que é grade, não transform) abre igual, e o gate continua travando com e-mail
inválido e liberando com válido — o script não lê geometria nenhuma, só classes.

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
valor dele que segura a gaveta aberta e o botão liberado. Medido em 2026-08-12: o
bloco fica em **211,42px nos três estados**, sem pulo (eram 227,41 antes de a
margem de baixo da gaveta sair, no mesmo dia, e 163,42 antes de o padding
vertical dobrar, em 2026-08-05).

Para conferir as frases sem envio nenhum: `?apresentacao=enviando`,
`?apresentacao=sucesso`, `?apresentacao=falha` — mesma encenação do formulário.

**A encenação não dispara na carga da página.** Ela vive dentro de
`pedirPorEmail()`, então a URL só arma o cenário: é preciso preencher um e-mail
válido e **clicar no botão** para a frase aparecer. Abrir a URL e esperar devolve o
bloco no estado normal — o que parece encenação quebrada e não é. E cuidado ao
testar: o clique **baixa de verdade** (o `preventDefault` não existe, de propósito),
então em automação vale `Browser.setDownloadBehavior: deny` antes, senão o teste
puxa os 63 MB.

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

### O vídeo de fundo do hero

Pedido do cliente, 2026-07-31: vídeo no lugar da foto estática
(`Hero.astro`). **Zero JS** — nem entra na lista das sete exceções ao
"sem JS", porque o mecanismo inteiro é `<video autoplay muted loop
playsinline>` mais uma media query.

O arquivo de origem, `src/assets/video-hero.mov`, é ProRes 4K de 692 MB
e ~10s — grande demais para o repositório e cru demais para servir.
Convertido com

```
ffmpeg -i video-hero.mov -vf "scale=1920:1080:flags=lanczos" \
  -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p \
  -profile:v high -level 4.1 -movflags +faststart -an video-hero.mp4
```

para **1080p H.264, 4 MB, sem trilha de áudio** (o vídeo é só fundo,
`aria-hidden`, e o site já não tinha som em lugar nenhum — `-an` evita
carregar bytes que ninguém vai ouvir). O `.mov` de origem fica de fora
do git (ver a nota no `.gitignore`, junto do PDF de 66 MB da
apresentação) e o `.mp4` gerado vai para `public/`, não `src/assets/`:
é vídeo, não imagem — o pipeline do Astro não o toca, e ele precisa
sair do build exatamente como está, igual ao PDF da matéria.

O `<video>` ocupa a **mesma caixa** que `<img class="hero__foto">`
(`position: absolute; inset: 0; z-index: -2`), e a foto **continua no
DOM**, por baixo: é o quadro que aparece antes do vídeo terminar de
carregar e o que sobra para quem prefere sem movimento.

A troca por `prefers-reduced-motion` aqui é **ao contrário** do resto
do site. Em toda outra animação da página o estado visível é a base e
é a animação que esconde — sem suporte, o texto ou a camada continuam
lá (ver "Nunca deixe o estado apagado como base", abaixo). Aqui é o
inverso: o vídeo nasce com `display: none` e só vira `display: block`
dentro de `@media (prefers-reduced-motion: no-preference)`. A razão é
que não existe nenhum `animation-timeline` sustentando essa troca — sem
JS e sem timeline, a única forma de garantir que quem pediu sem
movimento nunca veja o vídeo rodar, nem por um quadro, é ele nascer
escondido e a media query é que precisa se esforçar para revelar, não o
contrário.

`muted` é obrigatório — sem ele nenhum navegador libera `autoplay` — e
`playsinline` evita o iOS abrir o vídeo em tela cheia sozinho.

**O vídeo NÃO está no Sanity, e isso é decisão, não esquecimento.** Ele é o
único pedaço de conteúdo visível que o cliente não edita sozinho, contra a
premissa do resto do projeto. A razão: a CDN da Sanity redimensiona imagem, mas
**não transcodifica vídeo**. Um campo de upload livre significa que um dia
alguém sobe o ProRes de 692 MB e o site passa a servir isso no topo da página,
sem nada no caminho para impedir. Se um dia virar campo, que venha com validação
de tamanho.

#### A escada de resolução, medida (2026-08-07)

O material é uma montagem de três planos em 10s — Porto Alegre do alto
(Gasômetro, Guaíba, Beira-Rio), um skyline ao anoitecer e uma travessia urbana.
Três cortes, muito detalhe fino e um degradê de céu inteiro: não é o caso fácil
que "vídeo de fundo" sugere.

Todos no mesmo `-preset slow -crf 26`, SSIM contra o ProRes exibido a 4K, e a
coluna que importa é a **com o véu** — a faixa por cima do vídeo vai de 53% de
preto no topo a **preto total** embaixo, então metade da imagem é invisível e o
topo é visto a ~47%:

| versão | tamanho | SSIM cru | SSIM com véu |
|---|---|---|---|
| 720p | 2,03 MB | 0,9568 | — |
| **1080p (no ar)** | 4,04 MB | 0,9728 | 0,9853 |
| 1440p | 6,46 MB | 0,9794 | 0,9887 |
| 2160p | 13,20 MB | 0,9849 | 0,9917 |
| 1440p a CRF 20 | 16,55 MB | 0,9867 | — |

O véu corta os dois degraus pela metade, **por igual** — ele não penaliza a alta
resolução em particular. O argumento contra o 4K é preço: ele entrega
praticamente o mesmo incremento que o degrau anterior (+0,0030 contra +0,0034)
por **2,8× os bytes**.

**E há um limite de mecanismo que decide sozinho:** `<video>` não tem
`srcset`/`sizes`. O que existe é `media` no `<source>`, e ele funciona — testado
no Chrome — mas com duas propriedades que importam: a seleção é feita **uma vez,
na carga** (redimensionar não troca de arquivo), e a media query lê **pixels
CSS**. Um 27" 4K na escala de fábrica reporta **1920 CSS px**, indistinguível de
um 1080p real. Ou seja: o "monitor bom e caro" que justificaria o 4K é
exatamente o que a media query não sabe identificar.

Recomendação registrada, ainda não executada: **720p abaixo de 700px, 1440p
acima** — o corte cai de graça no único breakpoint que o site já tem. Mobile pela
metade, desktop com o degrau que rende, nenhum 4K que não se consegue endereçar.

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

Os 65vh moram em **`--freio-camada`** (`tokens.css`) e não cravados no keyframe,
porque desde 2026-08-12 são **dois** consumidores, em arquivos diferentes e com
sinais opostos: o freio (`camada-frear`, no `Site.astro`) e o contrapeso da barra
da apresentação (`camada-contrapeso`, no `Sobre.astro`). Dois números divergiriam
na primeira vez que alguém acertasse um só, e o sintoma seria a barra descolando
da emenda — visível, mas sem nada apontando para a causa.

### O contrapeso: cancelar o freio de uma camada num filho dela

O freio é `transform`, e `transform` é pintura: ele desloca **tudo** que está
dentro da camada. A ferramenta para tirar um filho dessa carona é pendurar nele a
animação **inversa** — mesma timeline, mesma faixa, deslocamento negado. As duas se
cancelam e o filho fica parado na posição de LAYOUT dele.

O número dos dois lados vem de **`--freio-camada`** (`tokens.css`, 65vh). Ele é
token justamente porque tem dois consumidores com sinais opostos e em arquivos
diferentes: `camada-frear` no `Site.astro` e `camada-contrapeso` no `Sobre.astro`.
Acertar um e esquecer o outro descola sem nada gritar.

A armadilha do minificador vale aqui: `animation` e `animation-timeline` em regras
separadas, com seletores diferentes.

**Dois usos, e o motivo é oposto em cada um:**

1. **Para segurar um `sticky` no lugar** — o caso original, hoje inativo (o rótulo
   das Áreas, que deixou de ser freado quando o contato virou rolagem linear). O
   `sticky` calcula contra a tela, ignorando o transform do ancestral, e o
   resultado pintado vira `top + freio`: o rótulo descia meia tela enquanto o
   resto da seção subia, e parecia defeito, não parallax. Aqui o contrapeso
   conserta um sintoma;

2. **Para colar um filho na camada de BAIXO** — a barra da apresentação, desde
   2026-08-12, e o primeiro caso ativo. Aqui o contrapeso é o efeito, não o
   conserto: livre do freio, o elemento passa a andar a 100% da rolagem, igual à
   camada seguinte (que não é freada), e fica soldado à borda de cima dela
   enquanto a camada em que ele mora afunda a 35%. Ver a seção do bloco de
   download.

O que mudou de entendimento com o caso 2: **isto não vale só para `sticky`.** O
texto aqui dizia "só faz sentido para quem é `sticky`; qualquer outro filho da
camada DEVE andar junto com o freio" — a segunda metade é falsa. Qualquer filho
pode sair do freio de propósito; o que ele ganha é a velocidade da camada de baixo.

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
torno de 2304. A cor dela é o `#C1503B` do arquivo — um tijolo mais claro que não
aparece em nenhum outro lugar do site, e é isso mesmo. Até 2026-08-06 ela usava a
terracota da marca (`#7A3225`, a da faixa do Thiago), por uma decisão daqui; o
cliente a reverteu quando o Figma voltou a valer como fonte da verdade.

As duas cores moram dentro dos SVGs porque eles entram como `background-image`, e
imagem externa não herda `currentColor` nem enxerga variável de CSS. Consequência
prática: **a vermelha não tem token nenhum**, e mudar a cor dela é editar
`divisoria-vermelho-loop.svg`. Se um token de cor mudar, os arquivos têm que ser
editados junto.

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

Os 36 logos reais chegaram em **2026-07-31**. Migraram direto para
`configuracoes.clientes` no Sanity — uma lista achatada, sem os quatro
grupos (ver "A divisa que sustenta o i18n", acima): cada item traz `logo`
(a imagem), `nome` (que dobra de `alt`), `largura` (em rem, ver a seção
abaixo) e, quando precisa, `ajusteOptico`. Até a migração, o mesmo grupo de
nove aparecia 4× só para a passagem rodar.

O componente recebe a lista pronta por prop e fatia de 9 em 9 (`POR_GRUPO`)
**aqui**, não no CMS: agrupar pediria ao cliente que pensasse em "slide",
que é apresentação, não conteúdo — o 37º cliente cria um quinto grupo e uma
quinta divisória sozinho, sem editar nada além da lista.

`src/assets/clientes/slide-1` a `slide-4` ainda existem no disco — são os
arquivos originais que a migração leu para subir ao Sanity — mas **nenhum
código os referencia mais**: nem glob, nem import, nem script. Ficaram como
histórico da migração, não como fonte do site.

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

Duas coisas que custaram medição, e que voltam a morder se alguém mexer:

- **o ciclo inteiro somado na frente não é enfeite.** Sem ele, pular para o
  primeiro grupo joga o último para tempo negativo, onde ele ainda está no atraso
  e não pinta quadro nenhum: o grupo que devia sair da frente simplesmente não
  está lá, e no lugar do cruzamento aparece um surgimento do branco;
- **parada, a passagem precisa de outro alvo.** Se as animações estiverem
  pausadas, o quadro não avança sozinho — cravar no começo do cruzamento deixa o
  grupo pedido em opacidade zero e o anterior ainda aceso, congelados assim para
  sempre. O sintoma é o pior possível: o clique parece não fazer nada. Por isso o
  alvo ganha o tempo do cruzamento quando `animationPlayState` é `paused`.
  Conferido: sem esse ajuste, Enter num traço mostrava o grupo **anterior**.
  Desde 2026-08-12 o único estado parado é a **espera** de antes de a visita
  chegar, e é ela quem depende deste ramo: o `irPara(0)` da largada roda com a
  passagem segurada, e sem o `+ fade` a parede nasceria em branco. Clique de
  verdade cai sempre no outro ramo.

### A passagem nunca para durante a visita (2026-08-12)

Pedido do cliente: **sempre trocando, no desktop e no celular.** Saíram as duas
pausas que existiam, e as duas eram deliberadas quando foram escritas:

- a **pausa por ponteiro** (`.clientes__trilho:hover`). Ela já tinha sido
  encolhida da seção para a grade (a zona antiga era a faixa inteira, 1430×693
  contra 858×440 da grade, incluindo os 128px de respiro e todo o terço do
  rótulo) e depois guardada com `(hover: hover) and (pointer: fine)`, porque no
  toque o primeiro toque GRUDAVA o estado e a passagem ficava parada até a pessoa
  tocar em outro lugar. Os dois consertos foram atrás do mesmo relato — "trava em
  alguns momentos" —, e a terceira resposta foi tirar a pausa;
- a **pausa por teclado** (`.clientes:has(:focus-visible)`, que já tinha sido
  `:focus-within` e mudou porque clicar num traço com o mouse dava foco ao botão
  e parava a passagem **para sempre**).

O que sobra para parar o movimento é o `prefers-reduced-motion`, que envolve todo
o bloco de animação — quem configurou o sistema nunca vê a passagem correr. A
**WCAG 2.2.2** pediria um controle na própria página para movimento automático de
mais de 5s; o cliente foi avisado e decidiu assim. Os traços continuam pulando de
grupo, mas **pular não é pausar**.

A espera de antes de a visita chegar (`.clientes--espera`) **fica** — ela não é
pausa durante a visita, é o que garante que os nove primeiros logos sejam vistos
(ver a seção acima). Sai na primeira interseção e não volta.

Dois detalhes de marcação e desenho:

- **os botões nascem inertes** (`aria-hidden` no container, `tabindex="-1"` em
  cada um) e é o script que os promove. Sem JS não há para onde pular, e botão
  morto anunciado pelo leitor de tela é pior que enfeite nenhum;
- **o traço tem 3px** (pedido do cliente, 2026-08-12 — eram os 4px do arquivo),
  mas o alvo de clique tem 24. O respiro vai em `padding` com
  `background-clip: content-box`, e `box-sizing: content-box` é obrigatório: com o
  `border-box` do reset o padding sairia da altura e o traço sumiria.

  **Os dois valores são um par: `padding = (24 − altura) ÷ 2`.** Com 3px de traço
  são 10,5px de cada lado. Mexer na altura sem mexer no padding tira o alvo dos 24
  que a WCAG 2.5.8 pede.

  E os dois levam `max()` com o valor em `px`, que é a exceção documentada à regra
  do `rem`: em `rem` puro o piso do clamp (fonte-raiz em 12px abaixo de ~1084px)
  encolheria o traço para 2,25px e o alvo para 23,25. Com piso nos dois, o traço é
  3px e o alvo 24 em QUALQUER largura — medido a 1446, 1200, 1000 e 375. Isso de
  quebra consertou um desvio antigo: enquanto só o padding tinha piso, o alvo caía
  a 23px no celular.

Com `prefers-reduced-motion` não há animação para buscar, então o pulo troca a
opacidade direto, em estilo inline. Sem isso o controle existiria e não faria nada
justamente para quem mais depende dele para ver os outros 27 logos.

### A largura da barra é a da coluna, não a do arquivo (2026-08-12)

`.passagem` **não declara `width`**. Pedido do cliente, e é divergência assumida do
Figma — que desenha 241px (`104:25`).

Como se chegou aqui: o arquivo desenha o rótulo numa caixa estreita de 171px
(`152:369`), onde ele quebra em ~3 linhas e a barra fica mais LARGA que o texto. No
código o rótulo nunca teve `width` — enche a coluna de apoio. Quando
`--texto-apoio` caiu de 20 para 16px, na leva do mesmo dia, a frase portuguesa
passou a **caber em uma linha** de 316,5px, e os 241px da barra ficaram 75px mais
estreitos que ela: a relação do arquivo tinha se invertido, e obedecer ao número
reproduzia a medida perdendo o desenho.

**O que faltava não era responsividade.** Os 241px estavam em `rem` e já encolhiam
com o `clamp()` da raiz (241 → 200 → 180,8) — o problema era proporção. Vale
lembrar antes de "consertar" fluidez que já existe.

Sem `width`, quem estica é o `align-items: stretch` padrão de `.clientes__aparte`
(que é coluna e não declara alinhamento), então a barra mede a coluna — a mesma
caixa em que a frase vive. Nada de `width: 100%` nem `align-self`. E os traços são
`flex: 1`, então repartem sozinhos: **78px** cada na largura de projeto, contra 55,8.

**Funciona até 375px sem breakpoint porque coluna e frase congelam JUNTAS** no piso
do clamp (247,5 contra 237,6). Medido:

| viewport | coluna = barra | frase (pt) | sobra |
|---|---|---|---|
| 1446 | 330 | 316,5 (1 linha) | 13,5 |
| 1200 | 273,8 | 262,7 | 11,1 |
| ≤1084 | 247,5 | 237,6 | 9,9 |

#### E o `text-wrap: balance` do reset teve de sair deste rótulo

Só apareceu conferindo o inglês, e **a mudança de largura tinha piorado a página
inglesa** antes disso. "Companies that have relied on Tobias's experience:" não cabe
em uma linha, e `balance` — que o reset dá a todo `h1..h4` — iguala as duas,
**encolhendo o bloco de propósito**: duas linhas de 189,2px numa coluna de 330. Com
a barra passando a medir 330, a sobra foi de 51,8px (quando a barra tinha 241) para
**140,8px**.

`text-wrap: wrap` no `.clientes__rotulo` devolve a primeira linha à largura
disponível: bloco de 270,6px, sobra de 59,4 — de volta ao patamar de antes. **O
português não muda** (uma linha; `balance` não tinha o que equilibrar).

Fica como alerta para qualquer barra amarrada a texto: **`balance` trabalha contra
você**, porque o trabalho dele é justamente encolher o bloco. E nenhuma das duas
opções deixa o inglês rente — a sobra some só medindo a linha pintada, o que pede
JS e não passa perto do critério das exceções.

#### A cor da barra é preto, não o petróleo do arquivo

Pedido do cliente, 2026-08-12, junto com a altura de 3px. O Figma pinta os quatro
traços em petróleo a 15% (`104:25`) e o preenchido em petróleo cheio (`76:235`);
aqui os três viraram **`--cor-preto`**, nas mesmas porcentagens — mudou o pigmento,
não a hierarquia:

| elemento | valor |
|---|---|
| trilha (`.passagem__divisao`) | `--cor-preto` a **15%** |
| trilha em hover/foco | `--cor-preto` a **40%** |
| preenchimento | `--cor-preto` cheio |

**O contorno de foco continua petróleo, e isso não é esquecimento:** ele é a cor de
foco de TODO o site (`global.css`, "o design não especifica, então usamos a cor da
marca"), e aparece igual em links preto sobre bege em toda a página. Trocá-lo aqui
por preto tiraria a única coisa que distingue o anel de foco do próprio traço.
`.passagem__divisao:focus-visible` só existe para mudar o `outline-offset`; a cor
vem de lá.

Vale como aviso de método: **`getComputedStyle` da página não vê pseudo-estado
forçado** (a mesma armadilha do hover do rodapé). Para conferir a cor do anel de
foco use `CSS.forcePseudoState` + `CSS.getComputedStyleForNode`; lendo pelo lado da
página, um elemento sem foco devolve `outline-color: currentColor` e
`outline-width: medium` (3px) e o teste parece dizer que o anel virou preto.

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

- **o respiro é assimétrico e espelhado, e o `gap` também.** O primeiro bloco
  abre com 128 e fecha com 64; o segundo faz o inverso. Somados aos 64+64 da
  faixa, é isso que dá o ritmo do arquivo. Nenhum dos dois usa o `.secao`
  padrão. Desde 2026-08-06 o **gap entre rótulo e grade** também difere: 32px
  no primeiro (`54:179`), 64 no segundo (`105:191`) — assimetria do arquivo,
  não deslize;
- **o rótulo grudado, no desktop, percorre os dois grupos — não só o
  primeiro.** O cliente pediu isso em 2026-07-31, quando o arquivo tinha a
  coluna só em `areas-1` (`154:384`); em 2026-08-06 **o designer incorporou o
  rótulo do segundo grupo ao arquivo** (`218:128`), então não é mais acréscimo
  nosso. Uma diferença sobrou: o do primeiro grupo tem os 12px de padding do
  frame, o do segundo é nó de texto solto e não tem — daí o
  `.areas--fecho .areas__rotulo { padding-top: 0 }`. Quem segura os 980px no
  lugar certo, nos dois grupos, é o `justify-content: flex-end` da seção — sem
  ele o grupo encostaria à esquerda e as duas grades sairiam desalinhadas;
- **a marcação dos cartões fica em um lugar só.** As duas seções saem do mesmo
  laço, e o que os índices decidem é o que existe em cada ponta (rótulo e
  âncora no primeiro, faixa antes do segundo). Quando o Sanity entrar, é um
  ponto de troca, não dois.

### O rótulo é sticky nos dois grupos; o chapéu é só do mobile

O `<h2 class="areas__rotulo">` sai do laço junto com `<Divisoria>` e
`<article class="grupo">` — cada grupo desenha o seu, incondicionalmente,
não só o primeiro. **No desktop os dois se comportam de forma idêntica**:
sticky, à esquerda, grudando a 128px do topo. É o resultado de uma correção
em cima de uma correção, e vale registrar a volta:

1. antes de 2026-07-31 só o primeiro grupo tinha a coluna grudada, como no
   Figma;
2. a primeira leva de ajustes mobile trocou o rótulo por um "chapéu" —
   texto de apoio comum, acima do título, dentro de `.grupo__cabecalho` —
   nos **dois** grupos, achando que resolvia tanto o mobile quanto a
   assimetria do Figma;
3. o cliente corrigiu: o chapéu é comportamento **só de mobile**; no
   desktop os dois grupos precisam do sticky lateral, igual, sem exceção
   para o segundo;
4. em 2026-08-06 o designer deu razão a ele e pôs o rótulo do segundo grupo
   no arquivo (`218:128`). O código não mudou por causa disso — a
   divergência é que deixou de existir.

A solução final são as **duas marcações, sempre presentes, alternando por
media query** — o mesmo padrão de outras seções (ver "Strings de interface"
e o rótulo do Fale conosco): `.areas__rotulo` (sticky, desktop) fica com
`display: none` abaixo de 700px; `.grupo__chapeu` (texto de apoio comum,
dentro do cabeçalho do `<article>`) nasce com `display: none` e só vira
`display: block` no mesmo breakpoint. Nunca os dois ao mesmo tempo — cada
um é a versão do outro para a largura em que está ativo, e os dois leem o
mesmo `areasAtuacao.rotulo`, então trocar o texto no Sanity troca os dois
juntos.

### As descrições dos cartões se alinham pelo topo — e desde 2026-08-12 de graça

Pedido do cliente, 2026-07-31: no arquivo de então cada descrição ficava ancorada
no rodapé do cartão e começava onde o texto dela mandasse, então uma descrição de
3 linhas começava uma linha ABAIXO da vizinha de 4 — a linha branca sobrava em
cima. Medido na época: 210px contra 237px de degrau, no meio da grade.

A correção era `min-height: 4lh` na descrição: com o bloco em `space-between`,
reservar a altura da mais alta punha todas na mesma linha e jogava a sobra para
BAIXO.

**Em 2026-08-12 o arquivo trocou a mecânica e o pedido passou a se cumprir
sozinho**, então as duas linhas de `min-height` saíram. O cartão (`layout_656a76e8`)
é hoje coluna com `padding: 32px`, **`gap: 64px`** e altura de conteúdo — sem
`space-between` e sem `min-height: 350px`. Com o vão fixo, a descrição começa
sempre em `32 + 29,76 + 64`, porque o título tem uma linha só nos oito cartões: o
alinhamento é **por construção**, não por reserva de altura. Medido depois:
as duas descrições da fileira começam no mesmo pixel.

O que mudou de aparência é a sobra: antes ela ficava embaixo do texto (cartão de
350px cravado), agora o cartão fecha onde o texto fecha. Medido: **253,7px de
miolo** no cartão de descrição mais longa, contra os 254 que o arquivo desenha na
célula vazia (`270:65`).

**Cuidado ao comparar essa altura com o arquivo:** a célula vazia do Figma não tem
stroke, e os nossos cartões têm borda com `box-sizing: border-box`, então a caixa
medida sai 1 ou 2px maior (255,7 no cartão da última fileira, que tem as duas). A
diferença é a divisa, não erro de layout — desconte as bordas antes de achar que
sobrou pixel.

O `letter-spacing` dessas descrições continua próprio: **-0.03em**, contra os
-0.04 do resto do corpo (e contra o -0.04 que o arquivo pede). Pedido do cliente,
mantido em 2026-08-12.

### A célula vazia não desenha traço — e agora são DUAS

Na última fileira o arquivo desenha **um cartão de 490px sozinho** (`270:101` no
2º grupo, `270:62` no 1º): o traço de baixo para na metade da grade em vez de
atravessá-la. A célula continua existindo no HTML, mas só para ancorar o símbolo
no canto inferior direito (`270:168`, `270:85`) — medido, ele fica rente à borda
direita e à base da fileira, folga **zero** nas duas, nos dois grupos.

**O segundo símbolo apareceu sem uma linha de código, em 2026-08-12**, e é o
melhor argumento a favor de a decisão de agrupar viver no componente e não no CMS.
Ao remover "Registro de Marcas e Patentes" o primeiro grupo foi de 6 para 5 áreas;
o `grupo.itens.length % 2 === 1` que já estava lá viu o número ímpar e criou a
célula vazia com o símbolo — exatamente o que o designer passou a desenhar. Foram
duas edições no Sanity e zero em CSS.

Consequência a lembrar: **a quantidade de símbolos nas Áreas é função da paridade
de cada grupo.** Um item entrando ou saindo pelo Studio acende ou apaga um símbolo,
e ninguém vai associar as duas coisas se isto não estiver escrito.

Isso mudou em 2026-07-30. Antes a linha atravessava, e era a célula que a
desenhava; se alguém puser de volta um `border-top` ali, a grade volta a divergir
do arquivo.

**Correção em 2026-07-31**: sem borda própria, o lado DIREITO da divisa acima da
última fileira não fechava — o cartão à esquerda desenhava o `border-top` dele e a
célula vazia, nada. A correção é dar à célula vazia o mesmo `border-top` do cartão;
ela não ganha `border-bottom` porque, como o resto da última fileira, quem fecha
embaixo é `.cartao:nth-last-child(-n + 2)`, e a célula vazia sempre é a última do
laço. **Reconferido nó a nó em 2026-08-12** contra os `strokeWeight` dos cartões
novos: as três regras de borda reproduzem o arquivo sem uma vírgula de mudança,
nos dois grupos.

No mobile a célula empilha embaixo do cartão "Outsourcing de Apoio" (a grade
vira 1 coluna, ver abaixo) e ganha `margin-top: 32px` — em `px` cru, não
`2rem`, pelo mesmo motivo do resto desta seção: dentro do breakpoint a
fonte-raiz já está no piso do clamp (12px), e `2rem` daria só 24px físicos.

Duas outras exceções pontuais de `max-width: 700px` vivem nesta seção, e as
duas são a mesma armadilha do card por trás: `.grupo__grade` vira 1 coluna
(2 colunas de ~140px não sobram espaço depois do padding do cartão) e
`.cartao:nth-child(odd) { border-right: none }` some — o `nth-child` conta
posição no DOM, não coluna visual, e sem a exceção metade dos cartões
empilhados ficava com um traço solto à direita, sobra de quando dividiam duas
colunas.

## O card do Fale conosco (rotulado "Localização")

> O rótulo da seção virou **"Localização"** em 2026-07-31, a pedido do cliente —
> o componente e o id continuam `FaleConosco`/`#contato`, e é o texto do Sanity
> que mudou. O "Localização" do rodapé aponta para `#contato`, a seção inteira.

O designer refez o card (`161:446`) em 2026-07-30: o recado que pedia dados de
exemplo saiu, e no lugar entraram três blocos de ícone + texto (`181:26`).
O traço é **só em cima** (`strokeWeight: 1px 0px 0px`) — não é caixa fechada
nem par de réguas, é uma régua só, abrindo o bloco embaixo do título.

O padding acompanha: só 32px em cima. O recuo lateral que era do card inteiro
passou a ser da fileira de dados (`padding-left` de 32). Os três ícones também
foram redesenhados e cresceram — 40,4px de altura no endereço (`194:157`) e no
horário (`194:151`), 37,59 na agenda (`194:153`) —, e passaram a viver no mesmo
0.7 de opacidade do texto, em vez da cor cheia. Só a **altura** é declarada: os
três têm razão própria no arquivo, e fixar as duas medidas deformaria o desenho.

Mais duas coisas mudaram na segunda leva do mesmo dia:

- o título virou **"Como nos encontrar"** (era "Estamos prontos para servir.");
- **os blocos trocaram de ordem**: endereço → horário → canais. Antes o horário
  fechava a fileira.

### O mapa foi removido (2026-08-05), e apagado de vez em 2026-08-07

Pedido do cliente: o mapa do Google Maps que ficava embaixo dos dados de contato
saiu do `FaleConosco.astro`, junto com o CSS da classe `.cartao-info__mapa`. Com
isso saiu também o `id="localizacao"` que o rodapé mirava — o link "Localização"
aponta para `#contato`, a seção inteira.

Em **2026-08-07** foram embora os restos, que eram três e viviam em lugares
diferentes: `configuracoes.mapaEmbed` (dado, esquema e projeção),
`pagina.faleConosco.mapaTitulo` (o nome acessível do mapa, que era texto
traduzido), e os comentários do `FaleConosco.astro` que ainda explicavam padding
e borda **pelo mapa** — "embaixo quem fecha é a borda do próprio mapa" descrevia
um elemento que não existia mais havia dois dias.

Uma coisa que parece do mapa e **não é**: o ícone `MapaPino`, importado no
`FaleConosco.astro`, é o pino do **endereço**, um dos três blocos de dados. Esse
fica.

### Os telefones agora são WhatsApp (2026-08-05)

Pedido do cliente: **os dois campos de telefone** (`telefonePrincipal` e
`telefoneRodape`) apontam para o mesmo número, e os dois links levam ao WhatsApp
(`wa.me/…?text=…`), não ao discador (`tel:`). A mensagem pré-preenchida é "Olá!
Gostaria de conversar com a equipe da Tobias Advogados." e é construída no
frontmatter de cada componente com `encodeURIComponent`. Os links abrem em nova
aba (`target="_blank"`, `rel="noopener"`).

Isso resolveu o bloqueio de lançamento dos "dois telefones diferentes" — agora
são o mesmo número nos dois lugares.

**E o número estava errado até 2026-08-06:** faltava o 9 do celular. O Figma
escreve `+55 51 98194-6082` nos dois nós (`181:24` e `52:131`); o Sanity guardava
`8194-6082`, e o `href.replace(/\D/g, '')` que monta o link produzia
`wa.me/555181946082` — dez dígitos, número que o WhatsApp não abre. Vale como
alerta geral: **um telefone errado aqui não quebra nada visível**, o link
continua bonito e clicável, e só quem clica descobre. Corrigido e **publicado em
2026-08-07**.

### O rótulo mudou de lado

No arquivo a coluna do rótulo (`161:440`) passou a vir **depois** do conteúdo, e
o texto é `textAlignHorizontal: RIGHT` — ou seja, "Fale conosco" gruda na
**direita**. As Áreas mantêm o rótulo à esquerda, então o espelho é deliberado,
não deslize de arquivo. Medido: a borda direita do rótulo cai em 1382,02, que é
exatamente a margem de 64px da seção.

O `position: sticky` e o `top: var(--respiro-secao)` não mudam com isso — o que
faz o rótulo trocar de lado é a ordem dos dois filhos no HTML, e o `text-align`
é que o encosta na margem da seção em vez da divisa com o card.

### O rótulo é sticky no desktop; o chapéu é só do mobile

Mesmo padrão das Áreas (ver a seção lá para o histórico da correção): a coluna
grudada (`.fale-conosco__lateral` → `.fale-conosco__rotulo`, sticky, à
direita) e o chapéu (`.fale-conosco__chapeu`, texto de apoio comum acima do
título) **coexistem sempre** na marcação, e a media query decide qual dos
dois se mostra. Abaixo de 700px a coluna lateral vira `display: none` e o
chapéu vira `display: block`; acima, o inverso. Os dois leem
`faleConosco.rotulo` — o mesmo texto do Sanity, nunca duplicado à mão.

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

O traço antes do telefone e do e-mail (`181:73`) é SVG no arquivo e `::before`
aqui: 14×1,09 de retângulo não justifica um arquivo, e em CSS ele acompanha a
cor do texto e a escala fluida.

## O formulário ([`Formulario.astro`](src/components/Formulario.astro))

Rolagem linear, sem freio: a seção mora dentro da `.camada-contato`, que não
publica nem consome `view-timeline` (ver a seção das camadas).

### A coluna da esquerda é só o título

**Os quatro eixos (TEMPO • EMPRESA • PATRIMÔNIO • FAMÍLIA) não existem mais.** O
cliente pediu que saíssem em 2026-07-31 e o componente os removeu na hora; em
2026-08-06 o arquivo acompanhou — `63:80` tem um filho só, o título. O parágrafo
de apoio que morava ali ("Fale conosco preenchendo o formulário…") já tinha saído
antes, na revisão de 2026-07-30.

O que sobrou disso: o campo `eixos` continuou viajando na consulta do Sanity sem
ninguém para lê-lo até 2026-08-06, quando saiu de `conteudo.ts` — e em
**2026-08-07 saiu do esquema e dos dois documentos**, a pedido do cliente. Se
ele voltar a aparecer numa projeção, é sobra, não requisito.

O respiro da seção passou de 64 para **96px** em cima e embaixo (2026-07-30).

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
estão em `formulario.envio` e `formulario.estados`, dentro de `configuracoes`
no Sanity (não traduz — é o mesmo destino e a mesma decisão de provedor nos
dois idiomas) — trocar de provedor é trocar uma string, porque o script só
faz POST de JSON e olha se a resposta veio OK.

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

### Fontes do formulário (atualizadas em 2026-08-06)

Campos e botão: **Inter Medium 500, 16px**, entrelinha 1.1, `letter-spacing`
−0.04em. O tamanho caiu de 18 para 16 em 2026-07-30, e o peso desceu a Regular
400 junto; em 2026-08-06 o arquivo devolveu o Medium sem mexer no tamanho. A seta
do botão encolheu na primeira leva — caixa do nó de 32,67 para 25,33, tinta de 17
para 13px.

O rótulo de campo vazio é **`#848484`**, o mesmo cinza dos textos de apoio do
site (`--cor-apoio`), e não a opacidade de 0.32 que estava aqui até 2026-08-06.

O botão fica no `--cor-preto`, que desde 2026-08-06 é o **`#171717`** do arquivo
— não mais o `#000` puro de antes, nem o `#031E21` que as variantes de sucesso e
erro trazem (esse petróleo escuro saiu do projeto e não volta).

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
  clicar nela abre a lista igual. E ela é à **esquerda** (`left: 2rem`, alinhada
  com o padding), não à direita como manda o hábito: no arquivo o vetor vem antes
  do rótulo dentro do auto-layout (`131:37` antes de `131:32`), com gap de 16px.
  Conferido em 2026-08-12 — a leitura do Figma sugere uma seta à esquerda porque
  ela está mesmo à esquerda;
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

E conte com **poder precisar** de uma folga na largura: o Chrome mede as mesmas
linhas ~4px mais largas que o Figma, e já houve caso de uma palavra cair de linha
por isso (a caixa do manifesto ficou em 702px contra os 697 do arquivo, e a do
hero em 348 contra 337).

**Folga não é regra, é conserto.** Na leva de 2026-08-06 o arquivo trocou os dois
números — manifesto para 655, hero para 305 (com o nó de texto em 289 dentro
dele) — e os valores crus do Figma bateram sem folga nenhuma: as quebras do
manifesto saem palavra por palavra iguais ao render do nó `62:3`, e a linha mais
larga do aparte mede 283,1 contra os 282 do render de `35:98`. Só acrescente
folga depois de medir e ver a quebra divergir; acrescentar por precaução é o que
faz o código deixar de descrever o arquivo.

## O rodapé ([`Rodape.astro`](src/components/Rodape.astro))

Fora do `main` e **último no documento** — a revelação dele depende disso.
Gutter de 32px, e não os 64 do resto do site: a assinatura gigante (`268:54`)
ocupa a largura toda entre as margens.

Pedido do cliente, 2026-08-05: no bloco de contato o **telefone vem antes do
e-mail** (era o contrário). Os dois links de telefone — aqui e no FaleConosco —
levam ao **WhatsApp** (`wa.me/…?text=…`), não ao discador. Ver a seção do Fale
conosco para detalhes.

### Refeito em 2026-08-12: os títulos viraram chapéus e a cor inverteu

O designer substituiu o frame inteiro (`52:21` → **`268:41`**; ver a armadilha dos
ids trocados, na seção do Figma — o antigo continua no arquivo e engana). **As
quatro colunas em `fr` são a única coisa que não mudou.**

Os três títulos de coluna eram 24px Semi Bold em preto e viraram **chapéus de
11px, Regular, caixa alta, `#5E5440`** — e entrou um quarto, "Menu", em cima da
navegação, que antes não tinha rótulo nenhum. A hierarquia da coluna passou a vir
do contraste de TAMANHO (11 contra 18 ou 34), não de peso.

Três coisas que valem registro:

- **`letter-spacing: +0.01em` no chapéu é o único positivo do site.** Todo o resto
  é negativo, porque todo o resto é corpo normal ou maior; caixa alta em 11px pede
  o contrário. Se alguém "padronizar" isso para -0.04, as letras se encavalam;

- **a caixa alta é do CSS (`text-transform`), não do conteúdo.** Assim
  "Menu"/"Contato"/"Redes sociais" ficam em caixa normal no Studio, legíveis e
  traduzíveis sem ninguém escrever em capslock — e o inglês ganhou "Contact" e
  "Social media" sem virar grito;

- **a cor inverteu, e isso deixou uma regra de hover morta.** Os links de contato e
  redes saíram de `rgba(23,23,23,.5)` para o preto cheio, enquanto o texto pequeno
  (chapéus, copyright, legais) andou no sentido oposto e ficou com o marrom. Com os
  links nascendo em `--cor-preto`, o `.rodape__link:hover { color: var(--cor-preto) }`
  que existia virou regra que não faz nada. Hoje: quem nasce escuro **apaga** para
  `rgba(23,23,23,.6)` (junto com a nav e o "Voltar ao topo"), e os legais, que
  nascem no marrom, **acendem** para o preto.

  Detalhe que morde: o peso 400 dos legais **não desce por herança**. A lista
  declara `font: 400 …`, mas `.rodape__link` declara `font-weight: 500` no próprio
  elemento, e valor próprio ganha de herdado — precisou de um `font-weight: 400`
  explícito na regra dos legais. Passou batido enquanto os dois eram 500.

#### O ritmo vertical, medido

As quatro colunas agora **começam na mesma linha** (y≈45,3): os 12px de
`padding-top` que a coluna carregava eram o degrau entre a navegação (y=46) e os
títulos de 24px (y=58), e ele desapareceu com os chapéus. `min-height` das colunas
foi de 368 para **388px** (45,27 até o pé do selo, em 433,27).

E "Voltar ao topo" fica **8px acima** das outras três, o que parece deslize e não é:
a coluna dele não tem chapéu, e o link está **centralizado na fileira dos
chapéus**. A conta é a diferença das duas caixas dividida por dois — chapéu 11 ×
1.2 = 13,2 e link 24 × 1.2 = 28,8, logo `(13,2 − 28,8) ÷ 2 = −7,8px` de recuo. É de
onde vem o `margin-top` negativo, que sem essa explicação lê como número mágico.

Ele também **encostou na margem direita** (x=1209 → 1237, terminando em 1414 junto
com o selo), então a coluna virou `align-items: flex-end`.

Medido a 1446px, contra o arquivo: altura do rodapé 699,9 (701), chapéus em 45,98
(45,3), "Voltar ao topo" em 38,19 (37,27) e terminando em 1414,02 (1414), selo em
381,98 (381,27) e 1414,02 (1414), assinatura em 488,95 (489,74).

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
  empurravam a navegação 5px. **A primeira fileira não tem respiro em cima**
  (`268:43` declara `0 0 16px`): ela encosta no chapéu "Menu", e quem separa os
  dois é o vão de 20px do `.rodape__bloco`;
- **a seta diagonal mede 12px de tinta contra os 21,21 do nó** — o nó é a caixa
  de um quadrado girado 45°. A do "Voltar ao topo" tem 15 nos dois. As duas
  ficam rentes à borda da coluna; no arquivo a diagonal fica 5px para dentro,
  sobra da rotação, e alinhar as duas vale mais que copiar a sobra.

### No mobile o desktop não muda — e por isso a marcação dobra

Pedido explícito do cliente, 2026-07-31, depois de uma primeira rodada de
ajustes mobile ter mexido no rodapé inteiro: **"o rodapé do desktop deve
permanecer da forma que estava originalmente, as alterações feitas antes
eram apenas para o mobile."** A correção não foi ajustar a media query — foi
duplicar a marcação onde CSS sozinho não bastava, e reservar a media query
só para trocar qual das duas cópias aparece.

O motivo de precisar duplicar, e não só reposicionar por CSS: os dois pares
abaixo pertencem a **colunas diferentes da grade** no desenho original —
`order` ou `grid-column` movem um elemento dentro do mesmo pai, não para o
pai de outra coluna, e a página não tem JS para arrancar um nó de um lugar e
recolocar em outro.

- **Termos/Políticas + copyright.** No desktop (desenho original) eles ficam
  **separados**: os links legais empilhados na coluna de contato
  (`.rodape__lista--legais-desktop`), o copyright sozinho na coluna de redes
  (`.rodape__copyright-desktop`), cada um com `display: none` no mobile. A
  cópia mobile — `.rodape__rodape`, dentro da coluna de redes — agrupa os
  dois num bloco só, com os links lado a lado (`flex-direction: row`) acima
  do copyright, e nasce com `display: none`, virando `flex` só abaixo de
  700px;
- **"Voltar ao topo" + selo.** No desktop os dois vivem dentro da quarta
  coluna da grade (`.rodape__coluna--fim`), sem alinhar entre si — desenho
  original, link à esquerda e só o selo empurrado para a borda direita da
  fatia. Essa coluna some inteira no mobile. A cópia mobile —
  `.rodape__fim`, filho direto de `.rodape`, fora da grade — põe o link e o
  selo na mesma linha com `justify-content: space-between`, um em cada
  ponta do rodapé inteiro (pedido do cliente: alinhados horizontalmente,
  cada um numa extremidade).

Três números que só existem porque, uma vez empilhado, o mobile precisou de
respiro que o desenho original nunca teve — e todos em `px` cru, nunca
`rem`, pelo motivo de sempre nesta faixa: a fonte-raiz já está travada no
piso do clamp (12px), e `rem` daria um valor menor que o pedido:

- `.rodape__colunas` ganha `gap: 40px` só no mobile — a grade nunca teve
  `gap` porque as 4 colunas nunca precisaram de um lado a lado; empilhadas,
  ficavam coladas;
- `.rodape__coluna` ganha `gap: 32px` só no mobile — mínimo entre o bloco
  de Redes e o grupo Termos/Políticas/Copyright que só existe empilhado
  dessa forma abaixo de 700px; no desktop as colunas continuam só com
  `space-between`, sem gap fixo;
- os links legais e o copyright mobile ganham `padding-top: 12px` cada —
  "tá muito grudado", pedido do cliente depois de ver o resultado da
  primeira rodada.

E dois ajustes de leitura, só na cópia mobile: a fonte de Termos, Políticas
e copyright sobe de 12px para `max(0.8125rem, 13px)` (o `max()` também
trava o piso, do mesmo jeito que os `px` acima), e o copyright ganha
`line-height: 1.5` — no desktop ele continua em 12px e na entrelinha
original do arquivo, porque lá o `width: 27.4375rem` fixo sangra por cima
da coluna vizinha vazia (ver "Detalhes do desenho", acima) e aumentar a
fonte ali reabriria essa conta.

### A navegação do rodapé virou a do header também

Ela tem lista e ordem próprias desde 2026-07-30 (`52:48`): **Manifesto, Sobre,
Áreas de atuação, Localização, Contato**. Trocou "Clientes" por "Manifesto" e
"Localização" subiu para antes de "Contato".

**Os cinco destinos são cinco lugares diferentes** — e não eram até 2026-08-06,
quando o cliente reparou que "Contato" e "Localização" caíam no mesmo ponto. Os
dois apontavam para `#contato`, que é a seção do Fale conosco (o id ficou com
esse nome, e "Localização" é o rótulo que o designer lhe deu depois). Agora
"Contato" aponta para **`#formulario`**, que é onde a pessoa realmente escreve.

Cuidado ao mexer: o id `contato` NÃO é o formulário, apesar do nome. Conferido
clicando os cinco links com o Lenis rodando — todos param com o topo da seção
em 0 (±0,2px), e `#formulario` assenta 499px abaixo de `#contato`.

**Em 2026-08-06 o cliente pediu que o header usasse a mesma lista**, e isso
diverge do Figma: `155:385` desenha quatro itens (Clientes, Sobre, Serviços,
Contato). Os dois campos continuam separados no Sanity (`navegacao` e
`rodape.navegacao`), com chaves próprias — guardam o mesmo conteúdo hoje, mas
voltar a divergir é edição no Studio, não mudança de código. Medido: a nav de
cinco itens ocupa 388,8px no header, com 691px de folga na largura de projeto e
333 aos 900px; não chega perto de quebrar.

### Caixa de frase nos títulos, contra o Figma

Pedido do cliente, 2026-08-06: **"Áreas de atuação"** com "a" minúsculo (no
rótulo de apoio, na nav do header e na do rodapé), **"Governança e organização
societária"** e **"Gestão de contingências"**. O arquivo escreve os três em
caixa alta de título. Como os títulos dos grupos alimentam os `<optgroup>` do
formulário, a correção desceu junto — sem uma segunda lista para sincronizar.

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

E vale para ACENDER também. O hover da nav do header foi para preto em
2026-08-06 (pedido do cliente): lá os links nascem em `--cor-apoio` (`#848484`)
e vão a `--cor-preto`, o inverso do rodapé. O CTA ao lado, que já nasce preto,
troca por `rgba(23, 23, 23, .6)` — exatamente o cinza que a `opacity: .6`
anterior pintava, sem tirar o texto da camada de fundo.

Conferido com `CSS.forcePseudoState` pelo CDP, e não com ponteiro sintetizado:
**`Input.dispatchMouseEvent` não dispara `:hover` de forma confiável no
headless**, e o teste passa a mentir que a regra não existe. Forçar o
pseudo-estado é o que o botão "hov" do DevTools faz.

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
  Figma de propósito (ex.: as descrições dos cartões das Áreas têm
  `letter-spacing: -0.03em` contra os -0.04 do arquivo, porque o cliente pediu).
  E quando o arquivo diverge de si mesmo, o comentário diz isso: o
  `letter-spacing` do título do Sobre é regra local justamente porque só ele
  ficou em -0.07.
- Assets de marca em `src/assets/` (não `public/`), para o Astro otimizar. Vale
  também para SVG: dentro de `src/` ele é inlinado como componente, e aí um
  `fill="currentColor"` deixa a cor vir do token em vez de ficar escrita no
  arquivo. `public/` hoje tem os favicons, o PDF da matéria e o vídeo do hero
  (`video-hero.mp4`, ver a seção do Hero) — coisas para servir como estão,
  sem o Astro reprocessar.
- **SVG exportado do Figma vem com a cor cravada** (`fill="#171717"`,
  `fill="black"`). Trocar por `currentColor` é passo obrigatório do fluxo de
  exportação, não detalhe — sem isso o ícone ignora o token e para de acompanhar
  hover e mudança de tema. Foi o que os dois ícones do seletor de idioma
  precisaram em 2026-08-07.
- **O reset não zera lista.** Cada componente que usa `<ul>` declara o próprio
  `list-style: none` (rodapé, Fale conosco, clientes, formulário, seletor de
  idioma). Numa caixa sem padding à esquerda, os marcadores caem FORA dela.

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

O build gera **duas** páginas: `/` e `/en/`. Se sair só uma, o `pagina-en` do
Sanity não está publicado.

**O `astro dev` não serve `/api/apresentacao`** — a função é da hospedagem, não
do Astro. Em desenvolvimento o POST dá 404 e o bloco mostra a frase de falha, o
que está certo e não é defeito. Para ver as três frases sem servidor nenhum, use
a encenação (`?apresentacao=sucesso`); para exercitar a função de verdade, é
`vercel dev` ou `netlify dev`, com `RESEND_API_KEY` e `EMAIL_REMETENTE` no
`.env`.

**`grep -r` trava nesta máquina** quando varre a raiz do projeto — mordeu duas
vezes em 2026-08-07, a segunda derrubando um comando encadeado com `&&` (o `rm`
depois dele nunca rodou, e o arquivo continuou lá parecendo apagado). Use a
ferramenta de busca do agente, ou restrinja o caminho. E **não encadeie uma ação
destrutiva depois de um `grep`** — se ele travar, você não sabe se a ação
aconteceu.

Dependências do site, e por quê: **@sanity/client** (lê o conteúdo no build),
**@sanity/image-url** (monta as URLs da CDN), **groq** (`defineQuery`), **lenis**
(rolagem suave), **libphonenumber-js** (formato do telefone por país) e, só de
desenvolvimento, **flag-icons** — fonte dos SVGs que o `npm run bandeiras`
transforma em sprite. Nada mais; o resto é Astro. **React e o `sanity` NÃO são
dependências do site** — vivem em `studio/`, com `package.json` próprio.

Documentação do Astro: https://docs.astro.build
