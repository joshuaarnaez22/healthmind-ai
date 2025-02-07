import BackNavigation from './_components/back-navigation';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 transition-colors duration-300 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <BackNavigation />
      {children}
    </div>
  );
}
