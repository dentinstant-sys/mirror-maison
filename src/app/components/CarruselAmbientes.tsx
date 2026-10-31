'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';

interface CarruselAmbientesProps {
  imagenes: string[];
  nombreProducto: string;
}

export default function CarruselAmbientes({ imagenes, nombreProducto }: CarruselAmbientesProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 450; // Ancho aproximado de cada tarjeta + gap
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Autoplay effect optimizado con scrollBy fijo
  useEffect(() => {
    if (!imagenes || imagenes.length <= 1) return;

    const interval = setInterval(() => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        
        // Si llega al final, regresa al principio; si no, avanza 450px
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          sliderRef.current.scrollBy({ left: 450, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [imagenes]);

  if (!imagenes || imagenes.length === 0) return null;

  return (
    <div className="mt-16 relative">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-2xl text-[#1A1A1A] font-normal">
          Galería de Ambientes
        </h3>
        
        {/* Botones de navegación del slider */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => scrollSlider('left')}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors shadow-sm text-gray-700 cursor-pointer"
            aria-label="Anterior"
          >
            ←
          </button>
          <button
            onClick={() => scrollSlider('right')}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors shadow-sm text-gray-700 cursor-pointer"
            aria-label="Siguiente"
          >
            →
          </button>
        </div>
      </div>

      {/* Contenedor deslizante de imágenes */}
      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-4 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {imagenes.map((imgUrl, index) => (
          <div
            key={index}
            className="relative min-w-[300px] md:min-w-[450px] h-[350px] md:h-[450px] bg-gray-100 rounded-xl overflow-hidden snap-start flex-shrink-0 border border-gray-100 shadow-sm"
          >
            <Image
              src={imgUrl}
              alt={`${nombreProducto} - Ambiente ${index + 1}`}
              fill
              className="object-cover object-center"
            />
          </div>
        ))}
      </div>
    </div>
  );
}