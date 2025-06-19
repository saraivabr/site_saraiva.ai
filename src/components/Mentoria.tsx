
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
      icon: "🎯",
      title: "Módulo 1: Fundamentos",
      desc: "Domine os conceitos essenciais e prepare sua mente para o sucesso com IA.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: "💰",
      title: "Módulo 2: Monetização",
      desc: "Estratégias práticas para gerar os primeiros R$ 10.000 com IA.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: "🚀",
      title: "Módulo 3: Escala",
      desc: "Como transformar seu negócio em uma máquina automatizada de lucro.",
      gradient: "from-blue-500 to-cyan-500"
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
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'animate-zoom-in' : 'opacity-0 scale-75'}`}>
          <h2 className="text-5xl md:text-6xl font-black mb-8 text-black">
            Mentoria{" "}
            <span className="text-black">Saraiva.AI</span>
          </h2>
          
          <p className="text-2xl text-black max-w-4xl mx-auto mb-8">
            O único programa que te ensina a transformar IA em uma máquina de fazer dinheiro.
          </p>
          
          <div className="w-32 h-1 bg-black mx-auto"></div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Pricing card */}
          <div className={`transition-all duration-1000 ${isVisible ? 'animate-slide-left' : 'opacity-0 translate-x-[-100px]'}`}>
            <div className="relative">
              <div className="relative border-2 border-black bg-white p-8 brutalist-shadow">
                {/* Price section */}
                <div className="text-center mb-8">
                  <div className="inline-block bg-black text-white px-6 py-2 mb-4 font-bold">
                    🔥 PROMOÇÃO LIMITADA
                  </div>
                  
                  <div className="relative">
                    <div className="text-7xl font-black text-black mb-2">
                      R$ 2.997
                    </div>
                    <div className="absolute -top-4 -right-8 text-2xl text-gray-400 line-through rotate-12">
                      R$ 9.997
                    </div>
                  </div>
                  
                  <div className="text-lg text-black mb-6">
                    ou 12x de R$ 297 sem juros
                  </div>
                </div>
                
                {/* Benefits with animation */}
                <div className="space-y-4 mb-8">
                  {benefits.map((benefit, index) => (
                    <div 
                      key={index}
                      className={`flex items-center space-x-4 p-3 transition-all duration-500 ${
                        currentBenefit === index 
                          ? 'bg-black text-white scale-105' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className={`text-2xl transition-all duration-300 ${
                        currentBenefit === index ? 'scale-125' : ''
                      }`}>
                        ✅
                      </div>
                      <div className={`font-medium ${
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
                  className="w-full bg-black text-white hover:bg-gray-900 font-black py-6 text-xl brutalist-shadow mb-6"
                  size="lg"
                >
                  🎯 QUERO MINHA VAGA AGORA
                </Button>
                
                {/* Security badges */}
                <div className="text-center text-sm text-black space-y-2">
                  <div className="flex items-center justify-center space-x-4">
                    <span>🔒 Pagamento 100% Seguro</span>
                    <span>•</span>
                    <span>✅ Garantia de 7 dias</span>
                  </div>
                  <div className="text-xs">
                    Não satisfeito? Devolvemos 100% do seu dinheiro
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Modules section */}
          <div className={`space-y-8 transition-all duration-1000 delay-500 ${isVisible ? 'animate-slide-right' : 'opacity-0 translate-x-[100px]'}`}>
            {modules.map((module, index) => (
              <Card 
                key={index}
                className="border-2 border-black bg-white brutalist-shadow"
              >
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    {/* Icon */}
                    <div className="w-16 h-16 border-2 border-black bg-white flex items-center justify-center text-2xl text-black">
                      {module.icon}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-black mb-3 text-black">
                        {module.title}
                      </h3>
                      <p className="text-black leading-relaxed text-lg">
                        {module.desc}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Urgency section */}
        <div className={`text-center mt-20 transition-all duration-1000 delay-1000 ${isVisible ? 'animate-zoom-in' : 'opacity-0 scale-75'}`}>
          <div className="max-w-3xl mx-auto">
            <Card className="border-2 border-black bg-white brutalist-shadow">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">⏰</div>
                <div className="font-black text-2xl mb-4 text-black">
                  ATENÇÃO: Apenas 50 Vagas!
                </div>
                <div className="text-lg text-black mb-6">
                  Esta turma está quase esgotada. Garante sua vaga antes que seja tarde!
                </div>
                
                {/* Progress bar */}
                <div className="bg-gray-200 border-2 border-black h-4 mb-4">
                  <div className="bg-black h-full" style={{width: '87%'}}></div>
                </div>
                <div className="text-sm text-black">
                  <strong>43 vagas preenchidas</strong> • Restam apenas 7 vagas
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
