// Posts de EXEMPLO, mostrados só enquanto o Sanity não está configurado (NEXT_PUBLIC_SANITY_PROJECT_ID vazio).
// Têm o mesmo formato que vem do Sanity (corpo em Portable Text). Pode apagar este arquivo depois de ligar o Sanity,
// mas mantenha a exportação SAMPLE_POSTS (como lista vazia) se fizer isso.

let n = 0;
const key = () => `k${(n += 1)}`;
const span = (text, marks = []) => ({ _type: 'span', _key: key(), text, marks });
const block = (style, children, extra = {}) => ({ _type: 'block', _key: key(), style, markDefs: [], children, ...extra });
const p = (...parts) => block('normal', parts.map((x) => (typeof x === 'string' ? span(x) : x)));
const h2 = (text) => block('h2', [span(text)]);
const h3 = (text) => block('h3', [span(text)]);
const quote = (text) => block('blockquote', [span(text)]);
const bold = (text) => span(text, ['strong']);
const code = (text) => span(text, ['code']);
const ul = (...items) => items.map((t) => block('normal', [span(t)], { listItem: 'bullet', level: 1 }));
const ol = (...items) => items.map((t) => block('normal', [span(t)], { listItem: 'number', level: 1 }));
const callout = (tone, text) => ({ _type: 'callout', _key: key(), tone, text });
const prompt = (label, text) => ({ _type: 'prompt', _key: key(), label, text });

