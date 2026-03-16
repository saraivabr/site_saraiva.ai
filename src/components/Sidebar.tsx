import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const browseLinks = [
  { to: "/skills", label: "Skills", count: "698", icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
  )},
  { to: "/agents", label: "Agents", count: "412", icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><path d="M9 17h6"/><path d="M12 2v2"/></svg>
  )},
  { to: "/commands", label: "Commands", count: "283", icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
  )},
  { to: "/settings", label: "Settings", count: "67", icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
  )},
  { to: "/hooks", label: "Hooks", count: "51", icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
  )},
  { to: "/mcps", label: "MCPs", count: "67", icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1115.71 8h1.79a4.5 4.5 0 012.5 8.242"/><path d="M12 12v9"/><path d="M8 17l4 4 4-4"/></svg>
  )},
];

const resourceLinks = [
  { to: "/pricing", label: "Planos", icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
  )},
  { to: "https://github.com/saraivabr", label: "GitHub", external: true, icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
  )},
];

export default function Sidebar() {
  const location = useLocation();
  const { user, isLoggedIn, isPro, login, logout } = useAuth();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path) ||
           location.pathname.startsWith(`/directory/${path.slice(1)}`);
  };

  return (
    <aside className="hidden md:flex w-[220px] flex-col border-r border-[var(--color-border)] bg-surface-0 fixed inset-y-0 left-0 z-40">
      {/* Logo */}
      <div className="flex items-center px-3 h-14 border-b border-[var(--color-border)] shrink-0">
        <Link to="/" className="flex items-center gap-2 group w-full">
          <img
            src="/logo.png"
            alt="Saraiva.AI"
            className="w-[160px] h-auto"
            style={{ filter: "invert(1) brightness(2) sepia(1) saturate(5) hue-rotate(10deg)" }}
          />
          <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--color-surface-3)] text-[var(--color-text-tertiary)] shrink-0">Beta</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
        {/* Browse section */}
        <div className="px-2 py-2">
          <span className="text-[11px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-widest">Diretório</span>
        </div>

        {browseLinks.map((link) => (
          <Link
            key={link.to}
            to={`/directory${link.to}`}
            className={`relative flex items-center gap-2.5 px-2.5 py-[6px] rounded-md text-[13px] transition-colors group ${
              isActive(link.to)
                ? "text-[var(--color-text-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]"
            }`}
          >
            {isActive(link.to) && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute inset-0 bg-[var(--color-surface-2)] rounded-md"
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              />
            )}
            <span className={`relative z-10 w-4 h-4 shrink-0 ${
              isActive(link.to) ? "text-[var(--color-text-secondary)]" : "text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-secondary)]"
            }`}>
              {link.icon}
            </span>
            <span className="relative z-10 truncate">{link.label}</span>
            <span className="relative z-10 ml-auto text-[11px] tabular-nums text-[var(--color-text-tertiary)]">{link.count}</span>
          </Link>
        ))}

        {/* Divider */}
        <div className="my-3 mx-2 border-t border-[var(--color-border)]" />

        {/* Resources */}
        <div className="px-2 py-2">
          <span className="text-[11px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-widest">Recursos</span>
        </div>

        {resourceLinks.map((link) => (
          link.external ? (
            <a
              key={link.label}
              href={link.to}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-2.5 py-[6px] rounded-md text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] transition-colors group"
            >
              <span className="w-4 h-4 shrink-0 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-secondary)]">
                {link.icon}
              </span>
              <span>{link.label}</span>
              <svg className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
          ) : (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-2.5 px-2.5 py-[6px] rounded-md text-[13px] transition-colors group ${
                location.pathname === link.to
                  ? "text-[var(--color-text-primary)] bg-[var(--color-surface-2)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]"
              }`}
            >
              <span className="w-4 h-4 shrink-0 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-secondary)]">
                {link.icon}
              </span>
              <span>{link.label}</span>
            </Link>
          )
        ))}
      </nav>

      {/* Footer - Auth */}
      <div className="px-2 py-3 border-t border-[var(--color-border)] shrink-0">
        {isLoggedIn ? (
          <div className="flex items-center gap-2.5 px-2.5 py-1.5">
            {user?.avatar_url && (
              <img src={user.avatar_url} alt="" className="w-6 h-6 rounded-full" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-[var(--color-text-primary)] truncate">{user?.username}</p>
              {isPro && <span className="text-[9px] font-bold text-amber-400 uppercase">Pro</span>}
            </div>
            <button
              onClick={logout}
              className="p-1 rounded text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors"
              title="Sair"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/></svg>
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-md text-[13px] font-medium bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-hover)] hover:shadow-[0_0_12px_-2px_rgba(94,106,210,0.3)] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            Entrar com GitHub
          </button>
        )}
      </div>
    </aside>
  );
}
