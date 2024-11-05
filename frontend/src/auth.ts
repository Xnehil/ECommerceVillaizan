import axios, { Axios } from "axios";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

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
  ],
  callbacks: {
    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      //! Fix this, middleware not working
      console.log("==========================")
      console.log("isLoggedIn: ", isLoggedIn);
      console.log("pathname: ", pathname);
      console.log("==========================")

      if (pathname.startsWith("/login") && isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }

      return !!auth;
    },
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
      signIn: "/login",
      error: "/login",
    },
    trustHost: true,
    debug: true,
});
