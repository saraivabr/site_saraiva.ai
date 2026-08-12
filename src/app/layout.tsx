import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://saraiva.ai"),
  title: "Saraiva.AI is coming.",
  description: "Saraiva.AI is coming.",
  authors: [{ name: "Saraiva.AI" }],
  icons: { icon: "/brand/favicon.png", apple: "/brand/favicon.png" },
  openGraph: { title: "Saraiva.AI is coming.", description: "Saraiva.AI is coming.", type: "website", locale: "pt_BR", siteName: "Saraiva.AI", url: "https://saraiva.ai" },
  twitter: { card: "summary", title: "Saraiva.AI is coming.", description: "Saraiva.AI is coming." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" className="h-full antialiased"><body className="min-h-full">{children}</body></html>;
}
