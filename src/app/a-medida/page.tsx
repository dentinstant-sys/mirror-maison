'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Image from 'next/image';

interface ItemConfig {
  id: string;
  nombre: string;
  imagen?: string;
  tipo: 'tipo_mueble' | 'estilo' | 'pata' | 'costura';
}

interface Material {
  id: string;
  nombre: string;
  categoria: string;
  imagen: string;
}

export default function AMedidaPage() {
  const [tiposMueble, setTiposMueble] = useState<ItemConfig[]>([]);
  const [estilos, setEstilos] = useState<ItemConfig[]>([]);
  const [patas, setPatas] = useState<ItemConfig[]>([]);
  const [costuras, setCosturas] = useState<ItemConfig[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);


  
  // Estados para selección separada de materiales
  const [telaSeleccionada, setTelaSeleccionada] = useState('');
  const [maderaSeleccionada, setMaderaSeleccionada] = useState('');
  const [colorSeleccionado, setColorSeleccionado] = useState('Arena');

  // Separar materiales por categoría automáticamente desde la colección de Firebase
  const telasFiltradas = materiales.filter((m) => 
    !m.categoria.toLowerCase().includes('madera')
  );
  const maderasFiltradas = materiales.filter((m) => 
    m.categoria.toLowerCase().includes('madera')
  );

  useEffect(() => {
    // Asignar selección por defecto al cargar datos
    if (telasFiltradas.length > 0 && !telaSeleccionada) setTelaSeleccionada('');
    if (maderasFiltradas.length > 0 && !maderaSeleccionada) setMaderaSeleccionada('');
  }, [materiales]);

  // Respuestas del usuario
  const [tipoSeleccionado, setTipoSeleccionado] = useState('');
  const [estiloSeleccionado, setEstiloSeleccionado] = useState('');
  const [ancho, setAncho] = useState('220');
  const [fondo, setFondo] = useState('100');
  const [alto, setAlto] = useState('70');
  const [pataSeleccionada, setPataSeleccionada] = useState('');
  const [costuraSeleccionada, setCosturaSeleccionada] = useState('');
  
  const [detallesIdea, setDetallesIdea] = useState('');
  const [imagenIdeaFile, setImagenIdeaFile] = useState<File | null>(null);

  const [nombre, setNombre] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [celular, setCelular] = useState('');
  const [correo, setCorreo] = useState('');

  const [enviando, setEnviando] = useState(false);
  const numeroWhatsApp = '573000000000';

  const inputEstilo = "w-full border border-gray-200 rounded-xl p-3 text-sm text-[#1A1A1A] font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#8C6D53] bg-white";

  useEffect(() => {
    async function cargarTodo() {
      // 1. Opciones del configurador
      const configSnap = await getDocs(collection(db, 'configurador_opciones'));
      const listConfig: ItemConfig[] = [];
      configSnap.forEach((doc) => listConfig.push({ id: doc.id, ...doc.data() } as ItemConfig));

      const mueb = listConfig.filter((i) => i.tipo === 'tipo_mueble');
      const est = listConfig.filter((i) => i.tipo === 'estilo');
      const pat = listConfig.filter((i) => i.tipo === 'pata');
      const cos = listConfig.filter((i) => i.tipo === 'costura');

      setTiposMueble(mueb);
      setEstilos(est);
      setPatas(pat);
      setCosturas(cos);

      if (mueb[0]) setTipoSeleccionado(mueb[0].nombre);
      if (est[0]) setEstiloSeleccionado(est[0].nombre);
      if (pat[0]) setPataSeleccionada(pat[0].nombre);
      if (cos[0]) setCosturaSeleccionada(cos[0].nombre);

      // 2. Materiales
      const matSnap = await getDocs(collection(db, 'materiales'));
      const listMat: Material[] = [];
      matSnap.forEach((doc) => listMat.push({ id: doc.id, ...doc.data() } as Material));
      setMateriales(listMat);
      if (listMat[0]) setTelaSeleccionada('');
    }
    cargarTodo();
  }, []);

  const handleCotizar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    try {
      let urlImagenReferencia = '';
      if (imagenIdeaFile) {
        const storageRef = ref(storage, `cotizaciones/ref_${Date.now()}_${imagenIdeaFile.name}`);
        await uploadBytes(storageRef, imagenIdeaFile);
        urlImagenReferencia = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'cotizaciones_medida'), {
        tipoMueble: tipoSeleccionado,
        estilo: estiloSeleccionado,
        medidas: `Ancho: ${ancho}cm, Fondo: ${fondo}cm, Alto: ${alto}cm`,
     tela: `Tela: ${telaSeleccionada || 'N/A'} | Madera: ${maderaSeleccionada || 'N/A'} (Color: ${colorSeleccionado})`,
        acabados: `Patas: ${pataSeleccionada}, Costuras: ${costuraSeleccionada}`,
        detallesIdea,
        imagenReferencia: urlImagenReferencia,
        nombre,
        ciudad,
        celular,
        correo: correo || 'No proporcionado',
        estado: 'pendiente',
        creadoEn: serverTimestamp(),
      });

      const mensaje = `Hola *Acomódate Muebles*, quiero cotizar un diseño personalizado:%0A%0A🛋️ *Mueble:* ${tipoSeleccionado} (${estiloSeleccionado})%0A📏 *Medidas:* ${ancho}x${fondo}x${alto} cm%0A🧶 🧶 *Materiales:* Tela: ${telaSeleccionada || 'N/A'}, Madera: ${maderaSeleccionada || 'N/A'} (Color: ${colorSeleccionado}) (${colorSeleccionado})%0A🪵 *Acabados:* Patas ${pataSeleccionada}, Costuras ${costuraSeleccionada}%0A💬 *Idea:* ${detallesIdea || 'N/A'}%0A👤 *Cliente:* ${nombre} (${ciudad}) - Tel: ${celular}`;

      window.open(`https://wa.me/message/D6QREGANQXL3O1${numeroWhatsApp}?text=${mensaje}`, '_blank');
      alert('¡Configuración enviada! Te hemos redirigido a WhatsApp.');
    } catch (error) {
      console.error('Error al enviar:', error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="w-full bg-[#FDFBF7] min-h-screen pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        
   {/* HERO BANNER CON IMAGEN DE FONDO Y VALORES */}
        <div className="relative rounded-3xl overflow-hidden bg-[#1A1A1A] text-white p-10 md:p-16 shadow-lg">
          {/* Imagen de fondo con opacidad */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/acomodate-muebles.firebasestorage.app/o/sofa-banner.jpg?alt=media&token=dd6bf266-6f9f-48ab-9ca3-7d24487c69b8"
              alt="Personaliza tu mueble"
              fill
              className="object-cover object-center opacity-40"
            />
          </div>

          <div className="relative z-10 max-w-2xl space-y-6">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#8C6D53] font-sans font-semibold block mb-2">
                PERSONALIZA TU MUEBLE
              </span>
              <h1 className="font-serif text-4xl md:text-5xl font-normal leading-tight">
                Tu idea, nosotros la hacemos.
              </h1>
            </div>
            <p className="text-sm text-gray-200 font-light leading-relaxed">
              Diseña cada detalle y crea un mueble único, hecho a tu medida, con los materiales y acabados que más te gustan.
            </p>

            {/* Íconos de características */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/20">
              <div className="space-y-1">
                <span className="text-xl">✏️</span>
                <p className="text-[11px] uppercase tracking-wider font-medium">Diseño a tu estilo</p>
              </div>
              <div className="space-y-1">
                <span className="text-xl">🪵</span>
                <p className="text-[11px] uppercase tracking-wider font-medium">Materiales de alta calidad</p>
              </div>
              <div className="space-y-1">
                <span className="text-xl">🛠️</span>
                <p className="text-[11px] uppercase tracking-wider font-medium">Fabricación propia</p>
              </div>
              <div className="space-y-1">
                <span className="text-xl">💬</span>
                <p className="text-[11px] uppercase tracking-wider font-medium">Asesoría personalizada</p>
              </div>
            </div>
          </div>
        </div>

        {/* 01. TIPO DE MUEBLE DINÁMICO */}
        <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-3 flex items-baseline gap-4">
            <span className="font-serif text-2xl text-[#8C6D53]">01</span>
            <h2 className="font-serif text-xl text-[#1A1A1A]">¿Qué tipo de mueble quieres crear?</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {tiposMueble.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTipoSeleccionado(item.nombre)}
                className={`p-4 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center ${
                  tipoSeleccionado === item.nombre
                    ? 'border-[#1A1A1A] bg-gray-50 ring-1 ring-[#1A1A1A]'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                {item.imagen && (
                  <div className="relative h-24 w-full mb-3 rounded-lg overflow-hidden">
                    <Image src={item.imagen} alt={item.nombre} fill className="object-cover" />
                  </div>
                )}
                <span className="text-xs font-sans uppercase font-medium text-[#1A1A1A]">{item.nombre}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 02. ESTILOS DINÁMICOS */}
        <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-3 flex items-baseline gap-4">
            <span className="font-serif text-2xl text-[#8C6D53]">02</span>
            <h2 className="font-serif text-xl text-[#1A1A1A]">Elige el estilo</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {estilos.map((est) => (
              <button
                key={est.id}
                type="button"
                onClick={() => setEstiloSeleccionado(est.nombre)}
                className={`px-6 py-3 rounded-xl border text-xs font-sans uppercase font-medium transition-all cursor-pointer ${
                  estiloSeleccionado === est.nombre
                    ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {est.nombre}
              </button>
            ))}
          </div>
        </section>

{/* 03. MEDIDAS CON IMAGEN GRÁFICA */}
          <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6 flex flex-col justify-between">
            <div>
              <div className="border-b border-gray-100 pb-3 flex items-baseline gap-4 mb-6">
                <span className="font-serif text-2xl text-[#8C6D53]">03</span>
                <div>
                  <h2 className="font-serif text-xl text-[#1A1A1A]">Define tus medidas</h2>
                  <p className="text-xs text-gray-400 font-light">Indícanos las medidas de tu espacio o el mueble que deseas.</p>
                </div>
              </div>

              {/* Imagen gráfica explicativa del sofá con cotas */}
                      <div className="relative h-48 w-full bg-white rounded-xl overflow-hidden border border-gray-100 mb-6 flex items-center justify-center p-2">
                          <Image
                              src="https://firebasestorage.googleapis.com/v0/b/acomodate-muebles.firebasestorage.app/o/medidas-sofa.jpg?alt=media&token=4b18f8db-3d18-4aed-9330-cc463e1dfa63"
                              alt="Esquema de medidas del mueble"
                              fill
                              className="object-contain opacity-90"
                          />
                      </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-xs uppercase font-medium text-gray-600">Ancho (cm)</span>
                <input type="number" value={ancho} onChange={(e) => setAncho(e.target.value)} className="w-24 text-center border border-gray-200 rounded-lg p-2 text-sm font-bold bg-white text-[#1A1A1A]" />
              </div>
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-xs uppercase font-medium text-gray-600">Fondo (cm)</span>
                <input type="number" value={fondo} onChange={(e) => setFondo(e.target.value)} className="w-24 text-center border border-gray-200 rounded-lg p-2 text-sm font-bold bg-white text-[#1A1A1A]" />
              </div>
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-xs uppercase font-medium text-gray-600">Alto (cm)</span>
                <input type="number" value={alto} onChange={(e) => setAlto(e.target.value)} className="w-24 text-center border border-gray-200 rounded-lg p-2 text-sm font-bold bg-white text-[#1A1A1A]" />
              </div>
            </div>
          </section>

        {/* 05. ACABADOS DINÁMICOS (PATAS Y COSTURAS) */}
        <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-3 flex items-baseline gap-4">
            <span className="font-serif text-2xl text-[#8C6D53]">05</span>
            <h2 className="font-serif text-xl text-[#1A1A1A]">Elige tus acabados</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Patas */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-3 font-semibold">
                Patas
              </label>
              <div className="flex flex-wrap gap-2">
                {patas.map((pata) => (
                  <button
                    key={pata.id}
                    type="button"
                    onClick={() => setPataSeleccionada(pata.nombre)}
                    className={`px-4 py-2 rounded-xl text-xs border transition-all cursor-pointer capitalize ${
                      pataSeleccionada === pata.nombre
                        ? 'bg-[#1A1A1A] text-white font-medium'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {pata.nombre}
                  </button>
                ))}
              </div>
            </div>

            {/* Costuras */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-3 font-semibold">
                Costuras
              </label>
              <div className="flex flex-wrap gap-2">
                {costuras.map((costura) => (
                  <button
                    key={costura.id}
                    type="button"
                    onClick={() => setCosturaSeleccionada(costura.nombre)}
                    className={`px-4 py-2 rounded-xl text-xs border transition-all cursor-pointer capitalize ${
                      costuraSeleccionada === costura.nombre
                        ? 'bg-[#1A1A1A] text-white font-medium'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {costura.nombre}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 06 & 07. IDEA Y COTIZACIÓN */}
        <section className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="border-b border-gray-100 pb-3 flex items-baseline gap-4">
              <span className="font-serif text-2xl text-[#8C6D53]">06</span>
              <h2 className="font-serif text-xl text-[#1A1A1A]">Cuéntanos tu idea</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-semibold">Detalles adicionales</label>
                <textarea rows={4} value={detallesIdea} onChange={(e) => setDetallesIdea(e.target.value)} placeholder="Número de puestos, estilo que te gusta..." className={inputEstilo} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-semibold">Sube una imagen de referencia (Opcional)</label>
                <input type="file" accept="image/*" onChange={(e) => setImagenIdeaFile(e.target.files?.[0] || null)} className="w-full text-xs text-gray-500 border border-gray-200 rounded-xl p-3 bg-gray-50" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-[#FDFBF7] p-8 rounded-2xl border border-gray-200 space-y-6">
            <div className="border-b border-gray-100 pb-3 flex items-baseline gap-4">
              <span className="font-serif text-2xl text-[#8C6D53]">07</span>
              <h2 className="font-serif text-xl text-[#1A1A1A]">Cotiza tu diseño</h2>
            </div>

            <form onSubmit={handleCotizar} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase font-semibold text-gray-600 mb-1">Tu Nombre *</label>
                  <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Carlos Rodriguez" className={inputEstilo} />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-semibold text-gray-600 mb-1">Ciudad *</label>
                  <input type="text" required value={ciudad} onChange={(e) => setCiudad(e.target.value)} placeholder="Bogotá" className={inputEstilo} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase font-semibold text-gray-600 mb-1">Celular con WhatsApp *</label>
                  <input type="tel" required value={celular} onChange={(e) => setCelular(e.target.value)} placeholder="3001234567" className={inputEstilo} />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-semibold text-gray-600 mb-1">Correo (Opcional)</label>
                  <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="correo@ejemplo.com" className={inputEstilo} />
                </div>
              </div>

              <button type="submit" disabled={enviando} className="w-full bg-[#1A1A1A] text-white hover:bg-[#8C6D53] transition-colors py-4 rounded-xl text-xs uppercase tracking-widest font-semibold cursor-pointer shadow-sm disabled:bg-gray-400 mt-4">
                {enviando ? 'Procesando diseño...' : 'COTIZA POR WHATSAPP →'}
              </button>
            </form>
          </div>

        </section>

      </div>
    </main>
  );
}