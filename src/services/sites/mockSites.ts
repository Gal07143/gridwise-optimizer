
import { Site } from '@/types/energy';

export const mockSites: Site[] = [
  {
    id: 'site-1',
    name: 'Main Campus',
    location: 'New York',
    timezone: 'America/New_York',
    lat: 40.7128,
    lng: -74.0060,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'site-2',
    name: 'West Building',
    location: 'San Francisco',
    timezone: 'America/Los_Angeles',
    lat: 37.7749,
    lng: -122.4194,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'site-3',
    name: 'East Campus',
    location: 'Boston',
    timezone: 'America/New_York',
    lat: 42.3601,
    lng: -71.0589,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];
