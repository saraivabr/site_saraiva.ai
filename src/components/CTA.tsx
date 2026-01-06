
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
        <div className={`mb-20 transition-all duration-1000 ease-out ${isVisible ? 'fade-in-up' : ''}`}>
          <h2 className="text-8xl md:text-[10rem] font-black mb-12 leading-[0.9]" style={{ letterSpacing: '-0.04em' }}>
            ÚLTIMA<br/>
            CHANCE
          </h2>
          
          <p className="text-2xl md:text-4xl font-medium max-w-4xl mx-auto leading-relaxed opacity-90" style={{ lineHeight: '1.5' }}>
            Você pode continuar estudando para sempre.<br/>
            Ou pode <span className="bg-white text-black px-4 py-2 font-bold">começar a lucrar hoje.</span>
          </p>
        </div>
        
        {/* Only 2 large buttons */}
        <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-24 transition-all duration-1000 ease-out delay-500 ${isVisible ? 'fade-in-up' : ''}`}>
          <Button 
            onClick={scrollToMentoria}
            className="bg-white text-black hover:opacity-90 font-black text-2xl py-8 px-16 transition-all duration-300 ease-out"
          >
            PARAR DE ESTUDAR
          </Button>
          
          <Button 
            onClick={handleWhatsApp}
            className="bg-transparent text-white border border-white hover:bg-white hover:text-black font-black text-2xl py-8 px-16 transition-all duration-300 ease-out"
          >
            COMEÇAR A LUCRAR
          </Button>
        </div>
        
        {/* Final truth */}
        <div className={`transition-all duration-1000 ease-out delay-1000 ${isVisible ? 'fade-in-up' : ''}`}>
          <div className="border border-white/10 p-10 bg-black max-w-3xl mx-auto">
            <p className="text-base font-mono uppercase tracking-widest mb-4 opacity-60">
              AVISO FINAL
            </p>
            <p className="text-xl font-medium leading-relaxed opacity-90">
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
