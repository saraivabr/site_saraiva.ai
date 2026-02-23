import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto px-8 py-24"
    >
      <h2 className="section-header">About</h2>
      
      <div className="flex flex-col gap-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="body-text"
        >
          Over a decade of experience crafting digital products, brands and experiences that are used by millions of people every day.
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="body-text"
        >
          Embracing growth, I continually combine extensive experience in{" "}
          <span className="text-emphasis">Product</span>,{" "}
          <span className="text-emphasis">Motion</span>,{" "}
          <span className="text-emphasis">Sound</span> and{" "}
          <span className="text-emphasis">Brand</span>-Design
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="body-text"
        >
          I am dedicated to shaping a better future through Design. My approach always puts people first — from clients to users.
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="body-text italic"
        >
          Curious and optimistic.
        </motion.p>
      </div>
    </motion.section>
  );
};

export default AboutSection;
