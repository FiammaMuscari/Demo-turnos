import { NextResponse } from "next/server";
import { createAppointment } from "@/actions/appointments"; // Asegúrate de que esta función esté disponible

export async function POST(req: Request) {
  const { data } = await req.json();

  // Verifica si el estado de la colección es "approved"
  if (data.collection_status === "approved") {
    // Extrae la información necesaria para crear el turno
    const appointmentData = {
      userName: data.userName, // Asegúrate de que estos campos existan en la notificación
      userEmail: data.userEmail,
      date: data.date,
      time: data.time,
      services: data.services, // Asegúrate de que este campo sea un array de strings
    };

    try {
      // Crea el turno en la base de datos
      await createAppointment(appointmentData);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error al crear el turno:", error);
      return NextResponse.json(
        { success: false, error: "Error al crear el turno" },
        { status: 500 }
      );
    }
  } else {
    // Si el estado no es "approved", simplemente responde con éxito
    return NextResponse.json({ success: true });
  }
}
