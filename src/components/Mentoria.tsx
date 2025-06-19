
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Mentoria = () => {
  const handleWhatsApp = () => {
    window.open('https://wa.me/5511999999999?text=Olá! Quero me inscrever na mentoria de IA!', '_blank');
  };

  const benefits = [
    "Acesso direto ao Saraiva por 90 dias",
    "Método step-by-step para lucrar com IA",
    "Ferramentas e automações prontas",
    "Grupo VIP com outros alunos",
    "Cases reais e estratégias testadas",
    "Certificado de conclusão"
  ];

  return (
    <section id="mentoria" className="section-spacing bg-white">
      <div className="container-max">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Mentoria{" "}
            <span className="text-green-600">Saraiva.AI</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            O único programa que te ensina a transformar IA em uma máquina de fazer dinheiro.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in">
            <div className="bg-black text-white p-8 rounded-2xl shadow-2xl">
              <div className="text-center mb-8">
                <div className="text-6xl font-black mb-4">
                  R$ 2.997
                </div>
                <div className="text-lg text-gray-300 line-through mb-2">
                  De R$ 9.997
                </div>
                <div className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold inline-block">
                  PROMOÇÃO LIMITADA
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="text-green-400 text-xl">✅</div>
                    <div className="text-gray-100">{benefit}</div>
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={handleWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-lg rounded-xl animate-pulse-strong"
                size="lg"
              >
                QUERO MINHA VAGA AGORA
              </Button>
              
              <div className="text-center mt-4 text-sm text-gray-400">
                🔒 Pagamento 100% Seguro • Garantia de 7 dias
              </div>
            </div>
          </div>
          
          <div className="space-y-8 animate-fade-in">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-2xl mb-3">🎯</div>
                <h3 className="text-xl font-bold mb-3">Módulo 1: Fundamentos</h3>
                <p className="text-gray-600">Domine os conceitos essenciais e prepare sua mente para o sucesso com IA.</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-2xl mb-3">💰</div>
                <h3 className="text-xl font-bold mb-3">Módulo 2: Monetização</h3>
                <p className="text-gray-600">Estratégias práticas para gerar os primeiros R$ 10.000 com IA.</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-2xl mb-3">🚀</div>
                <h3 className="text-xl font-bold mb-3">Módulo 3: Escala</h3>
                <p className="text-gray-600">Como transformar seu negócio em uma máquina automatizada de lucro.</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="text-center mt-16">
          <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-6 max-w-2xl mx-auto">
            <div className="text-2xl mb-2">⏰</div>
            <div className="font-bold text-lg mb-2">ATENÇÃO: Vagas Limitadas!</div>
            <div className="text-gray-700">Apenas 50 vagas disponíveis nesta turma. Não perca sua chance!</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mentoria;
