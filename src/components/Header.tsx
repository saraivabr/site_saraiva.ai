import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { trackEvent } from "@/hooks/use-analytics";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isContent = location.pathname.startsWith('/conteudo');

  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    if (!isHome) {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      setIsMenuOpen(false);
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleWhatsApp = () => {
    trackEvent('cta', 'click', 'whatsapp-header');
    window.open('https://wa.me/5511999999999?text=Quero parar de estudar IA e começar a lucrar.', '_blank');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const rafRef = useRef<number>(0);
  const updateActiveSection = useCallback(() => {
    if (!isHome) return;
    const sections = ['sobre', 'produtos', 'mentoria', 'depoimentos'];
    const scrollPosition = window.scrollY + 100;

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const offsetTop = element.offsetTop;
        const offsetHeight = element.offsetHeight;
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(section);
          return;
        }
      }
    }
  }, [isHome]);

  useEffect(() => {
    if (!isHome) return;
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateActiveSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateActiveSection, isHome]);

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

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const homeNavItems = [
    { id: 'sobre', label: 'SOBRE' },
    { id: 'produtos', label: 'PRODUTOS' },
    { id: 'mentoria', label: 'MENTORIA' },
    { id: 'depoimentos', label: 'PROVAS' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-black/10">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:bg-black focus:text-white focus:px-4 focus:py-2 focus:font-mono focus:text-sm"
      >
        Pular para o conteúdo principal
      </a>

      <div className="container-max">
        <div className="flex items-center justify-between py-4 md:py-5">
          <Link to="/" className="font-medium text-base md:text-lg font-mono tracking-wide opacity-70 hover:opacity-100 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
            SARAIVA.AI
          </Link>

          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8" aria-label="Navegação principal">
            {homeNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-black font-mono text-xs uppercase tracking-wider transition-all duration-300 ease-out relative pb-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                  isHome && activeSection === item.id
                    ? 'after:w-full after:opacity-100'
                    : 'after:w-0 hover:after:w-full'
                } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-accent after:transition-all after:duration-300 after:ease-out`}
              >
                {item.label}
              </button>
            ))}
            <Link
              to="/conteudo"
              className={`text-black font-mono text-xs uppercase tracking-wider transition-all duration-300 ease-out relative pb-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                isContent
                  ? 'after:w-full after:opacity-100'
                  : 'after:w-0 hover:after:w-full'
              } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-accent after:transition-all after:duration-300 after:ease-out`}
            >
              CONTEÚDO
            </Link>
          </nav>

          <button
            onClick={toggleMenu}
            className="md:hidden menu-toggle p-2 hover:opacity-70 transition-opacity duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            aria-label={isMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>

          <Button
            onClick={handleWhatsApp}
            className="hidden md:block bg-accent text-accent-foreground hover:opacity-90 font-mono font-bold text-xs px-6 py-3 transition-all duration-300 ease-out"
            aria-label="Entrar em contato via WhatsApp"
          >
            PARAR DE ESTUDAR
          </Button>
        </div>

        <div
          id="mobile-navigation"
          className={`md:hidden mobile-menu transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
          role="region"
          aria-label="Menu de navegação mobile"
        >
          <nav className="py-4 border-t border-black/10" aria-label="Navegação mobile">
            <div className="flex flex-col space-y-2">
              {homeNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left text-black px-4 py-3 transition-all duration-300 ease-out font-mono uppercase text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  {item.label}
                </button>
              ))}
              <Link
                to="/conteudo"
                className={`text-left px-4 py-3 font-mono uppercase text-sm transition-all duration-300 ${
                  isContent ? 'font-bold' : ''
                }`}
              >
                CONTEÚDO
              </Link>
              <Button
                onClick={handleWhatsApp}
                className="mt-4 bg-accent text-accent-foreground hover:opacity-90 font-mono font-bold text-sm px-4 py-3 transition-all duration-300 ease-out w-full"
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
