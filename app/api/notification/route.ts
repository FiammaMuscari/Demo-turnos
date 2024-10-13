import { NextResponse } from "next/server";
import { createAppointment } from "@/actions/appointments"; // Asegúrate de importar la función

async function handler(request: Request) {
  const rawBody = await request.text();
  const response = JSON.parse(rawBody);
  const objId = response && response["data"]["id"];
  const collectionStatus = response?.data?.collection_status; // Obtener el estado de la colección

  console.log("objId:", objId);
  console.log("response:", response);

  if (collectionStatus === "approved") {
    // Aquí debes extraer los datos necesarios para crear la cita
    const appointmentData = {
      userName: response.data.userName, // Asegúrate de que estos campos existan en la notificación
      userEmail: response.data.userEmail,
      date: response.data.date,
      time: response.data.time,
      services: response.data.services, // Asegúrate de que este campo sea un array de strings
    };

    // Crear la cita
    const result = await createAppointment(appointmentData);
    if (result.error) {
      console.error("Error al crear la cita:", result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  }

  return NextResponse.json({}, { status: 200 });
}

export const POST = handler;
