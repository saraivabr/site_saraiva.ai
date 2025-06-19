
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
    <footer className="bg-black text-white py-16 border-t-4 border-white">
      <div className="container-max">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="font-bold text-2xl mb-6 font-mono">
              SARAIVA.AI
            </div>
            <p className="font-mono text-sm leading-relaxed">
              Paramos de ensinar IA.<br/>
              Começamos a ensinar lucro.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 font-mono uppercase">LINKS</h4>
            <div className="space-y-3 text-sm font-mono">
              <button 
                onClick={() => scrollToSection('sobre')}
                className="block hover:bg-white hover:text-black px-2 py-1 transition-all uppercase"
              >
                SOBRE
              </button>
              <button 
                onClick={() => scrollToSection('produtos')}
                className="block hover:bg-white hover:text-black px-2 py-1 transition-all uppercase"
              >
                PRODUTOS
              </button>
              <button 
                onClick={() => scrollToSection('mentoria')}
                className="block hover:bg-white hover:text-black px-2 py-1 transition-all uppercase"
              >
                MENTORIA
              </button>
              <button 
                onClick={handleWhatsApp}
                className="block hover:bg-white hover:text-black px-2 py-1 transition-all uppercase"
              >
                CONTATO
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 font-mono uppercase">PRODUTOS</h4>
            <div className="space-y-3 text-sm font-mono">
              <div>MENTORIA</div>
              <div>CONSULTORIA</div>
              <div>LIGAÇÃO.AI</div>
              <div>ESCREVE.AI</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 font-mono uppercase">CONTATO</h4>
            <div className="space-y-4">
              <button 
                onClick={handleWhatsApp}
                className="block border-2 border-white px-4 py-2 hover:bg-white hover:text-black transition-all font-mono font-bold text-sm"
              >
                WHATSAPP
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t-2 border-white pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="font-mono text-sm mb-4 md:mb-0">
              © 2025 SARAIVA.AI — PARE DE ESTUDAR. COMECE A LUCRAR.
            </div>
            
            <div className="flex space-x-6 text-sm font-mono">
              <a href="#" className="hover:bg-white hover:text-black px-2 py-1 transition-all">TERMOS</a>
              <a href="#" className="hover:bg-white hover:text-black px-2 py-1 transition-all">PRIVACIDADE</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
