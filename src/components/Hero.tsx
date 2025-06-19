
import { Button } from "@/components/ui/button";

const Hero = () => {
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
    <section className="hero-gradient min-h-screen flex items-center justify-center text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-transparent"></div>
      
      <div className="container-max relative z-10">
        <div className="text-center max-w-5xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-8 text-shadow-strong">
            Eu ensino pessoas comuns a{" "}
            <span className="text-white">transformar IA</span>{" "}
            em dinheiro, tempo e liberdade.
            <br />
            <span className="text-red-500">Antes que seja tarde.</span>
          </h1>
          
          <p className="text-xl md:text-2xl font-medium mb-12 text-gray-200 max-w-4xl mx-auto leading-relaxed">
            Enquanto os outros tentam entender, meus clientes já estão{" "}
            <strong className="text-white">lucrando, automatizando e dominando mercados.</strong>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              onClick={handleWhatsApp}
              className="btn-primary text-lg w-full sm:w-auto animate-pulse-strong"
              size="lg"
            >
              🔗 Falar no WhatsApp
            </Button>
            
            <Button 
              onClick={scrollToMentoria}
              className="btn-secondary text-lg w-full sm:w-auto"
              size="lg"
            >
              🔗 Quero Aprender IA
            </Button>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-sm text-gray-400 font-medium tracking-wide uppercase">
              Mais de 1.000 pessoas já transformaram suas vidas
            </p>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
