import Image from "next/image";
import Link from "next/link";

const pillars = [
  { number: "01", title: "Entenda", text: "Curadoria editorial que traduz movimentos de IA sem transformar novidade em espetáculo." },
  { number: "02", title: "Construa", text: "Ferramentas e sistemas selecionados para sair da pesquisa e chegar a um fluxo funcional." },
  { number: "03", title: "Venda", text: "Aplicações orientadas a negócio, aquisição, atendimento e operação com prova observável." },
  { number: "04", title: "Implemente", text: "A Saraiva.AI conecta estratégia, software e automação no ambiente real da empresa." },
] as const;

export function AboutPage() {
  return (
    <main className="bg-[#f6f4ee] text-[#0a0b0f]">
      <section className="relative overflow-hidden bg-[#07090d] px-6 py-24 text-white md:py-32">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,133,254,0.22),transparent_38%)]" />
        <div className="relative mx-auto max-w-6xl">
          <Image src="/brand/saraiva-ai-logo.png" alt="Saraiva.AI" width={220} height={64} className="h-12 w-auto brightness-0 invert" priority />
          <p className="mt-12 text-xs font-bold uppercase tracking-[0.2em] text-[#66b7ff]">Sobre a Saraiva.AI</p>
          <h1 className="mt-5 max-w-5xl text-5xl font-semibold uppercase leading-[0.98] tracking-[-0.055em] md:text-7xl lg:text-8xl">Conhecimento de IA só vale quando vira capacidade.</h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-white/55">A Saraiva.AI é uma camada de curadoria, construção e implementação para pessoas e empresas que querem usar inteligência artificial com direção.</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid gap-6 md:grid-cols-2">
          {pillars.map((pillar) => <article key={pillar.number} className="rounded-3xl border border-black/8 bg-white p-8 md:p-10"><span className="text-5xl font-semibold tracking-[-0.06em] text-[#0085FE]">{pillar.number}</span><h2 className="mt-8 text-3xl font-semibold tracking-[-0.04em]">{pillar.title}</h2><p className="mt-3 max-w-lg leading-7 text-black/55">{pillar.text}</p></article>)}
        </div>
      </section>
      <section className="border-t border-black/10 px-6 py-20"><div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1fr_auto] md:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0085FE]">O que defendemos</p><h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.045em] md:text-6xl">Menos operação repetitiva. Mais direção humana.</h2></div><Link href="/#newsletter" className="rounded-full bg-[#0085FE] px-7 py-4 text-center text-sm font-bold text-white">Receber a curadoria</Link></div></section>
    </main>
  );
}
