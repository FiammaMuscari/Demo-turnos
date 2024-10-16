"use server";

import cuid from "cuid";
import * as z from "zod";
import { AppointmentSchema } from "@/schemas";
import { db } from "@/lib/db";
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export const payment = async (
values: z.infer<typeof AppointmentSchema>, totalPrice: number, p0: { text: string; }): Promise<{ appointment: any; paymentUrl: string }> => {
  try {
    const validatedFields = AppointmentSchema.safeParse(values);

    if (!validatedFields.success) {
      throw new Error("Invalid fields!");
    }

    const newAppointment = await db.appointment.create({
      data: {
        id: cuid(),
        userName: values.userName,
        userEmail: values.userEmail,
        date: values.date,
        time: values.time,
        isAvailable: false,
        services: values.services,
      },
    });

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
      },
    });

    return {
      appointment: newAppointment,
      paymentUrl: preference.init_point!,  
    };
  } catch (error) {
    console.error("Error creating appointment or payment preference:", error);
    throw new Error("Could not create appointment and payment preference");
  }
};
