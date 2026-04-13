import { Nunito_Sans, Roboto } from "next/font/google";

export const robotoFont = Roboto({
  subsets: ["latin"],
  weight: ["100", "400", "700"],
  display: "swap",
  variable: "--font-roboto",
});

export const nunitoSansFont = Nunito_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-display",
});
