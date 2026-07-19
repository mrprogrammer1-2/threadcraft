import NavBar from "@/components/NavBar";
import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Cursor />
      <NavBar />
      <main className="mt-20">{children}</main>
      <Footer />
    </>
  );
}
