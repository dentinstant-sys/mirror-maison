'use client';

import React, { useState } from 'react';

interface OpcionMedida {
  titulo?: string;
  peso?: string | number;
  largo?: string | number;
  ancho?: string | number;
  alto?: string | number;
}

interface MedidasMuebleProps {
  medidas?: OpcionMedida[] | OpcionMedida | string;
}

export const MedidasMueble: React.FC<MedidasMuebleProps> = ({ medidas }) => {
  // Si no hay medidas, no renderizamos nada
  if (!medidas) return null;

  // Normalizamos para manejar si viene como un arreglo (varias opciones) o un objeto único
  const opciones: OpcionMedida[] = Array.isArray(medidas) 
    ? medidas 
    : typeof medidas === 'object' 
    ? [medidas] 
    : [];

  const [activeIndex, setActiveIndex] = useState(0);

  // Si es un texto plano por compatibilidad antigua
  if (typeof medidas === 'string') {
    return (
      <div className="mb-6 space-y-2">
        <h3 className="text-xs uppercase tracking-widest text-gray-400 font-medium">
          Dimensiones y Peso
        </h3>
        <p className="text-sm text-gray-700 font-light">{medidas}</p>
      </div>
    );
  }

  const medidaActual = opciones[activeIndex] || opciones[0];

  return (
    <div className="mb-6 space-y-4 border-t border-b border-gray-100 py-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs uppercase tracking-widest text-[#1A1A1A] font-semibold">
          Dimensiones y Peso
        </h3>
      </div>

      {/* Si hay múltiples opciones (ej. 2 puestos, 3 puestos), mostramos pestañas selectoras */}
      {opciones.length > 1 && (
        <div className="flex gap-2 border-b border-gray-100 pb-3">
          {opciones.map((op, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`text-xs px-4 py-2 rounded-lg transition-all uppercase tracking-wider font-medium ${
                activeIndex === index
                  ? 'bg-[#1A1A1A] text-white shadow-sm'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              {op.titulo || `Opción ${index + 1}`}
            </button>
          ))}
        </div>
      )}

      {/* Título de la variante seleccionada si existe */}
      {medidaActual.titulo && opciones.length > 1 && (
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest pt-1">
          {medidaActual.titulo}
        </p>
      )}

      {/* Lista detallada de características estilo minimalista */}
      <div className="space-y-3 text-sm font-light">
        {medidaActual.peso && (
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-gray-400 text-xs uppercase tracking-wider">Peso:</span>
            <span className="text-[#1A1A1A] font-normal">{medidaActual.peso}</span>
          </div>
        )}
        {medidaActual.largo && (
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-gray-400 text-xs uppercase tracking-wider">Largo:</span>
            <span className="text-[#1A1A1A] font-normal">{medidaActual.largo}</span>
          </div>
        )}
        {medidaActual.ancho && (
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-gray-400 text-xs uppercase tracking-wider">ancho:</span>
            <span className="text-[#1A1A1A] font-normal">{medidaActual.ancho}</span>
          </div>
        )}
        {medidaActual.alto && (
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-400 text-xs uppercase tracking-wider">Alto:</span>
            <span className="text-[#1A1A1A] font-normal">{medidaActual.alto}</span>
          </div>
        )}
      </div>
    </div>
  );
};