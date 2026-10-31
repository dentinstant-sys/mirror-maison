'use client';

import { useState, useEffect, use } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';

interface ProyectoDetalle {
  titulo: string;
  subtitulo: string;
  categoria: string;
  descripcion: string;
  imagen: string;
  imagenesGaleria?: string[];
  videoUrl?: string;
}

// Función helper para renderizar el video (ya sea enlace embed de YouTube/Vimeo o archivo HTML5 directo)
const renderVideo = (url: string) => {
  const isDirectVideo = url.endsWith('.mp4') || url.endsWith('.webm') || url.includes('firebasestorage.googleapis.com');

  if (isDirectVideo) {
    return (
      <video controls className="w-full h-full rounded-xl object-cover">
        <source src={url} type="video/mp4" />
        Tu navegador no soporta la reproducción de video.
      </video>
    );
  }

  // Si es un link de YouTube
  let embedUrl = url;
  if (url.includes('youtube.com/watch?v=')) {
    embedUrl = url.replace('watch?v=', 'embed/');
  } else if (url.includes('youtu.be/')) {
    embedUrl = url.replace('youtu.be/', 'youtube.com/embed/');
  }

  return (
    <iframe
      src={embedUrl}
      title="Video del proyecto"
      className="w-full h-full rounded-xl"
      allowFullScreen
    />
  );
};

export default function DetalleProyectoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [proyecto, setProyecto] = useState<ProyectoDetalle | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function obtenerProyecto() {
      try {
        setCargando(true);
        const docRef = doc(db, 'proyectos', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProyecto(docSnap.data() as ProyectoDetalle);
        } else {
          setProyecto(null);
        }
      } catch (error) {
        console.error('Error al cargar detalle del proyecto:', error);
      } finally {
        setCargando(false);
      }
    }
    if (id) obtenerProyecto();
  }, [id]);

  if (cargando) {
    return (
      <main className="w-full bg-[#FDFBF7] min-h-screen pt-32 pb-24 px-6 flex items-center justify-center">
        <p className="text-gray-400 font-light text-sm tracking-widest uppercase animate-pulse">
          Cargando proyecto...
        </p>
      </main>
    );
  }

  if (!proyecto) {
    return (
      <main className="w-full bg-[#FDFBF7] min-h-screen pt-32 pb-24 px-6 text-center">
        <div className="max-w-md mx-auto bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">Proyecto no encontrado</h2>
          <p className="text-sm text-gray-500 mb-6 font-light">
            El proyecto que buscas no está disponible o ha sido retirado.
          </p>
          <Link
            href="/proyectos"
            className="inline-block bg-[#1A1A1A] text-white text-xs uppercase tracking-widest px-6 py-3 rounded-md hover:bg-[#8C6D53] transition-colors"
          >
            Volver a Proyectos
          </Link>
        </div>
      </main>
    );
  }

  return (
    // Agregamos pt-32 para dar el espacio necesario debajo del Header/Navbar
    <main className="w-full bg-[#FDFBF7] min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* NAVEGACIÓN Y BREADCRUMBS */}
        <nav className="mb-8 text-xs font-sans text-gray-400 tracking-wider uppercase flex items-center gap-2">
          <Link href="/" className="hover:text-[#1A1A1A] transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/proyectos" className="hover:text-[#1A1A1A] transition-colors">Proyectos</Link>
          <span>/</span>
          <span className="text-[#1A1A1A] font-medium">{proyecto.titulo}</span>
        </nav>

        {/* ENCABEZADO Y TÍTULO */}
        <div className="mb-10">
          <span className="text-xs font-sans tracking-[0.3em] uppercase text-[#8C6D53] block mb-2 font-medium">
            {proyecto.subtitulo}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] font-normal">
            {proyecto.titulo}
          </h1>
        </div>

        {/* FOTO PRINCIPAL CON MARGEN ADECUADO */}
        <div className="relative h-[400px] md:h-[580px] w-full rounded-2xl overflow-hidden shadow-sm mb-12 bg-gray-100 border border-gray-100">
          <Image
            src={proyecto.imagen}
            alt={proyecto.titulo}
            fill
            priority
            className="object-cover object-top"  
          />
        </div>

        {/* DESCRIPCIÓN Y TEXTO */}
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-100 shadow-sm mb-12">
          <h3 className="font-serif text-2xl text-[#1A1A1A] mb-4">Sobre este espacio</h3>
          <p className="text-base text-gray-600 font-light leading-relaxed whitespace-pre-line">
            {proyecto.descripcion}
          </p>
        </div>

        {/* REPRODUCTOR DE VIDEO (SI TIENE VIDEO ADJUNTO O LINK) */}
        {proyecto.videoUrl && (
          <div className="mb-12 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
            <h3 className="font-serif text-2xl text-[#1A1A1A] mb-6">Recorrido del Espacio</h3>
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
              {renderVideo(proyecto.videoUrl)}
            </div>
          </div>
        )}

        {/* GALERÍA DE IMÁGENES */}
        {proyecto.imagenesGaleria && proyecto.imagenesGaleria.length > 0 && (
          <div className="mb-16">
            <h3 className="font-serif text-2xl text-[#1A1A1A] mb-6">Galería del Proyecto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {proyecto.imagenesGaleria.map((img, idx) => (
                <div key={idx} className="relative h-[360px] rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm">
                  <Image
                    src={img}
                    alt={`Detalle ${idx + 1}`}
                    fill
                    className="object-cover object-center"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}