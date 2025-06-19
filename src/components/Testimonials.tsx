
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
      }, 4000);
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
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'fade-in-up' : ''}`}>
          <h2 className="text-6xl md:text-7xl font-bold mb-8 leading-none">
            ELES PARARAM<br/>
            DE<br/>
            <span className="border-4 border-white p-4 inline-block">ESTUDAR</span>
          </h2>
          <p className="text-2xl font-bold max-w-3xl mx-auto">
            E começaram a ganhar mais que quem ainda estuda.
          </p>
        </div>
        
        {/* Brutal testimonial display */}
        <div className={`mb-16 transition-all duration-1000 ${isVisible ? 'fade-in-up' : ''}`}>
          <div className="max-w-4xl mx-auto">
            <div className="border-4 border-white p-12 bg-black">
              <blockquote className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
                "{testimonials[activeTestimonial].text}"
              </blockquote>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-lg font-bold">{testimonials[activeTestimonial].author}</div>
                  <div className="font-mono text-sm">{testimonials[activeTestimonial].role}</div>
                </div>
                
                <div className="border-l-0 md:border-l-2 border-white pl-0 md:pl-8">
                  <div className="text-sm font-mono mb-1">ANTES:</div>
                  <div className="font-bold">{testimonials[activeTestimonial].before}</div>
                </div>
                
                <div className="border-l-0 md:border-l-2 border-white pl-0 md:pl-8">
                  <div className="text-sm font-mono mb-1">DEPOIS:</div>
                  <div className="font-bold text-white bg-white text-black px-2 py-1">
                    {testimonials[activeTestimonial].result}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`transition-all duration-1000 delay-${index * 100} ${
                isVisible ? 'fade-in-up' : ''
              }`}
            >
              <div className={`minimal-card cursor-pointer ${
                activeTestimonial === index ? 'bg-black text-white border-white' : ''
              }`}
              onClick={() => setActiveTestimonial(index)}>
                <blockquote className="text-lg mb-4 font-bold">
                  "{testimonial.text}"
                </blockquote>
                
                <div className="flex justify-between items-end">
                  <div>
                    <div className="font-bold">{testimonial.author}</div>
                    <div className="font-mono text-sm">{testimonial.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{testimonial.result}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Brutal social proof */}
        <div className={`text-center transition-all duration-1000 delay-1000 ${isVisible ? 'fade-in-up' : ''}`}>
          <div className="border-4 border-white p-8 max-w-3xl mx-auto bg-black">
            <div className="text-6xl font-bold mb-4 counter-text">1000+</div>
            <div className="text-xl font-bold mb-4">PESSOAS QUE PARARAM DE ESTUDAR</div>
            <div className="text-4xl font-bold">R$ 50.000.000</div>
            <div className="font-mono text-sm mt-2">FATURADOS PELOS EX-ESTUDANTES</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
