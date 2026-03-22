"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">Citation Manager</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{user?.primaryEmailAddress?.emailAddress}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Manage Locations</h2>
            <p className="text-gray-600 mb-4">
              Add and manage your business locations for citation management.
            </p>
            <Link
              href="/locations"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              View Locations
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Browse Directories</h2>
            <p className="text-gray-600 mb-4">
              Explore 1000+ business directories and submit your citations.
            </p>
            <Link
              href="/directories"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              View Directories
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Submission Status</h2>
            <p className="text-gray-600 mb-4">
              Track your citation submissions and verification status.
            </p>
            <Link
              href="/submissions"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              View Submissions
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Account</h2>
            <p className="text-gray-600 mb-4">
              Manage your account settings and subscription plan.
            </p>
            <button className="inline-block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
              Account Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
