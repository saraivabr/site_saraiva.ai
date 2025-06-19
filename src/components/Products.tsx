
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

const Products = () => {
  const [isVisible, setIsVisible] = useState(false);
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
    window.open(`https://wa.me/5511999999999?text=Quero parar de estudar e lucrar com ${product}`, '_blank');
  };

  const products = [
    {
      title: "MENTORIA",
      subtitle: "PARE DE ESTUDAR",
      description: "Transforme IA em dinheiro em 7 dias. Sem teoria. Só resultados.",
      price: "R$ 5.000",
      period: "/mês"
    },
    {
      title: "CONSULTORIA",
      subtitle: "AUTOMATIZE TUDO",
      description: "Sua empresa vendendo sozinha. Enquanto você viaja.",
      price: "R$ 50.000",
      period: "/projeto"
    },
    {
      title: "LIGAÇÃO.AI",
      subtitle: "VENDA DORMINDO",
      description: "IA que liga, convence e fecha vendas. 24h por dia.",
      price: "R$ 3.000",
      period: "/mês"
    },
    {
      title: "ESCREVE.AI",
      subtitle: "NUNCA MAIS DIGITE",
      description: "Áudio do WhatsApp vira texto e resumo. Automático.",
      price: "R$ 500",
      period: "/mês"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      id="produtos" 
      className="section-spacing bg-white"
    >
      <div className="container-max">
        {/* Anti-marketing title */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'fade-in-up' : ''}`}>
          <h2 className="text-6xl md:text-7xl font-bold mb-8 leading-none">
            NÃO VENDO<br/>
            <span className="border-4 border-black p-4 inline-block">PRODUTOS</span>
          </h2>
          <p className="text-3xl font-bold text-black max-w-3xl mx-auto">
            Vendo tempo livre, dinheiro automático e liberdade total.
          </p>
        </div>
        
        {/* Brutal product grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {products.map((product, index) => (
            <div
              key={index}
              className={`transition-all duration-1000 delay-${index * 100} ${
                isVisible ? 'fade-in-up' : ''
              }`}
            >
              <div className="minimal-card h-full flex flex-col brutalist-shadow">
                <div className="flex-1">
                  <div className="mb-6">
                    <h3 className="text-4xl font-bold mb-2">{product.title}</h3>
                    <p className="font-mono text-sm uppercase tracking-wider">{product.subtitle}</p>
                  </div>
                  
                  <p className="text-xl mb-8 leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="flex items-baseline mb-8">
                    <span className="text-4xl font-bold">{product.price}</span>
                    <span className="text-lg font-mono ml-2">{product.period}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleWhatsApp(product.title)}
                  className="btn-primary w-full text-lg font-bold py-4"
                >
                  PARAR DE ESTUDAR
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Brutal CTA */}
        <div className={`text-center transition-all duration-1000 delay-800 ${isVisible ? 'fade-in-up' : ''}`}>
          <div className="border-4 border-black p-8 bg-white max-w-2xl mx-auto brutalist-shadow">
            <p className="text-2xl font-bold mb-6">
              Enquanto você decide, seus concorrentes já decidiram.
            </p>
            <Button 
              onClick={() => handleWhatsApp('todos os produtos')}
              className="btn-primary text-xl px-12 py-4"
            >
              DECIDIR AGORA
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
