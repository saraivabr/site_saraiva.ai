
import { useState, useEffect, useRef } from "react";

const About = () => {
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

  return (
    <section 
      ref={sectionRef}
      id="sobre" 
      className="section-spacing bg-black text-white"
    >
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          {/* Contrarian text */}
          <div className={`transition-all duration-1000 ease-out ${isVisible ? 'fade-in-up' : ''}`}>
            <h2 className="text-7xl md:text-8xl font-black mb-20 leading-[0.95]" style={{ letterSpacing: '-0.03em' }}>
              EU NÃO<br/>
              ENSINO<br/>
              IA
            </h2>
            
            <div className="space-y-16 text-xl md:text-2xl font-medium leading-relaxed">
              <div className="pl-8 border-l border-white/30">
                <p>Eu ensino você a <span className="bg-white text-black px-3 py-1 font-bold">PARAR DE TRABALHAR</span> usando IA.</p>
              </div>
              
              <div className="pl-8 border-l border-white/30">
                <p>Eu ensino você a <span className="bg-white text-black px-3 py-1 font-bold">GANHAR DINHEIRO</span> enquanto dorme.</p>
              </div>
              
              <div className="pl-8 border-l border-white/30">
                <p>Eu ensino você a <span className="bg-white text-black px-3 py-1 font-bold">DOMINAR MERCADOS</span> sem competir.</p>
              </div>
            </div>
            
            {/* Quote with giant quotation marks */}
            <div className="mt-20 relative">
              <div className="absolute -top-8 -left-4 text-9xl font-serif opacity-20" style={{ lineHeight: '0.8' }}>"</div>
              <div className="relative z-10 pl-12">
                <p className="text-2xl md:text-3xl font-bold leading-tight mb-4">
                  Tem gente ganhando R$ 100k/mês<br/>
                  enquanto você assiste YouTube sobre IA.
                </p>
                <p className="text-right font-mono text-sm opacity-70">— Saraiva</p>
              </div>
            </div>
          </div>
          
          {/* Abstract placeholder - Black square */}
          <div className={`relative transition-all duration-1000 ease-out delay-500 ${isVisible ? 'fade-in-up' : ''}`}>
            <div className="aspect-square bg-white/5 border border-white/10 relative overflow-hidden group">
              {/* Abstract geometric pattern */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border border-white/20 rotate-45 transition-transform duration-700 ease-out group-hover:rotate-90"></div>
              </div>
            </div>
            
            {/* Minimalist label */}
            <div className="border border-white/20 bg-black p-6 -mt-16 ml-8 relative z-10">
              <p className="text-lg font-bold">SARAIVA</p>
              <p className="font-mono text-sm opacity-70">CEO • SARAIVA.AI</p>
            </div>
          </div>
        </div>

        {/* Minimalist divider line */}
        <div className="my-32 w-full h-[1px] bg-white/10"></div>

        {/* Stats section - Asymmetric layout */}
        <div className={`transition-all duration-1000 ease-out delay-1000 ${isVisible ? 'fade-in-up' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="text-left">
              <div className="text-7xl font-black mb-4 counter-text" style={{ letterSpacing: '-0.02em' }}>1000+</div>
              <div className="font-mono uppercase tracking-widest text-sm opacity-60">PESSOAS QUE PARARAM DE ESTUDAR</div>
            </div>
            <div className="text-left md:text-right">
              <div className="text-7xl font-black mb-4 counter-text" style={{ letterSpacing: '-0.02em' }}>R$ 50M+</div>
              <div className="font-mono uppercase tracking-widest text-sm opacity-60">GERADOS ENQUANTO DORMEM</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
