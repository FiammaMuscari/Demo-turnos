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
    };

    if (!appointmentData.date) {
      console.error("Error: La fecha del turno es nula");
      return NextResponse.json(
        { error: "La fecha del turno es nula" },
        { status: 400 }
      );
    }

    const result = await createAppointment(appointmentData);
    if (result.error) {
      console.error("Error al crear la cita:", result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  }

  return NextResponse.json({}, { status: 200 });
}
