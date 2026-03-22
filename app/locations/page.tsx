"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export default function LocationsPage() {
  const locations = useQuery(api.locations.listLocations);

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
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Your Locations</h2>
          <Link
            href="/locations/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Location
          </Link>
        </div>

        {locations === undefined && (
          <div className="text-gray-600">Loading...</div>
        )}

        {locations && locations.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">No locations yet</p>
            <Link
              href="/locations/new"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create Your First Location
            </Link>
          </div>
        )}

        {locations && locations.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {locations.map((location: typeof locations[0]) => (
              <div key={location._id} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold">{location.businessName}</h3>
                <p className="text-gray-600">{location.address}</p>
                <p className="text-gray-600">{location.city}, {location.state} {location.zipCode}</p>
                <p className="text-gray-600">{location.phone}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
