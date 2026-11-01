'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface RedesConfig {
  whatsapp: string;
  instagram: string;
  facebook: string;
  tiktok: string;
}

export default function Footer() {
  const [redes, setRedes] = useState<RedesConfig>({
    whatsapp: '',
    instagram: '',
    facebook: '',
    tiktok: '',
  });

  useEffect(() => {
    async function obtenerRedes() {
      try {
        const docRef = doc(db, 'configuracion', 'redes');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRedes(docSnap.data() as RedesConfig);
        }
      } catch (error) {
        console.error('Error al cargar redes en el footer:', error);
      }
    }
    obtenerRedes();
  }, []);

  return (
    <footer className="w-full bg-[#26211E] text-[#FAF9F6] py-16 px-6 md:px-16 mt-20 border-t border-[#3D3530]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Columna 1: Marca */}
        <div className="space-y-4">
          <h2 className="font-serif text-xl tracking-[0.3em] uppercase font-semibold">
            Decoespejos
          </h2>
          <p className="text-xs text-[#A89F91] font-light leading-relaxed">
            Piezas artesanales elaboradas con vidrios flotados de alta definición y marcos de diseño exclusivo.
          </p>
        </div>

        {/* Columna 2: Enlaces rápidos */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
            Colecciones
          </h3>
          <ul className="space-y-2 text-xs text-[#A89F91] uppercase tracking-wider">
            <li><Link href="/categoria/organicos" className="hover:text-white transition-colors">Orgánicos</Link></li>
            <li><Link href="/categoria/arqueados" className="hover:text-white transition-colors">Arqueados</Link></li>
            <li><Link href="/categoria/pie" className="hover:text-white transition-colors">De Pie</Link></li>
            <li><Link href="/categoria/pared" className="hover:text-white transition-colors">De Pared</Link></li>
          </ul>
        </div>

        {/* Columna 3: Redes Sociales Dinámicas */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
            Síguenos
          </h3>
          <div className="flex flex-col space-y-2 text-xs text-[#A89F91] uppercase tracking-wider">
            {redes.instagram && (
              <a href={redes.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Instagram
              </a>
            )}
            {redes.facebook && (
              <a href={redes.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Facebook
              </a>
            )}
            {redes.tiktok && (
              <a href={redes.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                TikTok
              </a>
            )}
            {redes.whatsapp && (
              <a href={`https://wa.me/${redes.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                WhatsApp Directo
              </a>
            )}
          </div>
        </div>

        {/* Columna 4: Información */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
            Taller & Envíos
          </h3>
          <p className="text-xs text-[#A89F91] font-light leading-relaxed">
            Envíos asegurados a todo el territorio nacional con empaques de alta protección.
          </p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-6 border-t border-[#3D3530] text-center text-[10px] uppercase tracking-[0.2em] text-[#A89F91]">
        © {new Date().getFullYear()} Decoespejos. Todos los derechos reservados.
      </div>
    </footer>
  );
}