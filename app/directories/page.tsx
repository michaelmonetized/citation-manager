"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export default function DirectoriesPage() {
  const directories = useQuery(api.directories.listTopDirectories, { limit: 50 });

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
        <h2 className="text-2xl font-bold mb-8">Top Directories</h2>

        {directories === undefined && (
          <div className="text-gray-600">Loading directories...</div>
        )}

        {directories && directories.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No directories available yet</p>
          </div>
        )}

        {directories && directories.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {directories.map((dir) => (
              <div key={dir._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{dir.name}</h3>
                    <p className="text-gray-600 text-sm">Rank: {dir.rank}</p>
                    <p className="text-gray-600 text-sm">Category: {dir.category}</p>
                    <p className="text-gray-600 text-sm">
                      Method: {dir.submissionMethod}
                    </p>
                  </div>
                  <div className="text-right">
                    {dir.isFree && (
                      <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded text-sm">
                        Free
                      </span>
                    )}
                    {dir.apiAvailable && (
                      <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm ml-2">
                        API
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
