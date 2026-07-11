import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { success: false, error: "ADMIN_PASSWORD is not configured on the server." },
        { status: 500 }
      );
    }

    if (password === adminPassword) {
      // Set session cookie for 1 day
      cookies().set({
        name: "admin_session",
        value: "authenticated",
        httpOnly: true,
        path: "/",
        maxAge: 86400, // 24 hours
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "गलत पासवर्ड! (Incorrect Password)" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Something went wrong during login." },
      { status: 500 }
    );
  }
}
