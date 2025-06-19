
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
    window.open('https://wa.me/5511999999999?text=Olá! Estou pronto para transformar minha vida com IA!', '_blank');
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
      className="section-spacing hero-gradient text-white relative overflow-hidden"
    >
      {/* Dynamic background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-transparent to-purple-900/30"></div>
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-400 rounded-full animate-float opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      
      <div className="container-max relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Countdown timer */}
          <div className={`mb-12 transition-all duration-1000 ${isVisible ? 'animate-zoom-in' : 'opacity-0 scale-75'}`}>
            <p className="text-lg mb-4 text-red-300 font-medium">OFERTA EXPIRA EM:</p>
            <div className="flex justify-center space-x-4 mb-8">
              {[
                { label: 'HORAS', value: countdown.hours },
                { label: 'MIN', value: countdown.minutes },
                { label: 'SEG', value: countdown.seconds }
              ].map((item, index) => (
                <div key={index} className="glass-card p-4 rounded-xl text-center min-w-[80px]">
                  <div className="text-3xl font-black text-red-400 animate-pulse">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-gray-300 font-medium">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Main headline */}
          <div className={`mb-12 transition-all duration-1000 delay-300 ${isVisible ? 'animate-slide-left' : 'opacity-0 translate-x-[-100px]'}`}>
            <h2 className="text-6xl md:text-8xl font-black mb-8 leading-tight text-shadow-strong">
              Ou você aprende IA…{" "}
              <span className="text-red-500 neon-box inline-block px-6 py-3 rounded-2xl">
                ou vai trabalhar pra quem aprendeu.
              </span>
            </h2>
          </div>
          
          {/* Subheadline */}
          <div className={`mb-16 transition-all duration-1000 delay-600 ${isVisible ? 'animate-slide-right' : 'opacity-0 translate-x-[100px]'}`}>
            <p className="text-3xl md:text-4xl font-bold text-gray-200">
              Não existe meio termo. A única escolha é{" "}
              <strong className="text-white text-neon animate-pulse">agora.</strong>
            </p>
          </div>
          
          {/* Action buttons */}
          <div className={`flex flex-col sm:flex-row gap-8 justify-center items-center mb-20 transition-all duration-1000 delay-900 ${isVisible ? 'animate-zoom-in' : 'opacity-0 scale-75'}`}>
            <Button 
              onClick={scrollToMentoria}
              className="relative overflow-hidden group bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:via-red-400 hover:to-red-500 text-xl w-full sm:w-auto font-black py-6 px-12 rounded-xl shadow-2xl magnetic-btn"
              size="lg"
            >
              <span className="relative z-10 flex items-center">
                🔥 QUERO DOMINAR IA AGORA
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </Button>
            
            <Button 
              onClick={handleWhatsApp}
              className="btn-neon text-xl w-full sm:w-auto py-6 px-12 hover-scale-rotate"
              size="lg"
            >
              💬 Falar Direto no WhatsApp
            </Button>
          </div>
          
          {/* Features grid */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 delay-1200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {[
              {
                icon: "⚡",
                title: "Resultados Imediatos",
                desc: "Primeiros lucros em 7 dias",
                color: "from-green-400 to-emerald-500"
              },
              {
                icon: "🎯",
                title: "Método Comprovado",
                desc: "Testado por +1.000 pessoas",
                color: "from-blue-400 to-cyan-500"
              },
              {
                icon: "🚀",
                title: "Suporte Vitalício",
                desc: "Acesso direto ao Saraiva",
                color: "from-purple-400 to-pink-500"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="glass-card rounded-2xl p-8 floating-card hover-lift card-3d"
                style={{animationDelay: `${index + 2}s`}}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl shadow-lg`}>
                  {feature.icon}
                </div>
                <div className="text-xl font-bold mb-2 text-white">{feature.title}</div>
                <div className="text-gray-300">{feature.desc}</div>
              </div>
            ))}
          </div>

          {/* Final urgency message */}
          <div className={`mt-16 transition-all duration-1000 delay-1500 ${isVisible ? 'animate-zoom-in' : 'opacity-0 scale-75'}`}>
            <div className="glass-card p-8 rounded-2xl border-2 border-red-500/50 max-w-3xl mx-auto">
              <p className="text-xl font-bold text-red-300 mb-4">
                ⚠️ ÚLTIMA CHAMADA
              </p>
              <p className="text-lg text-gray-200">
                Enquanto você pensa, seus concorrentes já estão dominando o mercado com IA.
                <br />
                <strong className="text-white">Não seja deixado para trás.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
