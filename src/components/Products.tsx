
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";

const Products = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
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

  const handleWhatsApp = (product: string) => {
    window.open(`https://wa.me/5511999999999?text=Olá! Quero saber mais sobre ${product}!`, '_blank');
  };

  const products = [
    {
      title: "Mentoria em IA Aplicada",
      description: "Aprenda a transformar IA em dinheiro rápido. Método prático, direto e sem enrolação.",
      icon: "🎯",
      cta: "Quero a Mentoria",
      gradient: "from-purple-500 to-pink-500",
      glowColor: "rgba(168, 85, 247, 0.4)"
    },
    {
      title: "Consultoria para Empresas", 
      description: "Automatize vendas, atendimento e processos. ROI garantido em 30 dias.",
      icon: "🚀",
      cta: "Automatizar Empresa",
      gradient: "from-blue-500 to-cyan-500",
      glowColor: "rgba(59, 130, 246, 0.4)"
    },
    {
      title: "Ligação.AI",
      description: "IA que liga, fala, vende, cobra e fecha sem precisar de você. 24/7 no piloto automático.",
      icon: "📞",
      cta: "Conhecer Ligação.AI",
      gradient: "from-green-500 to-emerald-500",
      glowColor: "rgba(34, 197, 94, 0.4)"
    },
    {
      title: "Escreve.AI",
      description: "Transforma áudios do WhatsApp em texto e resumo automático. Economize horas diárias.",
      icon: "✍️",
      cta: "Testar Escreve.AI",
      gradient: "from-orange-500 to-red-500",
      glowColor: "rgba(249, 115, 22, 0.4)"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      id="produtos" 
      className="section-spacing bg-black text-white relative overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20"></div>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-float opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="container-max relative z-10">
        {/* Title section */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'animate-zoom-in' : 'opacity-0 scale-75'}`}>
          <h2 className="text-5xl md:text-6xl font-black mb-8">
            O Que Eu Faço —{" "}
            <span className="text-gradient">Meus Produtos</span>
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-2xl text-gray-300 mb-8">
              Cada produto foi criado para resolver um problema real e gerar resultados imediatos.
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
          </div>
        </div>
        
        {/* Products grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {products.map((product, index) => (
            <div
              key={index}
              className={`transition-all duration-1000 delay-${index * 200} ${
                isVisible ? 'animate-slide-left' : 'opacity-0 translate-y-10'
              }`}
            >
              <Card 
                className="border-0 bg-transparent relative group cursor-pointer h-full"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl backdrop-blur-sm border border-white/20"></div>
                
                {/* Glow effect */}
                <div 
                  className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                    hoveredCard === index ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    boxShadow: `0 0 40px ${product.glowColor}, 0 0 80px ${product.glowColor}`
                  }}
                ></div>

                <CardContent className="p-8 relative z-10 h-full flex flex-col">
                  {/* Icon with gradient background */}
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${product.gradient} flex items-center justify-center mb-6 text-3xl floating-card shadow-lg`}>
                    {product.icon}
                  </div>
                  
                  <h3 className="text-3xl font-black mb-6 text-white group-hover:text-gradient transition-all duration-300">
                    {product.title}
                  </h3>
                  
                  <p className="text-gray-300 mb-8 leading-relaxed text-lg flex-grow">
                    {product.description}
                  </p>
                  
                  <Button 
                    onClick={() => handleWhatsApp(product.title)}
                    className={`w-full relative overflow-hidden group/btn bg-gradient-to-r ${product.gradient} hover:scale-105 transition-all duration-300 text-lg font-bold py-4 border-0`}
                    size="lg"
                  >
                    <span className="relative z-10">{product.cta}</span>
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        {/* CTA section */}
        <div className={`text-center transition-all duration-1000 delay-1000 ${isVisible ? 'animate-zoom-in' : 'opacity-0 scale-75'}`}>
          <div className="glass-card p-8 rounded-2xl max-w-2xl mx-auto">
            <p className="text-xl mb-6 text-gray-300">
              Pronto para transformar sua vida com IA?
            </p>
            <Button 
              onClick={() => handleWhatsApp('todos os produtos')}
              className="btn-neon text-xl px-12 py-4 magnetic-btn"
              size="lg"
            >
              🌟 Ver Todos os Produtos
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
