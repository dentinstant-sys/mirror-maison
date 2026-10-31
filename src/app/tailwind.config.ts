import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tonos base Zara Home / Alta decoración
        fondo: "#FAF9F6",         // Blanco hueso muy suave / Off-white
        superficie: "#F2F0EB",    // Gris arena claro para fondos de tarjetas
        borde: "#EAE7E1",         // Líneas y bordes sutiles
        piedra: "#8C8275",        // Gris pardo / Taupe neutro para textos secundarios
        bronce: "#C5B39B",        // Champán / Latón mate para detalles sutiles o acentos
        carbon: "#111111",        // Negro profundo para textos principales y títulos
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-montserrat)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;