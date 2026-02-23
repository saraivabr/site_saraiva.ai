import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ExperienceItem {
  company: string;
  date: string;
  role: string;
  iconGradient: string;
  link?: string;
}

const experiences: ExperienceItem[] = [
  {
    company: "Verve",
    date: "2024-Present",
    role: "Design Director",
    iconGradient: "from-violet-500 to-purple-600",
    link: "/verve",
  },
  {
    company: "Spotify",
    date: "2020-2024",
    role: "Staff Designer",
    iconGradient: "from-green-500 to-emerald-600",
    link: "/spotify",
  },
  {
    company: "Figma",
    date: "2016-2020",
    role: "Senior Designer",
    iconGradient: "from-orange-500 to-red-500",
    link: "/figma",
  },
  {
    company: "Notion",
    date: "2012-2016",
    role: "Senior Designer",
    iconGradient: "from-neutral-600 to-neutral-800",
    link: "/notion",
  },
];

const personalProjects: ExperienceItem[] = [
  {
    company: "Explorations + Motion",
    date: "",
    role: "",
    iconGradient: "from-pink-500 via-blue-500 to-cyan-400",
  },
];

const ExperienceCard = ({ item }: { item: ExperienceItem }) => {
  const CardContent = (
    <>
      {/* Company Icon */}
      <div 
        className={`w-9 h-9 rounded border border-foreground/10 flex-shrink-0 bg-gradient-to-br ${item.iconGradient}`}
      />
      
      {/* Content */}
      <div className="flex-1 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold text-foreground">{item.company}</span>
          {(item.date || item.role) && (
            <div className="flex items-center gap-2 text-sm">
              {item.date && <span className="text-text-muted font-medium">{item.date}</span>}
              {item.date && item.role && <span className="text-text-muted">·</span>}
              {item.role && <span className="text-text-tertiary font-medium">{item.role}</span>}
            </div>
          )}
        </div>
        
        {/* Arrow */}
        <ArrowRight className="w-5 h-5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>
    </>
  );

  if (item.link) {
    return (
      <Link to={item.link} className="experience-card">
        {CardContent}
      </Link>
    );
  }

  return (
    <div className="experience-card">
      {CardContent}
    </div>
  );
};

const ExperienceSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto px-8 py-24"
    >
      {/* Work Experience */}
      <h2 className="section-header">Experience</h2>
      <div className="flex flex-col gap-2 mb-16">
        {experiences.map((item, index) => (
          <motion.div
            key={item.company}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <ExperienceCard item={item} />
          </motion.div>
        ))}
      </div>

      {/* Personal Projects */}
      <h2 className="section-header">Personal Projects</h2>
      <div className="flex flex-col gap-2">
        {personalProjects.map((item, index) => (
          <motion.div
            key={item.company}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <ExperienceCard item={item} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default ExperienceSection;
