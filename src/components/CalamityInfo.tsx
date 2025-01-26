import React from 'react';
import { AlertCircle } from 'lucide-react';

interface CalamityInfoProps {
  loading: boolean;
  calamityType: string;
  data: any[];
}

const CalamityInfo: React.FC<CalamityInfoProps> = ({ loading, calamityType, data }) => {
  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 capitalize">{calamityType} Information</h2>
      {data.length === 0 ? (
        <div className="flex items-center justify-center p-4 text-gray-500">
          <AlertCircle className="mr-2 h-5 w-5" />
          No recent {calamityType} events detected
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((event, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <h3 className="font-medium">{event.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                Location: {event.location}
              </p>
              <p className="text-sm text-gray-600">
                Time: {new Date(event.time).toLocaleString()}
              </p>
              {event.magnitude && (
                <p className="text-sm text-gray-600">
                  Magnitude: {event.magnitude}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalamityInfo;