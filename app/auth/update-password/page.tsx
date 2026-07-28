import { Suspense } from "react";
import UpdatePasswordClient from "./update-password-client";

export default function UpdatePasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-8">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Loading password reset form...
          </div>
        </div>
      }
    >
      <UpdatePasswordClient />
    </Suspense>
  );
}
