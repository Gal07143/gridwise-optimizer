
import { Site } from '@/types/site';

export const mockSites: Site[] = [
  {
    id: 'site-1',
    name: 'Main Residence',
    location: 'San Francisco, CA',
    timezone: 'America/Los_Angeles',
    type: 'residential',
    status: 'active',
    description: 'Primary residential site with solar and battery storage',
    lat: 37.7749,
    lng: -122.4194,
    created_at: '2023-01-15T12:00:00Z',
    updated_at: '2023-06-22T14:30:00Z'
  },
  {
    id: 'site-2',
    name: 'Office Building',
    location: 'New York, NY',
    timezone: 'America/New_York',
    type: 'commercial',
    status: 'active',
    description: 'Commercial office building with rooftop solar',
    lat: 40.7128,
    lng: -74.0060,
    created_at: '2023-02-10T09:15:00Z',
    updated_at: '2023-06-18T11:20:00Z'
  },
  {
    id: 'site-3',
    name: 'Beach House',
    location: 'Miami, FL',
    timezone: 'America/New_York',
    type: 'residential',
    status: 'active',
    description: 'Vacation home with solar panels and EV charger',
    lat: 25.7617,
    lng: -80.1918,
    created_at: '2023-03-05T16:45:00Z',
    updated_at: '2023-06-20T08:10:00Z'
  }
];

export default mockSites;
