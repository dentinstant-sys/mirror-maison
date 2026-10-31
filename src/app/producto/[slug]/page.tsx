'use client';

import { useState, useEffect, use } from 'react';
import { doc, getDoc, collection, getDocs, query, limit } from 'firebase/firestore';
import { useCart } from '@/app/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';

interface EspejoProducto {
  id: string;
  nombre: string;
  categoria: string;
  subcategoria?: string;
  precio: number;
  descripcion?: string;
  imagen: string;
  imagenes?: string[];
  medidas?: { alto?: string; ancho?: string; profundidad?: string };
  materiales?: { estructura?: string; tapiz?: string; patas?: string };
  editorial?: {
    composicion?: { delantera?: string; trasera?: string };
    origen?: string;
    peso?: string;
    envio?: string;
    disponibilidad?: string;
  };
}

export default function DetalleProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug;


  const [paginaRelacionados, setPaginaRelacionados] = useState(1);
const porPaginaRelacionados = 9; // 6 o 9 elementos por página

  const [producto, setProducto] = useState<EspejoProducto | null>(null);
  const [productosRelacionados, setProductosRelacionados] = useState<EspejoProducto[]>([]);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string>('');
  const [cargando, setCargando] = useState(true);
  const [drawerAbierto, setDrawerAbierto] = useState<string | null>(null);

  const { agregarAlCarrito } = useCart();

  useEffect(() => {
    async function obtenerDatos() {
      if (!slug) return;

      try {
        setCargando(true);
        
        // 1. Obtener el producto actual
        const docRef = doc(db, 'productos', slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const espejoData: EspejoProducto = {
            id: docSnap.id,
            nombre: data.nombre || 'Espejo de Colección',
            categoria: data.categoria || 'organicos',
            subcategoria: data.subcategoria || '',
            precio: Number(data.precio) || 0,
            descripcion: data.descripcion || '',
            imagen: data.imagen || '',
            imagenes: data.imagenes && data.imagenes.length > 0 ? data.imagenes : [data.imagen],
            medidas: data.medidas || {},
            materiales: data.materiales || {},
            editorial: data.editorial || {},
          };

          setProducto(espejoData);
          setImagenSeleccionada(espejoData.imagen);

          // 2. Obtener productos relacionados ("Te puede interesar")
          const q = query(collection(db, 'productos'), limit(10));
          const querySnapshot = await getDocs(q);
          const lista: EspejoProducto[] = [];
          
          querySnapshot.forEach((docItem) => {
            // Excluimos el producto actual de la lista de recomendados
            if (docItem.id !== slug) {
              const d = docItem.data();
              lista.push({
                id: docItem.id,
                nombre: d.nombre || 'Espejo',
                categoria: d.categoria || '',
                subcategoria: d.subcategoria || '',
                precio: Number(d.precio) || 0,
                imagen: d.imagen || '',
                medidas: d.medidas || {},
              });
            }
          });

          setProductosRelacionados(lista);

        } else {
          setProducto(null);
        }
      } catch (error) {
        console.error('Error al obtener la ficha del espejo:', error);
      } finally {
        setCargando(false);
      }
    }

    obtenerDatos();
  }, [slug]);

  if (cargando) {
    return (
      <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <p className="text-xs uppercase tracking-widest text-[#8C8275] animate-pulse">
          Cargando pieza...
        </p>
      </main>
    );
  }

  if (!producto) {
    return (
      <main className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center space-y-4">
        <p className="text-xs uppercase tracking-widest text-[#8C8275]">
          El espejo solicitado no está disponible.
        </p>
        <Link href="/" className="text-xs uppercase underline text-[#111111]">
          Volver a la colección
        </Link>
      </main>
    );
  }

  const galeria = producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes : [producto.imagen];

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#111111] pb-24">
      
      {/* BREADCRUMBS */}
      <nav className="max-w-7xl mx-auto px-6 py-6 text-[10px] uppercase tracking-[0.2em] text-[#8C8275] flex items-center gap-2">
        <Link href="/" className="hover:text-[#111111] transition-colors">Inicio</Link>
        <span>/</span>
        <span className="capitalize">{producto.categoria}</span>
        <span>/</span>
        <span className="text-[#111111] font-medium">{producto.nombre}</span>
      </nav>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* GALERÍA FOTOGRÁFICA */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[3/4] bg-[#F2F0EB] w-full overflow-hidden">
            <Image
              src={imagenSeleccionada || producto.imagen}
              alt={producto.nombre}
              fill
              className="object-cover transition-all duration-500"
              priority
            />
          </div>

          {galeria.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {galeria.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setImagenSeleccionada(img)}
                  className={`relative w-20 h-24 bg-[#F2F0EB] flex-shrink-0 overflow-hidden border transition-all ${
                    imagenSeleccionada === img ? 'border-[#111111]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Vista ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DETALLES Y COMPRA */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            
            <div className="space-y-2 border-b border-[#EAE7E1] pb-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C8275] block">
                {producto.subcategoria || producto.categoria}
              </span>
              <h1 className="font-serif text-2xl md:text-3xl text-[#111111] tracking-wide uppercase font-medium">
                {producto.nombre}
              </h1>
              <p className="text-lg font-semibold text-[#111111] pt-2">
                ${producto.precio.toLocaleString('es-CO')} COP
              </p>
            </div>

            <div className="space-y-4 text-xs text-[#2D2D2D] font-light leading-relaxed">
              <p>{producto.descripcion || 'Pieza escultórica con reflejo de alta definición y marco artesanal de fina terminación.'}</p>
            </div>

            {/* BOTÓN AÑADIR AL CARRITO */}
            <div className="pt-4 space-y-3">
              <button
                onClick={() =>
                  agregarAlCarrito({
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    imagen: producto.imagen,
                  })
                }
                className="w-full bg-[#111111] text-[#FAF9F6] py-4 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#8C8275] transition-colors cursor-pointer"
              >
                Añadir a la Cesta
              </button>
            </div>

            {/* ENLACES EDITORIALES */}
            <div className="pt-8 border-t border-[#EAE7E1] space-y-3 text-[11px] uppercase tracking-widest text-[#111111]">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-medium">
                <button onClick={() => setDrawerAbierto('composicion')} className="hover:text-[#8C8275] transition-colors cursor-pointer underline underline-offset-4">
                  Detalle Producto
                </button>
                <span className="text-[#8C8275]">|</span>
                <button onClick={() => setDrawerAbierto('medidas')} className="hover:text-[#8C8275] transition-colors cursor-pointer underline underline-offset-4">
                  Guía de Medidas
                </button>
                <span className="text-[#8C8275]">|</span>
                <button onClick={() => setDrawerAbierto('envio')} className="hover:text-[#8C8275] transition-colors cursor-pointer underline underline-offset-4">
                  Envío y Devolución
                </button>
                <span className="text-[#8C8275]">|</span>
                <button onClick={() => setDrawerAbierto('disponibilidad')} className="hover:text-[#8C8275] transition-colors cursor-pointer underline underline-offset-4">
                  Disponibilidad en Tienda
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

 {/* SECCIÓN: TE PUEDE INTERESAR (CUADRÍCULA CON PAGINACIÓN) */}
{productosRelacionados.length > 0 && (() => {
  const totalPaginasRelacionados = Math.ceil(productosRelacionados.length / porPaginaRelacionados);
  const inicio = (paginaRelacionados - 1) * porPaginaRelacionados;
  const itemsVisibles = productosRelacionados.slice(inicio, inicio + porPaginaRelacionados);

  return (
    <section className="max-w-7xl mx-auto px-6 mt-28 pt-12 border-t border-[#EAE7E1] space-y-12">
      <h2 className="text-xs uppercase tracking-[0.25em] font-medium text-[#111111]">
        Te puede interesar
      </h2>

      {/* Grid de productos relacionados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {itemsVisibles.map((item) => {
          const medidaTexto = item.medidas?.alto && item.medidas?.ancho 
            ? `${item.medidas.alto} x ${item.medidas.ancho}` 
            : '';

          return (
            <Link
              key={item.id}
              href={`/producto/${item.id}`}
              className="group flex flex-col space-y-4 cursor-pointer"
            >
              <div className="relative aspect-[3/4] bg-[#F2F0EB] overflow-hidden">
                <Image
                  src={item.imagen}
                  alt={item.nombre}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              <div className="space-y-1">
                {medidaTexto && (
                  <span className="text-[10px] uppercase tracking-widest text-[#8C8275] block">
                    {medidaTexto}
                  </span>
                )}
                <h3 className="font-serif text-base text-[#111111] group-hover:text-[#8C8275] transition-colors uppercase">
                  {item.nombre}
                </h3>
                <p className="text-sm font-semibold text-[#111111] pt-1">
                  ${item.precio.toLocaleString('es-CO')} COP
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Paginación de Relacionados */}
      {totalPaginasRelacionados > 1 && (
        <div className="flex items-center justify-center gap-4 pt-8 border-t border-[#EAE7E1]">
          <button
            onClick={() => setPaginaRelacionados((prev) => Math.max(prev - 1, 1))}
            disabled={paginaRelacionados === 1}
            className="text-xs uppercase tracking-widest font-medium transition-colors hover:text-[#8C8275] disabled:opacity-30 disabled:hover:text-[#111111] disabled:cursor-not-allowed cursor-pointer px-3 py-1"
          >
            ← Anterior
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPaginasRelacionados }, (_, index) => {
              const numPagina = index + 1;
              return (
                <button
                  key={numPagina}
                  onClick={() => setPaginaRelacionados(numPagina)}
                  className={`w-8 h-8 text-xs font-medium transition-all cursor-pointer flex items-center justify-center rounded-full ${
                    paginaRelacionados === numPagina
                      ? 'bg-[#111111] text-[#FAF9F6]'
                      : 'text-[#111111] hover:bg-[#EAE7E1]'
                  }`}
                >
                  {numPagina}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setPaginaRelacionados((prev) => Math.min(prev + 1, totalPaginasRelacionados))}
            disabled={paginaRelacionados === totalPaginasRelacionados}
            className="text-xs uppercase tracking-widest font-medium transition-colors hover:text-[#8C8275] disabled:opacity-30 disabled:hover:text-[#111111] disabled:cursor-not-allowed cursor-pointer px-3 py-1"
          >
            Siguiente →
          </button>
        </div>
      )}
    </section>
  );
})()}

      {/* DRAWER LATERAL */}
      {drawerAbierto && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-[#FAF9F6] h-full p-8 md:p-10 overflow-y-auto shadow-2xl relative flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-8 border-b border-[#EAE7E1] pb-4">
                <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#111111]">
                  {drawerAbierto === 'composicion' && 'COMPOSICIÓN, CUIDADOS & ORIGEN'}
                  {drawerAbierto === 'medidas' && 'MEDIDAS Y GUÍA DE TALLAS'}
                  {drawerAbierto === 'envio' && 'ENVÍO / DEVOLUCIÓN'}
                  {drawerAbierto === 'disponibilidad' && 'DISPONIBILIDAD EN TIENDA'}
                </h3>
                <button onClick={() => setDrawerAbierto(null)} className="text-xl font-light text-[#111111] hover:text-[#8C8275] cursor-pointer">
                  ✕
                </button>
              </div>

              <div className="space-y-6 text-xs text-[#2D2D2D] font-light leading-relaxed">
                {drawerAbierto === 'composicion' && (
                  <>
                    <div className="space-y-3">
                      <h4 className="font-semibold uppercase tracking-wider text-[#111111]">COMPOSICIÓN</h4>
                      <p><strong className="font-medium">Parte Delantera:</strong> {producto.editorial?.composicion?.delantera || '100% vidrio HD'}</p>
                      <p><strong className="font-medium">Parte Trasera:</strong> {producto.editorial?.composicion?.trasera || '100% fibra madera'}</p>
                    </div>
                    <div className="space-y-2 pt-4 border-t border-[#EAE7E1]">
                      <h4 className="font-semibold uppercase tracking-wider text-[#111111]">ORIGEN</h4>
                      <p>{producto.editorial?.origen || 'Hecho en India'}</p>
                    </div>
                  </>
                )}

                {drawerAbierto === 'medidas' && (
                  <div className="space-y-4">
                    <h4 className="font-semibold uppercase tracking-wider text-[#111111]">DIMENSIONES</h4>
                    <div className="bg-[#F2F0EB] p-4 rounded-sm space-y-2 border border-[#EAE7E1]">
                      <p><strong className="font-medium">Alto:</strong> {producto.medidas?.alto || '70 cm'}</p>
                      <p><strong className="font-medium">Ancho:</strong> {producto.medidas?.ancho || '50 cm'}</p>
                      <p><strong className="font-medium">Fondo:</strong> {producto.medidas?.profundidad || '2 cm'}</p>
                      <p><strong className="font-medium">Peso:</strong> {producto.editorial?.peso || '4.00 kg'}</p>
                    </div>
                  </div>
                )}

                {drawerAbierto === 'envio' && (
                  <div className="space-y-6">
                    <h4 className="font-semibold uppercase tracking-wider text-[#111111]">ENVÍO & DEVOLUCIÓN</h4>
                    <p>{producto.editorial?.envio || 'ESTÁNDAR: 14.900 COP. Gratis para pedidos superiores a 400.000 COP.'}</p>
                  </div>
                )}

                {drawerAbierto === 'disponibilidad' && (
                  <div className="space-y-4">
                    <h4 className="font-semibold uppercase tracking-wider text-[#111111]">STOCK EN TIENDA</h4>
                    <p>{producto.editorial?.disponibilidad || 'El stock es orientativo.'}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-[#EAE7E1] text-center">
              <button onClick={() => setDrawerAbierto(null)} className="w-full bg-[#111111] text-[#FAF9F6] py-3 text-xs uppercase tracking-widest font-semibold">
                Cerrar Panel
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}