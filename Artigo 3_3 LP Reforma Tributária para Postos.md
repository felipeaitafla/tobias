# **Como preparar seu posto para a reforma tributária: checklist prático**

Saber **como preparar posto de combustível para a reforma tributária** exige um plano de ação estruturado que envolve a escolha do enquadramento tributário, a atualização dos sistemas emissores de nota fiscal e a revisão das estruturas societárias e contratuais da empresa. A transição para o novo IVA Dual (composto pelo Imposto sobre Bens e Serviços \- IBS e pela Contribuição sobre Bens e Serviços \- CBS) altera profundamente o cálculo de impostos na loja de conveniência, a emissão de documentos fiscais eletrônicos e a gestão do caixa na pista. Este checklist prático reúne as principais decisões operacionais e jurídicas para garantir a conformidade e proteger a rentabilidade do seu estabelecimento.

---

## **Posto do Simples deve optar pelo regime regular de IBS e CBS?**

Depende da estrutura de custos do estabelecimento, do volume de mercadorias vendidas na loja de conveniência e do perfil de seus clientes.

A Lei Complementar 214/2025 e as normas do Comitê Gestor do Simples Nacional criaram o modelo "Simples Híbrido". Nessa sistemática, a empresa optante pelo Simples Nacional pode optar por recolher o IBS e a CBS "por fora" do Documento de Arrecadação do Simples Nacional (DAS), submetendo esses dois tributos ao regime geral de apuração não cumulativa.

Para avaliar se a opção vale a pena, o posto deve analisar dois cenários:

* **Quando vale a pena optar pelo regime regular:** Se a loja de conveniência possui um Custo de Mercadoria Vendida (CMV) elevado, compra produtos tributados de indústrias ou distribuidores e possui despesas operacionais relevantes (como aluguel e energia), o regime regular permite tomar créditos integrais de IBS e CBS (calculados à alíquota padrão) sobre as compras, reduzindo o imposto líquido a pagar. Além disso, essa opção permite transferir crédito integral de IBS/CBS para clientes corporativos (como transportadoras e frotistas).  
* **Quando vale a pena continuar no Simples Unificado (DAS "Puro"):** Se a margem de lucro da conveniência for muito alta (baixo custo de aquisição) e o atendimento for focado quase exclusivamente em consumidores finais (pessoas físicas que não usam crédito tributário), a manutenção do recolhimento unificado no DAS pode resultar em uma alíquota efetiva menor do que a apuração do IVA Dual.

Para entender a divisão entre a tributação da pista e da loja de conveniência, leia também o `[LINK ARTIGO 1]`.

---

## **O que acontece se o posto do Simples não fizer a opção?**

Depende da escolha deliberada da empresa, pois a ausência de manifestação mantém o posto automaticamente no regime unificado do Simples Nacional (DAS).

Se o posto enquadrado no Simples Nacional não exercer a opção formal pelo regime regular do IBS/CBS nos prazos definidos pela Receita Federal e pelo Comitê Gestor, a tributação permanecerá 100% concentrada na guia única do DAS.

As consequências práticas de não optar pelo regime regular envolvem:

1. **Fim da Exclusão de Bebidas e Cigarros:** Com a extinção do PIS/Cofins monofásico, a empresa não poderá mais segregar ou excluir as receitas de bebidas frias (cervejas, refrigerantes, águas) e cigarros da base de cálculo do DAS. O imposto será cobrado sobre 100% do faturamento da conveniência.  
2. **Impossibilidade de Tomar Créditos:** O posto continuará proibido de se creditar do IBS e da CBS destacados nas notas fiscais de compra de mercadorias, insumos, energia elétrica e fretes.  
3. **Transferência Fracionada de Crédito B2B:** Ao vender mercadorias ou serviços para pessoas jurídicas, o posto do Simples "Puro" só poderá transferir para o cliente o crédito correspondente ao pequeno percentual de IBS/CBS efetivamente contido na sua alíquota do DAS, o que reduz sua competitividade perante frotistas e empresas do Lucro Real.

---

## **Dá para voltar atrás depois de optar pelo regime regular?**

Sim, dá para voltar atrás, mas a alteração só produz efeitos para o ano-calendário seguinte.

A opção pelo regime regular de apuração do IBS e da CBS para empresas do Simples Nacional possui caráter anual e irrevogável para todo o exercício financeiro em que foi exercida. Segundo a Lei Complementar 214/2025 e a Resolução CGSN 186/2026, a escolha deve ser formalizada no sistema da Receita Federal no final do ano anterior (durante a janela de opção que ocorre tradicionalmente em novembro e dezembro) para vigorar a partir de 1º de janeiro.

Caso a empresa perceba ao longo do ano que a apuração "por fora" do DAS aumentou sua carga tributária ou complicou sua gestão contábil, ela deverá cumprir o regime regular até 31 de dezembro. A retratação e o retorno ao Simples Unificado só poderão ser efetivados mediante nova manifestação formal no mês de janeiro do ano seguinte, passando a valer para o novo ano-calendário.

