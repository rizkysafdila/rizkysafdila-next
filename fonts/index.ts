import { Syne, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";

export const plusJakartaSans = Plus_Jakarta_Sans({
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