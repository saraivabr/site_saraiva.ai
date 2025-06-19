
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Products = () => {
  const handleWhatsApp = (product: string) => {
    window.open(`https://wa.me/5511999999999?text=Olá! Quero saber mais sobre ${product}!`, '_blank');
  };

  const products = [
    {
      title: "Mentoria em IA Aplicada",
      description: "Aprenda a transformar IA em dinheiro rápido. Método prático, direto e sem enrolação.",
      icon: "🎯",
      cta: "Quero a Mentoria"
    },
    {
      title: "Consultoria para Empresas", 
      description: "Automatize vendas, atendimento e processos. ROI garantido em 30 dias.",
      icon: "🚀",
      cta: "Automatizar Empresa"
    },
    {
      title: "Ligação.AI",
      description: "IA que liga, fala, vende, cobra e fecha sem precisar de você. 24/7 no piloto automático.",
      icon: "📞",
      cta: "Conhecer Ligação.AI"
    },
    {
      title: "Escreve.AI",
      description: "Transforma áudios do WhatsApp em texto e resumo automático. Economize horas diárias.",
      icon: "✍️",
      cta: "Testar Escreve.AI"
    }
  ];

  return (
    <section id="produtos" className="section-spacing bg-gray-50">
      <div className="container-max">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            O Que Eu Faço —{" "}
            <span className="text-black">Meus Produtos</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cada produto foi criado para resolver um problema real e gerar resultados imediatos.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {products.map((product, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in bg-white">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">{product.icon}</div>
                
                <h3 className="text-2xl font-black mb-4 text-black">
                  {product.title}
                </h3>
                
                <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                  {product.description}
                </p>
                
                <Button 
                  onClick={() => handleWhatsApp(product.title)}
                  className="btn-primary w-full"
                  size="lg"
                >
                  {product.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <Button 
            onClick={() => handleWhatsApp('todos os produtos')}
            className="btn-secondary text-lg"
            size="lg"
          >
            Ver Todos os Produtos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Products;
