import AdminLayoutWrapper from '@/components/wrappers/admin-layout-wrapper';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminLayoutWrapper>
      <main className="container mx-auto py-10">{children}</main>
    </AdminLayoutWrapper>
  );
}
