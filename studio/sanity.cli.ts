import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: 'b4ibcfka',
    dataset: 'production',
  },
  /* O Studio publicado fica em tobias-adv.sanity.studio. `tobias` puro já estava
     tomado — hostname de studio é global entre TODOS os usuários da Sanity, não
     por projeto, e não há API para consultar disponibilidade: o único teste é
     tentar publicar. */
  studioHost: 'tobias-adv',
  deployment: {
    /* `autoUpdates` solto está obsoleto desde o CLI 7.x — mora aqui dentro.
       Ligado: o Studio publicado recebe correções da Sanity sem novo deploy. */
    autoUpdates: true,
    /* Gravado no primeiro deploy. Sem ele o CLI pergunta o id da aplicação a
       cada publicação. */
    appId: 'bgw91w5evlgplw7ti77bzm3c',
  },
});
