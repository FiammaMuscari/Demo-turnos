import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { db } from "@/lib/db";
import cuid from "cuid"; // Asegúrate de que tengas este paquete instalado

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const paymentId = body.data.id;

  const payment = await new Payment(client).get({ id: paymentId });

  console.log("Respuesta del pago:", payment);

  if (payment.status === "approved") {
    const firstItem = payment.additional_info?.items[0];

    if (firstItem) {
      const { userName, userEmail, date, time, services } = payment.metadata;
      const newAppointment = await db.appointment.create({
        data: {
          id: cuid(),
          userName,
          userEmail,
          date,
          time,
          isAvailable: false,
          services: services.join(", "),
        },
      });

      await db.appointment.update({
        where: { id: firstItem.id },
        data: {
          isAvailable: false,
        },
      });

      console.log("Cita guardada:", newAppointment);
    } else {
      console.error("No se encontraron items en la respuesta del pago");
      return new NextResponse(null, { status: 400 });
    }
  } else {
    console.error("El pago no está aprobado:", payment.status);
    return new NextResponse(null, { status: 400 });
  }

  return new NextResponse(null, { status: 200 });
}
