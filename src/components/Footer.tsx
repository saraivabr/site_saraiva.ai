import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-foreground text-white py-14 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <img src="/logo.png" alt="Saraiva.AI" className="h-12 mb-4 brightness-0 invert" />
            <p className="text-sm text-white/60 leading-relaxed">
              Sua livraria de IA. Skills, agents, MCPs e recursos curados para Claude Code.
            </p>
          </div>

          {/* Diretório */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Diretório</h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link to="/directory/skills" className="text-white/60 hover:text-white transition-colors">Skills</Link>
              <Link to="/directory/agents" className="text-white/60 hover:text-white transition-colors">Agents</Link>
              <Link to="/directory/commands" className="text-white/60 hover:text-white transition-colors">Commands</Link>
              <Link to="/directory/mcps" className="text-white/60 hover:text-white transition-colors">MCPs</Link>
              <Link to="/directory/hooks" className="text-white/60 hover:text-white transition-colors">Hooks</Link>
              <Link to="/directory/settings" className="text-white/60 hover:text-white transition-colors">Settings</Link>
            </div>
          </div>

          {/* Sobre */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Sobre</h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link to="/pricing" className="text-white/60 hover:text-white transition-colors">Planos</Link>
              <Link to="/directory/hooks" className="text-white/60 hover:text-white transition-colors">Hooks</Link>
              <Link to="/directory/settings" className="text-white/60 hover:text-white transition-colors">Settings</Link>
            </div>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contato</h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <a
                href="https://wa.me/5511999999999?text=Oi%20Saraiva%2C%20quero%20saber%20mais%20sobre%20IA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
              >
                WhatsApp
              </a>
              <a
                href="https://github.com/saraivabr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10">
          <p className="text-xs text-white/40 mono text-center">
            &copy; 2026 Saraiva.AI — Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
