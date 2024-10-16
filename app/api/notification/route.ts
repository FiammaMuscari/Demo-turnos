"use server";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function notification(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.type === "payment") {
      const { id, status } = body.data;

      const appointment = await db.appointment.findUnique({ where: { id } });

      if (appointment) {
        await db.appointment.update({
          where: { id },
          data: { isAvailable: status === "approved" },
        });
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Error processing notification:", error);
    return new NextResponse(null, { status: 403 });
  }
}
