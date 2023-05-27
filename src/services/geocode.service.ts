import opencage from 'opencage-api-client';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';
import { Post } from '@prisma/client';
import { Localization } from '../types/post/post.types';
import { universities } from '../config/addresses_universities';
import { splitAddress } from '../utils/splitAddress';

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
    console.log('errrrrrrrrrrrrrrroor geocoodeiing', error);
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
    // console.log('localizations', localizations);

    return localizations;
  } catch (e) {
    console.log(e);
  }
}
// __________________________________________ get university address _____________________________________
export const getUniversityAddress = async (universityName) => {
  try {
    const university = universities.find((u) => u.name === universityName);

    if (university) {
      return university.address;
    }

    return null;
  } catch (error) {
    console.error('Error retrieving university address:', error);
    throw error;
  }
};
export async function calculateDistance(
  coords1: { latitude: number; longitude: number },
  coords2: { latitude: number; longitude: number },
): Promise<number> {
  // Calculate the distance between two sets of coordinates
  // You can use a library or implement a formula to calculate the distance based on latitude and longitude
  // Here's an example using the Haversine formula:
  const earthRadius = 6371; // Radius of the Earth in kilometers
  const latDiff = (coords2.latitude - coords1.latitude) * (Math.PI / 180);
  const lonDiff = (coords2.longitude - coords1.longitude) * (Math.PI / 180);
  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos((coords1.latitude * Math.PI) / 180) *
      Math.cos((coords2.latitude * Math.PI) / 180) *
      Math.sin(lonDiff / 2) *
      Math.sin(lonDiff / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance;
}
export async function calculateNearestPostsToUniversity(
  universityAddress: string,
  posts: Post[],
): Promise<Post[]> {
  try {
    console.log('universityAddress', universityAddress);
    console.log(posts);

    // const [city, state, postal_code] = universityAddress.split(',').map((item) => item.trim());
    const [city, state, postal_code] = splitAddress(universityAddress);
    console.log(state);
    const universityStatePosts = posts.filter((post) => post.city === city);
    console.log('nearestPosts', universityStatePosts);

    return universityStatePosts;
  } catch (error) {
    console.error('Error calculating nearest posts:', error);
    throw error;
  }
}
