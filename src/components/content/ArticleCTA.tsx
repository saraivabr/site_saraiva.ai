import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const ArticleCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`mt-12 p-8 sm:p-10 bg-black text-white transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <span className="font-mono text-[0.6rem] uppercase tracking-widest opacity-40 block mb-4">
        Mentoria
      </span>
      <h3
        className="text-xl sm:text-2xl md:text-3xl font-black mb-4 leading-tight"
        style={{ letterSpacing: '-0.03em' }}
      >
        Quer implementar isso no seu negocio?
      </h3>
      <p className="font-mono text-sm opacity-60 leading-relaxed mb-6 max-w-lg">
        Na mentoria Saraiva.AI voce aprende a transformar IA em operacao real — com acompanhamento individual e implementacao pratica.
      </p>
      <Button
        asChild
        className="bg-white text-black hover:bg-white/90 font-black py-5 sm:py-6 text-sm sm:text-base transition-all duration-300 min-h-[44px]"
        size="lg"
      >
        <a href="/#mentoria">CONHECER A MENTORIA</a>
      </Button>
    </div>
  );
};

export default ArticleCTA;
