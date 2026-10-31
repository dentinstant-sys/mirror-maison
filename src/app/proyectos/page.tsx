'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';

interface Proyecto {
  id: string;
  titulo: string;
  subtitulo: string;
  categoria: string;
  descripcion: string;
  imagen: string;
  imagenesGaleria?: string[];
  videoUrl?: string;
  esBannerPrincipal?: boolean;
  slug: string;
}

const categoriasFiltro = ['Todos', 'Salas', 'Comedores', 'Dormitorios', 'Sillas y Poltronas', 'Proyectos completos'];

export default function ProyectosPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');

  useEffect(() => {
    async function obtenerProyectos() {
      try {
        setCargando(true);
        const querySnapshot = await getDocs(collection(db, 'proyectos'));
        const lista: Proyecto[] = [];
        querySnapshot.forEach((doc) => {
          lista.push({ id: doc.id, ...doc.data() } as Proyecto);
        });
        setProyectos(lista);
      } catch (error) {
        console.error('Error al cargar proyectos:', error);
      } finally {
        setCargando(false);
      }
    }
    obtenerProyectos();
  }, []);

  // Encontrar si hay un proyecto marcado como banner principal (o tomar el primero por defecto)
  const proyectoBanner = proyectos.find((p) => p.esBannerPrincipal) || proyectos[0];

  // Filtrar el resto para la grilla
  const proyectosFiltrados = categoriaActiva === 'Todos'
    ? proyectos
    : proyectos.filter((p) => p.categoria.toLowerCase() === categoriaActiva.toLowerCase());

  if (cargando) {
    return (
      <main className="w-full bg-[#FDFBF7] min-h-screen py-24 px-6 flex items-center justify-center">
        <p className="text-gray-400 font-light text-sm tracking-widest uppercase animate-pulse">
          Cargando proyectos...
        </p>
      </main>
    );
  }

  return (
    <main className="w-full bg-[#FDFBF7] min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* ENCABEZADO */}
        <div className="mb-16">
          <span className="text-xs font-sans tracking-[0.3em] uppercase text-gray-400 block mb-3">
            PROYECTOS
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] font-normal mb-6">
            Espacios que cuentan historias.
          </h1>
          <p className="text-base text-gray-600 font-light max-w-2xl leading-relaxed">
            Cada proyecto nace de una persona, un espacio y una forma distinta de vivir. Diseñamos y fabricamos muebles a la medida que se convierten en el corazón de cada hogar.
          </p>
        </div>

        {/* BANNER PRINCIPAL DINÁMICO (Si existe alguno) */}
        {proyectoBanner && (
     <div className="bg-[#2A2725] text-white rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-lg mb-24">
            <div className="lg:col-span-7 relative h-[350px] lg:h-[480px] bg-[#2A2725] flex items-center justify-center p-2">
              <Image
                src={proyectoBanner.imagen}
                alt={proyectoBanner.titulo}
                fill
                className="object-contain object-center"
              />
            </div>
            <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-gray-400 block mb-3">
                  PROYECTO DESTACADO
                </span>
                <h2 className="font-serif text-3xl font-normal mb-4">
                  {proyectoBanner.titulo}
                </h2>
                <p className="text-sm text-gray-300 font-light leading-relaxed mb-6">
                  {proyectoBanner.descripcion || proyectoBanner.subtitulo}
                </p>
              </div>
              <Link
                href={`/proyectos/${proyectoBanner.id}`}
                className="inline-block bg-white text-[#1A1A1A] hover:bg-[#8C6D53] hover:text-white transition-colors py-3.5 px-6 rounded-xl font-sans text-xs uppercase tracking-widest font-medium text-center"
              >
                Ver proyecto completo →
              </Link>
            </div>
          </div>
        )}

        {/* FILTROS Y GRILLA */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
          <div>
            <h2 className="font-serif text-3xl text-[#1A1A1A] font-normal mb-2">
              Casas reales. Diseños únicos.
            </h2>
            <p className="text-sm text-gray-500 font-light">
              Explora más proyectos y descubre cómo transformamos espacios en hogares.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categoriasFiltro.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={`px-4 py-2 rounded-full text-xs font-sans transition-colors cursor-pointer ${
                  categoriaActiva === cat
                    ? 'bg-[#1A1A1A] text-white font-medium'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* GRILLA DE PROYECTOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {proyectosFiltrados.map((proyecto) => (
            <Link
              key={proyecto.id}
              href={`/proyectos/${proyecto.id}`}
              className="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md"
            >
              <div className="relative h-[280px] w-full bg-gray-100 overflow-hidden">
                <Image
                  src={proyecto.imagen}
                  alt={proyecto.titulo}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="font-serif text-lg text-[#1A1A1A] font-medium mb-1">
                    {proyecto.titulo}
                  </h3>
                  <p className="text-xs text-gray-500 font-light">
                    {proyecto.subtitulo}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-[#8C6D53]">
                  <span className="group-hover:underline">Ver proyecto</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}