import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Cormorant_Garamond, Montserrat } from 'next/font/google';
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from '../app/context/CartContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-montserrat',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Acomódate Muebles",
  description: "Hecho para acomodarse a ti",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${montserrat.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
    <body className="min-h-full flex flex-col bg-[#FDFBF7] text-[#1A1A1A]">
        {/* El Navbar se queda aquí para que aparezca en todo el sitio web */}
        <CartProvider> <Navbar />
        
        {/* AQUÍ ES DONDE NEXT.JS RENDERIZARÁ CADA PÁGINA (HOME, CATEGORÍAS, PRODUCTOS) */}
        <main className="flex-grow">
         
          {children}
         
        </main>
        <Footer/> </CartProvider>
      </body>
    </html>
  );
}