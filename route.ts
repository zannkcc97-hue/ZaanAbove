import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

const CREATOR_ANSWER =
  "Fauzaan Noer Ramadhan umur 15 tahun tanggal 3 bulan Agustus tahun 2011";

// deteksi pertanyaan seputar "siapa yang membuat kamu"
function isCreatorQuestion(text: string) {
  const t = text.toLowerCase();
  const keywords = [
    "siapa yang membuat",
    "siapa pembuatmu",
    "siapa pembuat kamu",
    "siapa pembuat anda",
    "yang menciptakan kamu",
    "yang menciptakan anda",
    "siapa creator",
    "siapa developer",
    "siapa yang menciptakan",
    "who made you",
    "who created you",
    "your creator",
  ];
  return keywords.some((k) => t.includes(k));
}

export async function POST(req: NextRequest) {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Silakan login dulu." }, { status: 401 });
  }

  const { message, history } = await req.json();
  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Pesan kosong." }, { status: 400 });
  }

  // simpan pesan user
  await supabaseAdmin
    .from("messages")
    .insert({ user_id: session.id, role: "user", content: message });

  // jawaban khusus, tidak perlu panggil AI
  if (isCreatorQuestion(message)) {
    await supabaseAdmin
      .from("messages")
      .insert({ user_id: session.id, role: "assistant", content: CREATOR_ANSWER });
    return NextResponse.json({ reply: CREATOR_ANSWER });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

    const contents = [
      ...(Array.isArray(history) ? history : []).map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [
              {
                text:
                  "Nama kamu adalah Zaan Above, asisten AI yang membantu manusia dengan ramah, jelas, dan jujur. Jawab dalam Bahasa Indonesia kecuali diminta bahasa lain.",
              },
            ],
          },
        }),
      }
    );

    const data = await resp.json();

    if (!resp.ok) {
      const errMsg = data?.error?.message || "Gagal menghubungi AI.";
      return NextResponse.json({ error: errMsg }, { status: 500 });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") ||
      "Maaf, saya tidak bisa menjawab itu sekarang.";

    await supabaseAdmin
      .from("messages")
      .insert({ user_id: session.id, role: "assistant", content: reply });

    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menghubungi AI." },
      { status: 500 }
    );
  }
}
