"use server";
import { NextResponse } from "next/server";
import { createAppointment } from "@/actions/appointments";

async function handler(request: Request) {
  const rawBody = await request.text();
  const response = JSON.parse(rawBody);
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

    if (!appointmentData.date || !appointmentData.time) {
      console.error("Error: Fecha o hora del turno son nulas");
      return NextResponse.json(
        { error: "La fecha o la hora del turno son nulas" },
        { status: 400 }
      );
    }

    const result = await createAppointment(appointmentData);

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
