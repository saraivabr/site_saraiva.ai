
const About = () => {
  return (
    <section id="sobre" className="section-spacing bg-white">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
              O mentor dos que dominam.{" "}
              <span className="text-red-600">O pesadelo dos que ficam pra trás.</span>
            </h2>
            
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p className="font-medium">
                <strong className="text-black">Eu não ensino IA.</strong> Eu ensino você a construir{" "}
                <strong className="text-black">máquinas de lucro</strong>, eliminar trabalho inútil e acelerar sua liberdade usando IA.
              </p>
              
              <p className="text-xl font-semibold text-black">
                Quem entende, escala. Quem não entende… trabalha pra quem entendeu.
              </p>
              
              <div className="border-l-4 border-black pl-6 my-8">
                <p className="text-lg italic text-gray-600">
                  "Não existe meio termo no mundo da IA. Ou você domina a tecnologia, ou ela domina você."
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-black text-black">1000+</div>
                  <div className="text-sm text-gray-600 font-medium">Pessoas Transformadas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-black">R$ 50M+</div>
                  <div className="text-sm text-gray-600 font-medium">Gerados pelos Clientes</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in">
            <div className="aspect-square bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl shadow-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=face" 
                alt="Saraiva - CEO"
                className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-black text-white p-4 rounded-xl shadow-lg">
              <p className="text-sm font-bold">CEO & Fundador</p>
              <p className="text-lg font-black">SARAIVA.AI</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
