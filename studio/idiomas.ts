/*
 * Os idiomas do site, em um lugar só do lado do Studio.
 *
 * A documentação da Sanity sugere guardar os locales como documentos (`locale`),
 * para Studio e frontend lerem da mesma fonte. Aqui são DOIS e eles não mudam
 * sem alguém mexer no roteamento do Astro junto — um documento editável daria a
 * impressão de que acrescentar um terceiro idioma é tarefa de Studio, quando na
 * verdade exige uma rota nova.
 *
 * A outra ponta desta constante é o bloco `i18n` do `astro.config.mjs`. Os `id`
 * daqui têm que ser exatamente os `locales` de lá: é o que faz
 * `pagina.language` casar com a rota.
 */
export const IDIOMAS = [
  { id: 'pt-BR', title: 'Português' },
  { id: 'en', title: 'English' },
] as const;

export const IDIOMA_PADRAO = 'pt-BR';
