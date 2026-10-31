import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { totalCarrito, orderId } = await request.json();

    if (!totalCarrito || totalCarrito <= 0) {
      return NextResponse.json({ error: 'El monto no es válido' }, { status: 400 });
    }

    const apiKey = process.env.BOLD_API_KEY?.trim();
    const secretKey = process.env.BOLD_INTEGRITY_SECRET?.trim();

    if (!apiKey || !secretKey) {
      console.error('Faltan BOLD_API_KEY o BOLD_INTEGRITY_SECRET en .env.local');
      return NextResponse.json({ error: 'Configuración de pago incompleta' }, { status: 500 });
    }
console.log('Bold apiKey longitud:', apiKey.length, '| secret longitud:', secretKey.length);
    const referencia: string = orderId || `MM-${Date.now()}`;
    const monto = Math.round(totalCarrito);
    const moneda = 'COP';

    // SHA-256 de: referencia + monto + moneda + llave secreta
    const firmaIntegridad = crypto
      .createHash('sha256')
      .update(`${referencia}${monto}${moneda}${process.env.BOLD_INTEGRITY_SECRET!.trim()}`)
      .digest('hex');

    const origen = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
    const expiraEn = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    return NextResponse.json({
      referencia,
      moneda,
      monto,
      llaveIdentidad: apiKey,
      firmaIntegridad,
      descripcion: 'Compra en Maison Miroir',
      urlRetorno: `${origen}/pago/resultado`,
      modoApertura: 'embedded',
      expiraEn: expiraEn.toISOString(),
    });
  } catch (error) {
    console.error('Error interno en checkout Bold:', error);
    return NextResponse.json({ error: 'Error interno en la solicitud de pago' }, { status: 500 });
  }
}