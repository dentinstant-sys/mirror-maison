'use client';

import Link from 'next/link';

export default function PoliticaDatosPage() {
  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen pt-28 pb-24 px-6 text-[#111111]">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* ENCABEZADO */}
        <header className="border-b border-[#EAE7E1] pb-8 space-y-2">
          <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#8C8275] font-medium block">
            MAISON MIROIR
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-[#111111] uppercase tracking-wide">
            Política de Tratamiento de Datos Personales
          </h1>
          <p className="text-xs text-[#8C8275] font-light pt-1">
            Versión 1 · Vigente desde el 10 de octubre de 2026 (Ley 1581 de 2012 de Habeas Data Colombia)
          </p>
        </header>

        {/* CONTENIDO EDITORIAL DE TEXTO */}
        <article className="prose prose-stone max-w-none text-xs leading-relaxed text-[#2D2D2D] space-y-6 font-light">
          
          <section className="space-y-3">
            <h2 className="font-serif text-lg text-[#111111] uppercase tracking-wider font-normal">
              1. Responsable del Tratamiento
            </h2>
            <p>
              <strong>Maison Miroir</strong> es la responsable del tratamiento de los datos personales que recoge en su sitio web. Esta política cumple cabalmente con la Ley 1581 de 2012, el Decreto 1377 de 2013 y las normas complementarias sobre protección de datos en Colombia. Al marcar la casilla &quot;Autorizo el tratamiento de mis datos&quot; en la página de pago, o al interactuar con nuestros canales y formularios, autorizas expresamente este tratamiento.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-[#111111] uppercase tracking-wider font-normal">
              2. Qué datos recogemos
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Al comprar:</strong> Nombre y apellido, celular, correo electrónico, departamento, ciudad, dirección e indicaciones de entrega, así como los detalles de las piezas seleccionadas y los registros de tus aceptaciones legales.</li>
              <li><strong>Al cotizar o contactarnos:</strong> La información provista en nuestros canales de atención o formularios (nombre, celular, requerimientos o fotografías).</li>
              <li><strong>Procesamiento de pagos:</strong> Las transacciones se procesan a través de la pasarela segura de Bold. Maison Miroir no recopila ni almacena información financiera ni datos sensibles de tarjetas de crédito o cuentas bancarias.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-[#111111] uppercase tracking-wider font-normal">
              3. Para qué los usamos
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Gestionar, fabricar y despachar tus pedidos de espejos y piezas de diseño.</li>
              <li>Comunicarnos contigo a través de WhatsApp, correo o teléfono para notificarte el estado de tu entrega o resolver solicitudes.</li>
              <li>Cumplir con obligaciones de carácter legal, fiscal y contable.</li>
            </ul>
            <p className="pt-2">
              No compartimos bases de datos con fines publicitarios no autorizados ni alquilamos tu información personal.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-[#111111] uppercase tracking-wider font-normal">
              4. Quiénes intervienen en el proceso
            </h2>
            <p>
              Tus datos son tratados bajo estrictas medidas de confidencialidad por proveedores tecnológicos necesarios para la operación (servicios en la nube de Google y Vercel), transportadoras logísticas y pasarelas de pago (Bold), garantizando la seguridad de la información conforme a la ley.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-[#111111] uppercase tracking-wider font-normal">
              5. Tus Derechos (ARCO)
            </h2>
            <p>
              Como titular de los datos, tienes derecho a conocer, actualizar, rectificar y suprimir tu información, así como a revocar la autorización otorgada cuando la ley lo permita. Puedes presentar consultas o reclamos formales comunicándote a través de nuestros canales oficiales de atención al cliente. También puedes acudir ante la Superintendencia de Industria y Comercio (www.sic.gov.co) si consideras que tus derechos han sido vulnerados.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-[#111111] uppercase tracking-wider font-normal">
              6. Seguridad de la Información
            </h2>
            <p>
              Implementamos medidas técnicas y administrativas orientadas a proteger tu información frente a accesos no autorizados, pérdida o adulteración, resguardando los registros en plataformas de almacenamiento seguro con acceso restringido.
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