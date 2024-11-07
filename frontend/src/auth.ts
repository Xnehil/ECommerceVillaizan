import axios, { Axios } from "axios";
import NextAuth, { AuthError, CredentialsSignin, DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { Usuario, Response } from "types/PaqueteUsuario";
import Google from "next-auth/providers/google";

class CustomError extends CredentialsSignin {
  code: string;

  constructor(code: string) {
    super();
    this.code = code;
    this.name = "CustomError";

    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

function getCookieHostname() {
  const hostname = new URL(process.env.NEXT_PUBLIC_APP_URL!).hostname;
  const [subDomain] = hostname.split(".");

  const cookieDomain = hostname.replace(`${subDomain}.`, "");
  return cookieDomain;
}

const domain = process.env.NEXT_PUBLIC_APP_URL?.includes("localhost") ? "localhost" : getCookieHostname();


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const { email, password } = credentials;
      
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/auth`, {
            email,
            password,
          });
      
          const data = response.data.response;
      
          if (!data || data.status !== "Success") {
            console.log("Invalid credentials or unexpected response format:", data);
            return null;
          }
      
          return data.user; // Ensure that this contains `id`, `name`, and `email` as expected.
        } catch (error) {
          console.error("Error during authentication:", error);
          return null;
        }
      },
    }),
    Google({}),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token.id = user.id as string;
        token.name = user.name as string; 
        token.email = user.email as string;
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      return session
    },
  },
  pages: {
    signIn: `/login`,
    //signIn: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
    //error: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
    //signOut: `${process.env.NEXT_PUBLIC_APP_URL}`,
    error: "/login",
  },
  
  cookies: {
    sessionToken: {
      name: domain === "localhost" ? 'authjs.session-token' : `__Secure-next-auth.session-token`,
      options: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
        path: "/",
        domain,
      },
    },
    callbackUrl: {
      name: domain === "localhost" ? 'authjs.callback-url' : `__Secure-next-auth.callback-url`,
      options: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
        path: "/",
        domain,
      },
    },
    csrfToken: {
      name: domain === "localhost" ? 'authjs.csrf-token' : `next-auth.csrf-token`,
      options: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
        path: "/",
        domain,
      },
    },
  },
  trustHost: true
});
