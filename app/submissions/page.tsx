"use client";

import Link from "next/link";

export default function SubmissionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold">Citation Manager</h1>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-8">Submission Status</h2>

        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No submissions yet</p>
          <p className="text-gray-500 mt-2">
            Create a location and bulk submit to directories to see submission status here
          </p>
        </div>
      </main>
    </div>
  );
}
