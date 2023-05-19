import opencage from 'opencage-api-client';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';

export async function geocodeAddress(
  state: string,
  postal_code: string,
  city: string,
): Promise<{ latitude: number; longitude: number }> {
  const address = `${state}, ${postal_code}, ${city}`;
  try {
    const response = await opencage.geocode({ q: address });

    if (response.status.code === httpStatus.OK && response.results.length > 0) {
      const place = response.results[0];
      const latitude = place.geometry.lat;
      const longitude = place.geometry.lng;
      return { latitude, longitude };
    } else {
      throw new ApiError(500, 'Error in geocoding');
    }
  } catch (error) {
    throw new ApiError(500, 'Error in geocoding');
  }
}
