'use client';

import { useCart } from '@/app/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { abrirCheckoutBold } from '@/lib/bold';

export default function CarritoPage() {
  const { cart, actualizarCantidad, removerDelCarrito, vaciarCarrito, totalCarrito } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckoutBold = async () => {
  if (cart.length === 0 || loading) return;

  try {
    setLoading(true);

    const res = await fetch('/api/checkout/bold', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        totalCarrito,
        orderId: `MM-${Date.now()}`,
      }),
    });

    const cobro = await res.json();

    if (!res.ok) {
      alert(cobro.error || 'Ocurrió un error al generar la orden de pago.');
      return;
    }

    const resultado = await abrirCheckoutBold(cobro);
    if (resultado === 'no_abrio') {
      alert('No se pudo abrir el checkout de Bold. Intenta de nuevo.');
    }
  } catch (error) {
    console.error('Error al iniciar el pago:', error);
    alert('No se pudo conectar con el servidor de pagos.');
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen pt-28 pb-24 px-6 text-[#111111]">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* ENCABEZADO */}
        <header className="border-b border-[#EAE7E1] pb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#8C8275] font-medium block mb-2">
              MAISON MIROIR
            </span>
            <h1 className="font-serif text-3xl md:text-4xl text-[#111111] font-normal uppercase tracking-wide">
              Bolsa de Compra
            </h1>
          </div>
          <Link
            href="/"
            className="text-xs uppercase tracking-widest text-[#8C8275] hover:text-[#111111] font-medium transition-colors"
          >
            ← Volver a la Colección
          </Link>
        </header>

        {cart.length === 0 ? (
          /* ESTADO VACÍO */
          <div className="bg-white rounded-2xl p-12 text-center border border-[#EAE7E1] shadow-sm max-w-lg mx-auto space-y-6">
            <span className="text-4xl block">🪞</span>
            <h2 className="font-serif text-2xl text-[#111111] uppercase tracking-wide">Tu bolsa está vacía</h2>
            <p className="text-xs text-[#8C8275] font-light leading-relaxed">
              Explora nuestra colección editorial de espejos de alta gama y añade tus piezas preferidas.
            </p>
            <Link
              href="/categoria/organicos"
              className="inline-block bg-[#111111] text-[#FAF9F6] py-4 px-8 rounded-xl text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#8C8275] transition-colors"
            >
              Explorar Colección
            </Link>
          </div>
        ) : (
          /* VISTA CON ELEMENTOS */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* LISTADO DE PRODUCTOS */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 md:p-8 border border-[#EAE7E1] shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-[#EAE7E1] pb-4">
                <span className="text-xs uppercase tracking-wider text-[#8C8275] font-semibold">
                  Piezas Seleccionadas ({cart.length})
                </span>
                <button
                  onClick={vaciarCarrito}
                  className="text-xs text-red-600 hover:underline uppercase font-medium cursor-pointer"
                >
                  Vaciar Bolsa
                </button>
              </div>

              <div className="divide-y divide-[#EAE7E1]">
                {cart.map((item) => (
                  <div key={item.id} className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative h-24 w-20 sm:h-28 sm:w-22 rounded-xl overflow-hidden bg-[#F2F0EB] flex-shrink-0 border border-[#EAE7E1]">
                        <Image
                          src={item.imagen}
                          alt={item.nombre}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-serif text-base sm:text-lg text-[#111111] font-medium uppercase tracking-wide">
                          {item.nombre}
                        </h3>
                        <p className="text-xs font-semibold text-[#8C8275]">
                          ${item.precio.toLocaleString('es-CO')} COP c/u
                        </p>
                      </div>
                    </div>

                    {/* CONTROLES DE CANTIDAD */}
                    <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#EAE7E1]">
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                          className="w-8 h-8 rounded-lg bg-white border border-[#EAE7E1] text-[#111111] font-bold hover:bg-[#FAF9F6] flex items-center justify-center transition-colors text-xs cursor-pointer"
                          aria-label="Disminuir cantidad"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-sans text-xs font-bold text-[#111111]">
                          {item.cantidad}
                        </span>
                        <button
                          type="button"
                          onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                          className="w-8 h-8 rounded-lg bg-white border border-[#EAE7E1] text-[#111111] font-bold hover:bg-[#FAF9F6] flex items-center justify-center transition-colors text-xs cursor-pointer"
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </button>
                      </div>

                      {/* SUB-TOTAL Y REMOVER */}
                      <div className="text-right min-w-[110px]">
                        <p className="font-serif text-base font-bold text-[#111111]">
                          ${(item.precio * item.cantidad).toLocaleString('es-CO')} COP
                        </p>
                        <button
                          onClick={() => removerDelCarrito(item.id)}
                          className="text-[11px] text-red-600 hover:underline font-medium cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* CHECKOUT BOLD */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-8 border border-[#EAE7E1] shadow-sm space-y-6 h-fit">
              <h2 className="font-serif text-xl text-[#111111] border-b border-[#EAE7E1] pb-4 uppercase tracking-wide">
                Resumen de Compra
              </h2>

              <div className="space-y-3 text-xs text-[#2D2D2D] font-medium">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${totalCarrito.toLocaleString('es-CO')} COP</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío / Despacho:</span>
                  <span className="text-[#8C8275]">A convenir</span>
                </div>
                <hr className="border-[#EAE7E1] my-2" />
                <div className="flex justify-between text-base font-serif font-bold text-[#111111] pt-2">
                  <span>Total:</span>
                  <span>${totalCarrito.toLocaleString('es-CO')} COP</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckoutBold}
                disabled={loading}
                className="w-full bg-[#111111] text-[#FAF9F6] hover:bg-[#8C8275] transition-colors py-4 rounded-xl text-xs uppercase tracking-[0.2em] font-semibold cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? 'PROCESANDO...' : 'PROCEDER AL PAGO'}</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}