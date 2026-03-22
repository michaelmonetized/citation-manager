"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

export default function LocationsPage() {
  const submitToGoogle = useMutation(api.submitGoogle.submitToGoogle);

  const [name, setName] = useState("HustleLaunch");
  const [address, setAddress] = useState("146 Saints Place, Canton, NC 28716");
  const [phone, setPhone] = useState("828-269-8280");
  const [website, setWebsite] = useState("https://www.hustlelaunch.com");
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

  const handleSubmitGoogle = async () => {
    setSubmitStatus("Submitting...");
    setLoading(true);

    try {
      const result = await submitToGoogle({
        name,
        address,
        phone,
        website,
      });
      setSubmitStatus(`✓ ${result.status}`);
    } catch (err) {
      setSubmitStatus(
        `✗ Failed: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-slate-900">
            Citation Manager
          </h1>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Submit Location
          </h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Business Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Website
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={handleSubmitGoogle}
            disabled={loading}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white font-semibold rounded-lg transition"
          >
            {loading ? "Submitting..." : "Submit to Google Maps"}
          </button>

          {submitStatus && (
            <p className="mt-4 text-sm font-medium text-slate-700">
              {submitStatus}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
