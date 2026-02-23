import { motion } from "framer-motion";

interface EducationItem {
  degree: string;
  date: string;
  institution: string;
}

const education: EducationItem[] = [
  {
    degree: "Master of Fine Arts (M.F.A.)",
    date: "2010-2012",
    institution: "Rhode Island School of Design",
  },
  {
    degree: "Interaction Design",
    date: "2011-2012",
    institution: "Copenhagen Institute of Interaction Design",
  },
];

const EducationSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto px-8 py-24"
    >
      <h2 className="section-header">Education</h2>
      
      <div className="flex flex-col gap-8">
        {education.map((item, index) => (
          <motion.div
            key={item.degree}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-base font-semibold text-foreground">{item.degree}</span>
              <span className="text-sm text-text-muted font-medium">{item.date}</span>
            </div>
            <p className="text-sm text-text-tertiary font-medium">{item.institution}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default EducationSection;
