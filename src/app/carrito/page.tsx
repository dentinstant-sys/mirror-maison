'use client';

import { useCart } from '@/app/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const DEPARTAMENTOS_COLOMBIA = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bogotá D.C.', 'Bolívar',
  'Boyacá', 'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó',
  'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira',
  'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío',
  'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima',
  'Valle del Cauca', 'Vaupés', 'Vichada'
];

export default function CarritoPage() {
  const { cart, actualizarCantidad, removerDelCarrito, vaciarCarrito, totalCarrito } = useCart();
  const [loadingBold, setLoadingBold] = useState(false);
  const [loadingWp, setLoadingWp] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [numeroWhatsapp, setNumeroWhatsapp] = useState<string>('');

  // Cargar número de WhatsApp dinámico desde Firestore
  useEffect(() => {
    async function obtenerWhatsapp() {
      try {
        const docRef = doc(db, 'configuracion', 'redes');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().whatsapp) {
          setNumeroWhatsapp(docSnap.data().whatsapp);
        }
      } catch (error) {
        console.error('Error al cargar número de WhatsApp:', error);
      }
    }
    obtenerWhatsapp();
  }, []);

  // Estado del formulario de cliente y envío
  const [formData, setFormData] = useState({
    nombreApellido: '',
    celular: '',
    correo: '',
    departamento: '',
    ciudad: '',
    direccion: '',
    indicaciones: '',
    aceptaTiempo: false,
    aceptaTerminos: false,
    aceptaTratamientoDatos: false,
    esMayorEdad: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleProcederCheckout = () => {
    if (cart.length === 0) return;
    setModalOpen(true);
  };

  const validarCheckboxes = () => {
    if (!formData.aceptaTiempo || !formData.aceptaTerminos || !formData.aceptaTratamientoDatos || !formData.esMayorEdad) {
      alert('Debes aceptar todos los términos y declaraciones antes de continuar.');
      return false;
    }
    return true;
  };

  // Función auxiliar para notificar al panel administrativo
  const enviarNotificacionPush = async (orderId: string) => {
    try {
      const response = await fetch('/api/notificar-pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderId,
          nombreCliente: formData.nombreApellido,
          total: totalCarrito,
        }),
      });

      const resData = await response.json();
      console.log('Respuesta de /api/notificar-pedido:', resData);
    } catch (err) {
      console.error('Error al enviar la notificación push:', err);
    }
  };

  // 1. PAGO POR BOLD
  const handlePagarBold = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarCheckboxes()) return;

    try {
      setLoadingBold(true);

      const orderId = `MM-${Date.now()}`;

      // Guardar pedido en Firestore con fecha y hora
      await addDoc(collection(db, 'pedidos'), {
        orderId,
        cliente: formData,
        items: cart,
        total: totalCarrito,
        metodoPago: 'Bold',
        estado: 'Pendiente',
        fechaCreacion: serverTimestamp(),
        fechaTexto: new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }),
      });

      // 🔔 Disparar notificación push al admin
      await enviarNotificacionPush(orderId);

      const res = await fetch('/api/checkout/bold', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalCarrito: totalCarrito,
          orderId: orderId,
          cliente: formData,
          items: cart,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Ocurrió un error al generar la orden de pago.');
      }
    } catch (error) {
      console.error('Error al iniciar el pago con Bold:', error);
      alert('No se pudo conectar con el servidor de pagos.');
    } finally {
      setLoadingBold(false);
    }
  };

  // 2. PAGO POR WHATSAPP
  const handlePagarWhatsApp = async () => {
    if (!validarCheckboxes()) return;

    if (!formData.nombreApellido || !formData.celular || !formData.departamento || !formData.ciudad || !formData.direccion) {
      alert('Por favor completa los campos obligatorios del formulario antes de continuar.');
      return;
    }

    try {
      setLoadingWp(true);

      const orderId = `MM-WP-${Date.now()}`;

      // Guardar pedido en Firestore con fecha y hora
      await addDoc(collection(db, 'pedidos'), {
        orderId,
        cliente: formData,
        items: cart,
        total: totalCarrito,
        metodoPago: 'WhatsApp',
        estado: 'Pendiente WhatsApp',
        fechaCreacion: serverTimestamp(),
        fechaTexto: new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }),
      });

      // 🔔 Disparar notificación push al admin
      await enviarNotificacionPush(orderId);

      // Construcción del mensaje formateado para WhatsApp
      const listaProductos = cart
        .map((item) => `• ${item.nombre} (x${item.cantidad}) - $${(item.precio * item.cantidad).toLocaleString('es-CO')} COP`)
        .join('\n');

      const mensaje = `Hola, vengo de la página web de Decoespejos. Quiero terminar de pagar mi pedido.\n\n` +
        `*Número de Orden:* ${orderId}\n\n` +
        `*CLIENTE:* ${formData.nombreApellido}\n` +
        `*Celular:* ${formData.celular}\n` +
        `*Correo:* ${formData.correo || 'No especificado'}\n\n` +
        `*DIRECCIÓN DE ENTREGA:*\n` +
        `*Ciudad / Depto:* ${formData.ciudad}, ${formData.departamento}\n` +
        `*Dirección:* ${formData.direccion}\n` +
        `*Indicaciones:* ${formData.indicaciones || 'Ninguna'}\n\n` +
        `*PRODUCTOS SELECCIONADOS:*\n${listaProductos}\n\n` +
        `*TOTAL A PAGAR:* $${totalCarrito.toLocaleString('es-CO')} COP`;

      // Vaciar carrito local
      vaciarCarrito();

      // Redirigir a WhatsApp
      const targetPhone = numeroWhatsapp || '573001234567'; // Número por defecto si no se ha configurado
      const urlWp = `https://wa.me/${targetPhone}?text=${encodeURIComponent(mensaje)}`;
      window.open(urlWp, '_blank');

      setModalOpen(false);
    } catch (error) {
      console.error('Error al registrar pedido por WhatsApp:', error);
      alert('Ocurrió un error al guardar tu pedido.');
    } finally {
      setLoadingWp(false);
    }
  };

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen pt-28 pb-24 px-6 text-[#111111]">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* ENCABEZADO */}
        <header className="border-b border-[#EAE7E1] pb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#8C8275] font-medium block mb-2">
              Decoespejos
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
              href="/"
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
                          sizes="(max-width: 768px) 80px, 100px"
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

                    <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#EAE7E1]">
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                          className="w-8 h-8 rounded-lg bg-white border border-[#EAE7E1] text-[#111111] font-bold hover:bg-[#FAF9F6] flex items-center justify-center transition-colors text-xs cursor-pointer"
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
                        >
                          +
                        </button>
                      </div>

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

            {/* RESUMEN DE COMPRA */}
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
                onClick={handleProcederCheckout}
                className="w-full bg-[#111111] text-[#FAF9F6] hover:bg-[#8C8275] transition-colors py-4 rounded-xl text-xs uppercase tracking-[0.2em] font-semibold cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <span>PROCEDER AL PAGO</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* MODAL DE DATOS DE ENVÍO Y CONFIRMACIÓN */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#FAF9F6] w-full max-w-2xl rounded-2xl p-6 md:p-8 shadow-2xl border border-[#EAE7E1] my-8 relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-[#EAE7E1] pb-4 mb-6">
              <div>
                <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#8C8275] block">
                  INFORMACIÓN DE DESPACHO
                </span>
                <h3 className="font-serif text-xl text-[#111111] uppercase tracking-wide">
                  Datos de Entrega
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-xl font-light text-[#111111] hover:text-[#8C8275]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePagarBold} className="space-y-6 text-xs text-[#111111]">
              
              {/* ¿Quién lo recibe? */}
              <div className="space-y-4">
                <h4 className="font-semibold uppercase tracking-wider text-[#8C8275] border-b border-[#EAE7E1] pb-1">
                  ¿Quién lo recibe?
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium">Nombre y apellido *</label>
                    <input
                      type="text"
                      name="nombreApellido"
                      required
                      value={formData.nombreApellido}
                      onChange={handleChange}
                      placeholder="Ej. Juan Pérez"
                      className="w-full p-3 bg-white border border-[#EAE7E1] rounded-lg focus:outline-none focus:border-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Celular con WhatsApp *</label>
                    <input
                      type="tel"
                      name="celular"
                      required
                      value={formData.celular}
                      onChange={handleChange}
                      placeholder="Ej. 300 123 4567"
                      className="w-full p-3 bg-white border border-[#EAE7E1] rounded-lg focus:outline-none focus:border-[#111111]"
                    />
                    <p className="text-[10px] text-[#8C8275] mt-1">Para avisarte cómo va tu pedido.</p>
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-medium">Correo (opcional)</label>
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    placeholder="correo@ejemplo.com"
                    className="w-full p-3 bg-white border border-[#EAE7E1] rounded-lg focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              {/* ¿A dónde lo llevamos? */}
              <div className="space-y-4 pt-2">
                <h4 className="font-semibold uppercase tracking-wider text-[#8C8275] border-b border-[#EAE7E1] pb-1">
                  ¿A dónde lo llevamos?
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium">Departamento *</label>
                    <select
                      name="departamento"
                      required
                      value={formData.departamento}
                      onChange={handleChange}
                      className="w-full p-3 bg-white border border-[#EAE7E1] rounded-lg focus:outline-none focus:border-[#111111]"
                    >
                      <option value="">Escoge uno</option>
                      {DEPARTAMENTOS_COLOMBIA.map((dep) => (
                        <option key={dep} value={dep}>{dep}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Ciudad *</label>
                    <input
                      type="text"
                      name="ciudad"
                      required
                      value={formData.ciudad}
                      onChange={handleChange}
                      placeholder="Ej. Medellín / Bogotá"
                      className="w-full p-3 bg-white border border-[#EAE7E1] rounded-lg focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-medium">Dirección *</label>
                  <input
                    type="text"
                    name="direccion"
                    required
                    value={formData.direccion}
                    onChange={handleChange}
                    placeholder="Ej. Cra 43A # 1-50 Apt 301"
                    className="w-full p-3 bg-white border border-[#EAE7E1] rounded-lg focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Indicaciones para llegar (si hace falta)</label>
                  <textarea
                    name="indicaciones"
                    rows={2}
                    value={formData.indicaciones}
                    onChange={handleChange}
                    placeholder="Ej. Dejar en Portería, conjunto residencial los Pinos"
                    className="w-full p-3 bg-white border border-[#EAE7E1] rounded-lg focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              {/* Antes de pagar */}
              <div className="space-y-3 pt-2 bg-[#F2F0EB] p-4 rounded-xl border border-[#EAE7E1]">
                <h4 className="font-semibold uppercase tracking-wider text-[#111111] mb-2">
                  Antes de pagar
                </h4>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="aceptaTiempo"
                    required
                    checked={formData.aceptaTiempo}
                    onChange={handleChange}
                    className="mt-0.5 accent-[#111111]"
                  />
                  <span>Entiendo y acepto que mi pedido llega en 15 días desde mi anticipo.</span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="aceptaTerminos"
                    required
                    checked={formData.aceptaTerminos}
                    onChange={handleChange}
                    className="mt-0.5 accent-[#111111]"
                  />
                  <span>
                    Leí y acepto los{' '}
                    <Link
                      href="/terminos-y-condiciones"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-semibold hover:text-[#8C8275] transition-colors"
                    >
                      términos y condiciones
                    </Link>
                    .
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="aceptaTratamientoDatos"
                    required
                    checked={formData.aceptaTratamientoDatos}
                    onChange={handleChange}
                    className="mt-0.5 accent-[#111111]"
                  />
                  <span>
                    Autorizo el tratamiento de mis datos para gestionar mi pedido, según la{' '}
                    <Link
                      href="/politica-de-datos"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-semibold hover:text-[#8C8275] transition-colors"
                    >
                      política de datos personales
                    </Link>
                    .
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="esMayorEdad"
                    required
                    checked={formData.esMayorEdad}
                    onChange={handleChange}
                    className="mt-0.5 accent-[#111111]"
                  />
                  <span>Soy mayor de edad.</span>
                </label>
              </div>

              {/* BOTONES FINALES DE PAGO */}
              <div className="space-y-3 pt-2">
                {/* BOTÓN 1: PAGO CON TARJETA / BOLD */}
                <button
                  type="submit"
                  disabled={loadingBold || loadingWp}
                  className="w-full bg-[#111111] text-[#FAF9F6] hover:bg-[#8C8275] transition-colors py-4 rounded-xl text-xs uppercase tracking-[0.2em] font-semibold cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{loadingBold ? 'PROCESANDO PAGO...' : `PAGAR $${totalCarrito.toLocaleString('es-CO')} COP CON BOLD`}</span>
                </button>

                {/* BOTÓN 2: PAGO / PEDIDO POR WHATSAPP */}
                <button
                  type="button"
                  onClick={handlePagarWhatsApp}
                  disabled={loadingBold || loadingWp}
                  className="w-full bg-[#25D366] text-white hover:bg-[#20ba5a] transition-colors py-4 rounded-xl text-xs uppercase tracking-[0.2em] font-semibold cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>📱</span>
                  <span>{loadingWp ? 'REGISTRANDO PEDIDO...' : 'TERMINAR PAGO CON WHATSAPP'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </main>
  );
}