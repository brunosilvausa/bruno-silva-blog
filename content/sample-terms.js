// Termos de EXEMPLO do glossário, mostrados só enquanto o Sanity não está configurado (NEXT_PUBLIC_SANITY_PROJECT_ID vazio).
// Mesmo formato que vem do Sanity (corpo em Portable Text). Pode esvaziar a lista depois de ligar o Sanity,
// mas mantenha a exportação SAMPLE_TERMS.

let n = 0;
const key = () => `t${(n += 1)}`;
const span = (text) => ({ _type: 'span', _key: key(), text, marks: [] });
const p = (text) => ({ _type: 'block', _key: key(), style: 'normal', markDefs: [], children: [span(text)] });

export const SAMPLE_TERMS = [
  {
    _id: 'exemplo-termo-ein',
    term: 'EIN',
    slug: 'ein',
    fullName: 'Employer Identification Number',
    short: 'O número da sua empresa no IRS, a Receita americana. Funciona como o CNPJ: o banco pede e você usa para declarar impostos.',
    aliases: ['Employer ID'],
    body: [p('O EIN é um número de nove dígitos que o IRS dá à empresa. Você precisa dele para abrir conta bancária em nome da LLC, contratar pessoas e declarar os impostos da empresa.')],
  },
  {
    _id: 'exemplo-termo-llc',
    term: 'LLC',
    slug: 'llc',
    fullName: 'Limited Liability Company',
    short: 'Empresa de responsabilidade limitada nos EUA. Separa o seu patrimônio pessoal das dívidas do negócio e é simples de manter.',
    aliases: [],
    body: [p('A LLC é o tipo de empresa mais comum entre quem trabalha por conta própria nos EUA. O registro é feito no estado escolhido e a empresa passa a ter nome, endereço e documentos próprios.')],
  },
  {
    _id: 'exemplo-termo-itin',
    term: 'ITIN',
    slug: 'itin',
    fullName: 'Individual Taxpayer Identification Number',
    short: 'Número de contribuinte do IRS para quem precisa declarar imposto nos EUA mas não tem Social Security Number.',
    aliases: [],
    body: [p('O ITIN tem nove dígitos, como o Social Security Number, mas serve só para fins de imposto. Ele não dá direito a trabalhar nem muda a sua situação de imigração.')],
  },
  {
    _id: 'exemplo-termo-smllc',
    term: 'Single-Member LLC',
    slug: 'single-member-llc',
    fullName: '',
    short: 'LLC com um único dono. Por padrão o IRS ignora a empresa na hora de cobrar imposto e olha só para o dono.',
    aliases: ['SMLLC'],
    body: [p('Na Single-Member LLC, o lucro passa direto para a declaração do dono, sem um imposto separado para a empresa. Ainda assim, ela mantém a proteção do patrimônio pessoal.')],
  },
];
