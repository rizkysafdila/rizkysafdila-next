import type { Metadata } from "next";
import "@/styles/globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";
import { jetbrainsMono, plusJakartaSans, syne } from "@/fonts";
import { ShaderBackground } from "@/components/immersive/shader-background";
import { Logo } from "@/components/logo";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import LoadingScreen from "./loading";

export const metadata: Metadata = {
  title: "rizkysafdila | Software Engineer",
  description: "A modern portfolio page built with Nextjs and Shadcn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <link rel="icon" href="/favicon.svg" sizes="any" />
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          plusJakartaSans.className,
          syne.variable,
          jetbrainsMono.variable,
        )}
      >
        <Providers>
          <ShaderBackground />
          <Navbar />
          <main>
            <Suspense fallback={<LoadingScreen variant="dot-wave" />}>
              {children}
            </Suspense>
          </main>
          <footer className="overflow-hidden pt-8">
            <p className="mx-auto mb-4 max-w-5xl px-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              © {new Date().getFullYear()} Rizky Safdila
            </p>
            <Logo className="block w-full px-6 select-none whitespace-nowrap text-center text-[15vw] leading-none tracking-tighter opacity-50 mask-[linear-gradient(to_bottom,black,transparent)]" />
          </footer>
        </Providers>

        <Analytics />
      </body>
    </html>
  );
}
