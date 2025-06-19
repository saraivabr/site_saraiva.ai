
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const Hero = () => {
  const [currentText, setCurrentText] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const dynamicTexts = [
    "transformar IA em dinheiro, tempo e liberdade.",
    "dominar mercados com automação inteligente.",
    "construir máquinas de lucro 24/7.",
    "eliminar trabalho manual para sempre."
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % dynamicTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleWhatsApp = () => {
    window.open('https://wa.me/5511999999999?text=Olá! Quero saber mais sobre IA e como transformar em dinheiro!', '_blank');
  };

  const scrollToMentoria = () => {
    const element = document.getElementById('mentoria');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="morphing-bg min-h-screen flex items-center justify-center text-white relative overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Stronger gradient overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80"></div>
      
      {/* Main content */}
      <div className="container-max relative z-10">
        <div className="text-center max-w-6xl mx-auto">
          {/* Dynamic headline with stronger contrast */}
          <div className={`transition-all duration-1000 ${isVisible ? 'animate-zoom-in' : 'opacity-0'}`}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-8 text-white drop-shadow-2xl">
              Eu ensino pessoas comuns a{" "}
              <span className="text-gradient animate-text-glow block mt-4 font-black">
                {dynamicTexts[currentText]}
              </span>
              <span className="text-red-400 neon-box inline-block mt-6 px-6 py-4 rounded-lg font-black bg-black/50 backdrop-blur-sm border-2 border-red-400">
                Antes que seja tarde.
              </span>
            </h1>
          </div>
          
          {/* Animated subheadline with better contrast */}
          <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'animate-slide-left' : 'opacity-0 translate-x-[-100px]'}`}>
            <p className="text-2xl md:text-3xl font-bold mb-16 text-white max-w-5xl mx-auto leading-relaxed drop-shadow-xl">
              Enquanto os outros tentam entender, meus clientes já estão{" "}
              <strong className="text-yellow-300 text-neon font-black">lucrando, automatizando e dominando mercados.</strong>
            </p>
          </div>
          
          {/* Creative buttons */}
          <div className={`flex flex-col sm:flex-row gap-8 justify-center items-center mb-20 transition-all duration-1000 delay-1000 ${isVisible ? 'animate-slide-right' : 'opacity-0 translate-x-[100px]'}`}>
            <Button 
              onClick={handleWhatsApp}
              className="btn-primary text-xl w-full sm:w-auto magnetic-btn relative overflow-hidden group font-black"
              size="lg"
            >
              <span className="relative z-10 font-black">🚀 Falar no WhatsApp</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
            
            <Button 
              onClick={scrollToMentoria}
              className="btn-neon text-xl w-full sm:w-auto hover-scale-rotate font-black"
              size="lg"
            >
              ⚡ Quero Dominar IA
            </Button>
          </div>

          {/* Creative stats with better readability */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 transition-all duration-1000 delay-1500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="glass-card-strong p-8 rounded-2xl floating-card hover-lift">
              <div className="text-5xl font-black text-green-300 mb-4 animate-text-glow drop-shadow-lg">1000+</div>
              <div className="text-xl font-bold text-white">Vidas Transformadas</div>
            </div>
            
            <div className="glass-card-strong p-8 rounded-2xl floating-card hover-lift" style={{animationDelay: '1s'}}>
              <div className="text-5xl font-black text-yellow-300 mb-4 animate-text-glow drop-shadow-lg">R$ 50M+</div>
              <div className="text-xl font-bold text-white">Gerados por Clientes</div>
            </div>
            
            <div className="glass-card-strong p-8 rounded-2xl floating-card hover-lift" style={{animationDelay: '2s'}}>
              <div className="text-5xl font-black text-blue-300 mb-4 animate-text-glow drop-shadow-lg">24/7</div>
              <div className="text-xl font-bold text-white">Automação Total</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Creative scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="w-8 h-16 border-4 border-white rounded-full flex justify-center relative overflow-hidden">
          <div className="w-3 h-6 bg-white rounded-full mt-4 animate-bounce"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/30 animate-pulse"></div>
        </div>
      </div>

      {/* Liquid blob decoration */}
      <div className="absolute top-20 right-20 w-32 h-32 liquid-bg opacity-40 floating-card"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 liquid-bg opacity-30 floating-card" style={{animationDelay: '3s'}}></div>
    </section>
  );
};

export default Hero;
