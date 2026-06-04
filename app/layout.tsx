import type { Metadata } from "next";
import "@/styles/globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";
import { publicSans, syne } from "@/fonts";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { Logo } from "@/components/logo";
import { Analytics } from "@vercel/analytics/next";

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
          publicSans.className,
          syne.variable,
        )}
      >
        <DotPattern
          className={cn(
            "fixed inset-0 z-[-1]",
            "mask-[radial-gradient(600px_circle_at_center,white,transparent)]"
          )}
        />
        <Providers>
          <div className="max-w-lg lg:max-w-5xl mx-auto py-12 sm:py-24 px-6">
            <Navbar />
            <main>{children}</main>
            <footer className="-mb-12 mt-16 sm:-mb-24 md:hidden">
              <Logo className="block w-full select-none whitespace-nowrap text-center text-[15vw] leading-none tracking-tighter opacity-50 mask-[linear-gradient(to_bottom,black,transparent)]" />
            </footer>
          </div>
        </Providers>

        <Analytics />
      </body>
    </html>
  );
}
