import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Blocks, Package, Terminal, Server, Settings, Webhook, Compass, Home } from "lucide-react";

const navLinks = [
  { to: "/", label: "Início", icon: Home },
  { to: "/directory/skills", label: "Skills", icon: Blocks },
  { to: "/directory/agents", label: "Agents", icon: Package },
  { to: "/directory/commands", label: "Commands", icon: Terminal },
  { to: "/directory/mcps", label: "MCPs", icon: Server },
  { to: "/explore", label: "Explorar", icon: Compass },
];

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 nav-blur">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <img
                src="/logo.png"
                alt="Saraiva.AI"
                className="h-8 w-auto"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to ||
                  (link.to !== "/" && location.pathname.startsWith(link.to));
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-foreground bg-primary/15"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <link.icon className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white/98 backdrop-blur-xl pt-20 px-6"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link, i) => {
                const isActive = location.pathname === link.to ||
                  (link.to !== "/" && location.pathname.startsWith(link.to));
                return (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-4 rounded-xl text-lg font-medium transition-all ${
                        isActive
                          ? "text-foreground bg-primary/15"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div className="absolute bottom-12 left-6 right-6 text-center">
              <img src="/logo.png" alt="Saraiva.AI" className="h-6 mx-auto opacity-40" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
