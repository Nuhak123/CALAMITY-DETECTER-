import React, { useState, useEffect } from 'react';
import { MapPin, Flame, Waves as Wave } from 'lucide-react';
import Map from './components/Map';
import CalamityInfo from './components/CalamityInfo';
import { fetchEarthquakeData, fetchWildfireData, fetchTsunamiData } from './api/calamityApi';

function App() {
  const [selectedCalamity, setSelectedCalamity] = useState('earthquake');
  const [calamityData, setCalamityData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let data;
        switch (selectedCalamity) {
          case 'earthquake':
            data = await fetchEarthquakeData();
            break;
          case 'wildfire':
            data = await fetchWildfireData();
            break;
          case 'tsunami':
            data = await fetchTsunamiData();
            break;
          default:
            data = [];
        }
        setCalamityData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [selectedCalamity]);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">Natural Calamity Detection</h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Select Calamity</h2>
              <div className="space-y-4">
                <button
                  onClick={() => setSelectedCalamity('earthquake')}
                  className={`w-full flex items-center px-4 py-2 rounded-md ${
                    selectedCalamity === 'earthquake'
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  Earthquake
                </button>
                <button
                  onClick={() => setSelectedCalamity('wildfire')}
                  className={`w-full flex items-center px-4 py-2 rounded-md ${
                    selectedCalamity === 'wildfire'
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Flame className="mr-2 h-5 w-5" />
                  Wildfire
                </button>
                <button
                  onClick={() => setSelectedCalamity('tsunami')}
                  className={`w-full flex items-center px-4 py-2 rounded-md ${
                    selectedCalamity === 'tsunami'
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Wave className="mr-2 h-5 w-5" />
                  Tsunami
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white shadow rounded-lg p-6">
              <Map
                apiKey="AIzaSyDXwyxJ6_QFRHry5Scl9ySup6tkkCskCbw"
                calamityData={calamityData}
                calamityType={selectedCalamity}
              />
            </div>
            <div className="mt-8">
              <CalamityInfo
                loading={loading}
                calamityType={selectedCalamity}
                data={calamityData}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;