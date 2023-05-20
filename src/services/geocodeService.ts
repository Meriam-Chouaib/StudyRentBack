import opencage from 'opencage-api-client';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';
import { Post } from '@prisma/client';
import { Localization } from '../types/post/post.types';

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
export async function geocodeAddresses(posts: Post[]): Promise<Localization[]> {
  try {
    const localizations: Localization[] = await Promise.all(
      posts.map(async (item: Post) => {
        const address = await geocodeAddress(item.state, item.postal_code, item.city);
        return address;
      }),
    );
    return localizations;
  } catch (e) {
    throw new ApiError(500, 'Error in geocoding');
  }
}
