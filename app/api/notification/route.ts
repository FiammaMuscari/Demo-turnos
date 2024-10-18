// notification.ts

import { NextApiRequest, NextApiResponse } from "next";
import { createAppointment } from "@/actions/appointments";
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const paymentId = req.body.data.id; // ID del pago recibido
  const payment = await new Payment(client).get({ id: paymentId });

  if (payment.status === "approved") {
    const { userName, userEmail, date, time, services } = payment.metadata;

    const appointmentData = {
      userName,
      userEmail,
      date,
      time,
      services,
    };

    const appointmentResult = await createAppointment(appointmentData);

    if (appointmentResult.error) {
      return res.status(500).json({ error: appointmentResult.error });
    }

    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ error: "Pago no aprobado" });
}
