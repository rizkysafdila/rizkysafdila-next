import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";


const publicSans = Public_Sans({
  subsets: ["latin"],
});

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
          "min-h-screen bg-background antialiased max-w-4xl mx-auto py-12 sm:py-24 px-6",
          publicSans.className,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
        >
          <main>{children}</main>
          <Navbar />
        </ThemeProvider>
      </body>
    </html>
  );
}
