export const applyDeviceFilters = (devices, filters) => {
  return devices.filter((device) => {
    const matchType = !filters.type || device.type === filters.type;
    const matchStatus = !filters.status || device.status === filters.status;
    return matchType && matchStatus;
  });
};
