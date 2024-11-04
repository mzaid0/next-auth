import { signIn } from "@/auth";
import { CredentialsSignin } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Enter email and password" },
        { status: 400 }
      );
    }

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      return NextResponse.json({ message: result.error }, { status: 401 });
    }

    return NextResponse.json({ message: "Login successful" }, { status: 200 });
  } catch (error) {
    const err = error as CredentialsSignin;
    return NextResponse.json(
      { message: err.cause || "An error occurred" },
      { status: 401 }
    );
  }
};
