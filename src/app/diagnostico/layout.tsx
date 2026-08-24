import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diagnóstico operacional",
  description:
    "Oito perguntas para localizar onde sua operação perde vendas, tempo ou controle. Resultado imediato, sem cadastro.",
  alternates: { canonical: "/diagnostico" },
};

export default function DiagnosticoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
