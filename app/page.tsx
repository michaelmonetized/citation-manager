"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  // Try to check if user is authenticated via stored session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("convex_auth_token");
        if (token) {
          router.push("/dashboard");
        } else {
          router.push("/sign-in");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/sign-in");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Redirecting...</p>
    </div>
  );
}
