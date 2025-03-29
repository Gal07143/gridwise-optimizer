import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const DeviceFilterToolbar = ({ onFilter }: { onFilter: (filters: any) => void }) => {
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { type, status, [field]: value };
    if (field === "type") setType(value);
    if (field === "status") setStatus(value);
    onFilter(newFilters);
  };

  return (
    <div className="flex items-center gap-4 mb-4">
      <Select value={type} onValueChange={(value) => handleFilterChange("type", value)}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All types</SelectItem>
          <SelectItem value="battery">Battery</SelectItem>
          <SelectItem value="charger">Charger</SelectItem>
          <SelectItem value="inverter">Inverter</SelectItem>
          <SelectItem value="sensor">Sensor</SelectItem>
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={(value) => handleFilterChange("status", value)}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All statuses</SelectItem>
          <SelectItem value="online">Online</SelectItem>
          <SelectItem value="offline">Offline</SelectItem>
          <SelectItem value="error">Error</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
