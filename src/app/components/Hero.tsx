import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative w-full h-[85vh] min-h-[600px] bg-[#FDFBF7] flex items-end overflow-hidden border-b border-gray-200">
      {/* Imagen de Fondo con un tratamiento suave y elegante */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" 
          alt="Acomódate Muebles - Sala de estar contemporánea" 
          fill
          priority
          className="object-cover object-center opacity-90 scale-105 transition-transform duration-1000"
        />
        {/* Degradado suave sutil para que el texto resalte a la izquierda */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FDFBF7]/90 via-[#FDFBF7]/40 to-transparent" />
      </div>

      {/* Contenido Editorial */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 w-full flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <span className="text-xs font-sans tracking-[0.3em] uppercase text-gray-500 block mb-3">
            A TU MEDIDA
          </span>
          <h1 className="font-serif text-5xl md:text-7xl text-[#1A1A1A] font-normal tracking-wide leading-[1.1] mb-6">
            Hecho para <br />
            <span className="italic font-light">acomodarse a ti.</span>
          </h1>
          <p className="font-sans text-sm md:text-base text-gray-700 font-light tracking-wide max-w-lg mb-8 leading-relaxed">
            Tú eliges el diseño, las medidas, la tela y los acabados. Nosotros lo hacemos realidad.
          </p>
          <a 
            href="/a-medida" 
            className="inline-flex items-center gap-3 bg-[#1A1A1A] text-[#FDFBF7] px-8 py-4 rounded-full text-xs font-sans tracking-widest uppercase hover:bg-[#8C6D53] transition-all duration-300 font-medium shadow-sm"
          >
            Personaliza tu mueble 
            <span className="text-base">→</span>
          </a>
        </div>

        {/* Indicador de espacios / estilo editorial a juego */}
        <div className="hidden md:flex flex-col text-right text-gray-600 text-xs tracking-widest">
          <span className="font-serif text-sm mb-1 text-[#1A1A1A]">ESPACIOS REALES</span>
          <span>HISTORIAS ÚNICAS</span>
          <span>MUEBLES A TU MEDIDA</span>
        </div>
      </div>
    </section>
  );
}