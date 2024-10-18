import { NextResponse } from "next/server";
import { createAppointment } from "@/actions/appointments";
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: Request) {
  const body = await req.json();
  const paymentId = body.data?.id;

  if (!paymentId) {
    return NextResponse.json(
      { error: "ID de pago no encontrado en la solicitud" },
      { status: 400 }
    );
  }

  try {
    const payment = await new Payment(client).get({ id: paymentId });

    if (payment.status === "approved") {
      const { userName, userEmail, date, time, services } = payment.metadata;

      if (!userName || !userEmail || !date || !time || !services) {
        return NextResponse.json(
          { error: "Faltan datos necesarios en la metadata" },
          { status: 400 }
        );
      }

      const appointmentData = {
        userName,
        userEmail,
        date,
        time,
        services,
      };

      const appointmentResult = await createAppointment(appointmentData);

      if (appointmentResult.error) {
        return NextResponse.json(
          { error: appointmentResult.error },
          { status: 403 }
        );
      }

      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ error: "Pago no aprobado" }, { status: 403 });
  } catch (error) {
    console.error("Error procesando el pago:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 403 }
    );
  }
}
