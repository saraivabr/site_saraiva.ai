
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const CTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleWhatsApp = () => {
    window.open('https://wa.me/5511999999999?text=Quero parar de estudar e começar a lucrar AGORA.', '_blank');
  };

  const scrollToMentoria = () => {
    const element = document.getElementById('mentoria');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="section-spacing bg-black text-white relative overflow-hidden"
    >
      {/* Background animation */}
      <motion.div
        className="absolute inset-0 opacity-5"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <div className="container-max text-center relative z-10">
        {/* Powerful single message */}
        <motion.div
          className="mb-12 md:mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[10rem] font-black mb-8 sm:mb-10 md:mb-12 leading-[0.9]" style={{ letterSpacing: '-0.04em' }}>
            <motion.span
              className="block"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              ÚLTIMA
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              CHANCE
            </motion.span>
          </h2>

          <motion.p
            className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-medium max-w-4xl mx-auto leading-relaxed opacity-90 px-4"
            style={{ lineHeight: '1.5' }}
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Você pode continuar estudando para sempre.<br className="hidden sm:block"/>
            Ou pode{" "}
            <motion.span
              className="bg-white text-black px-3 sm:px-4 py-1 sm:py-2 font-bold inline-block mt-2 sm:mt-0"
              whileHover={{ scale: 1.08, boxShadow: "0 10px 20px rgba(255,255,255,0.2)" }}
              transition={{ duration: 0.3 }}
            >
              começar a lucrar hoje.
            </motion.span>
          </motion.p>
        </motion.div>

        {/* Only 2 large buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <motion.div
            className="w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={scrollToMentoria}
              className="bg-white text-black hover:opacity-90 font-black text-lg sm:text-xl md:text-2xl py-6 sm:py-7 md:py-8 px-10 sm:px-12 md:px-16 transition-all duration-300 ease-out w-full sm:w-auto min-h-[44px] shadow-lg"
            >
              PARAR DE ESTUDAR
            </Button>
          </motion.div>

          <motion.div
            className="w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleWhatsApp}
              className="bg-transparent text-white border border-white hover:bg-white hover:text-black font-black text-lg sm:text-xl md:text-2xl py-6 sm:py-7 md:py-8 px-10 sm:px-12 md:px-16 transition-all duration-300 ease-out w-full sm:w-auto min-h-[44px]"
            >
              COMEÇAR A LUCRAR
            </Button>
          </motion.div>
        </motion.div>

        {/* Final truth - simplified */}
        <motion.p
          className="text-base sm:text-lg md:text-xl font-mono opacity-50 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 0.5 } : {}}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          Seus concorrentes já pararam de estudar. Eles já estão lucrando.
        </motion.p>
      </div>
    </section>
  );
};

export default CTA;
