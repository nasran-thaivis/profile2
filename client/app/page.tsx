import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          Welcome to Profile Platform
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Create your professional profile, showcase your portfolio, and connect with others.
        </p>
        <div className="flex gap-4">
          <Link
            href="/register"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </main>
    </div>
  );
}
