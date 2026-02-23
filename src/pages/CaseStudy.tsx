import { motion } from "framer-motion";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// Import case study images
import verve1 from "@/assets/verve-1.jpg";
import verve2 from "@/assets/verve-2.jpg";
import verve3 from "@/assets/verve-3.jpg";
import verve4 from "@/assets/verve-4.jpg";
import cove1 from "@/assets/cove-1.jpg";
import cove2 from "@/assets/cove-2.jpg";
import studio1 from "@/assets/studio-1.jpg";
import studio2 from "@/assets/studio-2.jpg";
import prompt1 from "@/assets/prompt-1.jpg";
import prompt2 from "@/assets/prompt-2.jpg";

interface CaseStudyProps {
  title: string;
  subtitle: string;
  year: string;
  role: string;
  duration: string;
  description: React.ReactNode;
  challenge?: React.ReactNode;
  solution?: React.ReactNode;
  link?: { text: string; url: string };
  images: string[];
}

const CaseStudyPage = ({ 
  title, 
  subtitle, 
  year,
  role,
  duration,
  description, 
  challenge,
  solution,
  link, 
  images 
}: CaseStudyProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="min-h-screen py-32 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-16"
          >
            <Link 
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium uppercase tracking-wide"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Link>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-6xl md:text-8xl lg:text-9xl text-foreground mb-8 leading-none uppercase"
          >
            {title}
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl md:text-2xl text-muted-foreground font-normal mb-16 leading-relaxed max-w-2xl"
          >
            {subtitle}
          </motion.p>

          {/* Project Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid grid-cols-3 gap-8 mb-16 pb-16 border-b border-border"
          >
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Year</p>
              <p className="text-base font-medium text-foreground">{year}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Role</p>
              <p className="text-base font-medium text-foreground">{role}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Duration</p>
              <p className="text-base font-medium text-foreground">{duration}</p>
            </div>
          </motion.div>
          
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-sm text-muted-foreground uppercase tracking-wide mb-4">Overview</h2>
            <div className="body-text text-lg leading-relaxed">
              {description}
            </div>
          </motion.div>

          {/* Challenge */}
          {challenge && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mb-16"
            >
              <h2 className="text-sm text-muted-foreground uppercase tracking-wide mb-4">The Challenge</h2>
              <div className="body-text text-lg leading-relaxed">
                {challenge}
              </div>
            </motion.div>
          )}

          {/* Solution */}
          {solution && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-16"
            >
              <h2 className="text-sm text-muted-foreground uppercase tracking-wide mb-4">The Solution</h2>
              <div className="body-text text-lg leading-relaxed">
                {solution}
              </div>
            </motion.div>
          )}
          
          {/* External Link */}
          {link && (
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent font-medium text-lg hover:underline mb-16"
            >
              {link.text}
              <ArrowUpRight className="w-5 h-5" />
            </motion.a>
          )}
          
          {/* Image Gallery */}
          <div className="my-16 flex flex-col gap-8">
            {images.map((src, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="w-full rounded-lg overflow-hidden border border-border"
              >
                <img 
                  src={src} 
                  alt={`${title} case study image ${index + 1}`}
                  className="w-full h-auto object-cover"
                />
              </motion.div>
            ))}
          </div>

          {/* Next Project */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="pt-16 border-t border-border text-center"
          >
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-4">Next Project</p>
            <Link 
              to="/"
              className="font-display text-3xl md:text-4xl text-foreground hover:text-accent transition-colors uppercase"
            >
              View All Projects
            </Link>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Verve Case Study
export const VerveCaseStudy = () => (
  <CaseStudyPage
    title="Verve"
    subtitle="Reimagining how creative teams collaborate, ideate, and ship design work together in real-time."
    year="2024"
    role="Design Director"
    duration="8 months"
    description={
      <>
        Verve approached me to lead the design of their next-generation collaborative design platform. The goal was clear: create a tool that feels as natural as pen and paper, but with the power of modern cloud infrastructure. Working with a team of 12 engineers and 3 product managers, I established the <span className="text-emphasis">visual language</span>, <span className="text-emphasis">interaction patterns</span>, and <span className="text-emphasis">design system</span> that would become the foundation of the product.
      </>
    }
    challenge={
      <>
        The existing market was dominated by tools that prioritized features over experience. Users felt overwhelmed by complex interfaces and disconnected workflows. Our research revealed that 73% of designers switch between 4+ tools daily, causing friction and breaking creative flow. We needed to consolidate these experiences without sacrificing power.
      </>
    }
    solution={
      <>
        I designed a unified workspace that adapts to the user's context. The interface reveals complexity progressively—beginners see a clean canvas while power users can access advanced features through keyboard shortcuts and contextual menus. We introduced <span className="text-emphasis">Smart Components</span>, a system that learns from team patterns and suggests design elements based on project context. The result was a 40% reduction in time-to-prototype and a 92% user satisfaction score in beta testing.
      </>
    }
    link={{ text: "verve.design", url: "https://verve.design" }}
    images={[verve1, verve2, verve3, verve4]}
  />
);

// Cove App Case Study
export const SpotifyCaseStudy = () => (
  <CaseStudyPage
    title="Cove"
    subtitle="A holistic wellness app that helps users build sustainable habits through personalized routines and mindful tracking."
    year="2023"
    role="Lead Product Designer"
    duration="12 months"
    description={
      <>
        Cove started as a simple habit tracker but evolved into a comprehensive wellness companion. I joined the founding team to define the product vision and lead design from concept to launch. The app now serves over 500,000 active users who rely on it for meditation, fitness tracking, sleep analysis, and daily habit building. My focus was on creating an experience that feels <span className="text-emphasis">encouraging rather than punishing</span>—a departure from typical fitness apps.
      </>
    }
    challenge={
      <>
        Most wellness apps fail because they rely on guilt and streaks to motivate users. When users miss a day, they feel discouraged and often abandon the app entirely. We needed to design a system that acknowledges life's unpredictability while still encouraging consistent healthy behaviors. Additionally, the app needed to feel personal without requiring hours of setup.
      </>
    }
    solution={
      <>
        I introduced <span className="text-emphasis">"Flexible Goals"</span>—a system that adjusts expectations based on user patterns and life events. Instead of rigid daily streaks, Cove celebrates weekly trends and personal bests. The onboarding flow uses conversational UI to understand user motivations without feeling like a questionnaire. We also designed <span className="text-emphasis">"Cove Insights"</span>, an AI-powered feature that connects patterns across sleep, exercise, and mood to provide actionable recommendations.
      </>
    }
    link={{ text: "getcove.app", url: "https://getcove.app" }}
    images={[cove1, cove2]}
  />
);

// Studio Site Case Study
export const FigmaCaseStudy = () => (
  <CaseStudyPage
    title="Studio"
    subtitle="A bold digital presence for a creative agency that wanted their website to feel like an experience, not a brochure."
    year="2022"
    role="Brand & Web Designer"
    duration="4 months"
    description={
      <>
        Studio Collective is a 30-person creative agency known for pushing boundaries in branding and experiential design. Their old website didn't reflect their innovative work—it was safe, expected, and forgettable. They challenged me to create a digital experience that would make potential clients say "I want whoever made this to work with us." The result was a website that generated 340% more qualified leads in its first quarter.
      </>
    }
    challenge={
      <>
        Creative agencies often fall into a trap: their websites look like every other agency's website. Minimalist grids, case study thumbnails, and "Let's talk" buttons. Studio wanted to stand out in a saturated market while still communicating professionalism. The site also needed to load fast and work flawlessly on mobile—no small feat for a visually ambitious design.
      </>
    }
    solution={
      <>
        I designed around the concept of <span className="text-emphasis">"controlled chaos"</span>—layouts that feel dynamic and unexpected but follow an underlying grid system. The homepage uses oversized typography and asymmetric image placement to create energy, while project pages shift to a calmer, more focused layout. I worked with developers to implement <span className="text-emphasis">smooth scroll animations</span> and <span className="text-emphasis">cursor interactions</span> that respond to user behavior. The entire site was optimized to achieve a 98 Lighthouse performance score.
      </>
    }
    link={{ text: "studiocollective.co", url: "https://studiocollective.co" }}
    images={[studio1, studio2]}
  />
);

// Prompt Case Study
export const NotionCaseStudy = () => (
  <CaseStudyPage
    title="Prompt"
    subtitle="An AI-powered writing assistant that helps creators overcome blank page syndrome and develop their unique voice."
    year="2021"
    role="Founding Designer"
    duration="18 months"
    description={
      <>
        Prompt was born from a simple observation: AI writing tools felt robotic and impersonal. They could generate text, but the output never sounded like the user. I co-founded Prompt with two engineers to build something different—an AI that learns your writing style and helps you write better, not replace you. We raised $2.4M in seed funding and grew to 80,000 users before being acquired in 2023.
      </>
    }
    challenge={
      <>
        Early AI writing tools had a fundamental problem: they produced generic content that could be spotted a mile away. Writers wanted assistance with ideation and editing, but they didn't want to lose their voice. We also faced a UX challenge—how do you integrate AI suggestions without disrupting the writing flow? Every interruption breaks concentration, and writers are notoriously protective of their process.
      </>
    }
    solution={
      <>
        I designed Prompt around the concept of an <span className="text-emphasis">"invisible assistant"</span>. Instead of showing suggestions inline, Prompt uses a <span className="text-emphasis">peripheral awareness system</span>—subtle visual cues that indicate help is available without demanding attention. Users can summon suggestions with a keyboard shortcut when they're ready. The AI learns from accepted and rejected suggestions, gradually adapting to each user's preferences. We also built a <span className="text-emphasis">"Voice Training"</span> feature where users can upload their existing writing to teach the AI their style.
      </>
    }
    link={{ text: "prompt.ai", url: "https://prompt.ai" }}
    images={[prompt1, prompt2]}
  />
);
