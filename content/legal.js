// Textos das páginas /privacidade e /termos. Valem para todos os sites Bruno Silva USA
// (blog, link na bio, curso, consultoria e IA do Zero), que apontam para estas páginas no rodapé.
// Modelo escrito a partir do que os sites fazem hoje; para uma versão definitiva, peça a revisão de um advogado.
// Cada seção: { title, paragraphs: [], items: [] }. Ao mudar o texto, atualize `updated`.

export const CONTACT_EMAIL = 'info@brunosilvausa.com';
const OWNER = 'Bruno Silva USA';
const SITES = 'o blog, a página de links, o curso, a consultoria e a lista de espera IA do Zero';

export const legal = {
  updated: '2026-11-10',

  privacidade: {
    kicker: 'Legal',
    title: 'Política de privacidade',
    lead: `Quais dados os sites ${OWNER} coletam, para quê, e como você pede para ver ou apagar os seus.`,
    sections: [
      {
        title: 'Quem somos',
        paragraphs: [
          `Esta política vale para todos os sites ${OWNER}: ${SITES}. Para qualquer pedido sobre os seus dados, escreva para ${CONTACT_EMAIL}.`,
        ],
      },
      {
        title: 'O que coletamos',
        items: [
          'Seu e-mail, quando você se inscreve na newsletter ou na lista de espera. Ele é usado só para enviar o que você pediu e fica guardado no serviço de envio de e-mails que usamos.',
          'Dados técnicos de acesso, como endereço IP, navegador e páginas visitadas. A hospedagem (Vercel) registra esses dados para manter os sites funcionando e seguros. O endereço IP também é usado por alguns minutos para bloquear excesso de tentativas no formulário.',
          'As imagens dos posts são entregues pelo Sanity, o sistema onde os posts são escritos. Como qualquer site que entrega imagens, ele recebe o seu endereço IP ao carregá-las.',
        ],
      },
      {
        title: 'O que não fazemos',
        items: [
          'Não vendemos nem alugamos os seus dados.',
          'Não usamos cookies de publicidade nem ferramentas de análise de visitas. Se isso mudar, esta página será atualizada antes.',
        ],
      },
      {
        title: 'Links e serviços de terceiros',
        paragraphs: [
          'Alguns botões levam a serviços de outras empresas, como a plataforma de pagamento do curso, a agenda da consultoria e as redes sociais. Ao usá-los, valem as políticas de privacidade dessas empresas.',
        ],
      },
      {
        title: 'Seus direitos',
        paragraphs: [
          'Você pode pedir para ver, corrigir ou apagar os seus dados a qualquer momento, como prevê a LGPD (Lei Geral de Proteção de Dados, do Brasil). Todo e-mail da newsletter tem um link para cancelar a inscrição.',
          `Para os outros pedidos, escreva para ${CONTACT_EMAIL} dizendo o que você precisa.`,
        ],
      },
      {
        title: 'Por quanto tempo guardamos',
        paragraphs: [
          'Seu e-mail fica guardado enquanto você estiver inscrito. Quando você cancela a inscrição ou pede para apagar, ele é removido da lista. Os registros técnicos da hospedagem são apagados automaticamente depois de um tempo.',
        ],
      },
      {
        title: 'Menores de idade',
        paragraphs: ['Os sites não são feitos para menores de 18 anos, e não coletamos dados de menores de propósito.'],
      },
      {
        title: 'Mudanças nesta política',
        paragraphs: ['Quando esta política mudar, a data no topo da página também muda.'],
      },
    ],
  },

  termos: {
    kicker: 'Legal',
    title: 'Termos de uso',
    lead: `As regras para usar os sites ${OWNER} e o conteúdo publicado neles.`,
    sections: [
      {
        title: 'Conteúdo informativo',
        paragraphs: [
          'Os posts, vídeos e materiais gratuitos são informativos e educacionais. Eles não substituem a orientação de um advogado, contador ou consultor financeiro para o seu caso.',
          'Regras, impostos e taxas mudam. Antes de decidir, confira as informações nos sites oficiais e, quando for o caso, com um profissional.',
        ],
      },
      {
        title: 'Direitos autorais',
        paragraphs: [
          `Os textos, imagens e a marca ${OWNER} pertencem a Bruno Silva. Você pode compartilhar os links e citar trechos curtos com o crédito e o link para o original. Para outros usos, peça autorização por ${CONTACT_EMAIL}.`,
        ],
      },
      {
        title: 'Curso e consultoria',
        paragraphs: [
          'Preço, forma de pagamento, garantia e reembolso de cada produto ou serviço são os informados na página da oferta e na plataforma de pagamento no momento da compra.',
        ],
      },
      {
        title: 'Newsletter',
        paragraphs: ['A inscrição é gratuita, e você pode cancelar quando quiser pelo link presente em todo e-mail.'],
      },
      {
        title: 'Links de terceiros',
        paragraphs: ['Os sites têm links para serviços de outras empresas. Não controlamos esses serviços nem respondemos pelo conteúdo deles.'],
      },
      {
        title: 'Disponibilidade',
        paragraphs: ['Fazemos o possível para manter os sites no ar e o conteúdo correto, mas não garantimos que eles estarão sempre disponíveis ou livres de erros.'],
      },
      {
        title: 'Contato',
        paragraphs: [`Dúvidas sobre estes termos: ${CONTACT_EMAIL}.`],
      },
    ],
  },
};
