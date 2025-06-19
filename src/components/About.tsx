
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
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Contrarian text */}
          <div className={`transition-all duration-1000 ${isVisible ? 'fade-in-up' : ''}`}>
            <h2 className="text-6xl md:text-7xl font-bold mb-16 leading-none">
              EU NÃO<br/>
              ENSINO<br/>
              <span className="border-4 border-white p-4 inline-block">IA</span>
            </h2>
            
            <div className="space-y-12 text-xl md:text-2xl font-bold leading-relaxed">
              <div className="border-l-4 border-white pl-8">
                <p>Eu ensino você a <span className="bg-white text-black px-2">PARAR DE TRABALHAR</span> usando IA.</p>
              </div>
              
              <div className="border-l-4 border-white pl-8">
                <p>Eu ensino você a <span className="bg-white text-black px-2">GANHAR DINHEIRO</span> enquanto dorme.</p>
              </div>
              
              <div className="border-l-4 border-white pl-8">
                <p>Eu ensino você a <span className="bg-white text-black px-2">DOMINAR MERCADOS</span> sem competir.</p>
              </div>
            </div>
            
            {/* Brutal truth box */}
            <div className="border-4 border-white p-8 mt-16 bg-black">
              <p className="text-2xl font-bold text-center">
                "Tem gente ganhando R$ 100k/mês<br/>
                enquanto você assiste YouTube sobre IA."
              </p>
              <p className="text-right mt-4 font-mono">— Saraiva</p>
            </div>
          </div>
          
          {/* Minimalist image section */}
          <div className={`relative transition-all duration-1000 delay-500 ${isVisible ? 'fade-in-up' : ''}`}>
            <div className="aspect-square bg-white border-4 border-white overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=face" 
                alt="Saraiva - CEO"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            
            {/* Stark label */}
            <div className="border-4 border-white bg-black p-6 -mt-12 ml-8 relative z-10">
              <p className="text-lg font-bold">SARAIVA</p>
              <p className="font-mono text-sm">CEO • SARAIVA.AI</p>
            </div>
          </div>
        </div>

        {/* Counter-narrative section */}
        <div className={`mt-32 transition-all duration-1000 delay-1000 ${isVisible ? 'fade-in-up' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="minimal-card text-center">
              <div className="text-5xl font-bold mb-4 counter-text">1000+</div>
              <div className="font-mono uppercase tracking-wider">PESSOAS QUE PARARAM DE ESTUDAR</div>
            </div>
            <div className="minimal-card text-center">
              <div className="text-5xl font-bold mb-4 counter-text">R$ 50M+</div>
              <div className="font-mono uppercase tracking-wider">GERADOS ENQUANTO DORMEM</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
