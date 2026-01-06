import { motion } from "framer-motion";

const Footer = () => {
  const handleWhatsApp = () => {
    window.open('https://wa.me/5511999999999', '_blank');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-black text-white py-12 sm:py-14 md:py-16 border-t border-white/10 overflow-hidden">
      <div className="container-max">
        {/* Logo and tagline */}
        <motion.div
          className="text-center mb-8 sm:mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="font-black text-xl sm:text-2xl mb-2 sm:mb-3 font-mono"
            style={{ letterSpacing: '-0.01em' }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            SARAIVA.AI
          </motion.div>
          <p className="font-mono text-xs sm:text-sm opacity-60">
            Pare de estudar. Comece a lucrar.
          </p>
        </motion.div>

        {/* Links in single line - no separators */}
        <motion.div
          className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-10 mb-8 sm:mb-10 md:mb-12 text-xs sm:text-sm font-mono px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {[
            { label: "Sobre", action: () => scrollToSection('sobre') },
            { label: "Produtos", action: () => scrollToSection('produtos') },
            { label: "Mentoria", action: () => scrollToSection('mentoria') },
            { label: "Contato", action: handleWhatsApp },
            { label: "Termos", action: () => {} },
            { label: "Privacidade", action: () => {} },
          ].map((item, index) => (
            <motion.button
              key={index}
              onClick={item.action}
              className="hover:opacity-100 opacity-60 transition-opacity duration-300 ease-out uppercase tracking-widest min-h-[44px] flex items-center text-[0.65rem] sm:text-xs"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.6 }}
              whileHover={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              {item.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Discreet copyright */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="font-mono text-[0.65rem] sm:text-xs opacity-40">
            © 2025 SARAIVA.AI
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
