
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface RatePeriod {
  id?: string;
  period: 'Peak' | 'Shoulder' | 'Off-Peak';
  startTime: string;
  endTime: string;
  rate: number;
  dayType?: 'weekday' | 'weekend';
}

export interface Tariff {
  id?: string;
  name: string;
  type: 'standard' | 'tou' | 'dynamic' | 'fixed';
  weekdayRates: RatePeriod[];
  weekendRates: RatePeriod[];
  isDefault?: boolean;
  created_at?: string;
  updated_at?: string;
}

// For demo purposes, we'll store tariffs in local storage until a database is set up
const STORAGE_KEY = 'energy_tariffs';

// Demo tariff data to initialize if nothing exists
const defaultTariffs: Tariff[] = [
  {
    id: '1',
    name: 'Standard Time-of-Use',
    type: 'tou',
    isDefault: true,
    weekdayRates: [
      { id: '1', period: 'Off-Peak', startTime: '00:00', endTime: '07:00', rate: 0.08 },
      { id: '2', period: 'Shoulder', startTime: '07:00', endTime: '16:00', rate: 0.15 },
      { id: '3', period: 'Peak', startTime: '16:00', endTime: '20:00', rate: 0.28 },
      { id: '4', period: 'Shoulder', startTime: '20:00', endTime: '23:59', rate: 0.15 },
    ],
    weekendRates: [
      { id: '1', period: 'Off-Peak', startTime: '00:00', endTime: '09:00', rate: 0.07 },
      { id: '2', period: 'Shoulder', startTime: '09:00', endTime: '23:59', rate: 0.12 },
    ],
  },
  {
    id: '2',
    name: 'Fixed Rate Plan',
    type: 'fixed',
    isDefault: false,
    weekdayRates: [
      { id: '1', period: 'Off-Peak', startTime: '00:00', endTime: '23:59', rate: 0.15 },
    ],
    weekendRates: [
      { id: '1', period: 'Off-Peak', startTime: '00:00', endTime: '23:59', rate: 0.15 },
    ],
  },
];

// Initialize storage with default data if needed
const initializeStorage = () => {
  const existingTariffs = localStorage.getItem(STORAGE_KEY);
  if (!existingTariffs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTariffs));
  }
};

// Get all tariffs
export const getAllTariffs = (): Tariff[] => {
  initializeStorage();
  const tariffs = localStorage.getItem(STORAGE_KEY);
  return tariffs ? JSON.parse(tariffs) : [];
};

// Get a tariff by ID
export const getTariffById = (id: string): Tariff | undefined => {
  const tariffs = getAllTariffs();
  return tariffs.find(tariff => tariff.id === id);
};

// Create a new tariff
export const createTariff = (tariff: Omit<Tariff, 'id'>): Tariff => {
  const tariffs = getAllTariffs();
  const newTariff: Tariff = {
    ...tariff,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...tariffs, newTariff]));
  toast.success("Tariff created successfully");
  return newTariff;
};

// Update an existing tariff
export const updateTariff = (id: string, tariff: Partial<Tariff>): Tariff | null => {
  const tariffs = getAllTariffs();
  const index = tariffs.findIndex(t => t.id === id);
  
  if (index === -1) {
    toast.error("Tariff not found");
    return null;
  }
  
  const updatedTariff = {
    ...tariffs[index],
    ...tariff,
    updated_at: new Date().toISOString(),
  };
  
  tariffs[index] = updatedTariff;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tariffs));
  toast.success("Tariff updated successfully");
  return updatedTariff;
};

// Set a tariff as default
export const setDefaultTariff = (id: string): void => {
  const tariffs = getAllTariffs();
  const updatedTariffs = tariffs.map(tariff => ({
    ...tariff,
    isDefault: tariff.id === id,
    updated_at: tariff.id === id ? new Date().toISOString() : tariff.updated_at,
  }));
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTariffs));
  toast.success("Default tariff updated");
};

// Delete a tariff
export const deleteTariff = (id: string): boolean => {
  const tariffs = getAllTariffs();
  const tariffToDelete = tariffs.find(t => t.id === id);
  
  if (!tariffToDelete) {
    toast.error("Tariff not found");
    return false;
  }
  
  if (tariffToDelete.isDefault) {
    toast.error("Cannot delete default tariff");
    return false;
  }
  
  const filteredTariffs = tariffs.filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTariffs));
  toast.success("Tariff deleted successfully");
  return true;
};

// Add a rate period to a tariff
export const addRatePeriod = (
  tariffId: string, 
  ratePeriod: Omit<RatePeriod, 'id'>,
  dayType: 'weekday' | 'weekend'
): RatePeriod | null => {
  const tariffs = getAllTariffs();
  const index = tariffs.findIndex(t => t.id === tariffId);
  
  if (index === -1) {
    toast.error("Tariff not found");
    return null;
  }
  
  const newRatePeriod: RatePeriod = {
    ...ratePeriod,
    id: Date.now().toString(),
  };
  
  const ratesKey = dayType === 'weekday' ? 'weekdayRates' : 'weekendRates';
  
  tariffs[index] = {
    ...tariffs[index],
    [ratesKey]: [...tariffs[index][ratesKey], newRatePeriod],
    updated_at: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tariffs));
  return newRatePeriod;
};

// Update a rate period
export const updateRatePeriod = (
  tariffId: string,
  ratePeriodId: string,
  ratePeriod: Partial<RatePeriod>,
  dayType: 'weekday' | 'weekend'
): RatePeriod | null => {
  const tariffs = getAllTariffs();
  const tariffIndex = tariffs.findIndex(t => t.id === tariffId);
  
  if (tariffIndex === -1) {
    toast.error("Tariff not found");
    return null;
  }
  
  const ratesKey = dayType === 'weekday' ? 'weekdayRates' : 'weekendRates';
  const rates = tariffs[tariffIndex][ratesKey];
  const rateIndex = rates.findIndex(r => r.id === ratePeriodId);
  
  if (rateIndex === -1) {
    toast.error("Rate period not found");
    return null;
  }
  
  const updatedRate = {
    ...rates[rateIndex],
    ...ratePeriod,
  };
  
  tariffs[tariffIndex][ratesKey][rateIndex] = updatedRate;
  tariffs[tariffIndex].updated_at = new Date().toISOString();
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tariffs));
  return updatedRate;
};

// Delete a rate period
export const deleteRatePeriod = (
  tariffId: string,
  ratePeriodId: string,
  dayType: 'weekday' | 'weekend'
): boolean => {
  const tariffs = getAllTariffs();
  const tariffIndex = tariffs.findIndex(t => t.id === tariffId);
  
  if (tariffIndex === -1) {
    toast.error("Tariff not found");
    return false;
  }
  
  const ratesKey = dayType === 'weekday' ? 'weekdayRates' : 'weekendRates';
  const updatedRates = tariffs[tariffIndex][ratesKey].filter(r => r.id !== ratePeriodId);
  
  if (updatedRates.length === 0) {
    toast.error("Cannot delete all rate periods");
    return false;
  }
  
  tariffs[tariffIndex][ratesKey] = updatedRates;
  tariffs[tariffIndex].updated_at = new Date().toISOString();
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tariffs));
  toast.success("Rate period deleted");
  return true;
};
