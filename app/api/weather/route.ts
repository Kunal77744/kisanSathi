import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      message: "Weather API - Coming Soon",
      data: {},
    },
    { status: 200 }
  );
}
