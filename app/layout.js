import { Geist, Geist_Mono, VT323 } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vt323 = VT323({
  variable: "--font-pixel",
  weight: "400",
  subsets: ["latin"],
});

export const metadata = {
  title: "Flores para ti",
  description: "Un ramo nuevo cada mes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${vt323.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
