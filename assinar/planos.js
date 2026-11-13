/* Planos da BLR: fonte única para a Vitrine (raiz) e para o checkout (/assinar). 13/11/2026.
   Mudar preço, item ou link aqui muda as duas telas. O preço cobrado de verdade é o do Stripe (configurado no servidor da Gallery). */
window.BLR_PLANOS = {
  // chave PUBLICÁVEL do Stripe (é pública por natureza; a secreta fica só no servidor)
  pk: "pk_live_51Uao2eGopY4UdW6c0e8fO2TvNqQ4HJ1CRVB0DfBAqnvOFQjEemm6XGQ9cYDBLvTfylCFFy2Qmccgd6fF6l9j7BMC00AHy3XJAG",
  api: "https://api.blrdevelopment.com",
  planos: [
    {id: "gratuito", nome: "Gratuito", quem: "para conhecer", m: 0, a: 0, itens: ["Mapa dos EUA com todos os leilões", "Lista de oportunidades", "Lance de abertura de cada lote", "Calendário dos próximos leilões"], cta: "Começar grátis", href: "#explorar"},
    {id: "basico", nome: "Básico", quem: "para quem foca em 1 estado", m: 9.9, a: 99, itens: ["Tudo do Gratuito", "Ficha completa e filtros", "1 estado à sua escolha (troca 1× por mês)", "Assistente de IA: 10 consultas por mês"]},
    {id: "pro", nome: "Pro", quem: "o mais escolhido", m: 49.9, a: 499, dest: true, selo: "7 dias grátis", itens: ["Tudo do Básico", "Teto de lance BLR, ARV e a conta de cada lote", "Endereço, posição exata, contorno e Street View", "Até 3 estados (troca 1× por mês)", "Assistente de IA: 40 consultas por mês"]},
    {id: "ultra", nome: "UltraPro", quem: "para operar com a BLR", m: 249.9, a: 2499, itens: ["Tudo do Pro", "Os 50 estados, DC e territórios", "Partner Bidder: a BLR opera e divide o risco", "Sala de leilão online em tempo real", "Assistente de IA ilimitado"]}],
  // payment links: plano B quando o checkout embutido não responde (502/503) e para quem prefere pagar sem entrar
  stripe: {basico: {m: "https://buy.stripe.com/28EfZh5YKgub2fY40I8ww00", a: "https://buy.stripe.com/bJe14ncn8b9R8Emap68ww01"},
           pro:    {m: "https://buy.stripe.com/14AcN5af0cdV07Qbta8ww04", a: "https://buy.stripe.com/dRm4gzaf05PxbQy0Ow8ww05"},
           ultra:  {m: "https://buy.stripe.com/bJeeVd9aW7XFaMu9l28ww03", a: "https://buy.stripe.com/fZubJ14UGfq74o61SA8ww02"}}
};
