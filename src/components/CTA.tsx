
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

const CTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 23, minutes: 59, seconds: 59 });
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
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
      className="section-spacing bg-white"
    >
      <div className="container-max text-center">
        {/* Brutal countdown */}
        <div className={`mb-16 transition-all duration-1000 ${isVisible ? 'fade-in-up' : ''}`}>
          <p className="text-lg font-mono uppercase tracking-wider mb-8">TEMPO PERDIDO:</p>
          <div className="flex justify-center space-x-8">
            {[
              { label: 'HORAS', value: countdown.hours },
              { label: 'MIN', value: countdown.minutes },
              { label: 'SEG', value: countdown.seconds }
            ].map((item, index) => (
              <div key={index} className="border-4 border-black p-6 bg-white brutalist-shadow">
                <div className="text-5xl font-bold text-black counter-text">
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="font-mono text-sm uppercase tracking-wider">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Ultimate confrontation */}
        <div className={`mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'fade-in-up' : ''}`}>
          <h2 className="text-7xl md:text-9xl font-bold mb-8 leading-none">
            <span className="block">ÚLTIMA</span>
            <span className="block border-4 border-black p-4 inline-block brutalist-shadow">CHANCE</span>
          </h2>
        </div>
        
        {/* Binary choice */}
        <div className={`mb-20 transition-all duration-1000 delay-600 ${isVisible ? 'fade-in-up' : ''}`}>
          <div className="border-4 border-black p-12 bg-white max-w-5xl mx-auto brutalist-shadow">
            <p className="text-3xl md:text-4xl font-bold text-black leading-tight mb-8">
              ESCOLHA 1: Continue estudando IA para sempre.
            </p>
            <div className="border-t-4 border-black my-8"></div>
            <p className="text-3xl md:text-4xl font-bold text-black leading-tight">
              ESCOLHA 2: <span className="bg-black text-white px-4 py-2">Comece a lucrar hoje.</span>
            </p>
          </div>
        </div>
        
        {/* Final brutal buttons */}
        <div className={`flex flex-col sm:flex-row gap-8 justify-center items-center mb-20 transition-all duration-1000 delay-900 ${isVisible ? 'fade-in-up' : ''}`}>
          <Button 
            onClick={scrollToMentoria}
            className="btn-primary text-2xl font-bold py-8 px-16 brutalist-shadow hover:-translate-y-2 hover:shadow-none transition-all"
          >
            PARAR DE ESTUDAR
          </Button>
          
          <Button 
            onClick={handleWhatsApp}
            className="btn-secondary text-2xl font-bold py-8 px-16 brutalist-shadow hover:-translate-y-2 hover:shadow-none transition-all"
          >
            COMEÇAR A LUCRAR
          </Button>
        </div>
        
        {/* Brutal truth */}
        <div className={`transition-all duration-1000 delay-1200 ${isVisible ? 'fade-in-up' : ''}`}>
          <div className="border-4 border-black p-8 bg-white max-w-3xl mx-auto brutalist-shadow">
            <p className="text-xl font-bold text-black">
              ⚠️ AVISO FINAL
            </p>
            <p className="text-lg text-black mt-4">
              Seus concorrentes já pararam de estudar.<br/>
              Eles já estão lucrando.<br/>
              <span className="font-bold">Você vai ficar para trás para sempre?</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
