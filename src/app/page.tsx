'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/firebase';

interface Espejo {
  id: string;
  nombre: string;
  categoria: string;
  subcategoria?: string;
  precio: number;
  imagen: string;
}

export default function HomePage() {
  const [destacados, setDestacados] = useState<Espejo[]>([]);
  const [cargando, setCargando] = useState(true);


  const [paginaActual, setPaginaActual] = useState(1);
const productosPorPagina = 9;

// Cálculos para la paginación
const totalPaginas = Math.ceil(destacados.length / productosPorPagina);
const indiceInicio = (paginaActual - 1) * productosPorPagina;
const indiceFin = indiceInicio + productosPorPagina;
const productosPaginados = destacados.slice(indiceInicio, indiceFin);

// Función para cambiar de página y hacer scroll suave al inicio de la sección
const cambiarPagina = (nuevaPagina: number) => {
  setPaginaActual(nuevaPagina);
};

useEffect(() => {
  async function obtenerDestacados() {
    try {
      setCargando(true);
      
      // Asegúrate de NO tener limit(6) aquí
      const querySnapshot = await getDocs(collection(db, 'productos'));
      
      const lista: Espejo[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        lista.push({
          id: docSnap.id,
          nombre: data.nombre || '',
          categoria: data.categoria || '',
          precio: Number(data.precio) || 0,
          imagen: data.imagen || '',
        });
      });

      setDestacados(lista); // Ahora lista tendrá los 11 productos
    } catch (error) {
      console.error('Error al cargar destacados:', error);
    } finally {
      setCargando(false);
    }
  }

  obtenerDestacados();
}, []);

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen">
      
      {/* 1. HERO BANNER PRINCIPAL EDITORIAL */}
      <section className="relative w-full h-[85vh] bg-[#EAE7E1] flex items-end pb-16 px-6 md:px-16">
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/maison-mirror-1ab5b.firebasestorage.app/o/espejos%2FInterior%20minimalista%20con%20espejo%20orga%CC%81nico%20y%20lujo%20ca%CC%81lido.png?alt=media&token=c0bd7381-790a-41d3-972e-59e26d236533"
          alt="Colección Espejos de Diseño"
          fill
          className="object-cover brightness-95"
          priority
        />
        <div className="relative z-10 max-w-xl space-y-4 bg-[#FAF9F6]/80 backdrop-blur-md p-8 md:p-12 rounded-sm border border-[#EAE7E1]">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#8C8275] font-medium block">
            NUEVA COLECCIÓN
          </span>
          <h1 className="font-serif text-3xl md:text-5xl text-[#111111] font-normal leading-tight">
            La Escultura del Reflejo
          </h1>
          <p className="text-xs text-[#555555] font-light leading-relaxed">
            Piezas elaboradas con vidrios flotados de alta definición y marcos artesanales en roble macizo y latón cepillado.
          </p>
          <div className="pt-2">
            <Link
              href="/categoria/organicos"
              className="inline-block border-b border-[#111111] pb-1 text-xs uppercase tracking-[0.2em] font-semibold text-[#111111] hover:text-[#8C8275] hover:border-[#8C8275] transition-colors"
            >
              Explorar Colección →
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CATEGORÍAS EN RETÍCULA MINIMALISTA */}
      <section className="max-w-7xl mx-auto py-24 px-6 space-y-12">
        <header className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C8275] block">CATEGORÍAS</span>
          <h2 className="font-serif text-2xl md:text-3xl text-[#111111]">Diseños para Cada Espacio</h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <Link href="/categoria/organicos" className="group space-y-4">
            <div className="relative aspect-[3/4] bg-[#F2F0EB] overflow-hidden">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/maison-mirror-1ab5b.firebasestorage.app/o/espejos%2FCaptura%20de%20pantalla%202026-10-31%20a%20la(s)%2012.08.21%E2%80%AFp.m..png?alt=media&token=1f3d91e5-1b2c-42a5-a4bb-ac54a602fc45"
                alt="Espejos Orgánicos"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-serif text-lg text-[#111111]">Formas Orgánicas</h3>
              <p className="text-[11px] uppercase tracking-widest text-[#8C8275]">Curvas Fluidas</p>
            </div>
          </Link>

          <Link href="/categoria/arqueados" className="group space-y-4">
            <div className="relative aspect-[3/4] bg-[#F2F0EB] overflow-hidden">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/maison-mirror-1ab5b.firebasestorage.app/o/espejos%2FCaptura%20de%20pantalla%202026-10-31%20a%20la(s)%2012.08.33%E2%80%AFp.m..png?alt=media&token=cd897151-a3bf-408d-bb33-6aa70f320b9d"
                alt="Espejos Arqueados"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-serif text-lg text-[#111111]">Arqueados y Ventana</h3>
              <p className="text-[11px] uppercase tracking-widest text-[#8C8275]">Arquitectura Clásica</p>
            </div>
          </Link>

          <Link href="/categoria/pie" className="group space-y-4">
            <div className="relative aspect-[3/4] bg-[#F2F0EB] overflow-hidden">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/maison-mirror-1ab5b.firebasestorage.app/o/espejos%2FCaptura%20de%20pantalla%202026-10-31%20a%20la(s)%2012.08.46%E2%80%AFp.m..png?alt=media&token=11572838-7e14-4f8e-80dc-9fed3140b0ca"
                alt="Espejos de Pie"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-serif text-lg text-[#111111]">De Pie / Cuerpo Entero</h3>
              <p className="text-[11px] uppercase tracking-widest text-[#8C8275]">Presencia Monumental</p>
            </div>
          </Link>

        </div>
      </section>

      {/* 3. GRILLA DE PRODUCTOS DESTACADOS DESDE FIRESTORE */}
  <section className="max-w-7xl mx-auto pb-24 px-6 space-y-12 border-t border-[#EAE7E1] pt-20">
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
    <div>
      <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C8275] block">SELECCIÓN</span>
      <h2 className="font-serif text-2xl md:text-3xl text-[#111111]">Piezas Destacadas</h2>
    </div>
    <Link href="/categoria/organicos" className="text-xs uppercase tracking-widest text-[#111111] hover:text-[#8C8275] underline">
      Ver Todo el Catálogo
    </Link>
  </div>

  {cargando ? (
    <p className="text-xs uppercase tracking-widest text-center py-20 text-[#8C8275] animate-pulse">
      Cargando piezas de la colección...
    </p>
  ) : destacados.length === 0 ? (
    <div className="text-center py-20 space-y-4 bg-[#F2F0EB] rounded-2xl p-8">
      <span className="text-3xl block">🪞</span>
      <p className="text-xs uppercase tracking-widest text-[#8C8275]">Aún no han agregado espejos al catálogo.</p>
    </div>
  ) : (
    <>
      {/* GRID DE PRODUCTOS (9 por página) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {productosPaginados.map((espejo) => (
          <Link key={espejo.id} href={`/producto/${espejo.id}`} className="group space-y-4">
            <div className="relative aspect-[3/4] bg-[#F2F0EB] overflow-hidden">
              <Image
                src={espejo.imagen || 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=800'}
                alt={espejo.nombre}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-base text-[#111111] group-hover:text-[#8C8275] transition-colors uppercase">
                {espejo.nombre}
              </h3>
              <p className="text-[11px] text-[#8C8275] font-light capitalize">{espejo.categoria}</p>
              <p className="text-sm font-semibold text-[#111111] pt-1">
                ${espejo.precio.toLocaleString('es-CO')} COP
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* CONTROLES DE PAGINACIÓN */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-4 pt-12 border-t border-[#EAE7E1]">
          {/* Botón Anterior */}
          <button
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            className="text-xs uppercase tracking-widest font-medium transition-colors hover:text-[#8C8275] disabled:opacity-30 disabled:hover:text-[#111111] disabled:cursor-not-allowed cursor-pointer px-3 py-1"
          >
            ← Anterior
          </button>

          {/* Números de Página */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPaginas }, (_, index) => {
              const numPagina = index + 1;
              return (
                <button
                  key={numPagina}
                  onClick={() => cambiarPagina(numPagina)}
                  className={`w-8 h-8 text-xs font-medium transition-all cursor-pointer flex items-center justify-center rounded-full ${
                    paginaActual === numPagina
                      ? 'bg-[#111111] text-[#FAF9F6]'
                      : 'text-[#111111] hover:bg-[#EAE7E1]'
                  }`}
                >
                  {numPagina}
                </button>
              );
            })}
          </div>

          {/* Botón Siguiente */}
          <button
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className="text-xs uppercase tracking-widest font-medium transition-colors hover:text-[#8C8275] disabled:opacity-30 disabled:hover:text-[#111111] disabled:cursor-not-allowed cursor-pointer px-3 py-1"
          >
            Siguiente →
          </button>
        </div>
      )}
    </>
  )}
</section>
    </main>
  );
}