import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSideBar from "./_components/AdminSideBar";
import AdminNav from "./_components/AdminNav";
import AdminTableSkeleton from "@/components/skeletons/AdminTableSkeleton";
import { ToastContainer } from "react-toastify";
import { Suspense } from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="admin-scope min-h-screen">
      <SidebarProvider>
        <AdminSideBar />
        <main className="flex-1 min-h-screen p-4 pt-0 bg-surface text-cream">
          <AdminNav />

          <Suspense fallback={<AdminTableSkeleton />}>
            <div className="py-4">{children}</div>
          </Suspense>
        </main>
        <ToastContainer />
      </SidebarProvider>
    </div>
  );
}
