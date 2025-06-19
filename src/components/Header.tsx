
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false); // Fecha o menu mobile após clicar
    }
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/5511999999999?text=Quero parar de estudar IA e começar a lucrar.', '_blank');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Scroll spy para destacar seção ativa
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['sobre', 'produtos', 'mentoria', 'depoimentos'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fecha menu mobile ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('.mobile-menu') && !target.closest('.menu-toggle')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  const navigationItems = [
    { id: 'sobre', label: 'SOBRE' },
    { id: 'produtos', label: 'PRODUTOS' },
    { id: 'mentoria', label: 'MENTORIA' },
    { id: 'depoimentos', label: 'PROVAS' }
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b-2 border-black backdrop-blur-sm">
      <div className="container-max">
        <div className="flex items-center justify-between py-3 md:py-4">
          {/* Logo */}
          <div className="font-black text-lg md:text-xl font-mono tracking-tight">
            SARAIVA.AI
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-black hover:bg-black hover:text-white px-3 py-2 transition-all duration-300 font-mono font-bold uppercase text-xs border border-black transform hover:scale-105 ${
                  activeSection === item.id ? 'bg-black text-white' : ''
                }`}
                aria-label={`Navegar para seção ${item.label}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden menu-toggle p-2 border border-black hover:bg-black hover:text-white transition-all duration-300"
            aria-label="Abrir menu de navegação"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* CTA Button - Desktop */}
          <Button
            onClick={handleWhatsApp}
            className="hidden md:block bg-black text-white hover:bg-white hover:text-black border-2 border-black font-mono font-bold text-xs px-4 py-2 transition-all duration-300 transform hover:scale-105"
            aria-label="Entrar em contato via WhatsApp"
          >
            PARAR DE ESTUDAR
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden mobile-menu transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <nav className="py-4 border-t border-black">
            <div className="flex flex-col space-y-3">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-left text-black hover:bg-black hover:text-white px-4 py-3 transition-all duration-300 font-mono font-bold uppercase text-sm border border-black ${
                    activeSection === item.id ? 'bg-black text-white' : ''
                  }`}
                  aria-label={`Navegar para seção ${item.label}`}
                >
                  {item.label}
                </button>
              ))}

              {/* Mobile CTA Button */}
              <Button
                onClick={handleWhatsApp}
                className="mt-4 bg-black text-white hover:bg-white hover:text-black border-2 border-black font-mono font-bold text-sm px-4 py-3 transition-all duration-300 w-full"
                aria-label="Entrar em contato via WhatsApp"
              >
                PARAR DE ESTUDAR
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
