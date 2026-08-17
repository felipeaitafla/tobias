const MENSAGEM_PADRAO = 'Olá! Gostaria de conversar com a equipe da Tobias Advogados.';

export function linkWhatsapp(telefone: { href: string }, mensagem = MENSAGEM_PADRAO): string {
  return `https://wa.me/${telefone.href.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
}
