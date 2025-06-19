
import { Card, CardContent } from "@/components/ui/card";
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
      text: "O Saraiva não vende IA. O Saraiva vende tempo, dinheiro e liberdade.",
      author: "Marcus Silva",
      role: "Empresário - São Paulo",
      result: "Faturou R$ 180k no primeiro mês",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      bgColor: "from-purple-500 to-pink-500"
    },
    {
      text: "A mentoria virou a chave do meu negócio. Resultado em menos de 7 dias.",
      author: "Ana Carolina",
      role: "Consultora - Rio de Janeiro", 
      result: "Automatizou 80% dos processos",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      bgColor: "from-blue-500 to-cyan-500"
    },
    {
      text: "Enquanto outros estudam IA, eu já estou lucrando com ela. Obrigado, Saraiva!",
      author: "Roberto Mendes",
      role: "Empreendedor - Belo Horizonte",
      result: "3x mais vendas em 2 meses",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      bgColor: "from-green-500 to-emerald-500"
    },
    {
      text: "O Ligação.AI revolucionou minha empresa. Agora vendo dormindo.",
      author: "Camila Santos",
      role: "CEO - Brasília",
      result: "1.200% de ROI em 60 dias",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      bgColor: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      id="depoimentos" 
      className="section-spacing morphing-bg text-white relative overflow-hidden"
    >
      {/* Creative background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl floating-card"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-white/3 rounded-full blur-3xl floating-card" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="container-max relative z-10">
        {/* Title section */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'animate-zoom-in' : 'opacity-0 scale-75'}`}>
          <h2 className="text-5xl md:text-6xl font-black mb-8">
            Depoimentos e{" "}
            <span className="text-gradient">Provas Sociais</span>
          </h2>
          
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto mb-8">
            Resultados reais de pessoas que decidiram agir em vez de procrastinar.
          </p>
          
          <div className="flex justify-center space-x-4 mb-12">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  activeTestimonial === index 
                    ? 'bg-white scale-125' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Featured testimonial */}
        <div className={`mb-16 transition-all duration-1000 ${isVisible ? 'animate-slide-left' : 'opacity-0 translate-x-[-100px]'}`}>
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 bg-transparent relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-r ${testimonials[activeTestimonial].bgColor} opacity-10 rounded-3xl`}></div>
              <div className="absolute inset-0 glass-effect rounded-3xl"></div>
              
              <CardContent className="p-12 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Avatar */}
                  <div className="relative">
                    <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${testimonials[activeTestimonial].bgColor} p-1`}>
                      <img 
                        src={testimonials[activeTestimonial].avatar}
                        alt={testimonials[activeTestimonial].author}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold animate-pulse">
                      ✓
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 text-center md:text-left">
                    <blockquote className="text-2xl md:text-3xl font-bold mb-6 italic leading-relaxed text-white">
                      "{testimonials[activeTestimonial].text}"
                    </blockquote>
                    
                    <div className="space-y-2">
                      <div className="font-bold text-xl text-white">
                        {testimonials[activeTestimonial].author}
                      </div>
                      <div className="text-gray-300">
                        {testimonials[activeTestimonial].role}
                      </div>
                      <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${testimonials[activeTestimonial].bgColor} text-white font-bold text-sm`}>
                        ✅ {testimonials[activeTestimonial].result}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Grid of all testimonials */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`transition-all duration-1000 delay-${index * 100} ${
                isVisible ? 'animate-slide-right' : 'opacity-0 translate-x-[100px]'
              }`}
            >
              <Card className={`border-0 backdrop-blur-sm hover:scale-105 transition-all duration-300 cursor-pointer card-3d ${
                activeTestimonial === index ? 'ring-2 ring-white/50' : ''
              }`}
              onClick={() => setActiveTestimonial(index)}>
                <div className={`absolute inset-0 bg-gradient-to-r ${testimonial.bgColor} opacity-5 rounded-2xl`}></div>
                <div className="absolute inset-0 glass-effect rounded-2xl"></div>
                
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center space-x-4 mb-4">
                    <img 
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-bold text-white">{testimonial.author}</div>
                      <div className="text-gray-400 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                  
                  <blockquote className="text-gray-100 mb-4 italic">
                    "{testimonial.text}"
                  </blockquote>
                  
                  <div className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${testimonial.bgColor} text-white inline-block`}>
                    ✅ {testimonial.result}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        {/* Social proof section */}
        <div className={`text-center transition-all duration-1000 delay-1000 ${isVisible ? 'animate-zoom-in' : 'opacity-0 scale-75'}`}>
          <div className="glass-card rounded-3xl p-8 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex -space-x-3">
                {testimonials.map((testimonial, i) => (
                  <img
                    key={i}
                    src={testimonial.avatar}
                    alt=""
                    className="w-12 h-12 rounded-full border-2 border-white object-cover floating-card"
                    style={{animationDelay: `${i * 0.5}s`}}
                  />
                ))}
              </div>
              <div className="text-xl font-bold text-white">
                +1.000 pessoas transformadas
              </div>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl animate-pulse" style={{animationDelay: `${i * 0.2}s`}}>⭐</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
