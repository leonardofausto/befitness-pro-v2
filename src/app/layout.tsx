import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "beFitness PRO",
  description: "Controle completo de peso e bem-estar na palma da sua mão.",
  icons: {
    icon: "/logo.ico",
    shortcut: "/logo.ico",
    apple: "/logo.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "beFitness PRO",
    description: "Controle completo de peso e bem-estar na palma da sua mão.",
    images: [{
      url: "https://befitness-pro-v2.vercel.app/logo.png",
      width: 1200,
      height: 630,
      alt: "beFitness PRO - Seu progresso em um só lugar"
    }],
    type: "website",
    siteName: "beFitness PRO",
    url: "https://befitness-pro-v2.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "beFitness PRO",
    description: "Controle completo de peso e bem-estar na palma da sua mão.",
    images: ["https://befitness-pro-v2.vercel.app/logo.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "beFitness PRO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider localization={ptBR}>
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
