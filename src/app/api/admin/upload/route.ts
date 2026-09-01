// app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    // ✅ ПРАВИЛЬНАЯ ПРОВЕРКА АВТОРИЗАЦИИ (с await!)
    const cookieStore = await cookies();
    const auth = cookieStore.get("admin_auth");
    
    if (!auth || auth.value !== "true") {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Файл не найден" },
        { status: 400 }
      );
    }

    // Проверка типа
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Разрешены только JPEG, PNG, WEBP, GIF" },
        { status: 400 }
      );
    }

    // Проверка размера (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Файл не должен превышать 5MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const originalName = file.name.replace(/\s/g, "_").replace(/[^a-zA-Z0-9._-]/g, "");
    const filename = `${timestamp}_${random}_${originalName}`;

    const uploadDir = path.join(process.cwd(), "public/uploads/products");
    
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const url = `/uploads/products/${filename}`;
    
    return NextResponse.json({ 
      url,
      success: true,
    });
  } catch (error) {
    console.error("Ошибка загрузки:", error);
    return NextResponse.json(
      { error: "Ошибка загрузки файла" },
      { status: 500 }
    );
  }
}
