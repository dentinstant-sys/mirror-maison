import Image from 'next/image';

export default function CustomSection() {
  return (
    <section id="amedida" className="w-full py-24 bg-[#F5EFE7] border-y border-[#D8C7B4]/40">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Imagen descriptiva del proceso a medida */}
        <div className="relative h-[480px] rounded-2xl overflow-hidden shadow-lg">
          <Image 
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1000&auto=format&fit=crop" 
            alt="Muebles personalizados a medida" 
            fill
            className="object-cover object-center"
          />
        </div>

        {/* Texto explicativo */}
        <div className="flex flex-col justify-center">
          <span className="text-xs font-sans tracking-[0.3em] uppercase text-[#8C6D53] block mb-3 font-semibold">
            DISEÑO PERSONALIZADO
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-[#1F1F1F] font-normal mb-6 leading-tight">
            Fabricamos exactamente lo que <span className="italic font-light">imaginas.</span>
          </h2>
          <p className="font-sans text-sm md:text-base text-gray-700 font-light leading-relaxed mb-8">
            No te conformes con medidas estándar. Adaptamos cada centímetro, material y acabado de nuestros muebles para que encajen a la perfección con la arquitectura y personalidad de tu hogar.
          </p>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h4 className="font-serif text-lg text-[#1F1F1F] mb-1">Medidas Exactas</h4>
              <p className="text-xs text-gray-600">Diseños ajustados milimétricamente a tus espacios.</p>
            </div>
            <div>
              <h4 className="font-serif text-lg text-[#1F1F1F] mb-1">Materiales Premium</h4>
              <p className="text-xs text-gray-600">Maderas nobles, herrajes de alta durabilidad y telas antifluidos.</p>
            </div>
          </div>

          <a 
            href="/a-medida" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-[#1F1F1F] text-[#F5EFE7] px-8 py-4 rounded-full text-xs font-sans tracking-widest uppercase hover:bg-[#5A3E2B] transition-all duration-300 w-fit shadow-sm"
          >
            Empieza a diseñar tu proyecto <span>→</span>
          </a>
        </div>

      </div>
    </section>
  );
}