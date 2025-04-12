// Fix the type export issues
export type { Alert, AlertCountSummary };
// Rest of the file remains the same

export const getAlertCounts = async (): Promise<AlertCountSummary> => {
  // Implementation
  return {
    critical: 2,
    high: 3,
    medium: 5,
    low: 8,
    total: 18
  };
};
