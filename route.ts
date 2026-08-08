import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { username, password, gmail } = await req.json();

    if (!username || !password || !gmail) {
      return NextResponse.json(
        { error: "Username, password, dan Gmail wajib diisi." },
        { status: 400 }
      );
    }

    if (!gmail.toLowerCase().endsWith("@gmail.com")) {
      return NextResponse.json(
        { error: "Gmail harus berupa alamat @gmail.com yang aktif." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter." },
        { status: 400 }
      );
    }

    const { data: existing } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Username sudah dipakai, coba username lain." },
        { status: 409 }
      );
    }

    const password_hash = await bcrypt.hash(password, 10);

    const { error } = await supabaseAdmin
      .from("users")
      .insert({ username, password_hash, gmail });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Gagal mendaftar. Coba lagi." },
      { status: 500 }
    );
  }
}
