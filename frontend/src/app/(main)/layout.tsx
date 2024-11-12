// layout.tsx
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

import Footer from "@modules/layout/templates/footer";
import Nav from "@modules/layout/templates/nav";
import Chatbot from "@components/Chatbot";
import path from "path";
import fs from "fs";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:8000";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
};

export default function PageLayout(props: { children: React.ReactNode }) {
  const cssPath = path.join(process.cwd(), 'src/styles/asistente.css');
  const cssContent = fs.readFileSync(cssPath, 'utf-8');
  const base64Css = Buffer.from(cssContent).toString('base64');

  return (
    <SessionProvider>
      <Nav />
      {props.children}
      <Footer />
      <Chatbot base64Css={base64Css} />
    </SessionProvider>
  );
}