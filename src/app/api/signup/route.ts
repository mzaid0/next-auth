import { NextRequest, NextResponse } from "next/server";
import db from "../../../../lib/db";
import { hash } from "bcryptjs";

export const POST = async (request: NextRequest) => {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Please fill all fields" },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 409 }
      ); // 409 Conflict
    }

    const hashedPassword = await hash(password, 10);

    await db.user.create({
      data: { name, email, password: hashedPassword },
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
};