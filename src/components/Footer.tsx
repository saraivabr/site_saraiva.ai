import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-sm font-bold text-foreground">
                Saraiva<span className="text-primary">.ai</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Sua livraria de IA. Ferramentas, prompts e recursos curados.
            </p>
          </div>

          {/* Explorar */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Explorar</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/explore" className="text-muted-foreground hover:text-foreground transition-colors">Todos os recursos</Link>
              <Link to="/ferramentas" className="text-muted-foreground hover:text-foreground transition-colors">Ferramentas</Link>
              <Link to="/prompts" className="text-muted-foreground hover:text-foreground transition-colors">Prompts</Link>
            </div>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Categorias</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/mcps" className="text-muted-foreground hover:text-foreground transition-colors">MCPs</Link>
              <Link to="/templates" className="text-muted-foreground hover:text-foreground transition-colors">Templates</Link>
              <Link to="/prompts" className="text-muted-foreground hover:text-foreground transition-colors">Prompts</Link>
              <Link to="/analises" className="text-muted-foreground hover:text-foreground transition-colors">Análises</Link>
              <Link to="/pensamentos" className="text-muted-foreground hover:text-foreground transition-colors">Pensamentos</Link>
            </div>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Contato</h4>
            <div className="flex flex-col gap-2 text-sm">
              <a
                href="https://wa.me/5511999999999?text=Oi%20Saraiva%2C%20quero%20saber%20mais%20sobre%20IA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                WhatsApp
              </a>
              <a
                href="https://github.com/saraivabr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground mono text-center">
            &copy; 2026 Saraiva.ai — Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
