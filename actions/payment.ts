"use server";

import cuid from "cuid";
import * as z from "zod";
import { AppointmentSchema } from "@/schemas";
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export const createPaymentPreference = async (
  values: z.infer<typeof AppointmentSchema>,
  totalPrice: number
): Promise<{ paymentUrl: string }> => {
  try {
    const validatedFields = AppointmentSchema.safeParse(values);

    if (!validatedFields.success) {
      throw new Error("Invalid fields!");
    }

    const appointmentId = cuid();

    const preference = await new Preference(client).create({
      body: {
        items: [
          {
            id: "turno",
            title: "Pago de Turno",
            quantity: 1,
            unit_price: totalPrice,
          },
        ],
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/notification`,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/mis-turnos`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/error`,
        },
        auto_return: "approved",
        metadata: {
          appointmentId,
          userName: values.userName,
          userEmail: values.userEmail,
          date: values.date,
          time: values.time,
          services: values.services,
        },
      },
    });

    return {
      paymentUrl: preference.init_point!,
    };
  } catch (error) {
    console.error("Error creating payment preference:", error);
    throw new Error("Could not create payment preference");
  }
};
