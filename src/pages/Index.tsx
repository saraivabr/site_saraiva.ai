
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ScrollHero from "@/components/ScrollHero";
import About from "@/components/About";
import Products from "@/components/Products";
import Mentoria from "@/components/Mentoria";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <ScrollHero />
      <About />
      <Products />
      <Mentoria />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
