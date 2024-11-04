import NextAuth, { AuthError, CredentialsSignin } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "../lib/db";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password)
          throw new CredentialsSignin({
            cause: "Please enter email and password",
          });

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user)
          throw new CredentialsSignin({ cause: "Invalid email or password" });

        if (!user.password) {
          throw new CredentialsSignin({
            cause:
              "This account is registered using Google, please login using Google.",
          });
        }

        const isMatch = await compare(password, user.password!);

        if (!isMatch)
          throw new CredentialsSignin({ cause: "Invalid email or password" });

        return {
          name: user.name,
          email: user.email,
          userId: user.id,
        };
      },
    }),
  ],
  callbacks: {
    signIn: async ({ user, account }) => {
      if (account?.provider === "google") {
        try {
          const { name, email, id } = user;

          const userExist = await db.user.findUnique({
            where: { email: email as string },
          });

          if (!userExist) {
            await db.user.create({
              data: {
                name: name || "",
                email: email as string,
                googleId: id,
              },
            });
          } else if (!userExist.googleId) {
            await db.user.update({
              where: { email: email as string },
              data: {
                googleId: id,
              },
            });
          }

          return true;
        } catch (error) {
          console.error("Error in Google SignIn: ", error);
          throw new AuthError("Error processing Google sign-in");
        }
      }
      return true;
    },
  },
});
