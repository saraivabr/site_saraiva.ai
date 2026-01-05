
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
      number: "01",
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2"/>
          <path d="M24 14 L24 34 M14 24 L34 24" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: "MENTORIA",
      subtitle: "PARE DE ESTUDAR",
      description: "Transforme IA em dinheiro em 7 dias. Sem teoria. Só resultados.",
      price: "R$ 5.000",
      period: "/mês"
    },
    {
      number: "02",
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="8" width="32" height="32" stroke="currentColor" strokeWidth="2"/>
          <path d="M16 24 L24 32 L32 16" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: "CONSULTORIA",
      subtitle: "AUTOMATIZE TUDO",
      description: "Sua empresa vendendo sozinha. Enquanto você viaja.",
      price: "R$ 50.000",
      period: "/projeto"
    },
    {
      number: "03",
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 24 L24 12 L36 24 L24 36 Z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: "LIGAÇÃO.AI",
      subtitle: "VENDA DORMINDO",
      description: "IA que liga, convence e fecha vendas. 24h por dia.",
      price: "R$ 3.000",
      period: "/mês"
    },
    {
      number: "04",
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 16 L40 16 M8 24 L40 24 M8 32 L40 32" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
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
        <div className={`text-center mb-24 transition-all duration-1000 ease-out ${isVisible ? 'fade-in-up' : ''}`}>
          <h2 className="text-7xl md:text-8xl font-black mb-8 leading-[0.95]" style={{ letterSpacing: '-0.03em' }}>
            NÃO VENDO<br/>
            PRODUTOS
          </h2>
          <p className="text-2xl md:text-3xl font-medium text-black max-w-3xl mx-auto" style={{ letterSpacing: '0.01em', lineHeight: '1.5' }}>
            Vendo tempo livre, dinheiro automático e liberdade total.
          </p>
        </div>
        
        {/* Clean product grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {products.map((product, index) => (
            <div
              key={index}
              className={`transition-all duration-1000 ease-out delay-${index * 100} ${
                isVisible ? 'fade-in-up' : ''
              }`}
            >
              <div className="border border-black/10 p-10 bg-white h-full flex flex-col group hover:bg-black hover:text-white transition-all duration-500 ease-out">
                <div className="flex items-start justify-between mb-8">
                  <div className="text-8xl font-black opacity-10 group-hover:opacity-20 transition-opacity duration-500" style={{ letterSpacing: '-0.05em' }}>
                    {product.number}
                  </div>
                  <div className="group-hover:text-white transition-colors duration-500 ease-out">
                    {product.icon}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="mb-6">
                    <h3 className="text-3xl font-black mb-2" style={{ letterSpacing: '-0.01em' }}>{product.title}</h3>
                    <p className="font-mono text-xs uppercase tracking-widest opacity-60">{product.subtitle}</p>
                  </div>
                  
                  <p className="text-lg mb-8 leading-relaxed opacity-80">
                    {product.description}
                  </p>
                  
                  <div className="flex items-baseline mb-8">
                    <span className="text-4xl font-black" style={{ letterSpacing: '-0.02em' }}>{product.price}</span>
                    <span className="text-sm font-mono ml-2 opacity-60">{product.period}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleWhatsApp(product.title)}
                  className="w-full text-base font-bold py-4 bg-black text-white group-hover:bg-white group-hover:text-black border border-black/10 group-hover:border-white transition-all duration-300 ease-out focus:outline-2 focus:outline-black focus:outline-offset-2"
                >
                  PARAR DE ESTUDAR
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Clean CTA */}
        <div className={`text-center transition-all duration-1000 ease-out delay-800 ${isVisible ? 'fade-in-up' : ''}`}>
          <div className="border border-black/10 p-10 bg-white max-w-2xl mx-auto">
            <p className="text-2xl font-bold mb-6" style={{ lineHeight: '1.4' }}>
              Enquanto você decide, seus concorrentes já decidiram.
            </p>
            <Button 
              onClick={() => handleWhatsApp('todos os produtos')}
              className="bg-black text-white hover:opacity-90 text-lg px-12 py-4 font-bold transition-all duration-300 ease-out"
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
