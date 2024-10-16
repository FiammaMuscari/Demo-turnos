"use server";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Payment } from "mercadopago";
import { MercadoPagoConfig } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.type === "payment") {
      const { id } = body.data;

      // Obtener el pago de Mercado Pago
      const payment = await new Payment(client).get({ id });

      // Verificar si el estado del pago es "approved"
      if (payment.status === "approved") {
        const appointmentId = payment.metadata.appointmentId;

        const appointment = await db.appointment.findUnique({ where: { id: appointmentId } });

        if (appointment) {
          await db.appointment.update({
            where: { id: appointmentId },
            data: { isAvailable: true },
          });
        }
      } else {
        // Aquí podrías manejar otros estados si es necesario
        console.log(`Payment not approved: ${payment.status}`);
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Error processing notification:", error);
    return new NextResponse(null, { status: 403 });
  }
}
