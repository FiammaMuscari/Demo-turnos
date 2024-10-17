"use server";

import { db } from "@/lib/db";
import { Payment } from "mercadopago";
import { MercadoPagoConfig } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: Request) {
  const body: { data: { id: string } } = await req.json();

  const payment = await new Payment(client).get({ id: body.data.id });

  if (payment.status === "approved") {
    const appointmentId = payment.metadata.appointmentId;

    await db.appointment.create({
      data: {
        id: appointmentId,
        userName: payment.metadata.userName,
        userEmail: payment.metadata.userEmail,
        date: payment.metadata.date,
        time: payment.metadata.time,
        isAvailable: true,
        services: payment.metadata.services,
      },
    });
  }

  return new Response(null, { status: 200 });
}
