import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const access = cookies().get("access_token")?.value;

  if (!access) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json({ access });
}
