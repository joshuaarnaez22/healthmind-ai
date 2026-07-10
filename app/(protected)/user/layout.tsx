import UserLayoutWrapper from '@/components/wrappers/user-layout.wrapper';

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserLayoutWrapper>
      <main className="mx-auto w-full max-w-6xl">{children}</main>
    </UserLayoutWrapper>
  );
}
