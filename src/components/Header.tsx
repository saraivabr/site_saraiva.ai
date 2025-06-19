
import { Button } from "@/components/ui/button";

const Header = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/5511999999999?text=Olá! Quero saber mais sobre IA e como transformar em dinheiro!', '_blank');
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="container-max">
        <div className="flex items-center justify-between py-4">
          <div className="font-black text-2xl tracking-tight">
            SARAIVA.<span className="text-gray-600">AI</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('sobre')}
              className="text-gray-700 hover:text-black transition-colors font-medium"
            >
              Sobre
            </button>
            <button 
              onClick={() => scrollToSection('produtos')}
              className="text-gray-700 hover:text-black transition-colors font-medium"
            >
              Produtos
            </button>
            <button 
              onClick={() => scrollToSection('mentoria')}
              className="text-gray-700 hover:text-black transition-colors font-medium"
            >
              Mentoria
            </button>
            <button 
              onClick={() => scrollToSection('depoimentos')}
              className="text-gray-700 hover:text-black transition-colors font-medium"
            >
              Resultados
            </button>
          </nav>

          <Button 
            onClick={handleWhatsApp}
            className="btn-primary text-sm"
          >
            WhatsApp
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
