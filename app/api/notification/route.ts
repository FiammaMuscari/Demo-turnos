import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { createAppointment } from "@/actions/appointments"; // Importar la acción de crear cita
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

    if (payment.status === "approved") {
      const { userName, userEmail, date, time, services } = payment.metadata;
      console.log("Metadata recibida:", payment.metadata);

      if (!userName || !userEmail || !date || !time || !services) {
        console.error("Faltan datos en la metadata del pago");
        return new NextResponse(null, { status: 400 });
      }

      try {
        const appointmentData = {
          userName,
          userEmail,
          date: new Date(date).toString(),
          time,
          services,
        };
        const result = await createAppointment(appointmentData);

        if (result.error) {
          console.error("Error al crear la cita:", result.error);
          return new NextResponse(null, { status: 500 });
        }

        console.log("Cita guardada:", result.data);
        return new NextResponse(null, { status: 200 });
      } catch (error) {
        console.error("Error al crear la cita:", error);
        return new NextResponse(null, { status: 500 });
      }
    } else {
      console.error("Pago no aprobado:", payment.status);
      return new NextResponse(null, { status: 400 });
    }
  } catch (error) {
    console.error("Error procesando el pago:", error);
    return new NextResponse(null, { status: 500 });
  }
}
