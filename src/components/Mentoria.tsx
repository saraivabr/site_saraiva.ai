
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";

const benefits = [
  "Acesso direto ao Saraiva por 90 dias",
  "Método step-by-step para lucrar com IA",
  "Ferramentas e automações prontas",
  "Grupo VIP com outros alunos",
  "Cases reais e estratégias testadas",
  "Certificado de conclusão"
] as const;

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
] as const;

const Mentoria = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentBenefit, setCurrentBenefit] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
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
    if (isVisible && !isPaused) {
      const interval = setInterval(() => {
        setCurrentBenefit((prev) => (prev + 1) % benefits.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isVisible, isPaused]);

  const handleBenefitsKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      setCurrentBenefit((prev) => (prev + 1) % benefits.length);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setCurrentBenefit((prev) => (prev - 1 + benefits.length) % benefits.length);
    }
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/5511999999999?text=Olá! Quero me inscrever na mentoria de IA!', '_blank');
  };

  return (
    <section
      ref={sectionRef}
      id="mentoria"
      className="section-spacing bg-white relative overflow-hidden"
      role="region"
      aria-label="Mentoria Saraiva.AI"
    >
      <div className="container-max relative z-10">
        {/* Title section */}
        <div className={`text-center mb-16 md:mb-24 transition-all duration-1000 ease-out ${isVisible ? 'animate-zoom-in' : 'opacity-0 scale-75'}`}>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 md:mb-8 text-black leading-[0.95]" style={{ letterSpacing: '-0.03em' }}>
            Mentoria{" "}
            <span className="text-black">Saraiva.AI</span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-black max-w-4xl mx-auto opacity-80 px-4" style={{ lineHeight: '1.6' }}>
            O único programa que te ensina a transformar IA em uma máquina de fazer dinheiro.
          </p>
          
          <div className="w-16 sm:w-20 h-[1px] bg-black/20 mx-auto mt-6 md:mt-8"></div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-start">
          {/* Pricing card */}
          <div className={`transition-all duration-1000 ease-out ${isVisible ? 'animate-slide-left' : 'opacity-0 translate-x-[-100px]'}`}>
            <div className="relative">
              <div className="relative border border-black/10 bg-white p-6 sm:p-8 md:p-10">
                {/* Price section - More typographic emphasis */}
                <div className="text-center mb-8 md:mb-10">
                  <div className="inline-block bg-black text-white px-4 sm:px-6 py-2 mb-4 sm:mb-6 font-mono text-[0.65rem] sm:text-xs uppercase tracking-wider sm:tracking-widest">
                    PROMOÇÃO LIMITADA
                  </div>
                  
                  <div className="relative mb-4 sm:mb-6">
                    <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-black" style={{ letterSpacing: '-0.04em' }}>
                      R$ 2.997
                    </div>
                    <div className="absolute -top-4 sm:-top-6 -right-6 sm:-right-12 text-base sm:text-xl text-gray-400 line-through rotate-12 opacity-70">
                      R$ 9.997
                    </div>
                  </div>
                  
                  <div className="text-sm sm:text-base text-black/60 font-mono">
                    ou 12x de R$ 297 sem juros
                  </div>
                </div>
                
                {/* Benefits with animation */}
                <div
                  className="space-y-2 sm:space-y-3 mb-8 md:mb-10"
                  role="region"
                  aria-roledescription="carousel"
                  aria-label="Beneficios da mentoria"
                  aria-live="polite"
                  tabIndex={0}
                  onKeyDown={handleBenefitsKeyDown}
                  onFocus={() => setIsPaused(true)}
                  onBlur={() => setIsPaused(false)}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 transition-all duration-500 ease-out border-l-2 ${
                        currentBenefit === index
                          ? 'border-l-black bg-black/5'
                          : 'border-l-transparent hover:bg-black/[0.02]'
                      }`}
                    >
                      <div className={`text-lg sm:text-xl font-mono transition-all duration-300 ${
                        currentBenefit === index ? 'scale-110' : ''
                      }`}>
                        +
                      </div>
                      <div className={`font-medium text-xs sm:text-sm ${
                        currentBenefit === index ? 'text-black font-bold' : 'text-black'
                      }`}>
                        {benefit}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Main CTA */}
                <Button 
                  onClick={handleWhatsApp}
                  className="w-full bg-accent text-accent-foreground hover:opacity-90 font-black py-5 sm:py-6 text-base sm:text-lg transition-all duration-300 ease-out mb-4 sm:mb-6 min-h-[44px]"
                  size="lg"
                >
                  QUERO MINHA VAGA AGORA
                </Button>
                
                {/* Security badges */}
                <div className="text-center text-xs text-black/60 space-y-2 font-mono">
                  <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-4">
                    <span>Pagamento 100% Seguro</span>
                    <span>•</span>
                    <span>Garantia de 7 dias</span>
                  </div>
                  <div className="text-[0.65rem] sm:text-xs opacity-70">
                    Não satisfeito? Devolvemos 100% do seu dinheiro
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Modules section - Simpler cards */}
          <div className={`space-y-4 sm:space-y-6 transition-all duration-1000 ease-out delay-500 ${isVisible ? 'animate-slide-right' : 'opacity-0 translate-x-[100px]'}`}>
            {modules.map((module, index) => (
              <Card 
                key={index}
                className="group border border-black/10 bg-white hover:bg-black hover:text-white transition-all duration-500 ease-out"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-start space-x-4 sm:space-x-6">
                    {/* Typographic symbol */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 border border-black/10 bg-white flex items-center justify-center text-3xl sm:text-4xl text-black font-light flex-shrink-0">
                      {module.symbol}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-black mb-2 sm:mb-3 text-black group-hover:text-white" style={{ letterSpacing: '-0.01em' }}>
                        {module.title}
                      </h3>
                      <p className="text-black/70 group-hover:text-white/80 leading-relaxed text-sm sm:text-base">
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
        <div className={`text-center mt-16 md:mt-24 transition-all duration-1000 ease-out delay-1000 ${isVisible ? 'animate-zoom-in' : 'opacity-0 scale-75'}`}>
          <div className="max-w-3xl mx-auto">
            <Card className="border border-black/10 bg-white">
              <CardContent className="p-6 sm:p-8 md:p-10">
                <div className="font-black text-xl sm:text-2xl mb-3 md:mb-4 text-black" style={{ letterSpacing: '-0.01em' }}>
                  ATENÇÃO: Apenas 50 Vagas
                </div>
                <div className="text-sm sm:text-base text-black/70 mb-6 sm:mb-8 font-mono">
                  Esta turma está quase esgotada. Garanta sua vaga antes que seja tarde.
                </div>
                
                {/* Minimalist progress bar */}
                <div className="bg-black/5 h-2 mb-3 sm:mb-4 overflow-hidden" role="progressbar" aria-valuenow={87} aria-valuemin={0} aria-valuemax={100} aria-label="Vagas preenchidas: 87%">
                  <div className="bg-black h-full transition-all duration-1000 ease-out" style={{width: '87%'}}></div>
                </div>
                <div className="text-xs sm:text-sm text-black/60 font-mono">
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
