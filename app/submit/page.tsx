"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export default function SubmitPage() {
  const locations = useQuery(api.locations.listLocations);
  const directories = useQuery(api.directories.listTopDirectories, { limit: 50 });
  const bulkSubmit = useMutation(api.submissions.bulkSubmit);

  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [selectedDirs, setSelectedDirs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState("");

  const handleDirToggle = (dirId: string) => {
    const newSet = new Set(selectedDirs);
    if (newSet.has(dirId)) {
      newSet.delete(dirId);
    } else {
      newSet.add(dirId);
    }
    setSelectedDirs(newSet);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocationId || selectedDirs.size === 0) {
      setError("Select location and at least one directory");
      return;
    }

    setLoading(true);
    setStatus("submitting");
    setError("");

    try {
      const dirIds = Array.from(selectedDirs) as any;
      await bulkSubmit({
        locationId: selectedLocationId as any,
        directoryIds: dirIds,
      });

      setStatus("success");
      setSelectedDirs(new Set());
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
      setStatus("idle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
          <span className="text-gray-400">/</span>
          <Link href="/locations" className="text-gray-600 hover:text-gray-900">
            Locations
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Submit to Directories</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8">
          {/* Location Select */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Business Location *
            </label>
            <select
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Choose location --</option>
              {locations?.map((loc: Exclude<typeof locations[0], undefined>) => (
                <option key={loc._id} value={loc._id}>
                  {loc.businessName} ({loc.city}, {loc.state})
                </option>
              ))}
            </select>
          </div>

          {/* Directories */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Top 50 Directories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-4 border rounded-md">
              {directories?.map((dir: Exclude<typeof directories[0], undefined>) => (
                <label key={dir._id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedDirs.has(dir._id)}
                    onChange={() => handleDirToggle(dir._id)}
                    className="rounded"
                  />
                  <span className="text-sm">
                    {dir.name}
                    <span className="text-gray-500 text-xs ml-1">
                      (#{dir.rank})
                    </span>
                  </span>
                </label>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Selected: {selectedDirs.size} director{selectedDirs.size !== 1 ? "ies" : "y"}
            </p>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm mb-4">
              {error}
            </div>
          )}

          {status === "success" && (
            <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm mb-4">
              ✅ Submitted to {selectedDirs.size} directories!
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !selectedLocationId || selectedDirs.size === 0}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium"
          >
            {loading ? "Submitting..." : `Submit to ${selectedDirs.size} Directories`}
          </button>
        </form>
      </main>
    </div>
  );
}
