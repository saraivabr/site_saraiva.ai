
const Footer = () => {
  const handleWhatsApp = () => {
    window.open('https://wa.me/5511999999999', '_blank');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-black text-white py-16">
      <div className="container-max">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="font-black text-2xl mb-4">
              SARAIVA.<span className="text-gray-400">AI</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Transformando pessoas comuns em especialistas em IA que dominam mercados e geram liberdade financeira.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Links Rápidos</h4>
            <div className="space-y-2 text-sm">
              <button 
                onClick={() => scrollToSection('sobre')}
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Sobre
              </button>
              <button 
                onClick={() => scrollToSection('produtos')}
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Produtos
              </button>
              <button 
                onClick={() => scrollToSection('mentoria')}
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Mentoria
              </button>
              <button 
                onClick={handleWhatsApp}
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Contato
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Produtos</h4>
            <div className="space-y-2 text-sm">
              <div className="text-gray-400">Mentoria IA</div>
              <div className="text-gray-400">Consultoria</div>
              <div className="text-gray-400">Ligação.AI</div>
              <div className="text-gray-400">Escreve.AI</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Redes Sociais</h4>
            <div className="space-y-3">
              <a 
                href="https://instagram.com/saraiva.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <span>📱</span>
                <span className="text-sm">Instagram</span>
              </a>
              <button 
                onClick={handleWhatsApp}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <span>💬</span>
                <span className="text-sm">WhatsApp</span>
              </button>
              <a 
                href="https://youtube.com/@saraiva.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <span>📺</span>
                <span className="text-sm">YouTube</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2025 Saraiva.AI. Todos os direitos reservados.
            </div>
            
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
