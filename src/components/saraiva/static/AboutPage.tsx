import Link from "next/link";

const principles = [
  { number: "01", title: "Comece pelo desafio", text: "A pessoa não precisa aprender nossa arquitetura. Ela precisa explicar, em linguagem normal, o que quer conseguir." },
  { number: "02", title: "Construa durante o caminho", text: "Conhecimento aparece quando é necessário e imediatamente vira decisão, ação ou artefato." },
  { number: "03", title: "Termine com prova", text: "Uma boa resposta não basta. O desafio termina quando existe algo criado, decidido, aprendido ou resolvido." },
] as const;

export function AboutPage() {
  return (
    <main className="product-page">
      <section className="product-shell py-20 md:py-32">
        <span className="product-kicker">Sobre a Saraiva.AI</span>
        <h1 className="mt-7 max-w-5xl text-[clamp(3.8rem,9vw,8.5rem)] font-semibold leading-[.82] tracking-[-.078em]">IA deveria aumentar aquilo que você consegue <span className="text-[var(--product-blue)]">fazer.</span></h1>
        <p className="mt-10 max-w-2xl text-lg leading-8 text-[var(--product-muted)]">A Saraiva.AI é um ambiente de resolução de desafios. Ela entende o objetivo, cria um caminho, ensina o necessário e executa junto até existir um resultado.</p>
      </section>
      <section className="border-y border-[var(--product-line)] bg-white py-20 md:py-28">
        <div className="product-shell grid gap-px bg-[var(--product-line)] md:grid-cols-3">
          {principles.map((principle) => <article key={principle.number} className="min-h-80 bg-white p-8"><span className="font-mono text-[10px] font-bold text-[var(--product-blue)]">{principle.number}</span><h2 className="mt-24 text-3xl font-semibold tracking-[-.05em]">{principle.title}</h2><p className="mt-4 text-sm leading-6 text-[var(--product-muted)]">{principle.text}</p></article>)}
        </div>
      </section>
      <section className="product-shell py-20 md:py-28"><span className="product-kicker">Nossa promessa</span><h2 className="mt-5 max-w-4xl text-[clamp(3rem,7vw,7rem)] font-semibold leading-[.87] tracking-[-.075em]">Comece com um desafio. Termine com algo resolvido.</h2><Link href="/#novo" className="challenge-primary-button mt-10">Resolver meu desafio →</Link></section>
    </main>
  );
}
