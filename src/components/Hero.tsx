
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ContactModal from "./ContactModal";

const Hero = () => {
  const [currentText, setCurrentText] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

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
    }, 4500);
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

  const openContactModal = () => {
    setIsContactModalOpen(true);
  };
  return (
    <section className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden pt-20">
      {/* Animated vertical line */}
      <motion.div
        className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-black/10 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-full h-32 bg-gradient-to-b from-transparent via-black to-transparent animate-slide-down"></div>
      </motion.div>

      <div className="container-max text-center relative z-10">
        {/* Anti-hero headline - Larger and bolder */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[10rem] xl:text-[12rem] font-black leading-[0.9] mb-12 md:mb-20 tracking-tighter">
            <motion.span
              className="block text-black"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              VOCÊ NÃO
            </motion.span>
            <motion.span
              className="block text-black"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              PRECISA
            </motion.span>
            <motion.span
              className="block text-black mt-4 md:mt-8"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              ENTENDER IA
            </motion.span>
          </h1>
        </motion.div>

        {/* Dynamic disruptive text - Smoother transition */}
        <div className="mb-12 md:mb-20">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentText}
              className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-black"
              style={{ letterSpacing: '0.02em' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {disruptiveTexts[currentText]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Brutal truth - No border box */}
        <motion.div
          className="mb-16 md:mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold text-black leading-tight max-w-5xl mx-auto px-4">
            Enquanto você perde tempo estudando,<br className="hidden sm:block"/>
            <motion.span
              className="bg-black text-white px-3 sm:px-4 md:px-6 py-1 md:py-2 inline-block mt-2 sm:mt-0"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              meus clientes já faturaram R$ 50 milhões.
            </motion.span>
          </p>
        </motion.div>

        {/* Anti-conventional buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.1, duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={openContactModal}
              className="bg-black text-white hover:opacity-90 font-mono font-bold text-base sm:text-lg md:text-xl py-5 sm:py-6 md:py-7 px-8 sm:px-10 md:px-14 transition-all duration-300 ease-out w-full sm:w-auto min-h-[44px]"
            >
              FALE CONOSCO
            </Button>
          </motion.div>

          <motion.div
            className="w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={scrollToMentoria}
              className="bg-white text-black border border-black hover:bg-black hover:text-white font-mono font-bold text-base sm:text-lg md:text-xl py-5 sm:py-6 md:py-7 px-8 sm:px-10 md:px-14 transition-all duration-300 ease-out w-full sm:w-auto min-h-[44px]"
            >
              COMECE A LUCRAR
            </Button>
          </motion.div>
        </motion.div>

        {/* Minimalist stats - No boxes */}
        <motion.div
          className="grid grid-cols-3 gap-4 sm:gap-8 md:gap-12 mt-16 md:mt-32"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.4, duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1.6, duration: 0.6 }}
          >
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-black counter-text mb-2 md:mb-3" style={{ letterSpacing: '-0.02em' }}>1000+</div>
            <div className="text-[0.6rem] sm:text-xs font-mono uppercase tracking-wider md:tracking-widest opacity-60">TRANSFORMADOS</div>
          </motion.div>
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1.7, duration: 0.6 }}
          >
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-black counter-text mb-2 md:mb-3" style={{ letterSpacing: '-0.02em' }}>R$ 50M</div>
            <div className="text-[0.6rem] sm:text-xs font-mono uppercase tracking-wider md:tracking-widest opacity-60">FATURADOS</div>
          </motion.div>
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1.8, duration: 0.6 }}
          >
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-black counter-text mb-2 md:mb-3" style={{ letterSpacing: '-0.02em' }}>0</div>
            <div className="text-[0.6rem] sm:text-xs font-mono uppercase tracking-wider md:tracking-widest opacity-60">ENROLAÇÃO</div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator - Animated vertical line */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="w-[1px] h-20 bg-black/20 overflow-hidden">
            <div className="w-full h-10 bg-black animate-slide-down"></div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </section>
  );
};

export default Hero;
