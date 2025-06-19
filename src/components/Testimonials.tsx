
import { Card, CardContent } from "@/components/ui/card";

const Testimonials = () => {
  const testimonials = [
    {
      text: "O Saraiva não vende IA. O Saraiva vende tempo, dinheiro e liberdade.",
      author: "Marcus Silva",
      role: "Empresário - São Paulo",
      result: "Faturou R$ 180k no primeiro mês"
    },
    {
      text: "A mentoria virou a chave do meu negócio. Resultado em menos de 7 dias.",
      author: "Ana Carolina",
      role: "Consultora - Rio de Janeiro", 
      result: "Automatizou 80% dos processos"
    },
    {
      text: "Enquanto outros estudam IA, eu já estou lucrando com ela. Obrigado, Saraiva!",
      author: "Roberto Mendes",
      role: "Empreendedor - Belo Horizonte",
      result: "3x mais vendas em 2 meses"
    },
    {
      text: "O Ligação.AI revolucionou minha empresa. Agora vendo dormindo.",
      author: "Camila Santos",
      role: "CEO - Brasília",
      result: "1.200% de ROI em 60 dias"
    }
  ];

  return (
    <section id="depoimentos" className="section-spacing bg-black text-white">
      <div className="container-max">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Depoimentos e{" "}
            <span className="text-green-400">Provas Sociais</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Resultados reais de pessoas que decidiram agir em vez de procrastinar.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2 animate-fade-in">
              <CardContent className="p-8">
                <div className="text-3xl mb-4">💬</div>
                
                <blockquote className="text-lg mb-6 italic leading-relaxed text-gray-100">
                  "{testimonial.text}"
                </blockquote>
                
                <div className="border-t border-white/20 pt-6">
                  <div className="font-bold text-white text-lg">
                    {testimonial.author}
                  </div>
                  <div className="text-gray-400 text-sm mb-2">
                    {testimonial.role}
                  </div>
                  <div className="text-green-400 font-semibold text-sm">
                    ✅ {testimonial.result}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4">
            <div className="flex -space-x-2">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-white font-bold text-sm">
                  {i}
                </div>
              ))}
            </div>
            <div className="text-lg font-bold">
              +1.000 pessoas transformadas
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
