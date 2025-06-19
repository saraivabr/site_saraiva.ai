
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
      className="section-spacing bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-100 to-transparent rounded-full opacity-30 floating-card"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-100 to-transparent rounded-full opacity-20 floating-card" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container-max relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Text content */}
          <div className={`transition-all duration-1000 ${isVisible ? 'animate-slide-left' : 'opacity-0 translate-x-[-100px]'}`}>
            <div className="spinning-border rounded-2xl p-1 mb-8">
              <div className="bg-white rounded-2xl p-8">
                <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
                  O mentor dos que{" "}
                  <span className="text-gradient">dominam.</span>
                  <br />
                  <span className="text-red-600 text-neon">O pesadelo dos que ficam pra trás.</span>
                </h2>
              </div>
            </div>
            
            <div className="space-y-8 text-lg text-gray-700 leading-relaxed">
              <div className="glass-card p-6 rounded-xl hover-lift">
                <p className="font-medium text-xl">
                  <strong className="text-black text-2xl">Eu não ensino IA.</strong> Eu ensino você a construir{" "}
                  <strong className="text-gradient">máquinas de lucro</strong>, eliminar trabalho inútil e acelerar sua liberdade usando IA.
                </p>
              </div>
              
              <div className="relative">
                <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                <p className="text-2xl font-bold text-black pl-8 animate-text-glow">
                  Quem entende, escala. Quem não entende… trabalha pra quem entendeu.
                </p>
              </div>
              
              <div className="neon-box border-2 border-black rounded-xl p-8 bg-black text-white">
                <p className="text-xl italic text-center">
                  "Não existe meio termo no mundo da IA. Ou você domina a tecnologia, ou ela domina você."
                </p>
              </div>
              
              {/* Creative stats */}
              <div className="grid grid-cols-2 gap-8 mt-16">
                <div className="text-center card-3d glass-card p-6 rounded-xl">
                  <div className="text-5xl font-black text-gradient mb-2">1000+</div>
                  <div className="text-sm text-gray-600 font-medium">Pessoas Transformadas</div>
                  <div className="w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-4"></div>
                </div>
                <div className="text-center card-3d glass-card p-6 rounded-xl">
                  <div className="text-5xl font-black text-gradient mb-2">R$ 50M+</div>
                  <div className="text-sm text-gray-600 font-medium">Gerados pelos Clientes</div>
                  <div className="w-full h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mt-4"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Creative image section */}
          <div className={`relative transition-all duration-1000 delay-500 ${isVisible ? 'animate-slide-right' : 'opacity-0 translate-x-[100px]'}`}>
            <div className="relative perspective-1000">
              {/* Main image container */}
              <div className="aspect-square bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl shadow-2xl overflow-hidden card-3d hover-tilt">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=face" 
                  alt="Saraiva - CEO"
                  className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-1000 hover:scale-110"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 glass-card p-4 rounded-xl shadow-lg floating-card animate-glow">
                <div className="text-3xl">🧠</div>
              </div>
              
              <div className="absolute -bottom-8 -left-8 glass-card p-6 rounded-xl shadow-lg floating-card" style={{animationDelay: '1s'}}>
                <p className="text-sm font-bold text-black">CEO & Fundador</p>
                <p className="text-2xl font-black text-gradient">SARAIVA.AI</p>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-1/2 -left-4 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full floating-card opacity-60" style={{animationDelay: '2s'}}></div>
              <div className="absolute top-1/4 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full floating-card opacity-40" style={{animationDelay: '3s'}}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