---

## **Como preencher IBS e CBS na nota fiscal do posto?**

Depende do tipo de produto comercializado na operação, exigindo a parametrização correta dos campos específicos do arquivo XML da Nota Fiscal Eletrônica (NF-e) e da Nota Fiscal de Consumidor Eletrônica (NFC-e).

De acordo com o Manual de Orientação ao Contribuinte (MOC 7.0 da NF-e e NFC-e), o preenchimento dos documentos fiscais do posto de combustível deve seguir duas estruturas distintas:

### **1\. Venda de Combustíveis Monofásicos (Gasolina, Diesel, Etanol, GLP)**

* **Código de Situação Tributária (CST):** Utiliza-se o CST específico para tributação monofásica cobrada anteriormente.  
* **Alíquota e Valor:** Informa-se a alíquota monetária *ad rem* (R\$ por litro ou kg) e o valor do IBS/CBS retido na origem pela refinaria ou usina, indicando o código de benefício fiscal (cBenef) correspondente. O valor do imposto na saída da bomba é informado como zero, pois a cobrança foi encerrada na etapa anterior.

### **2\. Venda de Mercadorias e Serviços no Regime Geral (Conveniência e Lubrificantes)**

* **CST de Operação Tributada:** Utiliza-se o CST de tributação integral ou com redução de base do IVA Dual.  
* **Base de Cálculo e Alíquota:** Informa-se o valor da venda como base de cálculo e aplica-se a alíquota *ad valorem* (%) do IBS e da CBS. O sistema calcula e destaca os valores monetários do IBS e da CBS no XML e no DANFE para permitir o creditamento do comprador.

Para conferir em detalhes quais itens geram direito ao crédito no seu estabelecimento, consulte o `[LINK ARTIGO 2]`.

---

## **O sistema do posto precisa ser atualizado para a reforma?**

Sim, o sistema de ponto de venda (PDV) e o software ERP do posto precisam ser atualizados obrigatoriamente para a reforma tributária.

A implementação do IVA Dual exige que os programas de automação comercial utilizados nos postos de combustíveis passem por uma reformulação técnica completa. Os sistemas de TI precisam estar aptos a processar as seguintes rotinas até a entrada em vigor das novas regras:

* **Emissão do Layout MOC 7.0:** Capacidade de gerar arquivos XML de NF-e (Modelo 55\) e NFC-e (Modelo 65\) contendo os novos grupos de campos do IBS e da CBS, discriminando impostos estaduais, municipais e federais.  
* **Duplo Motor de Cálculo:** Habilidade para calcular simultaneamente a tributação monofásica *ad rem* (em R\$/litro) na pista e a tributação *ad valorem* (%) na loja de conveniência e na troca de óleo.  
* **Integração com o Split Payment:** Adequação do software para se comunicar com as credenciadoras de cartão de crédito/débito e bancos, permitindo que a retenção e o recolhimento automático do IBS e da CBS ocorram no momento da liquidação financeira da transação.  
* **Gestão do Estoque de Transição:** Módulo para inventariar o estoque de abertura na data de virada e apurar o crédito presumido de transição autorizado pela Receita Federal.

---

## **Vender combustível para transportadora muda alguma coisa na nota?**

Não, vender combustível para transportadora não altera o regime tributário da operação na bomba, mas exige o preenchimento correto da Nota Fiscal Eletrônica (NF-e) com identificação do CNPJ do comprador para controle do Split Payment e de eventuais diferimentos.

Como a gasolina, o óleo diesel e o etanol permanecem sob o regime monofásico (*ad rem*), a venda de combustível para uma empresa de transporte rodoviário de cargas não gera débitos de IBS e CBS para o posto de combustível e nem transfere crédito do imposto contido no produto líquido para a transportadora.

Contudo, a operação exige cuidados específicos na emissão do documento fiscal:

1. **Obrigatoriedade da NF-e (Modelo 55):** O posto deve emitir a NF-e identificando a razão social, o CNPJ e a placa do veículo da transportadora, não sendo recomendada a emissão de cupom fiscal genérico (NFC-e) para vendas B2B.  
2. **Registro de Insumos da Transportadora:** A emissão correta da NF-e é indispensável para que a transportadora comprove perante a fiscalização a aquisição do combustível como insumo direto do serviço de frete.  
3. **Parametrização do Split Payment:** A identificação da conta bancária corporativa do comprador garante que a operação financeira seja processada sem retenções indevidas na liquidação do pagamento.

---

## **Preciso de advogado ou só do contador para a reforma no posto?**

Depende do nível de complexidade das alterações estruturais do posto, sendo recomendada a atuação conjunta entre o contador e o advogado tributarista.

