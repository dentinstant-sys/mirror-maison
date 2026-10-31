'use client';

import React from 'react';

interface MaterialesMuebleProps {
  materiales?: any;
}

export const MaterialesMueble: React.FC<MaterialesMuebleProps> = ({ materiales }) => {
  if (!materiales) return null;

  // Si por error de Firebase viene como string
  if (typeof materiales === 'string') {
    return (
      <div className="mb-6 space-y-2 border-t border-b border-gray-100 py-6">
        <h3 className="text-xs uppercase tracking-widest text-[#1A1A1A] font-semibold">
          Materiales
        </h3>
        <p className="text-sm text-gray-700 font-light leading-relaxed">{materiales}</p>
      </div>
    );
  }

  // Convertimos de forma segura a arreglo
  let grupos: any[] = [];
  if (Array.isArray(materiales)) {
    grupos = materiales;
  } else if (typeof materiales === 'object' && materiales !== null) {
    grupos = Object.values(materiales);
  }

  return (
    <div className="mb-6 space-y-6 border-t border-b border-gray-100 py-6">
      <h3 className="text-xs uppercase tracking-widest text-[#1A1A1A] font-semibold">
        Materiales
      </h3>

      <div className="space-y-6">
        {grupos.map((grupo, index) => {
          // Si el grupo no es un objeto válido, lo ignoramos para que no rompa React
          if (!grupo || typeof grupo !== 'object') return null;

          const categoria = typeof grupo.categoria === 'string' ? grupo.categoria : '';
          const rawItems = grupo.items;

          let itemsLista: string[] = [];
          if (Array.isArray(rawItems)) {
            itemsLista = rawItems.map((item) => 
              typeof item === 'string' ? item : JSON.stringify(item)
            );
          } else if (rawItems && typeof rawItems === 'object') {
            itemsLista = Object.values(rawItems).map((item) => 
              typeof item === 'string' ? item : JSON.stringify(item)
            );
          }

          return (
            <div key={index} className="space-y-2">
              {categoria && (
                <h4 className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium">
                  {categoria}
                </h4>
              )}

              {itemsLista.length > 0 && (
                <ul className="space-y-2 pl-4">
                  {itemsLista.map((item, itemIndex) => (
                    <li 
                      key={itemIndex} 
                      className="text-sm text-gray-600 font-light list-disc leading-relaxed"
                    >
                      {String(item)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};