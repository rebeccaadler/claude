export type Difficulty = 'Easy' | 'Moderate' | 'Hard';
export type Priority = 'High' | 'Medium' | 'Low';

export interface Photo {
  id: string;
  url: string;
  caption?: string;
}

export interface Hike {
  id: string;
  name: string;
  location: string;
  difficulty: Difficulty;
  duration: string;
  description: string;
  trailDescription: string;
  trailMarkers: string;
  notes: string;
  personalComments: string;
  rating: number;
  dateCompleted: string;
  photos: Photo[];
  coverPhoto: string;
  isFavorite: boolean;
  coordinates: [number, number];
  moovitLink: string;
  googleMapsLink: string;
  additionalLinks: { label: string; url: string }[];
  tags: string[];
}

export interface WishlistHike {
  id: string;
  name: string;
  location: string;
  difficulty: Difficulty;
  duration: string;
  notes: string;
  photos: Photo[];
  coverPhoto: string;
  priority: Priority;
  coordinates: [number, number];
  moovitLink: string;
  googleMapsLink?: string;
  description?: string;
}

export type ActiveTab = 'hikes' | 'wishlist' | 'map';
export type SortBy = 'name' | 'date' | 'duration' | 'location';
