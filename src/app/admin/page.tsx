"use client";

import { useState } from "react";
import AdminForm from "@/components/admin-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// A simple, hardcoded password to protect the admin page.
// In a real app, this should be a proper authentication system.
const ADMIN_PASSWORD = "admin123";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      toast({
        title: "Incorrect Password",
        description: "The password for the admin page is incorrect.",
        variant: "destructive",
      });
      setPassword("");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-muted/40">
      {isAuthenticated ? (
        <AdminForm />
      ) : (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>Enter the password to manage birthday settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
