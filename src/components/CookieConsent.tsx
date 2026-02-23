import { useState, useEffect } from "react";

const STORAGE_KEY = "lgpd-consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-white/20 p-4 sm:p-6">
      <div className="container-max flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-mono text-xs sm:text-sm text-white/80 text-center sm:text-left">
          Este site utiliza cookies para melhorar sua experiencia. Ao continuar
          navegando, voce concorda com nossa{" "}
          <a href="#" className="underline hover:opacity-70 transition-opacity">
            Politica de Privacidade
          </a>
          .
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleAccept}
            className="font-mono text-xs sm:text-sm uppercase tracking-wider bg-white text-black px-5 py-2.5 hover:bg-white/90 transition-colors min-h-[44px]"
          >
            Aceitar
          </button>
          <button
            onClick={handleAccept}
            className="font-mono text-xs sm:text-sm uppercase tracking-wider border border-white/40 text-white px-5 py-2.5 hover:border-white/70 transition-colors min-h-[44px]"
          >
            Configurar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