export const SAMPLE_POSTS = [
  {
    _id: 'exemplo-estado-llc',
    title: 'Como escolher o estado da sua LLC',
    slug: 'como-escolher-o-estado-da-sua-llc',
    pillar: 'empreendedorismo',
    publishedAt: '2026-11-06T12:00:00Z',
    excerpt: 'Delaware, Wyoming ou o estado onde você mora: o que comparar antes de decidir.',
    lead: 'Delaware e Wyoming aparecem em todo lugar, mas nem sempre são a melhor escolha. Veja o que comparar antes de decidir.',
    body: [
      p('Abrir uma LLC (empresa limitada americana) começa por uma escolha que parece simples: ', bold('em qual estado registrar'), '. A resposta depende de onde você mora e de onde o negócio realmente opera.'),
      h2('O que comparar'),
      ...ul('Taxa de abertura e taxa anual do estado', 'Imposto estadual sobre a empresa', 'Se você vai precisar registrar a empresa também no estado onde mora'),
      h3('Custos anuais'),
      p('Some a taxa anual do estado ao ', code('registered agent'), ' (o agente que recebe documentos oficiais em nome da empresa) para ter o custo real de manter a LLC.'),
      callout('dica', 'Confira os valores no site oficial do estado antes de decidir: eles mudam.'),
      quote('Escolha o estado pelo seu negócio, não pela fama.'),
      p('No próximo post, vamos ver o passo a passo do registro e do EIN (o CNPJ americano da empresa).'),
    ],
  },
  {
    _id: 'exemplo-apps-ia',
    title: '3 apps de IA que uso todo dia',
    slug: '3-apps-de-ia-que-uso-todo-dia',
    pillar: 'tecnologia',
    publishedAt: '2026-10-30T12:00:00Z',
    excerpt: 'As ferramentas que economizam horas da minha semana, e como eu uso cada uma.',
    lead: 'Não precisa de dez ferramentas. Três, bem usadas, já mudam a sua semana.',
    body: [
      p('Eu testo muita ferramenta, mas no dia a dia fico com poucas. O critério é simples: ela precisa me poupar tempo ', bold('toda semana'), ', não só uma vez.'),
      h2('1. Um assistente de conversa'),
      p('Uso para rascunhar e-mails, resumir documentos longos e organizar ideias antes de uma reunião.'),
      h2('2. Transcrição de áudio'),
      p('Gravo ideias andando e recebo o texto pronto para editar. Funciona bem em português.'),
      h2('3. Automação entre apps'),
      p('Conecta formulário, planilha e e-mail sem programar. É o que mais economiza tempo no meu negócio.'),
      callout('atencao', 'Não cole dados sensíveis de clientes em ferramentas de IA sem ler a política de privacidade.'),
    ],
  },
  {
    _id: 'exemplo-receber-dolar',
    title: 'Receber em dólar de clientes no Brasil',
    slug: 'receber-em-dolar-de-clientes-no-brasil',
    pillar: 'impacto-global',
    publishedAt: '2026-10-23T12:00:00Z',
    excerpt: 'Opções para cobrar clientes brasileiros em dólar, e o que observar em cada uma.',
    lead: 'Cobrar em dólar de quem está no Brasil é possível, mas cada caminho tem custo e prazo diferentes.',
    body: [
      p('Quem tem empresa nos EUA e clientes no Brasil precisa decidir como receber. As opções mais comuns são três.'),
      ...ol('Plataformas de pagamento internacionais', 'Transferência internacional direta', 'Contas digitais com câmbio integrado'),
      h2('O que comparar'),
      ...ul('Tarifa por transação e spread do câmbio', 'Prazo até o dinheiro chegar', 'Facilidade para o cliente pagar'),
      callout('dica', 'Coloque no contrato em qual moeda o valor é devido e quem paga as tarifas.'),
      p('Para o seu caso específico, converse com um contador que conheça os dois países.'),
    ],
  },
  {
    _id: 'exemplo-automatize',
    title: 'Automatize sua primeira tarefa',
    slug: 'automatize-sua-primeira-tarefa',
    seoTitle: 'Automação para iniciantes: sua primeira tarefa automática',
    pillar: 'inovacao',
    publishedAt: '2026-10-16T12:00:00Z',
    excerpt: 'Um passo a passo para quem nunca automatizou nada no trabalho.',
    lead: 'A primeira automação não precisa ser grande. Precisa ser uma tarefa chata que você faz toda semana.',
    body: [
      p('Escolha uma tarefa repetida, com começo e fim claros. Copiar dados de um formulário para uma planilha é um ótimo começo.'),
      h2('Passo a passo'),
      ...ol('Anote os passos que você faz à mão', 'Escolha a ferramenta de automação', 'Monte o fluxo com dados de teste', 'Deixe rodar uma semana e confira'),
      p('Para o primeiro passo, peça ajuda à IA para listar o que você faz à mão:'),
      prompt('Peça assim', 'Vou descrever uma tarefa que faço toda semana. Liste os passos em ordem, numerados, e marque quais dependem de uma decisão minha.\n\nTarefa: copiar os pedidos do formulário do site para a planilha de controle.'),
      quote('Automatize o que você já entende, não o que ainda está confuso.'),
    ],
  },
  {
    _id: 'exemplo-ein',
    title: 'O que é o EIN e quando você precisa dele',
    slug: 'o-que-e-o-ein',
    pillar: 'empreendedorismo',
    publishedAt: '2026-10-09T12:00:00Z',
    excerpt: 'O número da sua empresa na Receita americana, explicado sem juridiquês.',
    lead: 'Sem o EIN a sua LLC não abre conta no banco nem contrata ninguém. Veja quando pedir.',
    body: [
      p('O EIN (Employer Identification Number) é o número da empresa no IRS, a Receita Federal americana. Ele funciona como o CNPJ.'),
      h2('Quando você precisa'),
      ...ul('Para abrir a conta bancária da empresa', 'Para contratar funcionários', 'Para declarar impostos da empresa'),
      callout('dica', 'Peça o EIN logo depois de registrar a LLC: o banco vai pedir.'),
    ],
  },
  {
    _id: 'exemplo-produtividade',
    title: 'Minha rotina de trabalho remoto',
    slug: 'minha-rotina-de-trabalho-remoto',
    pillar: 'tecnologia',
    publishedAt: '2026-10-02T12:00:00Z',
    excerpt: 'Como eu organizo o dia trabalhando de casa nos Estados Unidos com clientes no Brasil.',
    lead: 'Fuso horário diferente, clientes em dois países e uma agenda que precisa caber nisso tudo.',
    body: [
      p('Trabalhar com o Brasil a partir dos EUA significa conviver com uma ou mais horas de diferença, dependendo do estado e da época do ano.'),
      h2('Blocos de tempo'),
      p('Divido o dia em blocos: manhã para trabalho focado, tarde para reuniões com o Brasil, fim do dia para revisar.'),
      p('O mais importante é deixar o fuso claro em todo convite: escreva ', bold('19h (horário de Brasília)'), ', e não só “19h”.'),
    ],
  },
  {
    _id: 'exemplo-validar-ideia',
    title: 'Valide sua ideia antes de abrir a empresa',
    slug: 'valide-sua-ideia-antes-de-abrir-a-empresa',
    pillar: 'inovacao',
    publishedAt: '2026-09-25T12:00:00Z',
    excerpt: 'Três testes baratos para saber se alguém pagaria pelo que você quer vender.',
    lead: 'Antes de gastar com registro e contador, descubra se existe cliente para a sua ideia.',
    body: [
      p('Validar é conseguir um sinal real de interesse: uma conversa, um cadastro, uma pré-venda.'),
      ...ol('Converse com cinco possíveis clientes', 'Monte uma página simples com lista de espera', 'Ofereça uma pré-venda com reembolso garantido'),
      callout('atencao', 'Curtidas não são validação. Cadastro e pagamento são.'),
    ],
  },
];
