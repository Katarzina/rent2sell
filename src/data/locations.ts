export const locationCoordinates: Record<string, [number, number]> = {
  'Downtown, New York': [40.7614, -73.9776],
  'Brooklyn, New York': [40.6782, -73.9442],
  'Upper East Side, New York': [40.7736, -73.9566],
  'Battery Park, New York': [40.7033, -74.0170],
  'SoHo, New York': [40.7233, -74.0030],
  'Greenwich Village, New York': [40.7336, -73.9938],
};

export const getLocationCoordinates = (locationString: string): [number, number] | null => {
  return locationCoordinates[locationString] || null;
};