Enquanto a contabilidade lida com a operacionalização diária da reforma — como atualização do plano de contas, parametrização do Sped, emissão de notas fiscais e apuração mensal das guias —, a assessoria jurídica atua na proteção do patrimônio, na governança contratual e na estratégia tributária do negócio.

A atuação integrada de ambos os profissionais garante a segurança do posto nas seguintes frentes:

* **Papel do Contador:** Acompanha as regras de escrituração digital, faz a opção do Simples Nacional, gera as guias de arrecadação, inventaria os estoques e audita os arquivos XML das compras.  
* **Papel do Advogado Tributarista:** Revisa contratos de distribuição, franquia e locação (inserindo cláusulas de adequação ao IVA); reestrutura a arquitetura societária (Holdings, cessão de espaço e segregação de CNPJs); defende o posto contra autuações fiscais e conduz processos administrativos de ressarcimento acelerado de créditos (PNCT).

---

## **O que é um diagnóstico tributário para posto de combustível?**

Depende da abrangência contratada, mas trata-se de uma auditoria técnica e jurídica preventiva que mapeia toda a estrutura fiscal, operacional e societária do estabelecimento perante as novas regras da reforma tributária.

O diagnóstico tributário analisa o comportamento histórico e projetado da empresa para apontar com precisão matemática e fundamentação legal o melhor caminho a seguir na transição para o IBS e a CBS.

O trabalho de diagnóstico para postos de combustíveis contempla:

1. **Simulação do Enquadramento Tributário:** Comparação numérica entre permanecer no Simples Unificado (DAS) ou migrar para o Simples Híbrido (IBS/CBS no regime regular) ou Lucro Presumido/Real.  
2. **Mapeamento de Créditos Operacionais:** Identificação de todas as despesas da pista que gerarão créditos de IBS e CBS (energia, frete, aluguel, manutenção, equipamentos).  
3. **Revisão da Engenharia Societária:** Análise do impacto do IVA sobre Holdings Patrimoniais, empresas de transporte do grupo e locação de espaços no pátio, eliminando incidências tributárias desnecessárias.  
4. **Plano de Ação para Ressarcimento Célere:** Estruturação da conformidade fiscal da empresa para que os saldos credores acumulados de CBS sejam devolvidos em até 30 dias pela Receita Federal.

---

### **Conclusão**

Entender **como preparar posto de combustível para a reforma tributária** é o passo decisivo para evitar sobressaltos financeiros na virada do sistema tributário. A decisão entre o Simples Nacional e o regime regular, a parametrização do software de ponto de venda e o aproveitamento correto dos créditos operacionais definirão quais redes manterão suas margens de lucro competitivas no mercado.

Para realizar a análise completa das operações do seu estabelecimento e definir um plano de transição seguro, agende um diagnóstico tributário personalizado com nossa equipe técnica acessando o `[LINK DA LP]`.

---

*Por Thiago Tobias, advogado, OAB/RS nº 61.313*

---

### **Fontes Citadas**

1. **Brasil.** *Emenda Constitucional nº 132, de 20 de dezembro de 2023\.* Altera o Sistema Tributário Nacional.  
2. **Brasil.** *Lei Complementar nº 214, de 16 de janeiro de 2025\.* Institui o Imposto sobre Bens e Serviços (IBS) e a Contribuição Social sobre Bens e Serviços (CBS).  
3. **Brasil.** *Lei Complementar nº 227, de 2026\.* Disciplina a governança do Comitê Gestor do IBS.  
4. **Comitê Gestor do Simples Nacional.** *Resolução CGSN nº 186, de 2026\.* Regulamenta as opções do Simples Nacional no IVA Dual.  
5. **Ordem dos Advogados do Brasil (OAB).** *Provimento CFOAB nº 205, de 2021\.* Dispõe sobre a publicidade e a informação da advocacia.

---

### **Metadados e Informações Técnicas**

* **Meta Title:** Como Preparar Posto de Combustível para a Reforma Tributária  
* **Meta Description:** Aprenda como preparar seu posto de combustível para a reforma tributária: opção pelo Simples, ajuste de notas fiscais, ERP e diagnóstico tributário. Confira\!  
* **Slug sugerido:** `como-preparar-posto-de-combustivel-para-a-reforma-tributaria`

---

### **Pontos para eu verificar**

* **\[VERIFICAR DATA: YYYY\]**: Os prazos contratuais e calendários de opção do Simples Nacional acompanham os cronogramas oficiais estabelecidos pela Receita Federal e pelo Comitê Gestor do Simples Nacional. Recomenda-se checar eventuais prorrogações de prazos regulamentares.  
* **\[NÚMERO\]**: Inserir o número do registro da OAB do Dr. Thiago Tobias na Seccional do Rio Grande do Sul antes da publicação final.  
* **\[LINK ARTIGO 1\]**, **\[LINK ARTIGO 2\]**, **\[LINK DA LP\]**: Substituir os marcadores entre colchetes pelas URLs definitivas das páginas do blog e da landing page de agendamento do diagnóstico.

