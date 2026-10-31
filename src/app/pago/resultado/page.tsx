'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { boldDiceEnProceso } from '@/lib/bold';

function Contenido() {
  const params = useSearchParams();
  const enProceso = boldDiceEnProceso(params.toString());
  const estado = params.get('bold-tx-status')?.toLowerCase();

  const mensaje = enProceso
    ? 'Tu pago está en proceso. Te avisaremos cuando se confirme.'
    : estado === 'approved'
      ? '¡Gracias por tu compra! Tu pago fue recibido.'
      : 'No pudimos completar tu pago. Puedes intentarlo de nuevo.';

  return (
    <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-6">
      <div className="bg-white border border-[#EAE7E1] rounded-2xl p-12 text-center max-w-lg space-y-6">
        <h1 className="font-serif text-2xl uppercase tracking-wide text-[#111111]">Maison Miroir</h1>
        <p className="text-sm text-[#8C8275]">{mensaje}</p>
        <Link href="/" className="inline-block text-xs uppercase tracking-widest text-[#111111] underline">
          Volver a la colección
        </Link>
      </div>
    </main>
  );
}

export default function ResultadoPago() {
  return (
    <Suspense fallback={null}>
      <Contenido />
    </Suspense>
  );
}