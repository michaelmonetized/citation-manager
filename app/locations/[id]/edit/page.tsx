"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export default function EditLocationPage() {
  const router = useRouter();
  const params = useParams();
  const locationId = params.id as string;

  const location = useQuery(api.locations.getLocation, { locationId });
  const updateLocation = useMutation(api.locations.updateLocation);
  const deleteLocation = useMutation(api.locations.deleteLocation);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Populate form when location loads
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
        locationId,
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

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      await deleteLocation({ locationId });
      router.push("/locations");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete location");
      setLoading(false);
    }
  };

  if (!location) {
    return (
      <div className="max-w-md mx-auto p-6">
        <p className="text-slate-600">Loading location...</p>
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
              onChange={(e) => setState(e.target.value.toUpperCase())}
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
            {loading ? "Updating..." : "Update Location"}
          </button>
          <Link href="/locations" className="flex-1 bg-gray-200 text-gray-800 py-2 rounded font-medium text-center">
            Cancel
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full bg-red-600 text-white py-2 rounded font-medium hover:bg-red-700 mt-4"
        >
          Delete Location
        </button>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Delete Location?</h2>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete "{name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-2 rounded font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
