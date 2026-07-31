import { createClient } from '@sanity/client';

/*
 * Cliente do Sanity, usado só em tempo de build.
 *
 * SEM TOKEN, e isso é de propósito: o dataset `production` tem ACL pública,
 * então ler conteúdo publicado não pede credencial. O build do site não carrega
 * segredo nenhum, o `dist/` não pode conter segredo nenhum, e a hospedagem não
 * precisa de variável de ambiente secreta. Só o script de migração usa token.
 *
 * `useCdn: false` porque a saída é estática: o build roda uma vez por publicação
 * e precisa do dado recém-publicado, não do cache de borda. A CDN valeria se as
 * consultas acontecessem a cada visita.
 */
export const sanity = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  apiVersion: '2026-02-01',
  useCdn: false,
});
