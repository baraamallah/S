"use client";

import { useState } from "react";
import PasswordGate from "@/components/password-gate";
import BirthdayGreeting from "@/components/birthday-greeting";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 transition-opacity duration-1000">
      {isAuthenticated ? (
        <BirthdayGreeting />
      ) : (
        <PasswordGate onSuccess={handleSuccess} />
      )}
    </main>
  );
}
