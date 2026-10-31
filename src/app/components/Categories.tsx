import Image from 'next/image';
import Link from 'next/link';

const categories = [
  {
    title: 'SALAS',
    subtitle: 'Espacios para compartir',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop',
    link: '/categoria/salas',
  },
  {
    title: 'COMEDORES',
    subtitle: 'Diseños que reúnen',
    image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?q=80&w=1000&auto=format&fit=crop',
    link: '/categoria/comedores',
  },
  {
    title: 'DORMITORIOS',
    subtitle: 'Tu hogar, tu ritmo',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1000&auto=format&fit=crop',
    link: '/categoria/dormitorios',
  },
  {
    title: 'SILLAS Y POLTRONAS',
    subtitle: 'Piezas con personalidad',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000&auto=format&fit=crop',
    link: '/categoria/sillas',
  },
];

export default function Categories() {
  return (
    /* 1. El section ocupa el 100% de la pantalla y el fondo claro abarca todo a lo ancho */
    <section className="w-full bg-[#FDFBF7] py-20">
      
      {/* 2. El contenedor interno limita el ancho máximo a 7xl y centra el contenido */}
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Encabezado de sección sutil */}
        <div className="mb-12 text-center md:text-left">
          <span className="text-xs font-sans tracking-[0.3em] uppercase text-gray-500 block mb-2">
            MÁS QUE MUEBLES
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-[#1A1A1A] font-normal">
            Creamos espacios que <span className="italic font-light">te representan.</span>
          </h2>
        </div>

        {/* Grid de 4 Categorías */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <Link 
              href={cat.link} 
              key={index}
              className="group relative h-[420px] rounded-xl overflow-hidden flex flex-col justify-end p-6 bg-gray-100 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-md"
            >
              {/* Imagen de fondo con efecto zoom al hacer hover */}
              <div className="absolute inset-0 z-0">
                <Image 
                  src={cat.image} 
                  alt={cat.title} 
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                {/* Degradado sutil en la parte inferior para resaltar el texto legible */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-[#1A1A1A]/20 to-transparent" />
              </div>

              {/* Textos de la categoría */}
              <div className="relative z-10 text-white">
                <h3 className="font-serif text-2xl tracking-wide mb-1 font-medium">
                  {cat.title}
                </h3>
                <p className="font-sans text-xs tracking-wider text-gray-200 font-light flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  {cat.subtitle} <span>→</span>
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}