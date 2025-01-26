const WILDFIRE_API_KEY = 'd487c805272fad2e7e3934f7c1d57c9a';
const FIRMS_API_URL = 'https://firms.modaps.eosdis.nasa.gov/api/area';

export const fetchEarthquakeData = async () => {
  try {
    const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
    const data = await response.json();
    return data.features.map((feature: any) => ({
      title: feature.properties.place,
      magnitude: feature.properties.mag,
      time: feature.properties.time,
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0],
      location: feature.properties.place
    }));
  } catch (error) {
    console.error('Error fetching earthquake data:', error);
    return [];
  }
};

export const fetchWildfireData = async () => {
  try {
    const response = await fetch(`${FIRMS_API_URL}/data/${WILDFIRE_API_KEY}`);
    const data = await response.json();
    return data.map((fire: any) => ({
      title: `Wildfire at ${fire.latitude.toFixed(2)}, ${fire.longitude.toFixed(2)}`,
      time: fire.acq_date,
      latitude: fire.latitude,
      longitude: fire.longitude,
      location: `${fire.latitude.toFixed(2)}°N, ${fire.longitude.toFixed(2)}°E`
    }));
  } catch (error) {
    console.error('Error fetching wildfire data:', error);
    return [];
  }
};

export const fetchTsunamiData = async () => {
  try {
    const response = await fetch('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&eventtype=tsunami');
    const data = await response.json();
    return data.features.map((feature: any) => ({
      title: feature.properties.place,
      time: feature.properties.time,
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0],
      location: feature.properties.place
    }));
  } catch (error) {
    console.error('Error fetching tsunami data:', error);
    return [];
  }
};