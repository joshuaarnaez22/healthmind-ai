import UserLayoutWrapper from '@/components/wrappers/user-layout.wrapper';

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserLayoutWrapper>
      <main className="container mx-auto py-10">{children}</main>
    </UserLayoutWrapper>
  );
}
