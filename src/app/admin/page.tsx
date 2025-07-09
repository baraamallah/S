
"use client";

import { useState } from "react";
import AdminForm from "@/components/admin-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useBirthdayConfig } from "@/hooks/use-birthday-config";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const { config, isLoaded } = useBirthdayConfig();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === config.adminPassword) {
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

  if (!isLoaded) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-muted/40">
            <Card className="w-full max-w-md">
              <CardHeader>
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-5 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                  <div className="space-y-4 pt-6">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                  </div>
              </CardContent>
            </Card>
        </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-muted/40">
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
