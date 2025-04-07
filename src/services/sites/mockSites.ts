
import { Site } from '@/types/energy';

export const mockSites: Site[] = [
  {
    id: "1",
    name: "Solar Farm Alpha",
    location: "Arizona, USA",
    timezone: "America/Phoenix",
    type: "solar_farm",
    status: "active",
    description: "Large-scale solar installation with 5,000 panels",
    contact_person: "John Smith",
    contact_email: "john.smith@example.com",
    lat: 33.448376,
    lng: -112.074036,
    created_at: "2023-01-15T00:00:00Z",
    updated_at: "2023-04-10T00:00:00Z",
    // Adding missing properties required by Site interface
    address: "123 Solar Way",
    city: "Phoenix",
    state: "Arizona",
    country: "USA",
    postal_code: "85001"
  },
  {
    id: "2",
    name: "Wind Farm Beta",
    location: "Oregon, USA",
    timezone: "America/Los_Angeles",
    type: "wind_farm",
    status: "active",
    description: "Coastal wind farm with 30 turbines",
    contact_person: "Jane Doe",
    contact_email: "jane.doe@example.com",
    lat: 45.523064,
    lng: -122.676483,
    created_at: "2023-02-20T00:00:00Z",
    updated_at: "2023-04-12T00:00:00Z",
    // Adding missing properties required by Site interface
    address: "456 Wind Drive",
    city: "Portland",
    state: "Oregon",
    country: "USA",
    postal_code: "97201"
  },
  {
    id: "3",
    name: "Hybrid Site Gamma",
    location: "Texas, USA",
    timezone: "America/Chicago",
    type: "hybrid",
    status: "maintenance",
    description: "Combined solar and wind installation with battery storage",
    contact_person: "Robert Johnson",
    contact_email: "robert.johnson@example.com",
    lat: 29.760427,
    lng: -95.369804,
    created_at: "2023-03-05T00:00:00Z",
    updated_at: "2023-04-15T00:00:00Z",
    // Adding missing properties required by Site interface
    address: "789 Energy Blvd",
    city: "Houston",
    state: "Texas",
    country: "USA",
    postal_code: "77001"
  }
];
