import React from 'react';

interface FurnitureDimensionsProps {
  dimensions: Dimensions;
  className?: string;
}

export interface Dimensions {
  width: number;  // Ancho en cm
  height: number; // Alto en cm
  depth: number;  // Profundidad en cm
}

export const FurnitureDimensions: React.FC<FurnitureDimensionsProps> = ({
  dimensions,
  className = '',
}) => {
  const { width, height, depth } = dimensions;

  return (
    <div className={`flex items-center gap-4 text-xs text-neutral-600 ${className}`}>
      <div className="flex items-center gap-1" title="Ancho">
        <span className="font-semibold text-neutral-900">Ancho:</span>
        <span>{width} cm</span>
      </div>
      <span className="text-neutral-300">|</span>
      <div className="flex items-center gap-1" title="Alto">
        <span className="font-semibold text-neutral-900">Alto:</span>
        <span>{height} cm</span>
      </div>
      <span className="text-neutral-300">|</span>
      <div className="flex items-center gap-1" title="Profundidad">
        <span className="font-semibold text-neutral-900">Fondo:</span>
        <span>{depth} cm</span>
      </div>
    </div>
  );
};