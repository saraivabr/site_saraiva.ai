import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface ProjectItem {
  title: string;
  isAccent?: boolean;
  link?: string;
}

const projects: ProjectItem[] = [
  { title: "LET'S PLAY", link: "/verve" },
  { title: "COVE APP", link: "/spotify" },
  { title: "STUDIO SITE", link: "/figma" },
  { title: "WARHOL'S", isAccent: true },
  { title: "FACTORY", isAccent: true },
  { title: "PROMPT", link: "/notion" },
  { title: "THE ORB" },
  { title: "COMMERCIAL" },
  { title: "PORTFOLIO" },
];

const HeroSection = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 pt-24 pb-16 max-w-7xl mx-auto">
      <div className="flex flex-col items-center text-center gap-1 md:gap-0">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay: index * 0.05,
            }}
          >
            {project.link ? (
              <Link 
                to={project.link}
                className={`hero-title text-6xl sm:text-7xl md:text-8xl lg:text-9xl cursor-pointer transition-colors duration-200 block ${
                  project.isAccent 
                    ? 'text-accent hover:text-foreground italic' 
                    : 'text-foreground hover:text-accent'
                }`}
              >
                {project.title}
              </Link>
            ) : (
              <span
                className={`hero-title text-6xl sm:text-7xl md:text-8xl lg:text-9xl cursor-default block ${
                  project.isAccent 
                    ? 'text-accent italic' 
                    : 'text-foreground hover:text-accent transition-colors duration-200'
                }`}
              >
                {project.title}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
