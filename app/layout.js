import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/app/components/AuthProvider";
import SmoothScroll from "@/app/components/SmoothScroll";
import EliteCursor from "@/app/components/EliteCursor";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ChadFocus — Disiplin Takip Sistemi",
  description: "Disiplinini gorsellestir, serilerini takip et, potansiyelini ortaya cikar."
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFD700",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('cf-theme') || 'cyberpunk';
                document.documentElement.setAttribute('data-theme', theme);
              } catch(e) {}
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js');
              }
            })();
          `
        }} />
        <link rel="manifest" href="/manifest.json" crossOrigin="use-credentials" />
      </head>
      <body className="antialiased" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <AuthProvider>
          <EliteCursor />
          <SmoothScroll>
            <div className="noise-overlay pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay"></div>
            {children}
          </SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  );
}