import { motion } from "framer-motion";
import { Mail, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";

const ContactSection = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const brTime = new Date().toLocaleTimeString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      });
      setTime(brTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto px-8 py-24"
    >
      <h2 className="section-header">Contato</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Links */}
        <div>
          <h3 className="text-base font-semibold text-foreground mb-6">Fale Conosco</h3>

          <div className="flex flex-col gap-1">
            <a
              href="mailto:contato@saraiva.ai"
              className="flex items-center gap-3 py-2 group"
            >
              <Mail className="w-5 h-5 text-muted-foreground" />
              <span className="text-[17px] text-muted-foreground font-medium group-hover:text-foreground transition-colors duration-200">
                contato@saraiva.ai
              </span>
            </a>

            <a
              href="https://saraiva.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 py-2 group"
            >
              <svg className="w-5 h-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              <span className="text-[17px] text-muted-foreground font-medium group-hover:text-foreground transition-colors duration-200 flex items-center gap-1">
                saraiva.ai
                <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-muted-foreground transition-colors duration-200" />
              </span>
            </a>
          </div>
        </div>

        {/* Location */}
        <div>
          <h3 className="text-base font-semibold text-foreground mb-6">Localização</h3>

          <p className="text-[17px] text-muted-foreground font-medium flex items-center gap-2">
            Brasil <span className="text-xl">🇧🇷</span>
          </p>
          <p className="text-[17px] text-text-tertiary font-medium mt-2">
            {time}
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactSection;
