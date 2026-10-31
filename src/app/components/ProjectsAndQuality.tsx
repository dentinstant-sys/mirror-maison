export default function ProjectsAndQuality() {
  return (
    <section id="proyectos" className="w-full py-24 px-6 max- mx-auto bg-[#FDFBF7]">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-sans tracking-[0.3em] uppercase text-gray-500 block mb-3">
          CALIDAD GARANTIZADA
        </span>
        <h2 className="font-serif text-3xl md:text-5xl text-[#1A1A1A] font-normal mb-4">
          Excelencia en cada <span className="italic font-light">detalle.</span>
        </h2>
        <p className="text-sm text-gray-600 font-light">
          Trabajamos con un riguroso control de calidad para garantizar que cada pieza no solo sea hermosa, sino eterna.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl bg-[#F5EFE7]/60 border border-[#D8C7B4]/30 flex flex-col items-start">
          <span className="text-2xl mb-4 text-[#8C6D53]">✦</span>
          <h3 className="font-serif text-xl text-[#1A1A1A] mb-2 font-medium">Diseño Exclusivo</h3>
          <p className="text-xs text-gray-600 leading-relaxed font-light">
            Creamos piezas con carácter que se integran armónicamente en tu espacio vital, huyendo de lo convencional.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-[#F5EFE7]/60 border border-[#D8C7B4]/30 flex flex-col items-start">
          <span className="text-2xl mb-4 text-[#8C6D53]">✦</span>
          <h3 className="font-serif text-xl text-[#1A1A1A] mb-2 font-medium">Artesanía Local</h3>
          <p className="text-xs text-gray-600 leading-relaxed font-light">
            Manos expertas moldean cada estructura combinando técnicas tradicionales de tapicería con innovación moderna.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-[#F5EFE7]/60 border border-[#D8C7B4]/30 flex flex-col items-start">
          <span className="text-2xl mb-4 text-[#8C6D53]">✦</span>
          <h3 className="font-serif text-xl text-[#1A1A1A] mb-2 font-medium">Garantía Extendida</h3>
          <p className="text-xs text-gray-600 leading-relaxed font-light">
            Respaldamos la durabilidad de nuestras estructuras y acabados para tu total tranquilidad y confianza.
          </p>
        </div>
      </div>
    </section>
  );
}