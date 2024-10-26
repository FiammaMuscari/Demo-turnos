import { NextResponse, NextRequest } from "next/server";
import { createAppointment } from "@/actions/appointments";
import { MercadoPagoConfig, Payment } from "mercadopago";
import cuid from "cuid";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const paymentId = body.data.id;
  console.log("paymentId", paymentId);

  try {
    const payment = await new Payment(client).get({ id: paymentId });
    console.log("payment", payment);

    if (payment.status === "approved") {
      const firstItem = payment.additional_info?.items![0];
      const descriptionParts = firstItem!.description!.split(", ");
      const userName = descriptionParts[0].split("para ")[1];
      const userEmail = descriptionParts[1].split("mail:")[1];
      const date = descriptionParts[2].split("el ")[1].split(" a las ")[0];
      const time = descriptionParts[2].split(" a las ")[1];

      const newAppointment = await db.appointment.create({
        data: {
          id: cuid(),
          userName: userName,
          userEmail: userEmail,
          date: date,
          time: time,
          isAvailable: false,
          services: [firstItem!.id],
        },
      });
      console.log("Turno guardado:", newAppointment);
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
