// layout.tsx
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

import Footer from "@modules/layout/templates/footer";
import Nav from "@modules/layout/templates/nav";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:8000";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
};

export default function PageLayout(props: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Nav />
      {props.children}
      <Footer />
    </SessionProvider>
  );
}