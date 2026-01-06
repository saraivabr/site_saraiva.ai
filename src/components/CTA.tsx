
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

const CTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleWhatsApp = () => {
    window.open('https://wa.me/5511999999999?text=Quero parar de estudar e começar a lucrar AGORA.', '_blank');
  };

  const scrollToMentoria = () => {
    const element = document.getElementById('mentoria');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="section-spacing bg-black text-white"
    >
      <div className="container-max text-center">
        {/* Powerful single message */}
        <div className={`mb-12 md:mb-20 transition-all duration-1000 ease-out ${isVisible ? 'fade-in-up' : ''}`}>
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[10rem] font-black mb-8 sm:mb-10 md:mb-12 leading-[0.9]" style={{ letterSpacing: '-0.04em' }}>
            ÚLTIMA<br/>
            CHANCE
          </h2>
          
          <p className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-medium max-w-4xl mx-auto leading-relaxed opacity-90 px-4" style={{ lineHeight: '1.5' }}>
            Você pode continuar estudando para sempre.<br className="hidden sm:block"/>
            Ou pode <span className="bg-white text-black px-3 sm:px-4 py-1 sm:py-2 font-bold inline-block mt-2 sm:mt-0">começar a lucrar hoje.</span>
          </p>
        </div>
        
        {/* Only 2 large buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16 md:mb-24 transition-all duration-1000 ease-out delay-500 ${isVisible ? 'fade-in-up' : ''}`}>
          <Button 
            onClick={scrollToMentoria}
            className="bg-white text-black hover:opacity-90 font-black text-lg sm:text-xl md:text-2xl py-6 sm:py-7 md:py-8 px-10 sm:px-12 md:px-16 transition-all duration-300 ease-out w-full sm:w-auto min-h-[44px]"
          >
            PARAR DE ESTUDAR
          </Button>
          
          <Button 
            onClick={handleWhatsApp}
            className="bg-transparent text-white border border-white hover:bg-white hover:text-black font-black text-lg sm:text-xl md:text-2xl py-6 sm:py-7 md:py-8 px-10 sm:px-12 md:px-16 transition-all duration-300 ease-out w-full sm:w-auto min-h-[44px]"
          >
            COMEÇAR A LUCRAR
          </Button>
        </div>
        
        {/* Final truth */}
        <div className={`transition-all duration-1000 ease-out delay-1000 ${isVisible ? 'fade-in-up' : ''}`}>
          <div className="border border-white/10 p-6 sm:p-8 md:p-10 bg-black max-w-3xl mx-auto">
            <p className="text-xs sm:text-sm md:text-base font-mono uppercase tracking-wider md:tracking-widest mb-3 md:mb-4 opacity-60">
              AVISO FINAL
            </p>
            <p className="text-base sm:text-lg md:text-xl font-medium leading-relaxed opacity-90">
              Seus concorrentes já pararam de estudar.<br/>
              Eles já estão lucrando.<br/>
              <span className="font-black">Você vai ficar para trás para sempre?</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
