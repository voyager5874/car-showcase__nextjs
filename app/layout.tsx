import "./globals.css";
import { Manrope } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata = {
  title: "Car showcase",
  description: "Next.js 13 JS Mastery workshop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={"relative"}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
