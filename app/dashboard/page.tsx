"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">Citation Manager</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                {user?.primaryEmailAddress?.emailAddress}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/locations" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-4">📍 Manage Locations</h2>
            <p className="text-gray-600 mb-4">
              Add and manage your business locations.
            </p>
            <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              View Locations →
            </span>
          </Link>

          <Link href="/submit" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-4">📤 Submit to Directories</h2>
            <p className="text-gray-600 mb-4">
              Submit your business to 100+ directories instantly.
            </p>
            <span className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Start Submitting →
            </span>
          </Link>

          <Link href="/directories" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-4">📚 Browse Directories</h2>
            <p className="text-gray-600 mb-4">
              Explore 100+ business directories for your industry.
            </p>
            <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              View Directories →
            </span>
          </Link>

          <Link href="/submissions" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-4">✅ Submission Status</h2>
            <p className="text-gray-600 mb-4">
              Track submissions and verification status in real-time.
            </p>
            <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              View Status →
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
}
