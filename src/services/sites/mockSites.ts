
import { Site } from '@/types/energy';

export const mockSites: Site[] = [
  {
    id: '1',
    name: 'Main Campus',
    location: 'New York, NY',
    type: 'commercial',
    capacity: 500,
    status: 'active',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-03-20T14:30:00Z',
  },
  {
    id: '2',
    name: 'East Distribution Center',
    location: 'Philadelphia, PA',
    type: 'industrial',
    capacity: 1200,
    status: 'active',
    createdAt: '2023-02-10T08:15:00Z',
    updatedAt: '2024-03-18T11:45:00Z',
  },
  {
    id: '3',
    name: 'West Research Facility',
    location: 'San Francisco, CA',
    type: 'research',
    capacity: 350,
    status: 'maintenance',
    createdAt: '2023-04-05T09:30:00Z',
    updatedAt: '2024-03-22T16:20:00Z',
  },
];
