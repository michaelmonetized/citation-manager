"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SubmitPage() {
  const router = useRouter();
  const locations = useQuery(api.locations.listLocations);
  const directories = useQuery(api.directories.listTopDirectories, { limit: 50 });
  const bulkSubmit = useMutation(api.submissions.bulkSubmit);

  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [selectedDirectories, setSelectedDirectories] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const toggleDirectory = (dirId: string) => {
    const newSelected = new Set(selectedDirectories);
    if (newSelected.has(dirId)) {
      newSelected.delete(dirId);
    } else {
      newSelected.add(dirId);
    }
    setSelectedDirectories(newSelected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocationId || selectedDirectories.size === 0) {
      setError("Please select a location and at least one directory");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await bulkSubmit({
        locationId: selectedLocationId as any,
        directoryIds: Array.from(selectedDirectories) as any,
      });
      setSuccess(true);
      setTimeout(() => router.push("/submissions"), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <Link href="/directories" className="text-gray-600 hover:text-gray-900">
                Directories
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold mb-8">Bulk Submit to Directories</h2>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8">
          {/* Location Selection */}
          <div className="mb-8">
            <label className="block text-lg font-semibold mb-4">
              Select Location
            </label>
            {locations === undefined && (
              <p className="text-gray-600">Loading locations...</p>
            )}
            {locations && locations.length === 0 && (
              <p className="text-red-600">
                No locations found.{" "}
                <Link href="/locations/new" className="underline">
                  Create one first
                </Link>
              </p>
            )}
            {locations && locations.length > 0 && (
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Choose a location --</option>
                {locations.map((loc: any) => (
                  <option key={loc._id} value={loc._id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Directory Selection */}
          <div className="mb-8">
            <label className="block text-lg font-semibold mb-4">
              Select Directories ({selectedDirectories.size} selected)
            </label>
            {directories === undefined && (
              <p className="text-gray-600">Loading directories...</p>
            )}
            {directories && directories.length === 0 && (
              <p className="text-red-600">No directories available</p>
            )}
            {directories && directories.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
                {directories.map((dir: any) => (
                  <label key={dir._id} className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={selectedDirectories.has(dir._id)}
                      onChange={() => toggleDirectory(dir._id)}
                      className="mt-1 w-4 h-4 rounded cursor-pointer"
                    />
                    <div>
                      <div className="font-semibold text-sm">{dir.name}</div>
                      <div className="text-xs text-gray-600">Rank: {dir.rank}</div>
                      <div className="text-xs text-gray-600">{dir.category}</div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              Submissions created successfully! Redirecting...
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting || !selectedLocationId || selectedDirectories.size === 0}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : `Submit to ${selectedDirectories.size} Directories`}
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
