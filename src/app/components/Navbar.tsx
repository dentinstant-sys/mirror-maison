'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart();

  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <header className="w-full bg-[#FAF9F6]/90 border-b border-[#EAE7E1] sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* NAVEGACIÓN PRINCIPAL (ESCRITORIO) */}
        <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium text-[#2D2D2D]">
          <Link href="/categoria/organicos" className="hover:text-[#8C8275] transition-colors">Orgánicos</Link>
          <Link href="/categoria/arqueados" className="hover:text-[#8C8275] transition-colors">Arqueados</Link>
          <Link href="/categoria/pie" className="hover:text-[#8C8275] transition-colors">De Pie</Link>
          <Link href="/categoria/pared" className="hover:text-[#8C8275] transition-colors">De Pared</Link>
        </nav>

        {/* LOGOTIPO EDITORIAL */}
        <Link href="/" className="text-center">
          <span className="font-serif text-xl md:text-2xl tracking-[0.3em] font-semibold text-[#111111] uppercase block">
            Decoespejos
          </span>
          <span className="text-[9px] tracking-[0.4em] text-[#8C8275] uppercase block -mt-1 font-sans">
            Espejos & Colección
          </span>
        </Link>

        {/* ACCIONES (CARRITO Y MENÚ MÓVIL) */}
        <div className="flex items-center gap-6">
          
          {/* 🛒 ENLACE DIRECTO A LA PÁGINA DEL CARRITO */}
          <Link
            href="/carrito"
            className="relative flex items-center gap-2 text-xs uppercase tracking-widest text-[#111111] font-medium cursor-pointer hover:text-[#8C8275] transition-colors"
            aria-label="Ver carrito"
          >
            <span>CARRITO</span>
            <span className="bg-[#111111] text-[#FAF9F6] text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-sans">
              {totalItems}
            </span>
          </Link>

          {/* BOTÓN MENÚ MÓVIL */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-[#111111] focus:outline-none cursor-pointer"
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

      </div>

      {/* MENÚ DESPLEGABLE MÓVIL */}
      {isOpen && (
        <div className="lg:hidden bg-[#FAF9F6] border-b border-[#EAE7E1] px-6 py-6 space-y-4 text-xs uppercase tracking-[0.2em] text-[#2D2D2D]">
          <Link href="/categoria/organicos" onClick={() => setIsOpen(false)} className="block py-2">Espejos Orgánicos</Link>
          <Link href="/categoria/arqueados" onClick={() => setIsOpen(false)} className="block py-2">Espejos Arqueados</Link>
          <Link href="/categoria/pie" onClick={() => setIsOpen(false)} className="block py-2">Espejos de Pie</Link>
          <Link href="/categoria/pared" onClick={() => setIsOpen(false)} className="block py-2">Espejos de Pared</Link>
          <div className="pt-2 border-t border-[#EAE7E1]">
            <Link href="/carrito" onClick={() => setIsOpen(false)} className="block py-2 font-semibold">
              Ver Carrito ({totalItems})
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}