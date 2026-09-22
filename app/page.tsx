import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Welcome</h1>
        <p className="mt-3 text-muted-foreground">
          Sign in to continue or create a new account.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/signin"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-10 items-center justify-center rounded-md border border-border px-5 text-sm font-medium transition-colors hover:bg-muted"
          >
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}
