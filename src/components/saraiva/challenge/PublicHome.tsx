import { ArrowDown, Check, MoveRight } from "lucide-react";

import { ChallengeStartForm } from "./ChallengeStartForm";
import { ProductHeader } from "./ProductHeader";

const stages = [
  { number: "01", title: "Entender", text: "A IA interpreta o que você realmente quer conseguir antes de propor qualquer coisa." },
  { number: "02", title: "Construir", text: "Você recebe o próximo passo, aprende o necessário e produz algo útil durante o caminho." },
  { number: "03", title: "Comprovar", text: "O desafio só termina quando existe um resultado que você consegue mostrar ou verificar." },
];

export function PublicHome() {
  return (
    <div className="product-page min-h-screen">
      <ProductHeader />
      <main>
        <section id="novo" className="product-hero">
          <div className="product-shell">
            <div className="product-eyebrow"><span /> Ambiente de resolução com IA</div>
            <h1>O que você quer <em>resolver?</em></h1>
            <p className="product-hero-copy">Comece com algo que importa. A Saraiva.AI entende o desafio, cria um caminho e executa junto até existir um resultado.</p>
            <ChallengeStartForm />
            <a href="#como-funciona" className="product-scroll-cue">
              Entenda em 30 segundos <ArrowDown className="size-4" aria-hidden="true" />
            </a>
          </div>
        </section>

        <section id="como-funciona" className="product-how">
          <div className="product-shell">
            <div className="product-section-heading">
              <span className="product-kicker">Do desafio ao resultado</span>
              <h2>A IA não entrega apenas uma resposta. <span>Ela conduz.</span></h2>
            </div>
            <div className="product-stage-grid">
              {stages.map((stage) => (
                <article key={stage.number} className="product-stage-card">
                  <span>{stage.number}</span>
                  <div>
                    <h3>{stage.title}</h3>
                    <p>{stage.text}</p>
                  </div>
                  <Check className="size-5" aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="product-promise">
          <div className="product-shell">
            <span className="product-kicker">A promessa</span>
            <p>“Eu não sei como fazer isso.”</p>
            <MoveRight className="product-promise-arrow" aria-hidden="true" />
            <p className="product-promise-result">“Eu consegui fazer.”</p>
          </div>
        </section>

        <section className="product-final-cta">
          <div className="product-shell">
            <div>
              <span className="product-kicker">Sua próxima conquista começa aqui</span>
              <h2>Comece com um desafio.<br />Termine com algo resolvido.</h2>
            </div>
            <ChallengeStartForm compact />
          </div>
        </section>
      </main>
      <footer className="product-footer">
        <div className="product-shell">
          <span className="product-logo">saraiva<span>.ai</span></span>
          <p>Inteligência artificial para aumentar aquilo que você consegue fazer.</p>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
}
