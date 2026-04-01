"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import type { Id } from "@/convex/_generated/dataModel";

export default function EditLocationPage() {
  const router = useRouter();
  const params = useParams();
  const locationId = params.id as string;

  const updateLocation = useMutation(api.locations.updateLocation);
  const location = useQuery(api.locations.getLocation, { 
    locationId: locationId as Id<"locations"> 
  }) as any;

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Populate form when location data loads
  useEffect(() => {
    if (location) {
      setName(location.businessName || "");
      setAddress(location.address || "");
      setPhone(location.phone || "");
      setWebsite(location.website || "");
      setCity(location.city || "");
      setState(location.state || "");
      setZipCode(location.zipCode || "");
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!name.trim() || !address.trim() || !city.trim() || !state.trim()) {
        throw new Error("Please fill in all required fields");
      }

      await updateLocation({
        locationId: locationId as Id<"locations">,
        businessName: name,
        address,
        phone,
        website,
        city,
        state,
        zipCode,
      });

      router.push("/locations");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update location");
      setLoading(false);
    }
  };

  if (location === undefined) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (location === null) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="text-center text-red-600">Location not found</div>
        <Link href="/locations" className="text-blue-600 hover:text-blue-700">
          ← Back to locations
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Location</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Business Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address *</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">City *</label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State *</label>
            <input
              type="text"
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              maxLength={2}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">ZIP Code</label>
          <input
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Website</label>
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 rounded font-medium disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <Link href="/locations" className="flex-1 bg-gray-200 text-gray-800 py-2 rounded font-medium text-center">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
