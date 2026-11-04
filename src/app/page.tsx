'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
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

interface PromocionMes {
  activo: boolean;
  badge: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  precioActual: number;
  precioAnterior: number;
  ahorro: string;
  imagen: string;
  link: string;
}

export default function HomePage() {
  const [destacados, setDestacados] = useState<Espejo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [promo, setPromo] = useState<PromocionMes | null>(null);

  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 9;

  // Cálculos para la paginación
  const totalPaginas = Math.ceil(destacados.length / productosPorPagina);
  const indiceInicio = (paginaActual - 1) * productosPorPagina;
  const indiceFin = indiceInicio + productosPorPagina;
  const productosPaginados = destacados.slice(indiceInicio, indiceFin);

  const cambiarPagina = (nuevaPagina: number) => {
    setPaginaActual(nuevaPagina);
  };

  useEffect(() => {
    async function obtenerDatos() {
      try {
        setCargando(true);

        // 1. Obtener Promoción del Mes desde Firestore
        const promoDocRef = doc(db, 'configuracion', 'promocion');
        const promoSnap = await getDoc(promoDocRef);
        if (promoSnap.exists()) {
          setPromo(promoSnap.data() as PromocionMes);
        }

        // 2. Obtener Productos Destacados / Catálogo
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

        setDestacados(lista);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setCargando(false);
      }
    }

    obtenerDatos();
  }, []);

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen">

      {/* 1. HERO BANNER PRINCIPAL / PROMOCIÓN DEL MES */}
      <section className="relative w-full h-[85vh] bg-[#EAE7E1] flex items-end pb-16 px-6 md:px-16 overflow-hidden">
        {/* IMAGEN DE FONDO FIJA (Mantiene la imagen institucional que pediste) */}
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/maison-mirror-1ab5b.firebasestorage.app/o/espejos%2FEspejos-de-lujo-en-tonos-ca%CC%81lidos.webp?alt=media&token=96f7d752-8576-4814-9623-798afc330edb"
          alt="Colección Espejos de Diseño"
          fill
          className="object-cover brightness-90"
          priority
        />
        
        {/* Degradado sutil para legibilidad en móviles */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent md:hidden" />

        {/* RECUADRO FLOTANTE (DINÁMICO SEGÚN PROMOCIÓN) */}
        <div className={`relative z-10 bg-[#FAF9F6]/95 backdrop-blur-md p-6 md:p-10 rounded-sm border border-[#EAE7E1] shadow-2xl transition-all duration-300 ${
          promo?.activo ? 'max-w-3xl w-full' : 'max-w-xl space-y-4'
        }`}>
          
          {promo?.activo ? (
            /* DISEÑO DE LA PROMOCIÓN DEL MES CON IMAGEN INCLUIDA EN EL RECUADRO */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              
              {/* Columna Izquierda: Imagen del producto en promoción */}
              {promo.imagen && (
                <div className="relative w-full h-64 md:h-72 rounded-sm overflow-hidden bg-[#EAE7E1]">
                  <Image
                    src={promo.imagen}
                    alt={promo.titulo}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Columna Derecha: Detalles, Precios y Botón */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#111111] text-[#FAF9F6] text-[18px] uppercase tracking-[0.2em] px-3 py-1 font-semibold rounded-full">
                    {promo.badge || "OFERTA ESPECIAL"}
                  </span>
                  {promo.ahorro && (
                    <span className="bg-[#C25E38]/10 text-[#C25E38] border border-[#C25E38]/20 text-[18px] uppercase tracking-[0.1em] px-3 py-1 font-medium rounded-full">
                      {promo.ahorro}
                    </span>
                  )}
                </div>

                <span className="text-[10px] uppercase tracking-[0.4em] text-[#8C8275] font-medium block">
                  {promo.subtitulo}
                </span>

                <h1 className="font-serif text-2xl md:text-3xl text-[#111111] font-normal leading-tight">
                  {promo.titulo}
                </h1>

                <p className="text-xs text-[#555555] font-light leading-relaxed">
                  {promo.descripcion}
                </p>

                <div className="flex items-baseline gap-3 pt-1">
                  <span className=" font-serif font-semibold text-[#111111] text-[27px]" >
                    ${promo.precioActual?.toLocaleString('es-CO')} <span className="text-[10px] font-sans font-normal text-[#8C8275]">COP</span>
                  </span>
                  {promo.precioAnterior > promo.precioActual && (
                    <span className="text-[27px] text-[#8C8275] line-through">
                      ${promo.precioAnterior?.toLocaleString('es-CO')}
                    </span>
                  )}
                </div>

                <div className="pt-2">
                  <Link
                    href={promo.link || '#'}
                    className="inline-block bg-[#111111] text-[#FAF9F6] hover:bg-[#C25E38] px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-semibold transition-colors rounded-sm shadow-md text-center w-full md:w-auto"
                  >
                    Aprovechar Oferta →
                  </Link>
                </div>
              </div>

            </div>
          ) : (
            /* DISEÑO ORIGINAL (CUANDO NO HAY PROMOCIÓN ACTIVA) */
            <div className="space-y-4">
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
          )}

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
                src="https://firebasestorage.googleapis.com/v0/b/maison-mirror-1ab5b.firebasestorage.app/o/espejos%2FCaptura-de-pantalla-2026-10-31-a-la_s_-12.08.21%E2%80%AFp.m..webp?alt=media&token=da715427-f14e-4f56-b474-7bb9600be70b"
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
                src="https://firebasestorage.googleapis.com/v0/b/maison-mirror-1ab5b.firebasestorage.app/o/espejos%2FCaptura-de-pantalla-2026-10-31-a-la_s_-12.08.33%E2%80%AFp.m..webp?alt=media&token=46d799ed-886e-4157-9eb8-cc39aa90dd07"
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
                src="https://firebasestorage.googleapis.com/v0/b/maison-mirror-1ab5b.firebasestorage.app/o/espejos%2FCaptura-de-pantalla-2026-10-31-a-la_s_-12.08.46%E2%80%AFp.m..webp?alt=media&token=62b955f2-71ee-4364-b13c-eabf37231bb0"
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
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
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

            {totalPaginas > 1 && (
              <div className="flex items-center justify-center gap-4 pt-12 border-t border-[#EAE7E1]">
                <button
                  onClick={() => cambiarPagina(paginaActual - 1)}
                  disabled={paginaActual === 1}
                  className="text-xs uppercase tracking-widest font-medium transition-colors hover:text-[#8C8275] disabled:opacity-30 disabled:hover:text-[#111111] disabled:cursor-not-allowed cursor-pointer px-3 py-1"
                >
                  ← Anterior
                </button>

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