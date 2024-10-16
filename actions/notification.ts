"use server";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function notification(request: NextRequest) {
  const body = await request.json();

  if (body.type === "payment") {
    const { id, status } = body.data;

    await db.appointment.update({
      where: { id },
      data: { isAvailable: status === "approved" },
    });
  }

  return new NextResponse(null, { status: 200 });
}
