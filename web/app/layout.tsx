import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body className="min-h-screen bg-background">
        <ThemeProvider>
          <Header />
          {children}
          <Toaster
            richColors
            closeButton
            position="top-right"
            duration={1000}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
