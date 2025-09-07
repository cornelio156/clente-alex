import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { PaymentProofProvider } from "@/context/PaymentProofContext";

export const metadata: Metadata = {
  title: "content exclusive",
  description: "Exclusive premium content. Access via Telegram.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <SiteConfigProvider>
          <PaymentProofProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </PaymentProofProvider>
        </SiteConfigProvider>
      </body>
    </html>
  );
}
