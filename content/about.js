// Texto da página /sobre. Edite à vontade: cada seção tem { id, title, paragraphs: [], items: [] }.
// Só entra aqui o que é verdade hoje; números (anos de experiência, alunos, clientes) ficam em `facts`
// e só aparecem quando você preencher. Exemplo: facts: [{ value: '10+', label: 'anos empreendendo' }]
import { CONTACT_EMAIL } from './legal';

export const about = {
  kicker: 'Sobre',
  title: 'Quem escreve este blog',
  lead: 'Eu sou o Bruno Silva: guru da tecnologia, empreendedor e brasileiro nos Estados Unidos.',
  image: '/img/avatar.webp',
  facts: [],
  sections: [
    {
      id: 'o-blog',
      title: 'O que é este blog',
      paragraphs: [
        'Quando eu comecei a empreender nos Estados Unidos, a informação que eu precisava existia, mas estava espalhada, em inglês e cheia de termos técnicos. Este blog é o lugar onde eu junto o que aprendi, do jeito que eu gostaria de ter lido.',
        'Os posts seguem quatro temas: tecnologia, empreendedorismo, inovação e impacto global.',
      ],
    },
    {
      id: 'como-eu-escrevo',
      title: 'Como eu escrevo',
      items: [
        'Em português e direto ao ponto.',
        'Cada termo em inglês é explicado na primeira vez que aparece.',
        'Os exemplos vêm do dia a dia de quem tem um negócio pequeno, não de empresa grande.',
        'Quando o assunto depende do seu caso, como impostos ou documentos, eu digo isso com clareza e indico quando vale falar com um profissional.',
        'Quando um post é revisado, a data de atualização aparece no topo dele.',
      ],
    },
    {
      id: 'trabalhe-comigo',
      title: 'Trabalhe comigo',
      paragraphs: ['Além do blog, eu tenho um curso para abrir e organizar a sua empresa nos EUA, uma consultoria para o seu caso e a lista de espera do IA do Zero.'],
      links: 'work',
    },
    {
      id: 'contato',
      title: 'Contato',
      paragraphs: [`Dúvidas, sugestões de pauta e parcerias: ${CONTACT_EMAIL}.`],
    },
  ],
};
