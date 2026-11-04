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

        {/* Columna 3: Redes Sociales con Iconos */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
            Síguenos
          </h3>
          <div className="flex items-center gap-3 pt-1">
            {redes.instagram && (
              <a
                href={redes.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-[#3D3530] flex items-center justify-center text-[#A89F91] hover:text-white hover:bg-[#8C8275] transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            )}

            {redes.facebook && (
              <a
                href={redes.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-[#3D3530] flex items-center justify-center text-[#A89F91] hover:text-white hover:bg-[#8C8275] transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            )}

            {redes.tiktok && (
              <a
                href={redes.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 rounded-full bg-[#3D3530] flex items-center justify-center text-[#A89F91] hover:text-white hover:bg-[#8C8275] transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.56-1.36 1.48-1.43 2.47-.07 1.1.37 2.21 1.18 2.92.83.73 2.01 1.05 3.1 0.85 1.14-.18 2.15-.99 2.55-2.07.28-.73.34-1.53.33-2.31.02-5.4.01-10.8.01-16.2z"/>
                </svg>
              </a>
            )}

            {redes.whatsapp && (
              <a
                href={`https://wa.me/${redes.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-[#3D3530] flex items-center justify-center text-[#A89F91] hover:text-white hover:bg-[#8C8275] transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
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