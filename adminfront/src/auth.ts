import axios, { Axios } from "axios";
import NextAuth, { AuthError, CredentialsSignin, DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { Usuario, Response } from "@/types/PaqueteUsuario";
import Google from "next-auth/providers/google";
import { User as NextAuthUser } from "next-auth";

interface CustomUser extends NextAuthUser {
  db_info?: {
    id: string;
    // Add other properties if needed
  };
}

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
    async signIn({ user, account, profile }) {
      try {
        if (user && account?.provider === "google") {
          const response: Response<Usuario> = await axios.post(
            `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/usuario/loginGoogle`,
            {
              email: user.email,
              nombre: profile?.given_name || user.name || "",
              apellido: profile?.family_name || "",
              imagenperfil: profile?.picture || user.image || "",
            }
          );
  
          if (response.data.status !== "Success") {
            return `/login?error=SigninError&code=${response.data.message}`;
          }
  
          (user as CustomUser).db_info = response.data.result;
        }
  
        return true;
      } catch (error) {
        console.log("See the error: ", error);
        return `/login?error=SigninError&code=Ups, algo salio mal. Intenta de nuevo.`;
      }
    },
    async jwt({ token, user }) {
      try {
        if (token) {
          token.sub = (user as CustomUser)?.db_info?.id || token.sub;
          const user_id = token.sub;
          const response : any = await axios.get(
            `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/usuario/${user_id}`
          );

          const usuario = response.data.usuario

          if (!usuario) {
            console.log("User not found in database:", user_id);
            return null;
          }

          token.db_info = usuario;
        }

        return token;
      } catch (error: any) {
        console.log("Error when fetching user data in JWT token: ", error.response);
        return null;
      }
    },
    async session({ token, session }) {
      //console.log("Token db_info: ", token.db_info);
      //@ts-ignore
      session.user.id = token.db_info.id;
      //@ts-ignore
      session.user.email = token.db_info.email;
      //@ts-ignore
      session.user.name = token.db_info.nombre;
      //@ts-ignore
      session.user.db_info = token.db_info;

      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return url;
    },
  },
  pages: {
    signIn: `/login`,
    //signIn: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
    //error: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
    //signOut: `${process.env.NEXT_PUBLIC_APP_URL}`,
    error: "/login",
    signOut: "/",
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
