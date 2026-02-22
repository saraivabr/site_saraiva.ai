
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { trackPageView } from "@/hooks/use-analytics";

const disruptiveTexts = [
  "Pare de estudar IA.",
  "Comece a lucrar com IA.",
  "Seus concorrentes já lucraram.",
  "Você ainda está estudando."
] as const;

const Hero = () => {
  const [currentText, setCurrentText] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    trackPageView();
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % disruptiveTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleWhatsApp = () => {
    window.open('https://wa.me/5511999999999?text=Quero parar de estudar e começar a lucrar com IA.', '_blank');
  };

  const scrollToMentoria = () => {
    const element = document.getElementById('mentoria');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="main-content" className="min-h-screen bg-white flex items-center justify-center relative" role="region" aria-label="Apresentação principal">
      {/* Animated vertical line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-black/10 overflow-hidden" aria-hidden="true">
        <div className="w-full h-32 bg-gradient-to-b from-transparent via-black to-transparent animate-slide-down"></div>
      </div>

      <div className="container-max text-center relative z-10">
        {/* Anti-hero headline - Larger and bolder */}
        <div className={`transition-all duration-1000 ease-out ${isVisible ? 'fade-in-up' : ''}`}>
          <h1 className="text-[clamp(3rem,8vw,10rem)] font-black leading-[0.9] mb-12 md:mb-20 tracking-tighter">
            <span className="block text-black">VOCÊ NÃO</span>
            <span className="block text-black">PRECISA</span>
            <span className="block text-black mt-4 md:mt-8">
              ENTENDER IA
            </span>
          </h1>
        </div>

        {/* Dynamic disruptive text - Smoother transition */}
        <div className={`mb-12 md:mb-20 transition-all duration-1000 ease-out ${isVisible ? 'fade-in-up' : ''}`} style={{ animationDelay: '0.5s' }}>
          <p aria-live="polite" className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-black transition-all duration-700 ease-out" style={{ letterSpacing: '0.02em' }}>
            {disruptiveTexts[currentText]}
          </p>
        </div>

        {/* Brutal truth - No border box */}
        <div className={`mb-16 md:mb-24 transition-all duration-1000 ease-out ${isVisible ? 'fade-in-up' : ''}`} style={{ animationDelay: '1s' }}>
          <p className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold text-black leading-tight max-w-5xl mx-auto px-4">
            Enquanto você perde tempo estudando,<br className="hidden sm:block"/>
            <span className="bg-black text-white px-3 sm:px-4 md:px-6 py-1 md:py-2 inline-block mt-2 sm:mt-0">meus clientes já faturaram R$ 50 milhões.</span>
          </p>
        </div>

        {/* Anti-conventional buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 md:gap-8 justify-center items-center transition-all duration-1000 ease-out ${isVisible ? 'fade-in-up' : ''}`} style={{ animationDelay: '1.5s' }}>
          <Button 
            onClick={handleWhatsApp}
            className="bg-accent text-accent-foreground hover:opacity-90 font-mono font-bold text-base sm:text-lg md:text-xl py-5 sm:py-6 md:py-7 px-8 sm:px-10 md:px-14 transition-all duration-300 ease-out w-full sm:w-auto min-h-[44px]"
          >
            PARE DE ESTUDAR
          </Button>
          
          <Button 
            onClick={scrollToMentoria}
            className="bg-white text-black border border-black hover:bg-black hover:text-white font-mono font-bold text-base sm:text-lg md:text-xl py-5 sm:py-6 md:py-7 px-8 sm:px-10 md:px-14 transition-all duration-300 ease-out w-full sm:w-auto min-h-[44px]"
          >
            COMECE A LUCRAR
          </Button>
        </div>

        {/* Minimalist stats - No boxes */}
        <div className={`grid grid-cols-3 gap-4 sm:gap-8 md:gap-12 mt-16 md:mt-32 transition-all duration-1000 ease-out ${isVisible ? 'fade-in-up' : ''}`} style={{ animationDelay: '2s' }}>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-black counter-text mb-2 md:mb-3" style={{ letterSpacing: '-0.02em' }}>1000+</div>
            <div className="text-xs font-mono uppercase tracking-wider md:tracking-widest opacity-60">TRANSFORMADOS</div>
          </div>
          <div className="text-center border-l border-r border-black/10">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-black counter-text mb-2 md:mb-3" style={{ letterSpacing: '-0.02em' }}>R$ 50M</div>
            <div className="text-xs font-mono uppercase tracking-wider md:tracking-widest opacity-60">FATURADOS</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-black counter-text mb-2 md:mb-3" style={{ letterSpacing: '-0.02em' }}>0</div>
            <div className="text-xs font-mono uppercase tracking-wider md:tracking-widest opacity-60">ENROLAÇÃO</div>
          </div>
        </div>

        {/* Scroll indicator - Animated vertical line */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2" aria-hidden="true">
          <div className="w-[1px] h-20 bg-black/20 overflow-hidden">
            <div className="w-full h-10 bg-black animate-slide-down"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
