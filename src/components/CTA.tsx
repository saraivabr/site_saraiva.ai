
import { Button } from "@/components/ui/button";

const CTA = () => {
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
    <section className="section-spacing hero-gradient text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-transparent"></div>
      
      <div className="container-max relative z-10">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight text-shadow-strong">
            Ou você aprende IA…{" "}
            <span className="text-red-500">ou vai trabalhar pra quem aprendeu.</span>
          </h2>
          
          <p className="text-2xl md:text-3xl font-bold mb-12 text-gray-200">
            Não existe meio termo. A única escolha é <strong className="text-white">agora.</strong>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              onClick={scrollToMentoria}
              className="btn-primary text-xl w-full sm:w-auto animate-pulse-strong"
              size="lg"
            >
              🔗 Quero Aprender IA
            </Button>
            
            <Button 
              onClick={handleWhatsApp}
              className="btn-secondary text-xl w-full sm:w-auto"
              size="lg"
            >
              🔗 Falar no WhatsApp
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="border border-white/20 rounded-xl p-6 bg-white/5 backdrop-blur-sm">
              <div className="text-3xl font-black text-green-400 mb-2">⚡</div>
              <div className="text-lg font-bold mb-1">Resultados Rápidos</div>
              <div className="text-sm text-gray-300">Primeiros lucros em 7 dias</div>
            </div>
            
            <div className="border border-white/20 rounded-xl p-6 bg-white/5 backdrop-blur-sm">
              <div className="text-3xl font-black text-blue-400 mb-2">🎯</div>
              <div className="text-lg font-bold mb-1">Método Comprovado</div>
              <div className="text-sm text-gray-300">Testado por +1.000 pessoas</div>
            </div>
            
            <div className="border border-white/20 rounded-xl p-6 bg-white/5 backdrop-blur-sm">
              <div className="text-3xl font-black text-yellow-400 mb-2">🚀</div>
              <div className="text-lg font-bold mb-1">Suporte Total</div>
              <div className="text-sm text-gray-300">Acesso direto ao Saraiva</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
