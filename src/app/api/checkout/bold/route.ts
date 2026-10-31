import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { totalCarrito, orderId, cliente, items } = await request.json();

    if (!totalCarrito || totalCarrito <= 0) {
      return NextResponse.json({ error: 'El monto no es válido' }, { status: 400 });
    }

    const apiKey = process.env.BOLD_API_KEY?.trim();
    const secretKey = process.env.BOLD_INTEGRITY_SECRET?.trim();

    if (!apiKey || !secretKey) {
      console.error('Error: Faltan credenciales BOLD_API_KEY o BOLD_INTEGRITY_SECRET en .env.local');
      return NextResponse.json(
        { error: 'Configuración incompleta en el servidor de pagos' },
        { status: 500 }
      );
    }

    const reference = orderId || `MM-${Date.now()}`;
    const amount = Math.round(totalCarrito); // Monto entero en COP
    const currency = 'COP';

    // 1. Generar la firma de integridad SHA-256 (reference + amount + currency + secretKey)
    const stringToHash = `${reference}${amount}${currency}${secretKey}`;
    const integritySignature = crypto
      .createHash('sha256')
      .update(stringToHash)
      .digest('hex');

    // 2. Guardar la orden inicial en Firestore con estado 'nuevo' para el Panel Admin
    try {
      await setDoc(doc(db, 'ordenes', reference), {
        id: reference,
        cliente: cliente || {},
        items: items || [],
        total: amount,
        estado: 'nuevo', // 'nuevo', 'revision', 'completado'
        notificacionWhatsAppEnviada: false,
        fechaCreacion: serverTimestamp(),
        fechaEntregaEstimada: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Plazo estimado de 15 días
      });
    } catch (dbError) {
      console.error('Error al guardar la orden en Firestore:', dbError);
      // Continuamos con el pago aunque falle el registro previo, o puedes retornar error si prefieres
    }

    // 3. Petición a la API de Bold para generar el link/checkout seguro
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
        redirection_url: 'http://localhost:3001/', // Cambia a tu dominio de producción cuando despliegues
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('🔴 Respuesta de Error de Bold API:', data);
      return NextResponse.json(
        { error: data.message || data.errors || 'Error de autorización con Bold' },
        { status: response.status }
      );
    }

    // Retornar la URL del checkout generada por Bold
    const checkoutUrl = data.payload?.url || data.url;
    return NextResponse.json({ url: checkoutUrl });

  } catch (error) {
    console.error('Error interno en servidor checkout Bold:', error);
    return NextResponse.json({ error: 'Error interno procesando la solicitud de pago' }, { status: 500 });
  }
}