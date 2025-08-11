// src/app/(FullPageLayout)/layout.tsx
// import Link from 'next/link';

export default function FullPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Simple Header */}
      {/* <header className="w-full bg-gray-100 p-4 dark:bg-gray-800">
        <nav className="container mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            FullPage Site
          </Link>
          <Link href="/dashboard" className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            Go to Dashboard
          </Link>
        </nav>
      </header> */}

      {/* Main Content */}
      <main className="flex-grow bg-gray-100">
        {children}
      </main>

      {/* Simple Footer */}
      {/* <footer className="w-full bg-gray-200 p-4 text-center dark:bg-gray-900">
        <p>© 2025 My Company</p>
      </footer> */}
    </div>
  );
}
