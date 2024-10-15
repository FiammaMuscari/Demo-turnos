"use server";

import { NextResponse } from "next/server";
import { createAppointment } from "@/actions/appointments";

async function handler(request: Request) {
  const rawBody = await request.text();
  const response = JSON.parse(rawBody);

  console.log("Respuesta de Mercado Pago:", response);

  const collectionStatus = response?.data?.collection_status;

  if (collectionStatus === "approved") {
    const appointmentData = {
      userName: response.data.userName || "",
      userEmail: response.data.userEmail || "",
      date: response.data.date || "",
      time: response.data.time || "",
      services: response.data.services || [],
      totalPrice: response.data.totalPrice || 0,
    };

    // Validar que la fecha y la hora no sean nulas
    if (!appointmentData.date || !appointmentData.time) {
      console.error("Error: Fecha o hora del turno son nulas");
      return NextResponse.json(
        { error: "La fecha o la hora del turno son nulas" },
        { status: 400 }
      );
    }

    // Crear la cita
    const result = await createAppointment(appointmentData);

    // Manejar errores al crear la cita
    if (result.error) {
      console.error("Error al crear la cita:", result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    console.log("Cita creada exitosamente:", result.data);
  } else {
    console.log("Pago no aprobado:", collectionStatus);
  }

  return NextResponse.json({}, { status: 200 });
}
