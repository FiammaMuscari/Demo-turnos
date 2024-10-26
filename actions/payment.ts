"use server";

import * as z from "zod";
import { AppointmentSchema } from "@/schemas";
import MercadoPagoConfig, { Preference } from "mercadopago";
import { currentUser } from "@/lib/auth";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

interface Service {
  id: string;
  name: string;
  price: string;
}

export const payment = async (
  values: z.infer<typeof AppointmentSchema>,
  selectedServices: Service[]
) => {
  try {
    const validatedFields = AppointmentSchema.safeParse(values);
    if (!validatedFields.success) {
      throw new Error("Invalid fields!");
    }
    const user = await currentUser();

    const items = selectedServices.map((service) => ({
      id: service.id,
      title: "Turno",
      quantity: 1,
      unit_price: parseFloat(service.price),
      description: `Cita para ${user?.name}, mail:${user?.email} el ${values.date} a las ${values.time}`,
      category_id: values.time,
    }));

    const preference = await new Preference(client).create({
      body: {
        items,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/mis-turnos`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/error`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/pending`,
        },
        auto_return: "approved",
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/notification`,
      },
    });

    console.log("Preferencia de pago creada:", preference);
    return {
      paymentUrl: preference.sandbox_init_point!,
    };
  } catch (error) {
    console.error("Error creando la preferencia de pago:", error);
    throw new Error("No se pudo crear la preferencia de pago");
  }
};
