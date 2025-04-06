
import { Site } from '@/types/site';

const mockSites: Site[] = [
  {
    id: "site-001",
    name: "Residential Home",
    location: "San Francisco, CA",
    timezone: "America/Los_Angeles",
    type: "residential",
    status: "active",
    description: "Single-family home with solar panels, battery storage, and EV charging.",
    contact_person: "John Doe",
    contact_email: "john.doe@example.com",
    lat: 37.7749,
    lng: -122.4194,
    created_at: "2023-01-15T08:00:00Z",
    updated_at: "2023-04-20T14:30:00Z"
  },
  {
    id: "site-002",
    name: "Commercial Office",
    location: "Austin, TX",
    timezone: "America/Chicago",
    type: "commercial",
    status: "active",
    description: "Multi-story office building with rooftop solar and energy storage.",
    contact_person: "Jane Smith",
    contact_email: "jane.smith@example.com",
    lat: 30.2672,
    lng: -97.7431,
    created_at: "2023-02-10T09:15:00Z",
    updated_at: "2023-05-05T11:45:00Z"
  },
  {
    id: "site-003",
    name: "Industrial Plant",
    location: "Detroit, MI",
    timezone: "America/Detroit",
    type: "industrial",
    status: "maintenance",
    description: "Manufacturing facility with combined heat and power system.",
    contact_person: "Robert Johnson",
    contact_email: "robert.johnson@example.com",
    lat: 42.3314,
    lng: -83.0458,
    created_at: "2023-03-05T10:30:00Z",
    updated_at: "2023-06-12T16:20:00Z"
  }
];

export default mockSites;
