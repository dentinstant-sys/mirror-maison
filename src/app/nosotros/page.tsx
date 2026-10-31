'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';

const HISTORIA_FALLBACK = `Detrás de Acomódate Muebles hay una historia de amor, sueños y perseverancia. Somos Winny Ríos y Cristian Rodríguez, una pareja que decidió construir no solo una empresa, sino también un futuro juntos.

En 2020 nació Acomódate Muebles en redes sociales, con muchas ganas de salir adelante y el sueño de crear algo propio. Con esfuerzo, dedicación y amor por lo que hacemos, fuimos convirtiendo aquella idea en una realidad.

En 2023 dimos un gran paso: abrimos nuestra sala de exhibición en el sector del 12 de Octubre, en Bogotá. Así, nuestro sueño comenzó a crecer y a llegar a más hogares.

En este camino, las redes sociales y las colaboraciones han sido fundamentales. Westcol, streamer colombiano, fue una de las primeras figuras reconocidas en brindarnos una oportunidad que impulsó nuestra visibilidad. Su segunda colaboración con nosotros hizo aún más especial esta experiencia.

También hemos compartido momentos con participantes del Desafío, Kelly Ríos “Guajira”, Kevyn Rua, Karoline, Valentina Rodríguez y Alejandro Estrada, personas que han formado parte de nuestro crecimiento y nos han ayudado a llevar nuestra marca más lejos.

Pero detrás de cada logro hay mucho más que muebles: hay trabajo en equipo, aprendizajes, retos y dos personas que siguen creyendo en el mismo sueño. Después de seis años juntos, continuamos construyendo una historia en la que el amor y el emprendimiento van de la mano.

Hoy, Acomódate Muebles representa todo lo que hemos creado juntos y la ilusión de seguir transformando hogares. Porque antes de ser una marca, fuimos dos personas que se atrevieron a soñar.

Somos Winny y Cristian. Somos amor, esfuerzo y sueños compartidos. Somos Acomódate Muebles. 🤍

Y esto apenas comienza… ✨`;

const IMAGEN_DEFAULT = "https://firebasestorage.googleapis.com/v0/b/acomodate-muebles.firebasestorage.app/o/sofa-banner.jpg?alt=media&token=dd6bf266-6f9f-48ab-9ca3-7d24487c69b8";

export default function NosotrosPage() {
  const [contenido, setContenido] = useState({
    titulo: 'Nuestra Historia 🤍',
    subtitulo: 'Acomódate Muebles',
    historiaTexto: HISTORIA_FALLBACK,
    imagenUrl: IMAGEN_DEFAULT
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarNosotros() {
      try {
        const docRef = doc(db, 'contenido_sitio', 'nosotros');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setContenido({
            titulo: data.titulo || 'Nuestra Historia 🤍',
            subtitulo: data.subtitulo || 'Acomódate Muebles',
            historiaTexto: data.historiaTexto || HISTORIA_FALLBACK,
            imagenUrl: data.imagenUrl || IMAGEN_DEFAULT
          });
        }
      } catch (error) {
        console.error('Error cargando la sección nosotros:', error);
      } finally {
        setCargando(false);
      }
    }
    cargarNosotros();
  }, []);

  return (
    <main className="w-full bg-[#FDFBF7] min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* ENCABEZADO */}
        <header className="text-center max-w-2xl mx-auto space-y-3 border-b border-gray-200 pb-10">
          <span className="text-xs font-sans tracking-[0.3em] uppercase text-[#8C6D53] block font-medium">
            {contenido.subtitulo}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] font-normal">
            {contenido.titulo}
          </h1>
        </header>

        {/* IMAGEN PRINCIPAL DINÁMICA */}
        <div className="relative h-[350px] md:h-[450px] w-full rounded-3xl overflow-hidden shadow-sm bg-gray-100">
          <Image
            src={contenido.imagenUrl}
            alt="Winny y Cristian - Acomódate Muebles"
            fill
            className="object-cover object-center"
          />
        </div>

        {/* CONTENIDO Y PÁRRAFOS */}
        {cargando ? (
          <div className="space-y-4 animate-pulse max-w-2xl mx-auto py-10">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        ) : (
          <article className="max-w-2xl mx-auto space-y-6 text-[#1A1A1A] font-light text-base md:text-lg leading-relaxed">
            {contenido.historiaTexto.split('\n').map((parrafo, idx) => {
              if (!parrafo.trim()) return null;
              return (
                <p key={idx} className="tracking-wide">
                  {parrafo}
                </p>
              );
            })}
          </article>
        )}

      </div>
    </main>
  );
}