
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
    <footer className="bg-black text-white py-16 border-t border-white/10">
      <div className="container-max">
        {/* Logo and tagline */}
        <div className="text-center mb-12">
          <div className="font-black text-2xl mb-3 font-mono" style={{ letterSpacing: '-0.01em' }}>
            SARAIVA.AI
          </div>
          <p className="font-mono text-sm opacity-60">
            Pare de estudar. Comece a lucrar.
          </p>
        </div>
        
        {/* Links in single line */}
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 mb-12 text-sm font-mono">
          <button 
            onClick={() => scrollToSection('sobre')}
            className="hover:opacity-70 transition-opacity duration-300 ease-out uppercase tracking-wider"
          >
            Sobre
          </button>
          <span className="opacity-30">•</span>
          <button 
            onClick={() => scrollToSection('produtos')}
            className="hover:opacity-70 transition-opacity duration-300 ease-out uppercase tracking-wider"
          >
            Produtos
          </button>
          <span className="opacity-30">•</span>
          <button 
            onClick={() => scrollToSection('mentoria')}
            className="hover:opacity-70 transition-opacity duration-300 ease-out uppercase tracking-wider"
          >
            Mentoria
          </button>
          <span className="opacity-30">•</span>
          <button 
            onClick={handleWhatsApp}
            className="hover:opacity-70 transition-opacity duration-300 ease-out uppercase tracking-wider"
          >
            Contato
          </button>
          <span className="opacity-30">•</span>
          <a href="#" className="hover:opacity-70 transition-opacity duration-300 ease-out uppercase tracking-wider">Termos</a>
          <span className="opacity-30">•</span>
          <a href="#" className="hover:opacity-70 transition-opacity duration-300 ease-out uppercase tracking-wider">Privacidade</a>
        </div>
        
        {/* Discreet copyright */}
        <div className="text-center">
          <div className="font-mono text-xs opacity-40">
            © 2025 SARAIVA.AI
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
