import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { totalCarrito, orderId, cliente, items } = await request.json();

    if (!totalCarrito || totalCarrito <= 0) {
      return NextResponse.json({ error: 'El monto no es válido' }, { status: 400 });
    }

    const apiKey = process.env.BOLD_API_KEY?.trim();
    const secretKey = process.env.BOLD_INTEGRITY_SECRET?.trim();

    if (!apiKey || !secretKey) {
      console.error('Error: Faltan credenciales de Bold en .env.local');
      return NextResponse.json({ error: 'Error de configuración de pago' }, { status: 500 });
    }

    const reference = orderId || `MM-${Date.now()}`;
    const amount = Math.round(totalCarrito);
    const currency = 'COP';

    // Firma SHA-256
    const stringToHash = `${reference}${amount}${currency}${secretKey}`;
    const integritySignature = crypto
      .createHash('sha256')
      .update(stringToHash)
      .digest('hex');

    // Aquí puedes opcionalmente guardar la orden pendiente en Firestore si lo deseas

    const response = await fetch('https://integrations.api.bold.co/online/link/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        description: `Compra Maison Miroir - ${cliente?.nombreApellido || 'Cliente'}`,
        reference: reference,
        amount: amount,
        currency: currency,
        integrity_signature: integritySignature,
        redirection_url: 'http://localhost:3001/',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error Bold API:', data);
      return NextResponse.json(
        { error: data.message || 'Error al conectar con Bold' },
        { status: response.status }
      );
    }

    const checkoutUrl = data.payload?.url || data.url;
    return NextResponse.json({ url: checkoutUrl });

  } catch (error) {
    console.error('Error interno en checkout Bold:', error);
    return NextResponse.json({ error: 'Error procesando la solicitud' }, { status: 500 });
  }
}