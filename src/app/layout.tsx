import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BelesPrivacy - Cursos de Protección de Datos",
  description: "Plataforma de aprendizaje especializada en protección de datos personales, privacidad y cumplimiento normativo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <LanguageProvider>
          <AuthProvider>
            <div className="min-h-screen bg-white">
              <Navbar />
              <main>{children}</main>
              <Toaster position="top-right" richColors />
            </div>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
