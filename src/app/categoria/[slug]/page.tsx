'use client';

import { useState, useEffect, use } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';

interface Producto {
  id: string;
  nombre: string;
  categoria?: string;
  categorias?: string[];
  subcategoria?: string;
  precio: number | string;
  imagen: string;
  descripcion?: string;
}

// Helper: Elimina tildes/acentos y convierte a minúsculas
const normalizeText = (text: string) =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// Subcategorías de la línea de espejos
const subcategoriasPorDefecto: Record<string, string[]> = {
  organicos: [
    'Espejos Orgánicos Asimétricos',
    'Espejos de Curvas Suaves',
    'Diseños de Autor'
  ],
  arqueados: [
    'Arqueados Estilo Ventana',
    'Arqueados de Pared',
    'Arcos Monumentales'
  ],
  pie: [
    'Cuerpo Entero con Soporte',
    'Espejos Vestidores',
    'De Pie con Marco Metálico'
  ],
  pared: [
    'Espejos Redondos y Ovalados',
    'Espejos Rectangulares',
    'Espejos Biselados sin Marco',
    'Espejos Decorativos / Consola'
  ]
};

export default function CategoriaPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug.toLowerCase();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarProductos() {
      try {
        setCargando(true);
        const productosRef = collection(db, 'productos');

        // 1. Consulta principal usando 'array-contains' en la lista de categorías
        const qArray = query(productosRef, where('categorias', 'array-contains', slug));
        const snapshotArray = await getDocs(qArray);

        const listaMap = new Map<string, Producto>();

        snapshotArray.forEach((doc) => {
          listaMap.set(doc.id, {
            id: doc.id,
            ...doc.data(),
          } as Producto);
        });

        // 2. Consulta de respaldo (fallback) por si existen registros con 'categoria' simple (string)
        if (listaMap.size === 0) {
          const qSimple = query(productosRef, where('categoria', '==', slug));
          const snapshotSimple = await getDocs(qSimple);
          snapshotSimple.forEach((doc) => {
            listaMap.set(doc.id, {
              id: doc.id,
              ...doc.data(),
            } as Producto);
          });
        }

        setProductos(Array.from(listaMap.values()));
      } catch (error) {
        console.error('Error al obtener los espejos de la categoría:', error);
      } finally {
        setCargando(false);
      }
    }

    cargarProductos();
  }, [slug]);

  // Filtro de subcategoría insensible a acentos/mayúsculas
  const productosFiltrados = subcategoriaSeleccionada
    ? productos.filter(
        p => p.subcategoria && normalizeText(p.subcategoria) === normalizeText(subcategoriaSeleccionada)
      )
    : productos;

  const subcategoriasDisponibles = subcategoriasPorDefecto[slug] || [];

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen py-16 px-6 text-[#111111]">
      <div className="max-w-7xl mx-auto">
        
        {/* ENCABEZADO PRINCIPAL */}
        <header className="mb-12 border-b border-[#EAE7E1] pb-8">
          <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#8C8275] block mb-2">
            COLECCIÓN EDITORIAL
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-[#111111] capitalize font-normal">
            {slug}
          </h1>
        </header>

        {/* LAYOUT DE 2 COLUMNAS */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* SIDEBAR DE SUBCATEGORÍAS */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="border-b border-[#EAE7E1] pb-4">
              <h3 className="font-serif text-xs tracking-widest uppercase text-[#111111] font-semibold">
                Líneas de Diseño
              </h3>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setSubcategoriaSeleccionada(null)}
                className={`w-full text-left text-xs font-sans tracking-wider uppercase block transition-colors py-1 cursor-pointer ${
                  subcategoriaSeleccionada === null 
                    ? 'text-[#111111] font-semibold border-l-2 border-[#111111] pl-3' 
                    : 'text-[#8C8275] hover:text-[#111111]'
                }`}
              >
                Ver Todos ({productos.length})
              </button>

              {subcategoriasDisponibles.map((subcat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSubcategoriaSeleccionada(subcat)}
                  className={`w-full text-left text-xs font-sans tracking-wider block transition-colors py-1 cursor-pointer ${
                    subcategoriaSeleccionada === subcat 
                      ? 'text-[#111111] font-semibold border-l-2 border-[#111111] pl-3' 
                      : 'text-[#8C8275] hover:text-[#111111]'
                  }`}
                >
                  {subcat}
                </button>
              ))}
            </div>
          </aside>

          {/* GRILLA DE ESPEJOS */}
          <div className="lg:col-span-3">
            {cargando ? (
              <div className="text-center py-20">
                <p className="text-[#8C8275] font-light text-xs tracking-widest uppercase animate-pulse">
                  Cargando piezas...
                </p>
              </div>
            ) : productosFiltrados.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-[#EAE7E1] p-8 shadow-sm">
                <p className="text-[#8C8275] font-light text-sm">
                  No hay piezas disponibles en esta línea de diseño por el momento.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {productosFiltrados.map((producto) => (
                  <Link 
                    key={producto.id} 
                    href={`/producto/${producto.id}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-[#EAE7E1] transition-all hover:shadow-md flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      {/* Imagen con Aspect Ratio 3:4 */}
                      <div className="relative aspect-[3/4] w-full bg-[#F2F0EB] overflow-hidden">
                        <Image 
                          src={producto.imagen} 
                          alt={producto.nombre} 
                          fill 
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>

                      {/* Información del Espejo */}
                      <div className="p-6">
                        <span className="text-[9px] uppercase tracking-[0.25em] text-[#8C8275] block mb-1">
                          {producto.subcategoria || slug}
                        </span>
                        <h3 className="font-serif text-lg text-[#111111] mb-2 font-medium uppercase tracking-wide">
                          {producto.nombre}
                        </h3>
                        {producto.descripcion && (
                          <p className="text-xs text-[#8C8275] line-clamp-2 font-light leading-relaxed">
                            {producto.descripcion}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Precio & Acción */}
                    <div className="p-6 pt-0">
                      <div className="flex items-center justify-between pt-4 border-t border-[#EAE7E1]">
                        <span className="font-sans text-sm font-semibold text-[#111111]">
                          ${typeof producto.precio === 'number' 
                            ? producto.precio.toLocaleString('es-CO') 
                            : producto.precio} COP
                        </span>
                        <span className="text-[10px] uppercase font-semibold tracking-widest text-[#8C8275] group-hover:text-[#111111] transition-colors flex items-center gap-1">
                          Ver Pieza →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}