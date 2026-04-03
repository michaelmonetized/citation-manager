'use client';

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { CheckCircle2, Clock, RefreshCw } from 'lucide-react';

export default function PushToDirectoriesPage() {
  const [locationId, setLocationId] = useState<string>('');
  const [selectedDirectories, setSelectedDirectories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Queries
  const directories = useQuery(api.directories.listDirectories);
  const submissions = useQuery(api.submissions.getLocationSubmissions, {
    locationId: locationId as any,
  });
  const submissionStatus = useQuery(api.submissions.getSubmissionStatus, {
    locationId: locationId as any,
  });

  // Mutations
  const bulkSubmit = useMutation(api.submissions.bulkSubmit);

  const handleSubmit = async () => {
    if (!locationId || selectedDirectories.length === 0) {
      alert('Please select a location and at least one directory');
      return;
    }

    setIsSubmitting(true);
    try {
      await bulkSubmit({
        locationId: locationId as any,
        directoryIds: selectedDirectories as any,
      });
      setSelectedDirectories([]);
      alert('Submissions queued successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Error: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!directories) return <div>Loading directories...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Push to All Directories</h1>

      {/* Step 1: Select Location */}
      <div className="mb-6 border rounded p-6">
        <h2 className="text-lg font-semibold mb-4">Step 1: Select Business Location</h2>
        <select
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="">Choose a location...</option>
          {/* Location options would be fetched from Convex */}
        </select>
      </div>

      {/* Step 2: Select Directories */}
      <div className="mb-6 border rounded p-6">
        <h2 className="text-lg font-semibold mb-4">Step 2: Select Directories ({selectedDirectories.length})</h2>
        <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {directories.map((dir: any) => (
            <label key={dir._id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedDirectories.includes(dir._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedDirectories([...selectedDirectories, dir._id]);
                  } else {
                    setSelectedDirectories(selectedDirectories.filter((id) => id !== dir._id));
                  }
                }}
              />
              <span className="text-sm">
                {dir.name} <span className="text-gray-400">({dir.rank})</span>
              </span>
            </label>
          ))}
        </div>
        <button
          onClick={() => setSelectedDirectories(directories.map((d: any) => d._id))}
          className="mt-4 mr-2 px-4 py-2 border rounded hover:bg-gray-100"
        >
          Select All
        </button>
        <button
          onClick={() => setSelectedDirectories([])}
          className="mt-4 px-4 py-2 border rounded hover:bg-gray-100"
        >
          Deselect All
        </button>
      </div>

      {/* Step 3: Submit & Status */}
      <div className="mb-6 border rounded p-6">
        <h2 className="text-lg font-semibold mb-4">Step 3: Submit & Track Status</h2>
        <button
          onClick={handleSubmit}
          disabled={!locationId || selectedDirectories.length === 0 || isSubmitting}
          className="mb-6 px-6 py-2 bg-black text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Push to All Selected Directories'}
        </button>

          {submissionStatus && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded">
                <div className="text-2xl font-bold">{submissionStatus.total}</div>
                <div className="text-sm text-gray-600">Total Submissions</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold">{submissionStatus.pending}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>
              <div className="p-4 bg-orange-50 rounded flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold">{submissionStatus.submitted}</div>
                  <div className="text-sm text-gray-600">Submitted</div>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">{submissionStatus.verified}</div>
                  <div className="text-sm text-gray-600">Verified</div>
                </div>
              </div>
            </div>
          )}

          {submissions && submissions.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Recent Submissions</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {submissions.slice(0, 10).map((sub: any) => (
                  <div key={sub._id} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{sub.directoryId}</span>
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        sub.status === 'verified'
                          ? 'bg-green-100 text-green-800'
                          : sub.status === 'submitted'
                          ? 'bg-orange-100 text-orange-800'
                          : sub.status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
    </div>
  );
}
