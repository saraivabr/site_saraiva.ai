import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Blocks, Package, Terminal, Server, Settings, Webhook, Home, LogIn, LogOut, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { to: "/", label: "Início", icon: Home },
  { to: "/directory/skills", label: "Skills", icon: Blocks },
  { to: "/directory/agents", label: "Agents", icon: Package },
  { to: "/directory/commands", label: "Commands", icon: Terminal },
  { to: "/directory/mcps", label: "MCPs", icon: Server },
  { to: "/directory/hooks", label: "Hooks", icon: Webhook },
  { to: "/directory/settings", label: "Settings", icon: Settings },
];

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, isLoggedIn, isPro, login, logout } = useAuth();

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
                className="h-10 w-auto"
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

            {/* Auth + Mobile */}
            <div className="flex items-center gap-2">
              {/* Auth buttons (desktop) */}
              <div className="hidden lg:flex items-center gap-2">
                {isLoggedIn ? (
                  <>
                    {isPro && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-400/15 text-amber-700">
                        PRO
                      </span>
                    )}
                    <div className="flex items-center gap-2 pl-2 border-l border-border">
                      {user?.avatar_url && (
                        <img src={user.avatar_url} alt="" className="w-6 h-6 rounded-full" />
                      )}
                      <span className="text-xs font-medium text-muted-foreground">{user?.username}</span>
                      <button
                        onClick={logout}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        title="Sair"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      to="/pricing"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-amber-700 hover:bg-amber-400/10 transition-all"
                    >
                      <Crown className="w-3.5 h-3.5" />
                      Pro
                    </Link>
                    <button
                      onClick={login}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-foreground text-white hover:bg-foreground/90 transition-all"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      Entrar
                    </button>
                  </>
                )}
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

              {/* Mobile auth */}
              <div className="mt-4 pt-4 border-t border-border">
                {isLoggedIn ? (
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      {user?.avatar_url && (
                        <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{user?.name || user?.username}</p>
                        {isPro && <span className="text-[10px] font-bold text-amber-700">PRO</span>}
                      </div>
                    </div>
                    <button onClick={() => { logout(); setMobileOpen(false); }} className="text-muted-foreground">
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/pricing"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-amber-400/10 text-amber-700"
                    >
                      <Crown className="w-4 h-4" />
                      Ver planos
                    </Link>
                    <button
                      onClick={() => { login(); setMobileOpen(false); }}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-foreground text-white"
                    >
                      <LogIn className="w-4 h-4" />
                      Entrar com GitHub
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="absolute bottom-12 left-6 right-6 text-center">
              <img src="/logo.png" alt="Saraiva.AI" className="h-10 mx-auto opacity-40" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
