'use client';

import Link from 'next/link';

export default function TerminosYCondicionesPage() {
  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen pt-28 pb-24 px-6 text-[#111111]">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* ENCABEZADO */}
        <header className="border-b border-[#EAE7E1] pb-8 space-y-2">
          <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#8C8275] font-medium block">
            MAISON MIROIR
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-[#111111] uppercase tracking-wide">
            Términos y Condiciones
          </h1>
          <p className="text-xs text-[#8C8275] font-light pt-1">
            Versión 1 · Vigente desde el 10 de octubre de 2026
          </p>
        </header>

        {/* CONTENIDO EDITORIAL DE TEXTO */}
        <article className="prose prose-stone max-w-none text-xs leading-relaxed text-[#2D2D2D] space-y-6 font-light">
          
          <section className="space-y-3">
            <h2 className="font-serif text-lg text-[#111111] uppercase tracking-wider font-normal">
              1. Generalidades
            </h2>
            <p>
              Estos términos regulan las compras hechas en <strong>maisonmiroir.co</strong> (el &quot;sitio&quot;), la tienda en línea de espejos y piezas de alta gama de Maison Miroir. Al marcar la casilla &quot;Leí y acepto los términos y condiciones&quot; en la página de pago o en el carrito, aceptas esta versión del texto, que queda registrada junto con tu pedido.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-[#111111] uppercase tracking-wider font-normal">
              2. Quién vende
            </h2>
            <p>
              Maison Miroir [puedes incluir NIT o datos si aplica]. Dirección de notificación: [Ciudad, Colombia]. Atención por WhatsApp desde cualquier página del sitio, o a través de nuestros canales oficiales de soporte.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-[#111111] uppercase tracking-wider font-normal">
              3. Cómo se compra
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Escoges la pieza o espejo de tu preferencia, sus medidas o acabados, y la agregas a tu bolsa de compra. El sitio te muestra el valor total de las piezas.</li>
              <li>En la página de pago nos proporcionas tus datos de entrega, aceptas el plazo de entrega estimado, estos términos y la política de tratamiento de datos.</li>
              <li>Procedes al pago seguro a través de Bold.</li>
              <li>Cuando Bold aprueba la transacción, tu pedido queda confirmado de inmediato: recibes los detalles y la referencia de pago. Si la transacción no se aprueba o se cancela, no se genera ningún cargo.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-[#111111] uppercase tracking-wider font-normal">
              4. Precios y Pago
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Los precios están expresados en pesos colombianos (COP) e incluyen los impuestos aplicables. El valor válido es el reflejado en la pasarela de pago al momento de confirmar la transacción.</li>
              <li>El pago en línea es procesado de forma segura por Bold (tarjeta de crédito, PSE, Nequi, etc.). Maison Miroir no almacena información financiera ni datos sensibles de tus tarjetas o cuentas bancarias.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-[#111111] uppercase tracking-wider font-normal">
              5. Plazo de Entrega
            </h2>
            <p>
              El plazo estimado de entrega corre a partir de la confirmación y aprobación de tu pago. Al tratarse de piezas de diseño y espejos artesanales, el tiempo estándar estipulado es de aproximadamente <strong>15 días</strong> (salvo especificación contraria en la ficha del producto). Si se presenta alguna novedad o retraso, te notificaremos oportunamente a través de nuestros canales de contacto.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-[#111111] uppercase tracking-wider font-normal">
              6. Envíos y Entregas
            </h2>
            <p>
              Realizamos envíos a nivel nacional en Colombia, a la dirección indicada por el usuario durante el proceso de compra. Es indispensable que revises el estado del espejo al recibirlo frente al transportador. Si la pieza presenta algún daño atribuible al transporte, debes reportarlo inmediatamente y escribirnos con soportes fotográficos para gestionar la garantía o reposición correspondiente.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-[#111111] uppercase tracking-wider font-normal">
              7. Garantía
            </h2>
            <p>
              Nuestros productos cuentan con garantía por defectos de fabricación o de materiales, conforme a lo estipulado por la Ley 1480 de 2011 (Estatuto del Consumidor). Esta garantía no cubre daños por mala manipulación, instalación inadecuada, exposición a humedad excesiva o golpes posteriores a la recepción.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-[#111111] uppercase tracking-wider font-normal">
              8. Retracto y Devoluciones
            </h2>
            <p>
              De acuerdo con el artículo 47 de la Ley 1480 de 2011, podrás ejercer tu derecho de retracto dentro de los cinco (5) días hábiles siguientes a la entrega del producto, siempre y cuando la pieza se encuentre en perfectas condiciones y en su empaque original. El costo del transporte de devolución correrá por cuenta del comprador. <em>Nota: El retracto no aplica para espejos fabricados bajo medidas especiales o personalizaciones exclusivas del cliente.</em>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-[#111111] uppercase tracking-wider font-normal">
              9. Tratamiento de Datos Personales
            </h2>
            <p>
              Tus datos personales son recolectados y tratados exclusivamente para gestionar la fabricación, el envío y el soporte de tu pedido, en estricto cumplimiento de la Ley 1581 de 2012 de Habeas Data, tal como se describe en nuestra política de privacidad.
            </p>
          </section>

        </article>

        {/* VOLVER */}
        <div className="pt-8 border-t border-[#EAE7E1]">
          <Link
            href="/carrito"
            className="text-xs uppercase tracking-widest text-[#111111] hover:text-[#8C8275] underline font-medium transition-colors"
          >
            ← Volver a la Bolsa de Compra
          </Link>
        </div>

      </div>
    </main>
  );
}