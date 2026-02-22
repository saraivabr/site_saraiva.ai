import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '@/types/content';

const Footer = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleWhatsApp = () => {
    window.open('https://wa.me/5511999999999', '_blank');
  };

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
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-black text-white py-12 sm:py-14 md:py-16 border-t border-white/10" role="contentinfo">
      <div className="container-max">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <Link to="/" className="font-black text-xl sm:text-2xl mb-2 sm:mb-3 font-mono inline-block" style={{ letterSpacing: '-0.01em' }}>
            SARAIVA.AI
          </Link>
          <p className="font-mono text-xs sm:text-sm opacity-60">
            Pare de estudar. Comece a lucrar.
          </p>
        </div>

        <nav className="flex flex-wrap justify-center items-center gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-3 sm:gap-y-4 mb-6 sm:mb-8 text-xs sm:text-sm font-mono px-4" aria-label="Navegação do rodapé">
          <button onClick={() => scrollToSection('sobre')} className="hover:opacity-70 transition-opacity duration-300 ease-out uppercase tracking-wider min-h-[44px] flex items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            Sobre
          </button>
          <span className="opacity-30" aria-hidden="true">·</span>
          <button onClick={() => scrollToSection('produtos')} className="hover:opacity-70 transition-opacity duration-300 ease-out uppercase tracking-wider min-h-[44px] flex items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            Produtos
          </button>
          <span className="opacity-30" aria-hidden="true">·</span>
          <button onClick={() => scrollToSection('mentoria')} className="hover:opacity-70 transition-opacity duration-300 ease-out uppercase tracking-wider min-h-[44px] flex items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            Mentoria
          </button>
          <span className="opacity-30" aria-hidden="true">·</span>
          <button onClick={handleWhatsApp} className="hover:opacity-70 transition-opacity duration-300 ease-out uppercase tracking-wider min-h-[44px] flex items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" aria-label="Contato via WhatsApp">
            Contato
          </button>
        </nav>

        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mb-8 sm:mb-10 md:mb-12">
          <Link to="/conteudo" className="font-mono text-xs uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity min-h-[44px] flex items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            Conteúdo
          </Link>
          {CATEGORIES.map(cat => (
            <Link
              key={cat.id}
              to={`/conteudo/${cat.id}`}
              className="font-mono text-xs uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity min-h-[44px] flex items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {cat.label}
            </Link>
          ))}
        </div>

        <div className="text-center">
          <div className="font-mono text-[0.65rem] sm:text-xs opacity-60">
            © {new Date().getFullYear()} SARAIVA.AI
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
