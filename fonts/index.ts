import { Public_Sans, Syne, JetBrains_Mono } from "next/font/google";

export const publicSans = Public_Sans({
  subsets: ["latin"],
});

export const syne = Syne({
  variable: '--font-syne',
  subsets: ["latin"],
})

export const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ["latin"],
})