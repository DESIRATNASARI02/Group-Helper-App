import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCurrentUser } from "@/lib/auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();
    if (!content) {
      return NextResponse.json({ message: "content is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(`
      Rangkum HANYA isi catatan berikut dalam Bahasa Indonesia.
      Jangan tambahkan informasi dari luar catatan.
      Jika catatan terlalu pendek, cukup tulis "Catatan terlalu singkat untuk dirangkum."
      
      Catatan:
      ${content}
    `);

    const summary = result.response.text();
    return NextResponse.json({ summary });

  } catch (error: any) { 
    console.error(error);

    // handle rate limit / service unavailable 
    if (error?.status === 503 || error?.statusText === "Service Unavailable") {
      return NextResponse.json(
        { message: "Layanan AI sedang sibuk. Silakan coba beberapa saat lagi." },
        { status: 503 }
      );
    }

    if (error?.status === 429) {
      return NextResponse.json(
        { message: "Batas penggunaan AI tercapai. Silakan coba beberapa menit lagi." },
        { status: 429 }
      );
    }

    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}