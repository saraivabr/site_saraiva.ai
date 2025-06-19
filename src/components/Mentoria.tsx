
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
      className="section-spacing bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 floating-card blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full opacity-15 floating-card blur-3xl" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="container-max relative z-10">
        {/* Title section */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'animate-zoom-in' : 'opacity-0 scale-75'}`}>
          <h2 className="text-5xl md:text-6xl font-black mb-8">
            Mentoria{" "}
            <span className="text-gradient">Saraiva.AI</span>
          </h2>
          
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto mb-8">
            O único programa que te ensina a transformar IA em uma máquina de fazer dinheiro.
          </p>
          
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Pricing card */}
          <div className={`transition-all duration-1000 ${isVisible ? 'animate-slide-left' : 'opacity-0 translate-x-[-100px]'}`}>
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
              
              <div className="relative glass-card border-2 border-purple-200 rounded-3xl p-8 shadow-2xl">
                {/* Price section */}
                <div className="text-center mb-8">
                  <div className="inline-block bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-4 animate-pulse">
                    🔥 PROMOÇÃO LIMITADA
                  </div>
                  
                  <div className="relative">
                    <div className="text-7xl font-black text-gradient mb-2">
                      R$ 2.997
                    </div>
                    <div className="absolute -top-4 -right-8 text-2xl text-gray-400 line-through rotate-12">
                      R$ 9.997
                    </div>
                  </div>
                  
                  <div className="text-lg text-gray-600 mb-6">
                    ou 12x de R$ 297 sem juros
                  </div>
                </div>
                
                {/* Benefits with animation */}
                <div className="space-y-4 mb-8">
                  {benefits.map((benefit, index) => (
                    <div 
                      key={index}
                      className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-500 ${
                        currentBenefit === index 
                          ? 'bg-gradient-to-r from-purple-100 to-pink-100 scale-105' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`text-2xl transition-all duration-300 ${
                        currentBenefit === index ? 'scale-125' : ''
                      }`}>
                        ✅
                      </div>
                      <div className={`font-medium ${
                        currentBenefit === index ? 'text-purple-600 font-bold' : 'text-gray-700'
                      }`}>
                        {benefit}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Main CTA */}
                <Button 
                  onClick={handleWhatsApp}
                  className="w-full relative overflow-hidden group bg-gradient-to-r from-green-600 via-green-500 to-green-600 hover:from-green-500 hover:via-green-400 hover:to-green-500 text-white font-black py-6 text-xl rounded-2xl shadow-2xl magnetic-btn mb-6"
                  size="lg"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    🎯 QUERO MINHA VAGA AGORA
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                </Button>
                
                {/* Security badges */}
                <div className="text-center text-sm text-gray-500 space-y-2">
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
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 card-3d overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${module.gradient} opacity-5`}></div>
                
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-start space-x-6">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${module.gradient} flex items-center justify-center text-2xl text-white shadow-lg floating-card`} style={{animationDelay: `${index}s`}}>
                      {module.icon}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-black mb-3 text-black">
                        {module.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-lg">
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
            <Card className="border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-10"></div>
              
              <CardContent className="p-8 relative z-10">
                <div className="text-4xl mb-4 animate-bounce">⏰</div>
                <div className="font-black text-2xl mb-4 text-gray-800">
                  ATENÇÃO: Apenas 50 Vagas!
                </div>
                <div className="text-lg text-gray-700 mb-6">
                  Esta turma está quase esgotada. Garante sua vaga antes que seja tarde!
                </div>
                
                {/* Progress bar */}
                <div className="bg-gray-200 rounded-full h-4 mb-4">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 h-4 rounded-full animate-pulse" style={{width: '87%'}}></div>
                </div>
                <div className="text-sm text-gray-600">
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
