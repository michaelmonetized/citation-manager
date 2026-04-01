"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

export default function SubmissionsPage() {
  const locations = useQuery(api.locations.listLocations);
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  
  const locationSubmissions = selectedLocationId 
    ? useQuery(api.submissions.getLocationSubmissions, { locationId: selectedLocationId as any })
    : null;
  
  const submissionStatus = selectedLocationId
    ? useQuery(api.submissions.getSubmissionStatus, { locationId: selectedLocationId as any })
    : null;

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
      submitted: { bg: "bg-blue-100", text: "text-blue-800", label: "Submitted" },
      verified: { bg: "bg-green-100", text: "text-green-800", label: "Verified" },
      failed: { bg: "bg-red-100", text: "text-red-800", label: "Failed" },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getDirectoryName = (dirId: string) => {
    // In a real app, we'd fetch directory details
    return `Directory ${dirId.slice(0, 8)}`;
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
              <Link href="/submit" className="text-gray-600 hover:text-gray-900">
                Submit
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-8">Submission Status</h2>

        {/* Location Selector */}
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Location
          </label>
          <select
            value={selectedLocationId}
            onChange={(e) => setSelectedLocationId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Choose location --</option>
            {locations?.map((loc) => (
              <option key={loc._id} value={loc._id}>
                {(loc as any).businessName} ({(loc as any).city}, {(loc as any).state})
              </option>
            ))}
          </select>
        </div>

        {/* Status Summary */}
        {selectedLocationId && submissionStatus && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total", key: "total", bg: "bg-blue-50", text: "text-blue-700" },
              { label: "Pending", key: "pending", bg: "bg-yellow-50", text: "text-yellow-700" },
              { label: "Submitted", key: "submitted", bg: "bg-blue-50", text: "text-blue-700" },
              { label: "Verified", key: "verified", bg: "bg-green-50", text: "text-green-700" },
            ].map((stat) => (
              <div key={stat.key} className={`${stat.bg} rounded-lg shadow p-6`}>
                <p className={`text-3xl font-bold ${stat.text}`}>
                  {(submissionStatus as any)[stat.key]}
                </p>
                <p className={`text-sm ${stat.text} mt-1`}>{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Progress Bar */}
        {submissionStatus && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-900">Overall Progress</h3>
              <span className="text-sm font-medium text-gray-600">
                {(submissionStatus as any).completionPercentage}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all"
                style={{ width: `${(submissionStatus as any).completionPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Submissions List */}
        {selectedLocationId && locationSubmissions && locationSubmissions.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Directory</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Submitted</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Verified</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Error</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {locationSubmissions.map((sub: any) => (
                    <tr key={sub._id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {getDirectoryName(sub.directoryId)}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        {getStatusBadge(sub.status)}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {sub.verifiedAt ? new Date(sub.verifiedAt).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-6 py-3 text-sm text-red-600">
                        {sub.errorMessage || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : selectedLocationId ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No submissions for this location</p>
            <p className="text-gray-500 mt-2">
              <Link href="/submit" className="text-blue-600 hover:text-blue-700">
                Start by submitting to directories
              </Link>
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Select a location to view submissions</p>
          </div>
        )}
      </main>
    </div>
  );
}
