
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";

const Mentoria = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentBenefit, setCurrentBenefit] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setCurrentBenefit((prev) => (prev + 1) % benefits.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const handleWhatsApp = () => {
    window.open('https://wa.me/5511999999999?text=Olá! Quero me inscrever na mentoria de IA!', '_blank');
  };

  const benefits = [
    "Acesso direto ao Saraiva por 90 dias",
    "Método step-by-step para lucrar com IA",
    "Ferramentas e automações prontas",
    "Grupo VIP com outros alunos",
    "Cases reais e estratégias testadas",
    "Certificado de conclusão"
  ];

  const modules = [
    {
      symbol: "+",
      title: "Módulo 1: Fundamentos",
      desc: "Domine os conceitos essenciais e prepare sua mente para o sucesso com IA."
    },
    {
      symbol: "×",
      title: "Módulo 2: Monetização",
      desc: "Estratégias práticas para gerar os primeiros R$ 10.000 com IA."
    },
    {
      symbol: "/",
      title: "Módulo 3: Escala",
      desc: "Como transformar seu negócio em uma máquina automatizada de lucro."
    }
  ];

  return (
    <section 
      ref={sectionRef}
      id="mentoria" 
      className="section-spacing bg-white relative overflow-hidden"
    >
      <div className="container-max relative z-10">
        {/* Title section */}
        <div className={`text-center mb-24 transition-all duration-1000 ease-out ${isVisible ? 'animate-zoom-in' : 'opacity-0 scale-75'}`}>
          <h2 className="text-7xl md:text-8xl font-black mb-8 text-black leading-[0.95]" style={{ letterSpacing: '-0.03em' }}>
            Mentoria{" "}
            <span className="text-black">Saraiva.AI</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-black max-w-4xl mx-auto opacity-80" style={{ lineHeight: '1.6' }}>
            O único programa que te ensina a transformar IA em uma máquina de fazer dinheiro.
          </p>
          
          <div className="w-20 h-[1px] bg-black/20 mx-auto mt-8"></div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Pricing card */}
          <div className={`transition-all duration-1000 ease-out ${isVisible ? 'animate-slide-left' : 'opacity-0 translate-x-[-100px]'}`}>
            <div className="relative">
              <div className="relative border border-black/10 bg-white p-10">
                {/* Price section - More typographic emphasis */}
                <div className="text-center mb-10">
                  <div className="inline-block bg-black text-white px-6 py-2 mb-6 font-mono text-xs uppercase tracking-widest">
                    PROMOÇÃO LIMITADA
                  </div>
                  
                  <div className="relative mb-6">
                    <div className="text-8xl font-black text-black" style={{ letterSpacing: '-0.04em' }}>
                      R$ 2.997
                    </div>
                    <div className="absolute -top-6 -right-12 text-xl text-gray-400 line-through rotate-12 opacity-50">
                      R$ 9.997
                    </div>
                  </div>
                  
                  <div className="text-base text-black/60 font-mono">
                    ou 12x de R$ 297 sem juros
                  </div>
                </div>
                
                {/* Benefits with animation */}
                <div className="space-y-3 mb-10">
                  {benefits.map((benefit, index) => (
                    <div 
                      key={index}
                      className={`flex items-center space-x-4 p-4 transition-all duration-500 ease-out border border-transparent ${
                        currentBenefit === index 
                          ? 'bg-black text-white border-black' 
                          : 'hover:border-black/10'
                      }`}
                    >
                      <div className={`text-xl font-mono transition-all duration-300 ${
                        currentBenefit === index ? 'scale-110' : ''
                      }`}>
                        +
                      </div>
                      <div className={`font-medium text-sm ${
                        currentBenefit === index ? 'text-white font-bold' : 'text-black'
                      }`}>
                        {benefit}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Main CTA */}
                <Button 
                  onClick={handleWhatsApp}
                  className="w-full bg-black text-white hover:opacity-90 font-black py-6 text-lg transition-all duration-300 ease-out mb-6"
                  size="lg"
                >
                  QUERO MINHA VAGA AGORA
                </Button>
                
                {/* Security badges */}
                <div className="text-center text-xs text-black/60 space-y-2 font-mono">
                  <div className="flex items-center justify-center space-x-4">
                    <span>Pagamento 100% Seguro</span>
                    <span>•</span>
                    <span>Garantia de 7 dias</span>
                  </div>
                  <div className="text-xs opacity-70">
                    Não satisfeito? Devolvemos 100% do seu dinheiro
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Modules section - Simpler cards */}
          <div className={`space-y-6 transition-all duration-1000 ease-out delay-500 ${isVisible ? 'animate-slide-right' : 'opacity-0 translate-x-[100px]'}`}>
            {modules.map((module, index) => (
              <Card 
                key={index}
                className="border border-black/10 bg-white hover:bg-black hover:text-white transition-all duration-500 ease-out"
              >
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    {/* Typographic symbol */}
                    <div className="w-14 h-14 border border-black/10 bg-white flex items-center justify-center text-4xl text-black font-light">
                      {module.symbol}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-black mb-3 text-black group-hover:text-white" style={{ letterSpacing: '-0.01em' }}>
                        {module.title}
                      </h3>
                      <p className="text-black/70 group-hover:text-white/80 leading-relaxed text-base">
                        {module.desc}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Urgency section - More minimalist progress bar */}
        <div className={`text-center mt-24 transition-all duration-1000 ease-out delay-1000 ${isVisible ? 'animate-zoom-in' : 'opacity-0 scale-75'}`}>
          <div className="max-w-3xl mx-auto">
            <Card className="border border-black/10 bg-white">
              <CardContent className="p-10">
                <div className="font-black text-2xl mb-4 text-black" style={{ letterSpacing: '-0.01em' }}>
                  ATENÇÃO: Apenas 50 Vagas
                </div>
                <div className="text-base text-black/70 mb-8 font-mono">
                  Esta turma está quase esgotada. Garanta sua vaga antes que seja tarde.
                </div>
                
                {/* Minimalist progress bar */}
                <div className="bg-black/5 h-2 mb-4 overflow-hidden">
                  <div className="bg-black h-full transition-all duration-1000 ease-out" style={{width: '87%'}}></div>
                </div>
                <div className="text-sm text-black/60 font-mono">
                  <strong className="text-black">43 vagas preenchidas</strong> • Restam apenas 7 vagas
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mentoria;
