// Materiais de EXEMPLO da Central de Conteúdo, mostrados só enquanto o Sanity não está configurado
// (NEXT_PUBLIC_SANITY_PROJECT_ID vazio). `next` é o slug de outro material de exemplo (ou null).
// Mantenha a exportação SAMPLE_MATERIALS (como lista vazia, se quiser) depois de ligar o Sanity.

let n = 0;
const key = () => `m${(n += 1)}`;
const span = (text, marks = []) => ({ _type: 'span', _key: key(), text, marks });
const block = (style, children, extra = {}) => ({ _type: 'block', _key: key(), style, markDefs: [], children, ...extra });
const p = (text) => block('normal', [span(text)]);
const h2 = (text) => block('h2', [span(text)]);
const prompt = (label, text) => ({ _type: 'prompt', _key: key(), label, text });
const checklist = (title, items) => ({ _type: 'checklist', _key: key(), title, items });

export const SAMPLE_MATERIALS = [
  {
    _id: 'exemplo-material-logo',
    title: 'Logo da LLC com IA',
    slug: 'logo-da-llc-com-ia',
    kind: 'prompt',
    summary: 'Um prompt para gerar ideias de logo para a sua LLC em minutos, sem designer.',
    minutes: 2,
    cover: { url: '/img/avatar.webp', alt: 'Bruno Silva' },
    publishedAt: '2026-11-12T12:00:00Z',
    videoUrl: 'https://www.instagram.com/',
    videoDate: '2026-11-12',
    next: null,
    body: [
      p('Cole o prompt abaixo na sua IA de preferência e troque os campos entre colchetes.'),
      prompt('Copie e cole', 'Crie 5 conceitos de logo para a minha empresa [NOME DA LLC], que atua com [ÁREA]. Estilo [moderno/clássico/minimalista]. Para cada conceito, descreva forma, cores (com código hex) e tipografia.'),
      p('Peça variações do conceito que mais gostou antes de contratar alguém.'),
    ],
  },
  {
    _id: 'exemplo-material-nome',
    title: 'Nome da LLC com IA',
    slug: 'nome-da-llc-com-ia',
    kind: 'prompt',
    summary: 'Gere e filtre nomes para a sua LLC antes de checar a disponibilidade no estado.',
    minutes: 2,
    publishedAt: '2026-11-10T12:00:00Z',
    videoUrl: null,
    videoDate: null,
    next: 'logo-da-llc-com-ia',
    body: [
      p('Use a IA para abrir o leque de ideias e só depois confira o nome no site do estado.'),
      prompt('Copie e cole', 'Sugira 15 nomes para uma LLC de [ÁREA], fáceis de pronunciar em inglês e em português. Evite nomes genéricos e marcas conhecidas. Liste os 5 melhores com uma frase explicando a escolha.'),
    ],
  },
  {
    _id: 'exemplo-material-checklist',
    title: 'Checklist para abrir a LLC',
    slug: 'checklist-abrir-llc',
    kind: 'checklist',
    summary: 'Os passos para abrir a sua LLC, do estado ao EIN, para marcar um a um.',
    minutes: 3,
    publishedAt: '2026-11-08T12:00:00Z',
    videoUrl: null,
    videoDate: null,
    next: null,
    body: [
      h2('Antes de começar'),
      checklist('Abrindo a LLC', ['Escolher o estado', 'Definir o nome e checar a disponibilidade', 'Contratar um registered agent', 'Registrar a LLC no estado', 'Pedir o EIN', 'Abrir a conta bancária da empresa']),
    ],
  },
];
