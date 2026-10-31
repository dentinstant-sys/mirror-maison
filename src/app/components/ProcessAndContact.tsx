export default function ProcessAndContact() {
  return (
    <section id="contacto" className="w-full py-24 bg-[#F5EFE7] border-t border-[#D8C7B4]/40">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Pasos */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-sans tracking-[0.3em] uppercase text-[#8C6D53] block mb-3 font-semibold">
            PASO A PASO
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-[#1F1F1F] font-normal mb-4">
            ¿Cómo crear tu <span className="italic font-light">mueble ideal?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="flex flex-col items-center text-center p-6">
            <span className="w-12 h-12 rounded-full bg-[#1F1F1F] text-[#F5EFE7] flex items-center justify-center font-serif text-lg mb-4">1</span>
            <h3 className="font-serif text-lg text-[#1F1F1F] mb-2">Cuéntanos tu idea</h3>
            <p className="text-xs text-gray-600 font-light">Envíanos referencias, medidas o cuéntanos qué espacio deseas transformar por WhatsApp.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6">
            <span className="w-12 h-12 rounded-full bg-[#1F1F1F] text-[#F5EFE7] flex items-center justify-center font-serif text-lg mb-4">2</span>
            <h3 className="font-serif text-lg text-[#1F1F1F] mb-2">Personalización y Cotización</h3>
            <p className="text-xs text-gray-600 font-light">Definimos juntos las telas, tonos de madera y te entregamos un presupuesto detallado sin compromiso.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6">
            <span className="w-12 h-12 rounded-full bg-[#1F1F1F] text-[#F5EFE7] flex items-center justify-center font-serif text-lg mb-4">3</span>
            <h3 className="font-serif text-lg text-[#1F1F1F] mb-2">Fabricación y Entrega</h3>
            <p className="text-xs text-gray-600 font-light">Creamos tu pieza a medida y la instalamos directamente en tu hogar.</p>
          </div>
        </div>

        {/* Tarjeta de Contacto Final */}
        <div className="bg-[#1F1F1F] text-[#F5EFE7] rounded-3xl p-10 md:p-16 text-center max-w-4xl mx-auto shadow-xl flex flex-col items-center">
          <span className="text-xs font-sans tracking-[0.3em] uppercase text-[#A1887F] block mb-3">
            HABLEMOS
          </span>
          <h3 className="font-serif text-3xl md:text-4xl font-normal mb-4">
            ¿Listo para transformar tus espacios?
          </h3>
          <p className="text-xs md:text-sm text-gray-300 font-light max-w-lg mb-8 leading-relaxed">
            Escríbenos directamente por WhatsApp y recibe asesoría personalizada con nuestros expertos en diseño de interiores.
          </p>
          <a 
            href="https://wa.me/message/D6QREGANQXL3O1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#F5EFE7] text-[#1F1F1F] px-8 py-4 rounded-full text-xs font-sans tracking-widest uppercase hover:bg-white transition-all duration-300 font-medium shadow-md"
          >
            Chatear por WhatsApp <span>→</span>
          </a>
        </div>

      </div>
    </section>
  );
}