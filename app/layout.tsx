import type {Metadata} from "next";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import {QueryProvider} from "@/src/providers/query-provider";
import NextAuthProvider from "@/src/providers/session-provider";

export const metadata: Metadata = {
  title: "Bucket Driver",
  description: "Driver management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <NextAuthProvider>
          <QueryProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
          </QueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
