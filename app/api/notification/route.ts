import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { db } from "@/lib/db";
import cuid from "cuid";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log("Webhook recibido:", body);
  const paymentId = body.data.id;

  try {
    const payment = await new Payment(client).get({ id: paymentId });
    console.log("Respuesta del pago:", JSON.stringify(payment, null, 2));

    if (payment.status !== "approved") {
      console.error("El pago no está aprobado:", payment.status);
      return new NextResponse(null, { status: 400 });
    }

    const additionalInfo = payment.additional_info;
    if (
      !additionalInfo ||
      !additionalInfo.items ||
      additionalInfo.items.length === 0
    ) {
      console.error("No se encontraron items en la respuesta del pago");
      return new NextResponse(null, { status: 400 });
    }

    const firstItem = additionalInfo.items[0];

    const { userName, userEmail, date, time, services } = payment.metadata;

    if (!userName || !userEmail || !date || !time || !services) {
      console.error("Faltan datos en la metadata del pago");
      return new NextResponse(null, { status: 400 });
    }

    try {
      const newAppointment = await db.appointment.create({
        data: {
          id: cuid(),
          userName,
          userEmail,
          date: new Date(date).toString(),
          time,
          isAvailable: false,
          services: services.join(", "),
        },
      });
      console.log("Cita guardada:", newAppointment);
    } catch (error) {
      console.error("Error al crear la cita:", error);
      return new NextResponse(null, { status: 500 });
    }

    await db.appointment.update({
      where: { id: firstItem.id },
      data: {
        isAvailable: false,
      },
    });
 
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Error procesando el pago:", error);
    return new NextResponse(null, { status: 500 });
  }
}
