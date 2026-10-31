import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function Logo({ width = 160, height = 55, className = '' }: LogoProps) {
  return (
    <Link href="/" className={`inline-block group cursor-pointer ${className}`}>
      <div className="relative" style={{ width, height }}>
        <Image
          src="/images/logo-maison-miroir.png" // Ajusta la ruta si lo guardaste con otro nombre en /public
          alt="Maison Miroir - Colección de Espejos de Lujo"
          fill
          className="object-contain transition-transform duration-500 group-hover:scale-105"
          priority
        />
      </div>
    </Link>
  );
}