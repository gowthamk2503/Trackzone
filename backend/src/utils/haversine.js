/**
 * Haversine Formula Utility
 * Calculates the great-circle distance between two geographic coordinates on Earth.
 */

/**
 * Calculates distance between two GPS coordinates in meters using the Haversine formula
 * @param coord1 First coordinate {latitude, longitude}
 * @param coord2 Second coordinate {latitude, longitude}
 * @returns Distance in meters
 */
export const calculateDistanceMeters = (coord1, coord2) => {
  const EARTH_RADIUS_METERS = 6371e3; // Earth's mean radius in meters

  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const phi1 = toRadians(coord1.latitude);
  const phi2 = toRadians(coord2.latitude);
  const deltaPhi = toRadians(coord2.latitude - coord1.latitude);
  const deltaLambda = toRadians(coord2.longitude - coord1.longitude);

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = EARTH_RADIUS_METERS * c;
  return Math.round(distance * 100) / 100; // round to 2 decimal places
};

/**
 * Validates whether a user's coordinate is within an office's geofenced radius
 * @param userCoord User's current GPS coordinates
 * @param officeCoord Office center GPS coordinates
 * @param radiusMeters Geofence radius in meters
 * @param accuracyToleranceMeters Optional GPS accuracy tolerance (default: 15m)
 */
export const validateGeofence = (
  userCoord,
  officeCoord,
  radiusMeters,
  accuracyToleranceMeters = 15
) => {
  const distance = calculateDistanceMeters(userCoord, officeCoord);
  const effectiveRadius = radiusMeters + accuracyToleranceMeters;
  const isWithin = distance <= effectiveRadius;

  let formattedDistance = '';
  if (distance < 1000) {
    formattedDistance = `${Math.round(distance)} m`;
  } else {
    formattedDistance = `${(distance / 1000).toFixed(2)} km`;
  }

  return {
    isWithinGeofence: isWithin,
    distanceMeters: distance,
    formattedDistance,
    radiusMeters,
    differenceMeters: Math.round((distance - radiusMeters) * 10) / 10,
  };
};
