
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

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
          <motion.div
            className="font-medium text-base md:text-lg font-mono tracking-wide opacity-70"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            SARAIVA.AI
          </motion.div>

          {/* Desktop Navigation - Plain text with underline on hover */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navigationItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-black font-mono text-xs uppercase tracking-wider transition-all duration-300 ease-out relative pb-1 ${
                  activeSection === item.id
                    ? 'after:w-full after:opacity-100'
                    : 'after:w-0 hover:after:w-full'
                } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-black after:transition-all after:duration-300 after:ease-out`}
                aria-label={`Navegar para seção ${item.label}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={toggleMenu}
            className="md:hidden menu-toggle p-2 hover:opacity-70 transition-opacity duration-300"
            aria-label="Abrir menu de navegação"
            aria-expanded={isMenuOpen}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.div>
          </motion.button>

          {/* CTA Button - Desktop - Single highlighted */}
          <motion.div
            className="hidden md:block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleWhatsApp}
              className="bg-black text-white hover:opacity-90 font-mono font-bold text-xs px-6 py-3 transition-all duration-300 ease-out"
              aria-label="Entrar em contato via WhatsApp"
            >
              PARAR DE ESTUDAR
            </Button>
          </motion.div>
        </div>

        {/* Mobile Navigation Menu */}
        <motion.div
          className={`md:hidden mobile-menu transition-all duration-300 ease-out overflow-hidden ${
            isMenuOpen ? '' : ''
          }`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <nav className="py-4 border-t border-black/10">
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-left text-black px-4 py-3 transition-all duration-300 ease-out font-mono uppercase text-sm relative ${
                    activeSection === item.id
                      ? 'after:w-full'
                      : 'after:w-0 hover:after:w-full'
                  } after:content-[''] after:absolute after:bottom-0 after:left-4 after:h-[1px] after:bg-black after:transition-all after:duration-300`}
                  aria-label={`Navegar para seção ${item.label}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isMenuOpen ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 5 }}
                >
                  {item.label}
                </motion.button>
              ))}

              {/* Mobile CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isMenuOpen ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: navigationItems.length * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <Button
                  onClick={handleWhatsApp}
                  className="mt-4 bg-black text-white hover:opacity-90 font-mono font-bold text-sm px-4 py-3 transition-all duration-300 ease-out w-full"
                  aria-label="Entrar em contato via WhatsApp"
                >
                  PARAR DE ESTUDAR
                </Button>
              </motion.div>
            </div>
          </nav>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
