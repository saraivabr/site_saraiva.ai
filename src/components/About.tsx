
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const About = () => {
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

  return (
    <section 
      ref={sectionRef}
      id="sobre" 
      className="section-spacing bg-black text-white"
    >
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          {/* Contrarian text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-12 md:mb-20 leading-[0.95]" style={{ letterSpacing: '-0.03em' }}>
              EU NÃO<br/>
              ENSINO<br/>
              IA
            </h2>

            <div className="space-y-8 sm:space-y-12 md:space-y-16 text-base sm:text-lg md:text-xl lg:text-2xl font-medium leading-relaxed">
              {[
                { text: "Eu ensino você a", highlight: "PARAR DE TRABALHAR", after: "usando IA." },
                { text: "Eu ensino você a", highlight: "GANHAR DINHEIRO", after: "enquanto dorme." },
                { text: "Eu ensino você a", highlight: "DOMINAR MERCADOS", after: "sem competir." }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="pl-4 sm:pl-6 md:pl-8 border-l border-white/30"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                >
                  <p>
                    {item.text}{" "}
                    <motion.span
                      className="bg-white text-black px-2 sm:px-3 py-1 font-bold inline-block"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.highlight}
                    </motion.span>{" "}
                    {item.after}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Quote with giant quotation marks */}
            <motion.div
              className="mt-12 md:mt-20 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="absolute -top-8 sm:-top-12 md:-top-16 -left-4 sm:-left-6 md:-left-8 text-[8rem] sm:text-[10rem] md:text-[14rem] font-serif opacity-10 select-none" style={{ lineHeight: '0.6' }}>"</div>
              <div className="relative z-10 pl-8 sm:pl-10 md:pl-12">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight mb-3 md:mb-4">
                  Tem gente ganhando R$ 100k/mês<br/>
                  enquanto você assiste YouTube sobre IA.
                </p>
                <p className="text-right font-mono text-xs sm:text-sm opacity-70">— Saraiva</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Abstract placeholder - Black square */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 40 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="aspect-square bg-white/5 border border-white/10 relative overflow-hidden group"
              whileHover={{ boxShadow: "0 0 30px rgba(255,255,255,0.1)" }}
              transition={{ duration: 0.3 }}
            >
              {/* Abstract geometric pattern - multiple shapes */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-24 h-24 sm:w-32 sm:h-32 border border-white/20"
                  animate={{ rotate: 45 }}
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.8 }}
                />
                <motion.div
                  className="absolute w-16 h-16 sm:w-20 sm:h-20 border border-white/10"
                  animate={{ rotate: -45 }}
                  whileHover={{ rotate: -90, scale: 1.2 }}
                  transition={{ duration: 0.8 }}
                />
                <motion.div
                  className="absolute w-2 h-2 bg-white/30"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>

            {/* Minimalist label */}
            <motion.div
              className="border border-white/20 bg-black p-6 -mt-16 ml-8 relative z-10"
              initial={{ opacity: 0, y: 10 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-lg font-bold">SARAIVA</p>
              <p className="font-mono text-sm opacity-70">CEO • SARAIVA.AI</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Minimalist divider line */}
        <motion.div
          className="my-32 w-full h-[1px] bg-white/10"
          initial={{ scaleX: 0 }}
          animate={isVisible ? { scaleX: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          style={{ originX: 0 }}
        />

        {/* Stats section - Asymmetric layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <motion.div
              className="text-center md:text-left"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-3 md:mb-4 counter-text" style={{ letterSpacing: '-0.02em' }}>1000+</div>
              <div className="font-mono uppercase tracking-wider sm:tracking-widest text-xs sm:text-sm opacity-60">PESSOAS QUE PARARAM DE ESTUDAR</div>
            </motion.div>
            <motion.div
              className="text-center md:text-right"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-3 md:mb-4 counter-text" style={{ letterSpacing: '-0.02em' }}>R$ 50M+</div>
              <div className="font-mono uppercase tracking-wider sm:tracking-widest text-xs sm:text-sm opacity-60">GERADOS ENQUANTO DORMEM</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
