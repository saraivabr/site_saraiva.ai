import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Blocks, Package, Terminal, Server, Settings, Sparkles, Webhook, Zap } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const typeCards = [
  { type: "skills", label: "Skills", desc: "Habilidades especializadas para Claude Code", icon: Blocks, color: "bg-violet-500" },
  { type: "agents", label: "Agents", desc: "Agentes autônomos para tarefas complexas", icon: Package, color: "bg-blue-500" },
  { type: "commands", label: "Commands", desc: "Comandos slash para workflows", icon: Terminal, color: "bg-green-500" },
  { type: "mcps", label: "MCPs", desc: "Servidores MCP para estender capacidades", icon: Server, color: "bg-teal-500" },
  { type: "settings", label: "Settings", desc: "Configurações otimizadas", icon: Settings, color: "bg-pink-500" },
  { type: "hooks", label: "Hooks", desc: "Hooks para automação de eventos", icon: Webhook, color: "bg-orange-500" },
];

export default function Home() {
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await fetch("/api/stats");
      return res.json() as Promise<Record<string, number>>;
    },
  });

  const { data: featuredItems = [] } = useQuery({
    queryKey: ["featured"],
    queryFn: async () => {
      const types = ["mcps", "skills", "agents"];
      const results = await Promise.all(
        types.map(async (t) => {
          const res = await fetch(`/api/${t}`);
          const items = await res.json();
          return items.slice(0, 3).map((i: any) => ({ ...i, _type: t }));
        })
      );
      return results.flat().slice(0, 6);
    },
  });

  const totalItems = stats ? Object.values(stats).reduce((a, b) => a + b, 0) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SEOHead />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 text-sm font-medium text-foreground mb-8">
              <Zap className="w-4 h-4" />
              {totalItems > 0 ? `${totalItems.toLocaleString()}+ componentes` : "Biblioteca curada"}
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[0.9] mb-6">
              Sua livraria de
              <br />
              <span className="text-primary">Inteligência Artificial</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Skills, agents, MCPs e comandos curados para Claude Code.
              Monte seu stack ideal e comece a criar.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/directory/skills"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-white rounded-full font-semibold hover:bg-foreground/90 transition-all hover:scale-[1.02]"
              >
                Explorar Diretório
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/directory/mcps"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-border rounded-full font-semibold hover:bg-secondary transition-all"
              >
                Ver MCPs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      {stats && (
        <section className="border-y border-border bg-foreground text-white py-6 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {typeCards.map(({ type, label, icon: Icon }) => (
                <Link
                  key={type}
                  to={`/directory/${type}`}
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-2xl font-bold text-white">{stats[type]?.toLocaleString() || 0}</span>
                  <span className="text-sm">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Items */}
      {featuredItems.length > 0 && (
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-8"
            >
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-1">Destaques</h2>
                <p className="text-sm text-muted-foreground">Os componentes mais populares da comunidade</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredItems.map((item: any, i: number) => (
                <motion.div
                  key={item.slug}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    to={`/directory/${item._type}/${item.slug}`}
                    className="group block p-5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0">
                        <span className="text-white text-sm font-bold">
                          {item.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        <span className="text-[10px] font-medium text-muted-foreground uppercase">
                          {item._type}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.description_pt || item.description}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Directory Cards */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore por categoria
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Componentes prontos para uso, curados e organizados por tipo
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {typeCards.map(({ type, label, desc, icon: Icon, color }, i) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/directory/${type}`}
                  className="group block p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {label}
                    </h3>
                    <span className="text-sm font-bold text-primary mono">
                      {stats?.[type] || "—"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Explorar <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 md:px-12 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-14">
              Como funciona
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Explore", desc: "Navegue por 1.500+ skills, agents e MCPs organizados por categoria" },
              { step: "02", title: "Monte seu Stack", desc: "Selecione os componentes que precisa e monte sua configuração ideal" },
              { step: "03", title: "Instale com 1 clique", desc: "Copie o comando de instalação e configure tudo direto no Claude Code" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-full bg-primary text-foreground font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 md:px-12 bg-foreground text-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para criar com IA?
            </h2>
            <p className="text-lg text-white/70 mb-10">
              Explore nossa biblioteca e monte o stack perfeito para seus projetos.
            </p>
            <Link
              to="/directory/skills"
              className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-foreground rounded-full font-bold text-lg hover:bg-primary/90 transition-all hover:scale-[1.02]"
            >
              Começar agora
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
