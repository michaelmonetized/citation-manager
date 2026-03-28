"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  
  // Try to check if user is authenticated via stored session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("convex_auth_token");
        if (token) {
          router.push("/dashboard");
        } else {
          router.push("/auth");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/auth");
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
