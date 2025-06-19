
import { Button } from "@/components/ui/button";

const Header = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/5511999999999?text=Quero parar de estudar IA e começar a lucrar.', '_blank');
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b-2 border-black">
      <div className="container-max">
        <div className="flex items-center justify-between py-4">
          <div className="font-black text-xl font-mono tracking-tight">
            SARAIVA.AI
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => scrollToSection('sobre')}
              className="text-black hover:bg-black hover:text-white px-3 py-2 transition-all font-mono font-bold uppercase text-xs border border-black"
            >
              SOBRE
            </button>
            <button 
              onClick={() => scrollToSection('produtos')}
              className="text-black hover:bg-black hover:text-white px-3 py-2 transition-all font-mono font-bold uppercase text-xs border border-black"
            >
              PRODUTOS
            </button>
            <button 
              onClick={() => scrollToSection('mentoria')}
              className="text-black hover:bg-black hover:text-white px-3 py-2 transition-all font-mono font-bold uppercase text-xs border border-black"
            >
              MENTORIA
            </button>
            <button 
              onClick={() => scrollToSection('depoimentos')}
              className="text-black hover:bg-black hover:text-white px-3 py-2 transition-all font-mono font-bold uppercase text-xs border border-black"
            >
              PROVAS
            </button>
          </nav>

          <Button 
            onClick={handleWhatsApp}
            className="bg-black text-white hover:bg-white hover:text-black border-2 border-black font-mono font-bold text-xs px-4 py-2 transition-all"
          >
            PARAR DE ESTUDAR
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
