/* Idioma do site (EN/PT), 25/11/2026 (Cris: "quero a vitrine com a opção em inglês de uma vez!").
   O código das páginas continua escrevendo em português; em inglês esta camada troca cada texto na tela (e placeholder, title,
   aria-label, alt) pelo dicionário D abaixo, inclusive o que aparece depois (fichas, avisos, mapa), com um MutationObserver.
   - Idioma: ?lang=en|pt > escolha salva (blr_lang) > navegador (pt* = português; o resto = inglês).
   - Número no meio do texto vira "#" na chave: "leilão em # dias" serve para qualquer número.
   - Texto com nome (condado, cidade) entra pelos padrões P; texto com " · " é traduzido pedaço a pedaço.
   - O que parecer português e não tiver tradução vai para BLR_I18N.faltando (o teste teste_i18n.py falha se sobrar algum).
   Mesmo padrão de idioma do /semana (blr_semana_lang também vale como escolha). */
(function(){
  "use strict";
  const q = new URLSearchParams(location.search).get("lang");
  let lang = q === "en" || q === "pt" ? q : null;
  try{ if(lang) localStorage.setItem("blr_lang", lang); else lang = localStorage.getItem("blr_lang") || localStorage.getItem("blr_semana_lang"); }catch(e){}
  if(lang !== "en" && lang !== "pt") lang = /^pt\b/i.test(navigator.language || "") ? "pt" : "en";
  const I = window.BLR_I18N = {lang, en: lang === "en", loc: lang === "en" ? "en-US" : "pt-BR", faltando: new Set(), D: null, P: null,
    troca(l){ try{ localStorage.setItem("blr_lang", l); localStorage.setItem("blr_semana_lang", l); }catch(e){}
      const u = new URL(location.href); u.searchParams.delete("lang"); location.replace(u.pathname + u.search + u.hash); setTimeout(() => location.reload(), 50); }};
  document.documentElement.lang = I.en ? "en" : "pt-BR";

  /* ---------- dicionário PT -> EN ---------- */
  const D = I.D = {
    // topo, navegação, rodapé
    "Vitrine de leilões": "Auction finder", "BLR Developments, início": "BLR Developments, home", "BLR Vitrine de leilões, início": "BLR Auction finder, home", "Meu progresso": "My progress", "Tema claro ou escuro": "Light or dark theme",
    "Entrar": "Sign in", "Explorar": "Explore", "Agenda": "Calendar", "Meus lotes": "My lots", "Aprender": "Learn", "Planos": "Plans", "Perguntar": "Ask",
    "© BLR Developments · dados de editais e cadastros oficiais": "© BLR Developments · data from official notices and county records",
    "Termos": "Terms", "Privacidade": "Privacy", "Por que BLR": "Why BLR", "Voltar à versão clássica": "Back to the classic version", "versão clássica": "classic version",
    "Assistente BLR": "BLR assistant", "Filtros": "Filters", "Ficha do lote": "Lot details", "Fechar": "Close", "Dispensar": "Dismiss", "Fechar apresentação": "Close intro",
    "Zoom in": "Zoom in", "Zoom out": "Zoom out",
    // hero e conteúdo
    "Leilões de imóveis por dívida nos EUA, com o teto de lance já calculado.": "US tax and foreclosure property auctions, with the maximum bid already calculated.",
    "A BLR junta num mapa só os leilões de imposto atrasado, execução de hipoteca e imóveis de banco e de governo dos EUA. Você abre o lote e vê quanto vale, quanto deve e até quanto vale a pena dar de lance.":
      "BLR puts the US tax-sale, foreclosure, bank-owned and government property auctions on one map. Open a lot and see what it is worth, what is owed and how high it still makes sense to bid.",
    "Testar # dias grátis": "Try # days free", "Explorar o mapa": "Explore the map", "condados": "counties", "nos critérios BLR": "meet BLR criteria", "próximo leilão": "next auction",
    "Teto de lance BLR · exemplo": "BLR max bid · example", "Abertura US$ #": "Opening bid US$ #", "Abertura $#": "Opening bid $#", "cadastro $#": "assessed $#", "Abertura": "Opening bid",
    "Use o e-mail e a senha do seu acesso BLR.": "Use the email and password of your BLR account.",
    "Só e-mail e telefone, sem cartão. Você recebe um link para criar a senha e, por # dias, vê tudo o que o assinante Pro vê.": "Just email and phone, no card. You get a link to create your password and, for # days, you see everything a Pro subscriber sees.",
    "Endereço, posição exata, contorno do lote e Street View": "Address, exact location, lot outline and Street View", "Teto de lance BLR, ARV e a conta de cada lote": "BLR max bid, ARV and the math for each lot",
    "Assistente de IA da BLR": "BLR AI assistant",
    "Quero receber novidades e oportunidades da BLR por SMS/WhatsApp (opcional). A frequência varia; podem incidir tarifas de mensagem e dados. Responda SAIR/STOP para parar e AJUDA/HELP para ajuda. Não é condição para usar a plataforma.":
      "I want to receive BLR news and opportunities by SMS/WhatsApp (optional). Message frequency varies. Message and data rates may apply. Reply STOP to opt out and HELP for help. Consent is not a condition of using the platform.",
    "Imposto atrasado": "Tax sales", "Execução de hipoteca": "Foreclosure", "Banco ou governo": "Bank or government", "Banco de terras": "Land bank", "Outros": "Other",
    "Tax deed, tax lien e upset sale": "Tax deed, tax lien and upset sale", "Foreclosure e sheriff sale": "Foreclosure and sheriff sale", "REO e imóveis de agência federal": "REO and federal agency homes",
    "Land bank do condado ou da cidade": "County or city land bank", "Tipo não informado no edital": "Sale type not stated in the notice",
    "O condado vende o imóvel por imposto atrasado e quem arremata recebe a escritura.": "The county sells the property for unpaid taxes and the winning bidder gets the deed.",
    "Você compra o certificado da dívida de imposto, não o imóvel. O retorno vem dos juros do resgate.": "You buy the tax debt certificate, not the property. The return comes from the interest paid at redemption.",
    "Venda por imposto em que a hipoteca e alguns ônus podem sobreviver ao leilão.": "Tax sale where the mortgage and some liens may survive the auction.",
    "Execução da hipoteca, no tribunal ou em trustee sale: o credor cobra a dívida vendendo o imóvel.": "Mortgage foreclosure, in court or by trustee sale: the lender collects the debt by selling the property.",
    "Leilão do xerife, por imposto ou por execução, com regras do tribunal do condado.": "Sheriff's auction, for taxes or foreclosure, under the county court's rules.",
    "Venda direta do banco de terras do condado ou da cidade, em geral com exigência de uso.": "Direct sale by the county or city land bank, usually with a use requirement.",
    "Imóvel que ficou com o banco e é vendido do estoque dele.": "Property taken back by the bank and sold from its inventory.",
    "Imóvel de agência federal (HUD, VA e outras), vendido direto, não em leilão.": "Federal agency property (HUD, VA and others), sold directly, not at auction.",
    "O edital não trouxe um tipo de venda reconhecível. Confira no edital oficial.": "The notice did not state a recognizable sale type. Check the official notice.",
    "Governo federal": "Federal government", "Tipo não informado": "Type not stated",
    "Escolha um estado": "Pick a state", "Abra um lote": "Open a lot", "Veja um teto de lance": "See a max bid", "Acompanhe um lote": "Follow a lot", "Leia um guia": "Read a guide",
    "Abra um lote ✓": "Open a lot ✓", "Escolha um estado ✓": "Pick a state ✓", "Veja um teto de lance ✓": "See a max bid ✓", "Acompanhe um lote ✓": "Follow a lot ✓", "Leia um guia ✓": "Read a guide ✓",
    "Ferramenta comum": "Typical tool", "Uma calculadora. O lance e o risco ficam por sua conta.": "A calculator. The bid and the risk are on you.",
    "O teto de lance já calculado no Pro e, no UltraPro, levantamento, projeto e gestão de obra com a BLR.": "The max bid already calculated in Pro and, in UltraPro, survey, design and construction management with BLR.",
    "O primeiro lance, passo a passo": "Your first bid, step by step", "Do edital ao arremate em cada tipo de leilão.": "From the notice to the winning bid, for each auction type.",
    "A jornada em # passos: achar, arrematar, reformar e lucrar.": "The journey in # steps: find, win, renovate and profit.", "Checklist de terrenos": "Land checklist",
    "Os pontos que separam um bom negócio de um prejuízo.": "What separates a good deal from a loss.",
    "Teto de lance BLR": "BLR max bid", "Até quanto vale a pena dar de lance para o negócio fechar com margem, pela conta da BLR.": "The highest bid that still leaves a margin on the deal, by BLR's math.",
    "ARV": "ARV", "After Repair Value: quanto o imóvel vale depois de reformado, pelas vendas reais do entorno.": "After Repair Value: what the property is worth once renovated, from real nearby sales.",
    "Cadastro": "Assessed value", "O valor do imóvel no cadastro do condado (assessed/just value).": "The property's value on the county roll (assessed/just value).",
    "Resgate": "Redemption", "Prazo em que o dono ainda pode pagar a dívida e ficar com o imóvel.": "The period in which the owner can still pay the debt and keep the property.",
    "O lance mínimo do leilão, em geral a dívida mais as custas.": "The auction's minimum bid, usually the debt plus costs.",
    "Curioso": "Curious", "Estudante": "Student", "Investidor": "Investor", "Arrematador": "Winning bidder", "Sócio BLR": "BLR partner",
    "Primeiro lote": "First lot", "Explorador": "Explorer", "Calculista": "Number cruncher", "Colecionador": "Collector", "Aluno": "Learner", "Semana firme": "Solid week",
    "Abriu o primeiro lote": "Opened your first lot", "# estados explorados": "# states explored", "# tetos de lance vistos": "# max bids seen", "# lotes acompanhados": "# lots followed",
    "# guias lidos": "# guides read", "# dias seguidos": "# days in a row",
    "Quais os próximos leilões?": "What are the next auctions?", "Como funciona um tax deed?": "How does a tax deed work?", "Qual plano é melhor para mim?": "Which plan is best for me?",
    "no condado (ver edital)": "at the county (see notice)",
    // parceiros (27/11)
    "Parceiros BLR": "BLR partners", "Crédito, reforma e corretagem em cada etapa da compra": "Financing, renovation and brokerage at every step of the purchase", "Crédito, reforma e corretagem em cada etapa da compra ·": "Financing, renovation and brokerage at every step of the purchase ·",
    "Quero ser parceiro": "Become a partner", "Sua empresa aqui": "Your company here", "Crédito (lender)": "Financing (lender)", "Reforma (general contractor)": "Renovation (general contractor)",
    "Corretor (realtor)": "Broker (realtor)", "Outro serviço": "Other service", "Seja parceiro BLR": "Become a BLR partner",
    "Lenders, general contractors e corretores aparecem para quem está comprando imóveis em leilão, no momento em que precisa do serviço.": "Lenders, general contractors and realtors are shown to people buying properties at auction, right when they need the service.",
    "Deixe o contato e a BLR fala com você.": "Leave your details and BLR will get in touch.",
    "Empresa": "Company", "Tipo": "Type", "Estados onde atende": "States you serve", "Seu nome": "Your name", "E-mail": "Email", "Enviar": "Send", "Lote": "Lot",
    "Autorizo a BLR a me contatar sobre a parceria, conforme os": "I authorize BLR to contact me about the partnership, under the",
    "Recebido ✓": "Received ✓", "Obrigado. A BLR entra em contato pelo e-mail": "Thank you. BLR will contact you at", "para falar da parceria.": "about the partnership.",
    "Confira os campos.": "Please check the fields.", "Não foi possível enviar agora. Tente de novo em instantes.": "Couldn't send right now. Please try again in a moment.",
    "Serviços de parceiros para este lote": "Partner services for this lot",
    "Simular crédito para a compra": "Get a financing quote for the purchase", "Financiamento para arrematar ou comprar REO": "Financing to win the bid or buy REO",
    "Simular crédito para a reforma": "Get a renovation loan quote", "Rehab / fix & flip": "Rehab / fix & flip",
    "Orçar a reforma": "Get a renovation estimate", "Orçamento com um general contractor": "Estimate from a general contractor",
    "Opinião de preço de um corretor": "Price opinion from a realtor", "Quanto vale depois da reforma": "What it's worth after renovation",
    "Vender com um corretor": "Sell with a realtor", "Listar o imóvel depois da reforma": "List the property after renovation",
    "Parceiros independentes.": "Independent partners.",
    "A BLR não concede crédito, não executa obra e não intermedeia a venda, e não garante aprovação, preço nem prazo.": "BLR does not lend, does not perform construction and does not broker sales, and does not guarantee approval, price or timing.",
    "Seus dados só são enviados ao parceiro com a sua autorização.": "Your data is sent to the partner only with your authorization.",
    "Você vai para a página de": "You're going to the page of", "parceiro independente da BLR.": "an independent BLR partner.",
    ", parceiro independente da BLR.": ", an independent BLR partner.",
    "Para ele já abrir a simulação com o seu caso, a BLR envia:": "So it can open the quote with your case, BLR sends:",
    ", parceiro independente da BLR. Para ele já abrir a simulação com o seu caso, a BLR envia:": ", an independent BLR partner. So it can open the quote with your case, BLR sends:",
    "Li a seção de parceiros dos": "I have read the partners section of the",
    "Autorizar e abrir a página do parceiro ↗": "Authorize and open the partner's page ↗",
    "A BLR não concede crédito, não executa obra e não intermedeia a venda; a contratação é direto com o parceiro.": "BLR does not lend, does not perform construction and does not broker sales; you contract directly with the partner.",
    "Enviado ✓": "Sent ✓", "Se a página não abriu,": "If the page didn't open,", ". Se a página não abriu,": ". If the page didn't open,", "abra aqui ↗": "open it here ↗",
    // explorar
    "Leilões no mapa": "Auctions on the map", "Ver mapa": "View map", "O mapa abre quando você chegar nele.": "The map opens when you scroll to it.", "Carregando os leilões…": "Loading auctions…", "Próximos leilões": "Upcoming auctions", "Buscar": "Search",
    "Cidade, condado, CEP, nº da parcela ou endereço": "City, county, ZIP, parcel number or address",
    "Buscar no mapa por cidade, condado, CEP, número da parcela ou endereço": "Search the map by city, county, ZIP, parcel number or address",
    "Tipo de leilão": "Auction type", "Todos": "All", "Todos os tipos": "All types", "Só os que passam no critério BLR": "Only lots that meet BLR criteria",
    "Incluir lotes só listados (#)": "Include listed-only lots (#)", "Nos EUA": "In the US", "com dados": "with data", "só listados": "listed only", "# com dados": "# with data", "# só listados": "# listed only", "# no total (sem leilões já realizados)": "# in total (past auctions excluded)",
    "no total (sem leilões já realizados)": "in total (past auctions excluded)",
    "# de # feitos": "# of # done", "Ver progresso": "See progress", "Próximo": "Next",
    "Toque num estado, num grupo ou num leilão da lista": "Tap a state, a cluster or an auction in the list", "Toque num grupo ou num condado para aproximar": "Tap a cluster or a county to zoom in",
    "Toque num ponto para abrir o lote": "Tap a dot to open the lot", "Toque para aproximar": "Tap to zoom in",
    "Aproxime o mapa para ver os lotes sem data (venda direta e listados).": "Zoom in to see lots without a date (direct sales and listed-only).",
    "Nenhum leilão com data nesta área": "No dated auctions in this area", "Nenhum leilão com esses filtros nesta área.": "No auctions match these filters in this area.",
    "Lotes nesta área": "Lots in this area", "Lotes do leilão": "Lots in this auction", "← Todos os leilões": "← All auctions", "Mostrar mais #": "Show # more",
    "Mais # leilões: escolha um estado ou um dia.": "# more auctions: pick a state or a day.", "lista ainda não publicada": "list not published yet",
    "A lista de lotes deste leilão ainda não foi publicada": "The lot list for this auction has not been published yet",
    "sem leilão no calendário": "no auction on the calendar", "no critério BLR": "meet BLR criteria", "lote": "lot", "lotes": "lots", "# lote": "# lot", "# lotes": "# lots",
    "# no critério BLR": "# meet BLR criteria", "# leilões": "# auctions", "# leilões · # lotes": "# auctions · # lots", "leilões": "auctions", "leilão": "auction", "Leilão": "Auction",
    "dívidas continuam": "debts survive", "caem com o leilão": "wiped out by the sale", "depende": "it depends", "dívidas continuam com o comprador": "debts stay with the buyer",
    "online": "online", "presencial": "in person", "Leilão realizado": "Auction held", "Veja o resultado na ficha do lote.": "See the result on the lot page.",
    "Ainda carregando os leilões. Tente de novo em alguns segundos.": "Still loading auctions. Try again in a few seconds.",
    "Busca por número da parcela e por endereço é dos assinantes. Tente o CEP, a cidade ou o condado.": "Search by parcel number and address is for subscribers. Try the ZIP, the city or the county.",
    "Não achei essa parcela ou esse endereço entre os lotes à venda. Tente o CEP ou a cidade.": "That parcel or address is not among the lots for sale. Try the ZIP or the city.",
    "Não achei. Tente um estado, cidade, condado, CEP, número da parcela ou endereço.": "Not found. Try a state, city, county, ZIP, parcel number or address.",
    "mostrando os lotes só listados (ainda sem valores)": "showing listed-only lots (no figures yet)", "sem valores ainda": "no figures yet",
    "sem data (venda contínua ou a definir)": "no date (ongoing sale or to be set)", "Ver todos os estados": "See all states",
    "Filtro": "Filter", "Estado": "State", "Todos os estados": "All states", "Abertura até (US$)": "Opening bid up to (US$)", "Leilão nos próximos": "Auction within",
    "qualquer data": "any date", "Últimos # dias": "Last # days", "# dias": "# days", "Aplicar": "Apply", "Limpar": "Clear", "Só leilões com lotes publicados": "Only auctions with published lots",
    "# lotes nesta área": "# lots in this area", "# lotes no mapa visível": "# lots on the visible map", "# lote no mapa visível": "# lot on the visible map",
    "Nenhum leilão com data nesta área com esses filtros.": "No dated auctions in this area with these filters.", "Nenhum leilão com data nesta área.": "No dated auctions in this area.",
    "acima do teto": "above max bid", "abertura": "opening bid", "teto no Pro": "max bid in Pro", "Notificações": "Notifications", "# aviso": "# alert", "# avisos": "# alerts",
    "Carregando…": "Loading…", "Seu plano atual": "Your current plan", "Nível máximo": "Top level", "O seu progresso fica na sua conta e vale em qualquer aparelho.": "Your progress is saved to your account and works on any device.",
    "Lista oficial do leilão ↗": "Official auction list ↗", "sem lote à venda agora": "no lots for sale right now",
    // assinar, planos e conta (dinâmicos)
    "Seu plano": "Your plan", "# dias grátis para testar o Pro": "# days free to try Pro", "Plano": "Plan", "Conta:": "Account:", "Tentar de novo": "Try again",
    "Não foi possível conferir a sua conta.": "We couldn't check your account.", "O formulário do Stripe não abriu.": "The Stripe form didn't open.",
    "O formulário do Stripe não carregou neste navegador.": "The Stripe form didn't load in this browser.", "O pagamento dentro do site não abriu agora": "On-site payment didn't open right now",
    "O teste grátis de # dias é outro caminho: pelo cadastro do site, sem cartão.": "The #-day free trial is a separate path: sign up on the site, no card.",
    "Para trocar de plano, fale com a BLR ou ajuste em Minha conta.": "To change plans, contact BLR or adjust it in My account.", "Você não paga nada hoje.": "You pay nothing today.",
    "Atualização da conta:": "Account update:", "atualizar conta": "update account", "Salvo neste navegador ✓ (a sua conta no servidor não respondeu agora)": "Saved in this browser ✓ (your account on the server didn't respond right now)",
    "Toque de novo para confirmar: apaga listas, preferências e cadastro deste navegador.": "Tap again to confirm: deletes lists, preferences and sign-up data from this browser.",
    "UltraPro · teste grátis:": "UltraPro · free trial:", "consultas este mês · ilimitado no seu plano.": "questions this month · unlimited on your plan.",
    "endereço, ARV e teto em liberação pela BLR": "address, ARV and max bid being unlocked by BLR",
    // datas
    "data a confirmar": "date to be confirmed", "a confirmar": "to be confirmed", "já leiloado": "already auctioned", "leilão hoje": "auction today", "leilão amanhã": "auction tomorrow",
    "leilão em # dias": "auction in # days", "Leilão hoje": "Auction today", "Leilão amanhã": "Auction tomorrow", "hoje": "today", "amanhã": "tomorrow", "em # dias": "in # days", "dia": "day",
    "neste mês": "this month", "sem data": "no date",
    // ficha
    "Teto de lance, ARV, endereço e contorno ficam no Pro.": "Max bid, ARV, address and outline are in Pro.", "Este lote passa no critério BLR.": "This lot meets BLR criteria.",
    "Ver planos": "See plans", "não fecha": "doesn't work", "🔒 Pro": "🔒 Pro", "fora do critério": "outside the criteria", "ARV (valor depois da reforma)": "ARV (after-repair value)",
    "cadastro US$ #": "assessed US$ #", "Folga até o teto": "Room up to the max bid", "Abertura sobre o cadastro": "Opening bid vs. assessed value",
    "quanto menor a abertura, maior o desconto": "the lower the opening bid, the bigger the discount", "Contorno do lote": "Lot outline",
    "O contorno, o endereço e o Street View deste lote ficam no Pro.": "This lot's outline, address and Street View are in Pro.",
    "Abrir o Street View ↗": "Open Street View ↗", "Ver no mapa ↗": "View on map ↗", "Condado": "County", "Data do leilão": "Auction date", "Valor de cadastro": "Assessed value",
    "Uso": "Use", "Área construída": "Building area", "# pé²": "# sq ft", "# pé² · #": "# sq ft · #", "Parcela": "Parcel", "Edital oficial ↗": "Official notice ↗",
    "Confira sempre o edital oficial do condado antes do lance.": "Always check the county's official notice before bidding.",
    "Acompanhando ✓": "Following ✓", "Acompanhar": "Follow", "Acompanhando": "Following", "Perguntar à IA": "Ask the AI", "Fotos do lote": "Lot photos",
    // por-que-blr (27/11): a página ganhou o seletor EN | PT e a prova das compras reais
    "Por que BLR": "Why BLR",
    "Outros te dão uma calculadora.": "Others give you a calculator.",
    "A BLR te dá o teto de lance e cuida da obra.": "BLR gives you the max bid and handles the renovation.",
    "A Vitrine BLR foi feita por uma investidora que compra em leilão. Ela junta os leilões públicos dos EUA lidos direto da fonte oficial, calcula quanto a casa vale depois de pronta e diz até quanto vale a pena dar de lance.": "The BLR Auction Finder was built by an investor who buys at auction. It gathers U.S. public auctions read straight from the official source, works out what the house is worth once finished and tells you how high a bid still makes sense.",
    "Testar # dias grátis · sem cartão": "Try # days free · no card",
    "Ver os planos": "See the plans",
    "A gente compra o que mostra": "We buy what we show",
    "A BLR arrematou # imóveis em leilões de imposto na Pensilvânia em #, com o mesmo método da Vitrine. Os números são dos recibos oficiais.": "BLR won # properties at Pennsylvania tax sales in #, using the same method as the Auction Finder. The figures come from the official receipts.",
    "imóveis arrematados": "properties won",
    "em lances": "in bids",
    "em taxas e impostos de transferência": "in fees and transfer taxes",
    "pagos no total": "paid in total",
    "Ver os # imóveis, lance e taxas de cada um": "See the # properties, with the bid and fees for each",
    "O que muda na prática": "What changes in practice",
    "Leilões de fonte oficial": "Auctions from the official source",
    "Editais de condados, xerifes, tribunais e órgãos públicos de todo o país: imposto, execução de hipoteca, Upset e Judicial, land bank e imóveis do governo. Cada dado com a fonte e a data da coleta.": "Notices from counties, sheriffs, courts and public agencies nationwide: tax sales, foreclosures, Upset and Judicial sales, land banks and government-owned homes. Every data point with its source and collection date.",
    "ARV calculado, não digitado": "ARV calculated, not typed in",
    "O valor depois de pronto sai das vendas reais e do valor oficial do condado. Você não precisa adivinhar o número que decide o negócio.": "The after-repair value comes from real sales and the county's official value. You don't have to guess the number that makes or breaks the deal.",
    "Teto de lance": "Max bid",
    "O maior lance que ainda deixa a margem depois de reforma, título, impostos e venda. Passou dele, não vale.": "The highest bid that still leaves the margin after repairs, title, taxes and the sale. Above it, it isn't worth it.",
    "Nota #–# com o porquê": "A #–# score with the reasons",
    "Margem até o teto, riscos do tipo de leilão (o que sobrevive à venda) e chance de fechar, explicados em palavras.": "Room up to the max bid, the risks of the auction type (what survives the sale) and the odds of closing, explained in plain words.",
    "Assistente que responde tudo": "An assistant that answers everything",
    "Pergunte em português ou em inglês, por escrito ou por voz: como funciona cada leilão, os próximos de um estado, a conta de um lote.": "Ask in English or Portuguese, by text or by voice: how each auction works, the next ones in a state, the math on a lot.",
    "Obra com a BLR": "Renovation with BLR",
    "No UltraPro, levantamento, projeto e gestão de obra com a BLR. Quem só vende software não faz isso.": "On UltraPro, BLR handles the survey, design and construction management. A software-only company can't offer that.",
    "Comprar um imóvel nos EUA, como quem compra online": "Buying a U.S. property, as easily as shopping online",
    "Do leilão ao lucro em quatro passos. Você faz do Brasil; a BLR mostra o caminho e, no UltraPro, vai junto.": "From auction to profit in four steps. Work from anywhere; BLR shows the way and, on UltraPro, comes along.",
    "Achar": "Find",
    "Arrematar": "Win",
    "Reformar": "Renovate",
    "Lucrar": "Profit",
    "Mapa com os leilões oficiais do país, busca por endereço, cidade ou CEP, nota de # a # e o tipo de cada venda.": "A map of the country's official auctions, search by address, city or ZIP, a # to # score and the type of each sale.",
    "Teto de lance lote a lote, o que sobrevive ao leilão e o passo a passo da inscrição. No UltraPro, a BLR dá o lance com você.": "Max bid lot by lot, what survives the auction and the registration step by step. On UltraPro, BLR bids with you.",
    "Conta da reforma na ficha, foto aérea e de rua do imóvel, cadastro do condado e o relatório em PDF para levar ao empreiteiro.": "Renovation math on the lot page, aerial and street photos, the county record and a PDF report to hand to your contractor.",
    "Vender pelo ARV ou alugar e refinanciar (BRRRR): a ficha mostra o aluguel do bairro e a conta de cada saída.": "Sell at ARV or rent and refinance (BRRRR): the lot page shows the neighborhood rent and the math for each exit.",
    "Edital": "Notice",
    "Lance": "Bid",
    "Escritura": "Deed",
    "Obra": "Renovation",
    "Venda ou aluguel": "Sale or rental",
    "O prazo de cada etapa depende do estado e do tipo de leilão (por exemplo, prazo de resgate do antigo dono e quiet title). A ficha de cada lote diz o que vale para ele.": "How long each step takes depends on the state and the auction type (for example, the former owner's redemption period and quiet title). Each lot page says what applies to it.",
    "Fazer sozinho × ferramenta comum × Vitrine BLR": "Doing it yourself × a typical tool × BLR Auction Finder",
    "Fazer sozinho": "Doing it yourself",
    "Ferramenta comum": "Typical tool",
    "Vitrine BLR": "BLR Auction Finder",
    "Origem dos imóveis": "Where the properties come from",
    "Garimpar o site de cada condado, um por um": "Digging through each county's site, one by one",
    "Anúncios do mercado comum e bases compradas": "Regular listings and purchased databases",
    "Editais oficiais de leilão, com fonte e data": "Official auction notices, with source and date",
    "ARV (valor depois de pronto)": "ARV (after-repair value)",
    "Pesquisar vendas no braço": "Researching sales by hand",
    "Você digita": "You type it in",
    "Calculado pela BLR": "Calculated by BLR",
    "Teto de lance de leilão": "Auction max bid",
    "Conta própria, sem padrão": "Your own math, no standard",
    "Não tem": "Not available",
    "Tem, lote a lote": "Yes, lot by lot",
    "O que sobrevive ao leilão": "What survives the auction",
    "Ler cada edital e a lei do estado": "Reading every notice and the state law",
    "Pouco ou nada sobre o tipo de venda": "Little or nothing about the sale type",
    "Selo por tipo de leilão e ônus conferidos": "A badge per auction type and checked liens",
    "Imagem do imóvel": "Property imagery",
    "Viajar até lá ou procurar no Google": "Travel there or search Google",
    "Foto de anúncio, quando existe": "Listing photo, when there is one",
    "Street View, foto aérea e contorno do lote, mesmo sem anúncio": "Street View, aerial photo and lot outline, even without a listing",
    "Idioma e atendimento": "Language and support",
    "Inglês, por telefone com o condado": "English, by phone with the county",
    "Inglês": "English",
    "Português, com assistente de IA": "English or Portuguese, with an AI assistant",
    "Custo": "Cost",
    "Grátis, mas custa semanas do seu tempo": "Free, but it costs weeks of your time",
    "Pede cartão e cobra no fim do teste": "Asks for a card and charges when the trial ends",
    "# dias sem cartão, sem cobrança automática": "# days with no card, no automatic charge",
    "Sozinho": "On your own",
    "Não": "No",
    "Comece pelo mapa, sem cartão.": "Start with the map, no card.",
    "# dias com tudo o que o assinante vê. Quer a BLR cuidando da obra? Fale com a gente.": "# days with everything a subscriber sees. Want BLR to handle the renovation? Talk to us.",
    "Começar o teste": "Start the trial",
    "Falar com a BLR": "Talk to BLR",
    "A análise completa da BLR (ARV pelas vendas reais e teto) existe hoje na Flórida; nos outros estados os lotes trazem ARV estimado pelo valor oficial do condado e pelo mercado do CEP. Nota, ARV e teto são estimativas, não avaliação nem recomendação de investimento; o edital oficial é o que vale. Veja os": "BLR's full analysis (ARV from real sales and the max bid) is available in Florida today; in other states lots carry an ARV estimated from the county's official value and the ZIP-code market. Score, ARV and max bid are estimates, not an appraisal or investment advice; the official notice is what counts. See the",
    "Termos de Uso": "Terms of Use",
    "Início": "Home",
    // links das páginas novas (27/11)
    "Calculadora de lance máximo": "Max bid calculator", "A conta da BLR, degrau a degrau: do ARV até o maior lance que ainda deixa margem.": "BLR's math, step by step: from ARV to the highest bid that still leaves a margin.",
    "Regras de cada estado": "Rules in every state", "Tax deed ou tax lien, juros, prazo de resgate e a lei de cada estado, com os leilões da Vitrine.": "Tax deed or tax lien, interest, redemption period and the law in each state, with the Auction Finder's auctions.",
    "Calculadora": "Calculator", "Regras por estado": "Rules by state",
    // análise completa (27/11): a ficha da clássica, só do lote, num painel; a clássica ainda é em português
    "Análise completa": "Full analysis", "conta, comparáveis, ônus, cadastro e links": "math, comps, liens, county record and links",
    "Análise completa do lote · todos os dados da versão clássica, só deste lote": "Full lot analysis · every data point from the classic version, for this lot (in Portuguese)",
    "Fechar a análise completa": "Close the full analysis", "Carregando a análise completa…": "Loading the full analysis…", "Análise completa do lote": "Full lot analysis",
    "Foto aérea do lote": "Aerial photo of the lot", "Foto aérea (USGS, domínio público)": "Aerial photo (USGS, public domain)", "contorno da parcela no cadastro": "parcel outline from county records",
    "círculo = posição do lote": "circle = lot location", "arraste para girar": "drag to look around", "Fachada": "Front view", "cadastro do condado": "county records",
    "Vista aérea do bairro com as ruas e o contorno do lote": "Aerial view of the neighborhood with streets and the lot outline",
    "Satélite com as ruas, ~400 m de largura · USGS NAIP + Censo TIGER": "Satellite with streets, ~400 m wide · USGS NAIP + Census TIGER",
    "Foto de rua (Mapillary)": "Street photo (Mapillary)", "Foto de rua": "Street photo", "© Mapillary contributors (CC-BY-SA 4.0)": "© Mapillary contributors (CC-BY-SA 4.0)",
    "Terreno": "Land", "Com construção": "With building",
    // agenda
    "Agenda dos leilões": "Auction calendar", "Todos os leilões com data, dos editais e do calendário dos condados. Toque num leilão para ver os lotes dele no mapa.":
      "Every dated auction, from the notices and the county calendars. Tap an auction to see its lots on the map.",
    "Mês anterior": "Previous month", "Próximo mês": "Next month", "leilões no dia · toque no dia para ver só ele": "auctions that day · tap a day to see only that day",
    "ver todos": "see all", "Calendário dos próximos leilões": "Calendar of upcoming auctions", "Prazo para se inscrever no leilão": "Deadline to register for the auction",
    // meus lotes, avisos
    "Os lotes que você acompanha. Toque em \"Acompanhar\" na ficha de um lote para ele aparecer aqui.": "The lots you follow. Tap \"Follow\" on a lot page to see it here.",
    "Nenhum lote ainda.": "No lots yet.", "Portfólio": "Portfolio", "Os imóveis que você arrematou com a BLR aparecem aqui. Por enquanto ficam na": "Properties you won with BLR show up here. For now they live in the",
    ", em Meu portfólio.": ", under My portfolio.", "em Meu portfólio.": "under My portfolio.",
    // meu portfólio na versão nova (28/11)
    "Meu portfólio": "My portfolio", "Entre na sua conta para ver os imóveis que você arrematou e os seus projetos.": "Sign in to see the properties you won and your projects.",
    "# projeto": "# project", "# projetos": "# projects", "na carteira": "in the portfolio", "soma dos ARVs": "sum of ARVs", "desembolso total": "total cash out", "retorno da carteira": "portfolio return",
    "Nenhum arremate registrado ainda. Quando você arrematar, sozinho ou com a BLR, o imóvel aparece aqui.": "No winning bids recorded yet. When you win a property, on your own or with BLR, it shows up here.",
    "Nenhum projeto ainda. Os lotes salvos como projeto na versão clássica aparecem aqui.": "No projects yet. Lots saved as a project in the classic version show up here.",
    "Para mudar a etapa, os valores e as notas, ou ver a conta de cada projeto, use a": "To change the stage, figures and notes, or see each project's numbers, use the",
    "Valores são estimativas, não garantia de resultado.": "Figures are estimates, not a guarantee of results.",
    "seu lance": "your bid", "fora da base agora": "no longer in our data", "Analisando": "Analyzing", "Inscrito no leilão": "Registered for the auction", "Lance dado": "Bid placed", "Arrematado": "Won", "Descartado": "Dropped",
    "Nenhum aviso agora. Avisamos aqui quando a data ou o lance mudar, quando o leilão chegar ou o lote sair da lista.": "No alerts right now. We'll let you know here when the date or the bid changes, when the auction is near or when the lot leaves the list.",
    "Saiu da lista do condado": "Removed from the county list", "Costuma ser dívida paga, acordo ou leilão cancelado.": "Usually the debt was paid, settled or the auction was canceled.",
    "Data do leilão mudou": "Auction date changed", "Lance de abertura mudou": "Opening bid changed", "Inscrição fecha": "Registration closes", "Avisos": "Alerts",
    // aprender, progresso
    "Guias curtos para ir do edital ao arremate, e as palavras que aparecem nos leilões.": "Short guides from the notice to the winning bid, and the words you'll see at auctions.",
    "Glossário": "Glossary", "Primeiros passos": "First steps", "Selos": "Badges", "XP": "XP", "Sequência:": "Streak:", "Sequência": "Streak", "Faltam": "You need",
    "XP para Estudante": "XP to reach Student", "XP para Investidor": "XP to reach Investor", "XP para Arrematador": "XP to reach Winning bidder", "XP para Sócio BLR": "XP to reach BLR partner",
    "Mostrar os avisos de XP": "Show XP notices",
    "XP: abrir lote +# · estado novo +# · teto de lance visto +# · acompanhar lote +# · guia lido +#. Cada coisa conta uma vez.": "XP: open a lot +# · new state +# · max bid seen +# · follow a lot +# · guide read +#. Each one counts once.",
    "Cada coisa conta uma vez.": "Each one counts once.",
    "Você está como visitante: o progresso fica neste navegador e passa para a sua conta quando você entrar.": "You're browsing as a guest: progress stays in this browser and moves to your account when you sign in.",
    // planos (planos.js)
    "Escolha o seu plano": "Choose your plan", "Gratuito": "Free", "para conhecer": "to get started", "Básico": "Basic", "para quem foca em # estado": "for investors focused on # state",
    "o mais escolhido": "most popular", "para operar com a BLR": "to work with BLR", "Pro": "Pro", "UltraPro": "UltraPro",
    "Mapa dos EUA com todos os leilões": "US map with every auction", "Lista de oportunidades": "Opportunity list", "Lance de abertura de cada lote": "Opening bid for every lot",
    "Tudo do Gratuito": "Everything in Free", "Ficha completa e filtros": "Full lot details and filters", "# estado à sua escolha (troca #× por mês)": "# state of your choice (change #× a month)",
    "Assistente de IA: # consultas por mês": "AI assistant: # questions a month", "Tudo do Básico": "Everything in Basic", "Endereço, posição exata, contorno e Street View": "Address, exact location, outline and Street View",
    "Até # estados (troca #× por mês)": "Up to # states (change #× a month)", "Tudo do Pro": "Everything in Pro", "Os # estados, DC e territórios": "All # states, DC and territories",
    "Serviço de levantamento, projeto e gestão de obra com a BLR": "Survey, design and construction management service with BLR", "Sala de leilão online em tempo real": "Live online auction room",
    "Assistente de IA ilimitado": "Unlimited AI assistant", "Começar grátis": "Start free", "# dias grátis": "# days free", "Mensal": "Monthly", "Anual · # meses grátis": "Yearly · # months free",
    "Anual": "Yearly", "/mês": "/mo", "/ano": "/yr", "Grátis": "Free", "a partir de": "from", "Assinar o Básico": "Get Basic", "Assinar o Pro": "Get Pro", "Assinar o UltraPro": "Get UltraPro",
    "Comece grátis: o mapa dos EUA com todos os leilões e o lance de abertura. O Pro tem # dias grátis, só com e-mail e telefone, sem cartão.": "Start free: the US map with every auction and its opening bid. Pro has # days free, just email and phone, no card.",
    "Preços em dólar. Pagamento seguro pelo Stripe, aqui mesmo no site, em nome de BLR Development. Mensal: cancele quando quiser. O acesso é liberado assim que o pagamento é confirmado.":
      "Prices in US dollars. Secure payment by Stripe, right here on the site, billed by BLR Development. Monthly: cancel anytime. Access is unlocked as soon as the payment is confirmed.",
    "Forma de pagamento": "Payment method", "ver os planos": "see the plans", "sem limite": "no limit",
    // página /planos/
    "← voltar ao mapa": "← back to the map", "Tutoriais: o primeiro lance": "Tutorials: your first bid", "# meses grátis": "# months free", "Mais escolhido": "Most popular", "Falar com a BLR": "Talk to BLR", "Quero o Básico": "I want Basic",
    "Criar acesso grátis": "Create free access", "Teste o Pro # dias grátis": "Try Pro free for # days", "Eles te dão uma calculadora.": "They give you a calculator.",
    "A BLR te dá o teto de lance e cuida da obra.": "BLR gives you the max bid and handles the construction.", "Só a calculadora.": "Just the calculator.",
    "O lance fica por sua conta.": "The bid is on you.", "O analista marca o teto de lance, no Pro.": "The analyst sets the max bid, in Pro.",
    "No UltraPro, levantamento, projeto e gestão de obra com a BLR.": "In UltraPro, survey, design and construction management with BLR.",
    "Serviço de levantamento, projeto e gestão de obra com a BLR, depois do arremate.": "Survey, design and construction management service with BLR, after you win the bid.",
    "Self Bidder: você opera por conta própria": "Self Bidder: you bid on your own", "Você dá o lance por conta própria, com os dados e a análise da BLR.": "You place the bid yourself, with BLR's data and analysis.",
    "Nos planos Básico e Pro.": "In the Basic and Pro plans.", "Self Bidder com suporte a dúvidas": "Self Bidder with Q&A support",
    "Calculadora no mapa: teto BLR, ARV e a conta ao vivo": "Calculator on the map: BLR max bid, ARV and live math", "Posição exata, contorno do lote e Street View": "Exact location, lot outline and Street View",
    "Ficha completa e filtros avançados": "Full lot details and advanced filters", "Várias listas e alertas de oportunidades": "Multiple lists and opportunity alerts",
    "Valor da dívida (lance de abertura) de cada lote": "Debt amount (opening bid) for every lot", "Consultoria de engenharia": "Engineering consulting",
    "Comunidade: alertas, oferta de lotes já arrematados, mentoria": "Community: alerts, offers of already-won lots, mentoring", "Curso completo “da pesquisa ao arremate”": "Full course “from research to winning bid”",
    "Comece grátis: o mapa dos EUA com todos os leilões e o valor da dívida.": "Start free: the US map with every auction and the debt amount.",
    "Só com e-mail e telefone, sem cartão.": "Just email and phone, no card.", "Vale para o Pro e o UltraPro.": "Valid for Pro and UltraPro.", "O Básico não tem.": "Basic doesn't include it.",
    "Se não assinar, você continua como visitante.": "If you don't subscribe, you stay a guest.", "Nada é cobrado nesta página.": "Nothing is charged on this page.",
    "Preços em dólar.": "Prices in US dollars.", "Mensal: cancele quando quiser.": "Monthly: cancel anytime.",
    "Anual: paga # meses e usa #, com #% de desconto na taxa por arremate do self bider.": "Yearly: pay for # months and use #, with #% off the self-bidder fee per winning bid.",
    "Depois do pedido a BLR manda o link de pagamento seguro e libera o acesso.": "After your request, BLR sends a secure payment link and unlocks your access.",
    "Ao pedir um plano você aceita os": "By requesting a plan you accept the", "Por que BLR? Veja o que muda em relação a uma ferramenta comum →": "Why BLR? See how it differs from a typical tool →",
    // página /conta/
    "Você não está conectado.": "You're not signed in.", "entre na sua conta": "sign in to your account", "comece o teste grátis de # dias": "start the #-day free trial",
    "As preferências abaixo ficam neste navegador.": "The preferences below are saved in this browser.", "Para ver o seu plano,": "To see your plan,", "ou peça a": "or request",
    "Perfil do investidor": "Investor profile",
    "O questionário só sugere: você continua vendo tudo na vitrine.": "The questionnaire only suggests: you still see everything on the map.",
    "Cada questionário pode virar uma lista de acompanhamento.": "Each questionnaire can become a watch list.", "✦ Refazer o questionário Para você": "✦ Retake the For you questionnaire",
    "Plano e cobrança": "Plan and billing", "A cobrança é feita pela BLR: depois do pedido você recebe o link de pagamento seguro.": "Billing is handled by BLR: after your request you get a secure payment link.",
    "Cartão, faturas, recibos e cancelamento vão aparecer aqui quando o pagamento online for ligado.": "Card, invoices, receipts and cancellation will show up here once online payment is on.",
    "Para cancelar agora, fale com a BLR.": "To cancel now, contact BLR.", "Uso do assistente de IA": "AI assistant usage",
    "O assistente de IA é dos planos pagos; no teste de # dias você usa à vontade.": "The AI assistant is for paid plans; during the #-day trial you can use it freely.", "Este mês: #.": "This month: #.",
    "Os avisos vão por e-mail.": "Alerts go by email.", "A escolha fica gravada; o envio automático começa assim que o servidor estiver pronto.": "Your choice is saved; automatic sending starts as soon as the server is ready.",
    "Lote novo que combina com uma lista": "New lot that matches a list", "Leilão de um lote das minhas listas chegando (# dias antes)": "Auction of a lot on my lists coming up (# days before)",
    "Também pelo WhatsApp": "Also by WhatsApp", "Configurações: moeda, idioma e tela": "Settings: currency, language and display", "Moeda dos valores": "Currency for values",
    "Dólar americano (US$)": "US dollar (US$)", "Dólar australiano (A$)": "Australian dollar (A$)", "Dólar canadense (C$)": "Canadian dollar (C$)", "Franco suíço (CHF)": "Swiss franc (CHF)",
    "Dados pessoais": "Personal details", "Nome": "Name", "Salvar": "Save", "Telefone / WhatsApp": "Phone / WhatsApp", "Visitante (Gratuito)": "Guest (Free)", "Tema": "Theme",
    "Minhas listas (#)": "My lists (#)", "★ Minhas listas (#)": "★ My lists (#)", "Normal": "Normal", "Pequena": "Small", "Grande": "Large",
    "Apagar meus dados deste navegador": "Delete my data from this browser", "Vitrine": "Vitrine",
    "Libra esterlina (£)": "Pound sterling (£)", "Iene (¥)": "Yen (¥)", "Yuan (CN¥)": "Yuan (CN¥)", "Rupia indiana (₹)": "Indian rupee (₹)", "Shekel (₪)": "Shekel (₪)", "Rand (R)": "Rand (R)",
    "Dirham (AED)": "Dirham (AED)", "Guarani (₲)": "Guarani (₲)", "Peso argentino (AR$)": "Argentine peso (AR$)", "Peso chileno (CLP$)": "Chilean peso (CLP$)",
    "Peso colombiano (COL$)": "Colombian peso (COL$)", "Peso mexicano (MX$)": "Mexican peso (MX$)", "Peso uruguaio ($U)": "Uruguayan peso ($U)", "Sol peruano (S/)": "Peruvian sol (S/)",
    "Real (R$)": "Brazilian real (R$)", "Euro (€)": "Euro (€)", "Libra (£)": "Pound (£)", "Português": "Português", "English (em breve)": "English", "Idioma": "Language",
    "Escuro (padrão)": "Dark (default)", "Claro (nesta página e no Para você; o mapa é escuro)": "Light (on this page and For you; the map is dark)", "Tamanho da letra": "Font size",
    "Senha e segurança": "Password and security", "Receber link para criar uma senha nova": "Get a link to create a new password",
    "A BLR guarda só o necessário para o seu acesso.": "BLR keeps only what your access needs.", "Leia a": "Read the", "política de privacidade": "privacy policy", "exclusão dos seus dados": "deletion of your data",
    // conta, login, cadastro
    "E-mail": "Email", "Senha": "Password", "Esqueceu a senha?": "Forgot your password?", "Receber um link para criar uma senha nova": "Get a link to create a new password",
    "Ainda não tem acesso?": "No account yet?", "ou": "or", "Prefere pagar sem entrar?": "Prefer to pay without signing in?", "Pagar pelo Stripe": "Pay with Stripe",
    "(a BLR cria o acesso com o e-mail do pagamento).": "(BLR creates your access with the payment email).", "O pagamento fica ligado à sua conta BLR.": "The payment is linked to your BLR account.",
    "Entrando…": "Signing in…", "E-mail ou senha não conferem.": "Email or password is incorrect.", "Acesso bloqueado ou vencido. Fale com a BLR.": "Access blocked or expired. Contact BLR.",
    "Muitas tentativas. Espere 15 minutos.": "Too many attempts. Wait 15 minutes.", "Muitas tentativas. Espere alguns minutos.": "Too many attempts. Wait a few minutes.",
    "O login não respondeu agora. Tente de novo em instantes.": "Sign-in isn't responding right now. Try again in a moment.",
    "Você entrou, mas a conta não abriu agora. Atualize a página.": "You're signed in, but your account didn't load. Refresh the page.",
    "Minha conta": "My account", "Administrar usuários": "Manage users", "Sair da conta": "Sign out", "Saindo…": "Signing out…", "teste grátis do Pro": "Pro free trial", "Plano:": "Plan:",
    "Criar uma senha nova": "Create a new password", "Digite o e-mail do seu acesso. Se ele tiver acesso, você recebe um link (vale por pouco tempo e uma vez só) para escolher a senha nova.":
      "Enter your account email. If it has access, you'll get a link (valid for a short time, one use only) to choose a new password.",
    "Receber o link": "Send me the link", "Voltar para entrar": "Back to sign in", "Enviando…": "Sending…", "Confira o seu e-mail": "Check your email",
    "Muitos pedidos. Espere 15 minutos.": "Too many requests. Wait 15 minutes.", "Confira o e-mail digitado.": "Check the email you typed.",
    "O pedido não foi agora. Tente de novo em instantes.": "The request didn't go through. Try again in a moment.",
    "Teste grátis por # dias": "Free trial for # days", "Telefone / WhatsApp (com o código do país)": "Phone / WhatsApp (with country code)", "Li e aceito os": "I have read and accept the",
    "Termos de Uso": "Terms of Use", "e a": "and the", "e o": "and the", "e": "and", "Política de Privacidade": "Privacy Policy", "Começar o teste": "Start the trial",
    "Já tem acesso?": "Already have access?", "Quase lá ✓": "Almost there ✓", "Mandamos para": "We sent", "o link para criar a sua senha. O teste de # dias começa quando você entrar.": "a link to create your password. Your #-day trial starts when you sign in.",
    "Este e-mail já tem acesso. Entre ou peça uma senha nova.": "This email already has access. Sign in or request a new password.", "Confira o e-mail e o telefone.": "Check the email and phone number.",
    "O cadastro não respondeu agora. Tente de novo em instantes.": "Sign-up isn't responding right now. Try again in a moment.",
    // IA
    "IA": "AI", "Pergunte sobre um lote, um tipo de leilão ou os planos.": "Ask about a lot, an auction type or the plans.", "Escreva a sua pergunta": "Type your question", "Enviar": "Send",
    "Pensando…": "Thinking…", "Sem resposta.": "No answer.", "Entre na sua conta para usar o assistente.": "Sign in to use the assistant.",
    "Você chegou ao limite de perguntas do seu plano.": "You've reached your plan's question limit.", "O assistente não respondeu agora. Tente de novo.": "The assistant didn't answer. Try again.",
    // erros gerais
    "Recarregue a página.": "Reload the page.", "Não foi possível carregar os dados": "Couldn't load the data",
    // tipos/onde (dados dos editais)
    "venda do xerife/constable": "sheriff/constable sale", "lista pública do condado": "county public list", "inscrição até": "registration until",
    "Condominiums": "Condominiums", "Single Family": "Single Family",
    // estados e cidades com nome em português
    "Alasca": "Alaska", "Califórnia": "California", "Carolina do Norte": "North Carolina", "Carolina do Sul": "South Carolina", "Dakota do Norte": "North Dakota", "Dakota do Sul": "South Dakota",
    "Distrito de Colúmbia": "District of Columbia", "Flórida": "Florida", "Geórgia": "Georgia", "Havaí": "Hawaii", "Luisiana": "Louisiana", "Nova Jersey": "New Jersey", "Nova York": "New York",
    "Novo México": "New Mexico", "Pensilvânia": "Pennsylvania", "Virgínia": "Virginia", "Virgínia Ocidental": "West Virginia", "Porto Rico": "Puerto Rico", "Ilhas Virgens": "Virgin Islands",
    "Filadélfia": "Philadelphia", "São Francisco": "San Francisco", "Nova Orleans": "New Orleans", "Indianápolis": "Indianapolis"
  };
  /* padrões com nome ou data no meio (o grupo é traduzido de novo, se tiver tradução) */
  const t = s => tr(s);
  const P = I.P = [
    [/^Lote em (.+)$/, (m, a) => "Lot in " + a],
    [/^Autorizo a BLR a enviar esses dados a (.+?) para (.+), e a \1 a me contatar sobre isso\.$/, (m, a, b) => `I authorize BLR to send this data to ${a} for “${t(b.charAt(0).toUpperCase() + b.slice(1))}”, and ${a} to contact me about it.`],
    [/^(.+) recebeu o seu pedido com o código$/, (m, a) => a + " received your request with code"],
    [/^· Próximo: (.+)$/, (m, a) => "· Next: " + t(a)],
    [/^XP para (.+)$/, (m, a) => "XP to reach " + t(a)],
    [/^US\$ ?(\d{1,3}(?:\.\d{3})*),(\d{2})$/, (m, a, c) => "US$ " + a.replace(/\./g, ",") + "." + c],
    [/^(Quero|Ver) o (.+)$/, (m, v, a) => (v === "Quero" ? "I want " : "See ") + t(a)],
    [/^\/mês · economia de US\$ ?(.+)$/, (m, a) => "/mo · save US$ " + a],
    [/^(.+ County, \S+): (\S+) lotes · (\d+) leilões no calendário$/, (m, a, n, k) => a + ": " + n + " lots · " + k + " auctions on the calendar"],
    [/^(.+ County, \S+): sem lote à venda agora$/, (m, a) => a + ": no lots for sale right now"],
    [/^(\S+) consultas este mês \((.+)\)$/, (m, n, a) => n + " questions this month (" + a + ")"],
    [/^Salvo ✓ · os valores do mapa aparecem em (.+)$/, (m, a) => "Saved ✓ · map values now show in " + a],
    [/^condado de (.+)$/, (m, a) => a + " County"],
    [/^Em (.+)$/, (m, a) => "In " + t(a)],
    [/^Semana de (.+) a (.+)$/, (m, a, b) => "Week of " + a + " – " + b],
    [/^(\S+) de (\d{4})$/, (m, a, b) => a + " " + b],
    [/^(\d+) de (\S+): (\d+) leilões$/, (m, d, mes, n) => mes + " " + d + ": " + n + " auctions"],
    [/^inscrição até (.+)$/, (m, a) => "registration until " + a],
    [/^Gravames: (.+)$/, (m, a) => "Liens: " + t(a)],
    [/^Entre para assinar o (.+)$/, (m, a) => "Sign in to subscribe to " + t(a)],
    [/^Olá, (.+)!$/, (m, a) => "Hi, " + a + "!"],
    [/^Plano: (.+)$/, (m, a) => "Plan: " + t(a)],
    [/^Meus estados \((.*)\)$/, (m, a) => "My states (" + (a === "escolher" ? "choose" : a) + ")"],
    [/^Novo selo: (.+)$/, (m, a) => "New badge: " + t(a)],
    [/^(.+): mostrando os lotes só listados \(ainda sem valores\)$/, (m, a) => t(a) + ": showing listed-only lots (no figures yet)"],
    [/^(Data do leilão mudou|Lance de abertura mudou|Saiu da lista do condado|Leilão hoje|Leilão amanhã|Leilão realizado): (.+)$/, (m, a, b) => t(a) + ": " + b],
    [/^Leilão em (\d+) dias: (.+)$/, (m, n, b) => "Auction in " + n + " days: " + b],
    [/^Inscrição fecha (hoje|amanhã|em \d+ dias): (.+)$/, (m, a, b) => "Registration closes " + t(a) + ": " + b],
    [/^Prazo para se inscrever no leilão: (.+)$/, (m, a) => "Deadline to register for the auction: " + a],
    [/^Se (.+) tiver acesso BLR, o link para criar a senha nova chega em alguns minutos\. Veja também a caixa de spam\.$/, (m, a) => "If " + a + " has BLR access, the link to create a new password arrives in a few minutes. Check your spam folder too."],
    [/^Nenhum lote à venda com o CEP (.+)$/, (m, a) => "No lots for sale in ZIP " + a],
    [/^Street View ao vivo \(Google(?:, foto de (\S+))?\)$/, (m, a) => "Live Street View (Google" + (a ? ", photo from " + a : "") + ")"],
    [/^a (\S+) m do centro do lote$/, (m, a) => a + " m from the lot center"],
    [/^Foto de rua$/, () => "Street photo"],
    [/^(.+), foto de (\S+)$/, (m, a, b) => t(a) + ", photo from " + b],
    [/^Não foi possível carregar os dados \((.*)\)\. Recarregue a página\.$/, (m, a) => "Couldn't load the data (" + a + "). Reload the page."],
    [/^(\d[\d,.]*) (aviso novo|avisos novos)$/, (m, n, a) => n + (a === "aviso novo" ? " new alert" : " new alerts")]
  ];
  const DIAS = {dom: "Sun", seg: "Mon", ter: "Tue", qua: "Wed", qui: "Thu", sex: "Fri", "sáb": "Sat"};
  const MESES = {jan: "Jan", fev: "Feb", mar: "Mar", abr: "Apr", mai: "May", jun: "Jun", jul: "Jul", ago: "Aug", set: "Sep", out: "Oct", nov: "Nov", dez: "Dec"};
  Object.assign(D, DIAS, MESES);
  for(const m in MESES) for(const d in DIAS) D[m + " · " + d] = MESES[m] + " · " + DIAS[d];

  const PT = /[ãõçáéíóúâêôà]|\b(de|do|da|dos|das|em|com|sem|para|não|você|seu|sua|os|o|um|uma|ao|na|quero|ver|abertura|cadastro|lote|lotes|leilão|leilões|grátis|mais|já|até)\b/i;
  const SAIDAS = new Set();   // textos que já são tradução (o observer vê a troca e não pode contar como faltando)
  const NUM = /\d+(?:[.,]\d+)*/g;
  const cache = new Map();
  function tr(s){
    if(cache.has(s)) return cache.get(s);
    let r = null;
    if(Object.prototype.hasOwnProperty.call(D, s)) r = D[s];
    else {
      const nums = s.match(NUM);
      if(nums){ const k = s.replace(NUM, "#"); if(Object.prototype.hasOwnProperty.call(D, k)){ let i = 0; r = D[k].replace(/#/g, () => nums[i++] ?? "#"); } }
      if(r == null) for(const [re, f] of P){ const m = s.match(re); if(m){ r = f(...m); break; } }
      if(r == null && s.includes(" · ")){ const ps = s.split(" · "), ts = ps.map(x => tr(x)); if(ts.some((x, i) => x !== ps[i])) r = ts.join(" · "); }
      if(r == null && s.includes(" — ")){ const ps = s.split(" — "), ts = ps.map(x => tr(x)); if(ts.some((x, i) => x !== ps[i])) r = ts.join(" — "); }
      if(r == null && /\.\s/.test(s)){ const ps = s.split(/(?<=\.)\s+/), ts = ps.map(x => tr(x)); if(ts.some((x, i) => x !== ps[i])) r = ts.join(" "); }
    }
    if(r == null){ r = s; if(!SAIDAS.has(s) && PT.test(s.replace(/\S+\.(com|org|net|gov|us)\b\S*/gi, "").replace(/\b[A-Z]{2}\b/g, ""))) I.faltando.add(s); }
    else SAIDAS.add(r);
    cache.set(s, r); return r;
  }
  I.t = s => { const c = String(s ?? "").replace(/\s+/g, " ").trim(); return c ? tr(c) : String(s ?? ""); };
  if(!I.en) return;

  const ATRS = ["placeholder", "aria-label", "title", "alt", "data-s"];
  const PULA = el => el.closest && el.closest("script,style,.m.u,[data-sem-traducao]");
  function texto(n){
    const v = n.nodeValue; if(!v || !/[A-Za-zÀ-ú]/.test(v)) return;
    const p = n.parentElement; if(!p || PULA(p)) return;
    const c = v.replace(/\s+/g, " ").trim(); if(!c) return;
    const r = tr(c); if(r !== c){ const a = v.match(/^\s*/)[0], b = v.match(/\s*$/)[0]; n.nodeValue = (a ? " " : "") + r + (b ? " " : ""); }
  }
  function atributos(el){
    if(PULA(el)) return;
    for(const a of ATRS){ const v = el.getAttribute(a); if(v && /[A-Za-zÀ-ú]/.test(v)){ const r = I.t(v); if(r !== v) el.setAttribute(a, r); } }
    if(el.tagName === "A"){ const h = el.getAttribute("href"); if(h && /(^|\/)termos\/?$/.test(h)) el.setAttribute("href", "/terms/"); }
  }
  function varre(raiz){
    if(raiz.nodeType === 3){ texto(raiz); return; }
    if(raiz.nodeType !== 1 && raiz.nodeType !== 9 && raiz.nodeType !== 11) return;
    if(raiz.nodeType === 1){ if(PULA(raiz)) return; atributos(raiz); }
    const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let n; while((n = w.nextNode())){ if(n.nodeType === 3) texto(n); else atributos(n); }
  }
  I.varre = varre;
  const ob = new MutationObserver(ms => { for(const m of ms){
    if(m.type === "characterData") texto(m.target);
    else if(m.type === "attributes") atributos(m.target);
    else m.addedNodes.forEach(varre); } });
  ob.observe(document.documentElement, {subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATRS.concat("href")});
  document.addEventListener("DOMContentLoaded", () => varre(document.body));
})();

/* seletor EN | PT: entra no topo (antes do botão de tema, ou no fim do cabeçalho) */
document.addEventListener("DOMContentLoaded", () => {
  const I = window.BLR_I18N; if(!I || document.getElementById("btLang")) return;
  const alvo = document.querySelector("[data-lang-aqui]") || document.getElementById("btTema");
  const b = document.createElement("button"); b.type = "button"; b.id = "btLang"; b.className = alvo && alvo.classList.contains("pill") ? "pill" : "";
  b.setAttribute("data-sem-traducao", ""); b.setAttribute("aria-label", I.en ? "PT, mudar para português" : "EN, switch to English");   // 27/11: o nome acessível começa pelo texto visível (Lighthouse)
  b.title = b.getAttribute("aria-label"); b.textContent = I.en ? "PT" : "EN"; b.style.fontWeight = "600";
  if(!b.className) b.style.cssText = "font:600 13px/1 system-ui,sans-serif;padding:7px 11px;margin-right:10px;border:1px solid currentColor;border-radius:99px;background:transparent;color:inherit;cursor:pointer;opacity:.85";
  b.onclick = () => I.troca(I.en ? "pt" : "en");
  if(alvo) alvo.parentNode.insertBefore(b, alvo); else { b.style.cssText = "position:fixed;top:10px;right:10px;z-index:99;font-weight:600"; document.body.appendChild(b); }
});
