
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const Hero = () => {
  const [currentText, setCurrentText] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const disruptiveTexts = [
    "Pare de estudar IA.",
    "Comece a lucrar com IA.",
    "Seus concorrentes já lucraram.",
    "Você ainda está estudando."
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % disruptiveTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleWhatsApp = () => {
    window.open('https://wa.me/5511999999999?text=Quero parar de estudar e começar a lucrar com IA.', '_blank');
  };

  const scrollToMentoria = () => {
    const element = document.getElementById('mentoria');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen bg-white flex items-center justify-center relative">
      <div className="container-max text-center">
        {/* Anti-hero headline */}
        <div className={`transition-all duration-1000 ${isVisible ? 'fade-in-up' : ''}`}>
          <h1 className="text-7xl md:text-9xl font-bold leading-none mb-16 tracking-tight">
            <span className="block text-black">VOCÊ NÃO</span>
            <span className="block text-black">PRECISA</span>
            <span className="block text-black border-4 border-black p-4 inline-block mt-8 brutalist-shadow">
              ENTENDER IA
            </span>
          </h1>
        </div>

        {/* Dynamic disruptive text */}
        <div className={`mb-16 transition-all duration-1000 delay-500 ${isVisible ? 'fade-in-up' : ''}`}>
          <p className="text-3xl md:text-4xl font-bold text-black typewriter">
            {disruptiveTexts[currentText]}
          </p>
        </div>

        {/* Brutal truth */}
        <div className={`mb-20 transition-all duration-1000 delay-1000 ${isVisible ? 'fade-in-up' : ''}`}>
          <div className="border-4 border-black p-8 bg-white max-w-4xl mx-auto brutalist-shadow">
            <p className="text-2xl md:text-3xl font-bold text-black leading-tight">
              Enquanto você perde tempo estudando,<br/>
              <span className="bg-black text-white px-4 py-2">meus clientes já faturaram R$ 50 milhões.</span>
            </p>
          </div>
        </div>

        {/* Anti-conventional buttons */}
        <div className={`flex flex-col sm:flex-row gap-8 justify-center items-center transition-all duration-1000 delay-1500 ${isVisible ? 'fade-in-up' : ''}`}>
          <Button 
            onClick={handleWhatsApp}
            className="btn-primary text-xl font-bold py-6 px-12 brutalist-shadow hover:-translate-y-1 hover:shadow-none transition-all"
          >
            PARE DE ESTUDAR
          </Button>
          
          <Button 
            onClick={scrollToMentoria}
            className="btn-secondary text-xl font-bold py-6 px-12 brutalist-shadow hover:-translate-y-1 hover:shadow-none transition-all"
          >
            COMECE A LUCRAR
          </Button>
        </div>

        {/* Minimalist stats */}
        <div className={`grid grid-cols-3 gap-8 mt-32 transition-all duration-1000 delay-2000 ${isVisible ? 'fade-in-up' : ''}`}>
          <div className="text-center">
            <div className="text-6xl font-bold text-black counter-text">1000+</div>
            <div className="text-sm font-mono uppercase tracking-wider mt-2">TRANSFORMADOS</div>
          </div>
          <div className="text-center">
            <div className="text-6xl font-bold text-black counter-text">R$ 50M</div>
            <div className="text-sm font-mono uppercase tracking-wider mt-2">FATURADOS</div>
          </div>
          <div className="text-center">
            <div className="text-6xl font-bold text-black counter-text">0</div>
            <div className="text-sm font-mono uppercase tracking-wider mt-2">ENROLAÇÃO</div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-0.5 h-16 bg-black"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
