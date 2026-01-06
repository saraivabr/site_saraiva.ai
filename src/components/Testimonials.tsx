
import { useState, useEffect, useRef } from "react";

const Testimonials = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const testimonials = [
    {
      text: "Parei de estudar IA. Comecei a ganhar R$ 80k/mês com IA.",
      author: "Marcus Silva",
      role: "Ex-estudante de IA",
      result: "R$ 80.000/mês",
      before: "Estudava IA há 2 anos",
      after: "Lucra em 30 dias"
    },
    {
      text: "3 anos estudando. 7 dias com Saraiva = R$ 50k no primeiro mês.",
      author: "Ana Carolina", 
      role: "Ex-analista de dados",
      result: "R$ 50.000/mês",
      before: "3 anos estudando",
      after: "Rica em 7 dias"
    },
    {
      text: "Saí do YouTube. Entrei no mercado. Agora ganho mais que meu chefe.",
      author: "Roberto Mendes",
      role: "Ex-funcionário",
      result: "R$ 120.000/mês",
      before: "Assistia tutoriais",
      after: "Dono do próprio negócio"
    },
    {
      text: "Minha empresa vende sozinha. Eu durmo. Acordo com dinheiro na conta.",
      author: "Camila Santos",
      role: "Ex-workaholic",
      result: "R$ 200.000/mês",
      before: "Trabalhava 12h/dia",
      after: "Trabalha 2h/semana"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      id="depoimentos" 
      className="section-spacing bg-black text-white"
    >
      <div className="container-max">
        {/* Anti-social proof title */}
        <div className={`text-center mb-16 md:mb-24 transition-all duration-1000 ease-out ${isVisible ? 'fade-in-up' : ''}`}>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 md:mb-8 leading-[0.95]" style={{ letterSpacing: '-0.03em' }}>
            ELES PARARAM<br/>
            DE ESTUDAR
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium max-w-3xl mx-auto opacity-80 px-4" style={{ lineHeight: '1.6' }}>
            E começaram a ganhar mais que quem ainda estuda.
          </p>
        </div>
        
        {/* Giant quote display with typographic quotation marks */}
        <div className={`mb-12 md:mb-16 transition-all duration-1000 ease-out ${isVisible ? 'fade-in-up' : ''}`}>
          <div className="max-w-5xl mx-auto relative px-4">
            {/* Giant opening quotation mark */}
            <div className="absolute -top-8 sm:-top-12 md:-top-16 -left-4 sm:-left-6 md:-left-8 text-[8rem] sm:text-[10rem] md:text-[12rem] font-serif opacity-10 leading-none" style={{ lineHeight: '0.7' }} aria-hidden="true">"</div>
            
            <div className="border border-white/10 p-8 sm:p-12 md:p-16 bg-black relative z-10">
              <blockquote className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black mb-8 sm:mb-10 md:mb-12 leading-tight" style={{ letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                {testimonials[activeTestimonial].text}
              </blockquote>
              
              {/* Before/After with more impact */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 pt-6 sm:pt-8 border-t border-white/10">
                <div>
                  <div className="text-base sm:text-lg font-black mb-1">{testimonials[activeTestimonial].author}</div>
                  <div className="font-mono text-[0.65rem] sm:text-xs uppercase tracking-wider md:tracking-widest opacity-60">{testimonials[activeTestimonial].role}</div>
                </div>
                
                <div className="border-l-0 md:border-l border-white/20 pl-0 md:pl-8">
                  <div className="text-[0.65rem] sm:text-xs font-mono mb-2 uppercase tracking-wider md:tracking-widest opacity-40">ANTES:</div>
                  <div className="font-medium text-sm sm:text-base">{testimonials[activeTestimonial].before}</div>
                </div>
                
                <div className="border-l-0 md:border-l border-white/20 pl-0 md:pl-8">
                  <div className="text-[0.65rem] sm:text-xs font-mono mb-2 uppercase tracking-wider md:tracking-widest opacity-40">DEPOIS:</div>
                  <div className="font-black text-xl sm:text-2xl bg-white text-black px-3 sm:px-4 py-2 inline-block" style={{ letterSpacing: '-0.01em' }}>
                    {testimonials[activeTestimonial].result}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Giant closing quotation mark */}
            <div className="absolute -bottom-8 sm:-bottom-12 md:-bottom-16 -right-4 sm:-right-6 md:-right-8 text-[8rem] sm:text-[10rem] md:text-[12rem] font-serif opacity-10 leading-none rotate-180" style={{ lineHeight: '0.7' }} aria-hidden="true">"</div>
          </div>
        </div>

        {/* Minimalist dots navigation */}
        <div className="flex justify-center space-x-3 mb-20">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveTestimonial(index)}
              className={`transition-all duration-300 ease-out ${
                activeTestimonial === index 
                  ? 'w-12 h-2 bg-white' 
                  : 'w-2 h-2 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Social proof - single focused element */}
        <div className={`text-center transition-all duration-1000 ease-out delay-1000 ${isVisible ? 'fade-in-up' : ''}`}>
          <div className="border border-white/10 p-8 sm:p-10 md:p-12 max-w-3xl mx-auto bg-black">
            <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-3 md:mb-4 counter-text" style={{ letterSpacing: '-0.03em' }}>1000+</div>
            <div className="text-base sm:text-lg font-medium mb-4 sm:mb-6 opacity-80">PESSOAS QUE PARARAM DE ESTUDAR</div>
            <div className="text-4xl sm:text-5xl md:text-6xl font-black mb-2" style={{ letterSpacing: '-0.02em' }}>R$ 50.000.000</div>
            <div className="font-mono text-[0.65rem] sm:text-xs uppercase tracking-wider sm:tracking-widest opacity-60">FATURADOS PELOS EX-ESTUDANTES</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
