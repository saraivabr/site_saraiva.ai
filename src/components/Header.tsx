
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
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-black/10">
      <div className="container-max">
        <div className="flex items-center justify-between py-4 md:py-5">
          {/* Logo - More discrete */}
          <div className="font-medium text-base md:text-lg font-mono tracking-wide opacity-70">
            SARAIVA.AI
          </div>

          {/* Desktop Navigation - Plain text with underline on hover */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-black font-mono text-xs uppercase tracking-wider transition-all duration-300 ease-out relative pb-1 ${
                  activeSection === item.id 
                    ? 'after:w-full after:opacity-100' 
                    : 'after:w-0 hover:after:w-full'
                } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-black after:transition-all after:duration-300 after:ease-out`}
                aria-label={`Navegar para seção ${item.label}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden menu-toggle p-2 hover:opacity-70 transition-opacity duration-300"
            aria-label="Abrir menu de navegação"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* CTA Button - Desktop - Single highlighted */}
          <Button
            onClick={handleWhatsApp}
            className="hidden md:block bg-black text-white hover:opacity-90 font-mono font-bold text-xs px-6 py-3 transition-all duration-300 ease-out"
            aria-label="Entrar em contato via WhatsApp"
          >
            PARAR DE ESTUDAR
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden mobile-menu transition-all duration-300 ease-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <nav className="py-4 border-t border-black/10">
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-left text-black px-4 py-3 transition-all duration-300 ease-out font-mono uppercase text-sm relative ${
                    activeSection === item.id 
                      ? 'after:w-full' 
                      : 'after:w-0 hover:after:w-full'
                  } after:content-[''] after:absolute after:bottom-0 after:left-4 after:h-[1px] after:bg-black after:transition-all after:duration-300`}
                  aria-label={`Navegar para seção ${item.label}`}
                >
                  {item.label}
                </button>
              ))}

              {/* Mobile CTA Button */}
              <Button
                onClick={handleWhatsApp}
                className="mt-4 bg-black text-white hover:opacity-90 font-mono font-bold text-sm px-4 py-3 transition-all duration-300 ease-out w-full"
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
