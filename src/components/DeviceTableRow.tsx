
import { useDeviceStatus } from "@/hooks/useDeviceStatus";
import { TableRow, TableCell } from "@/components/ui/table";
import DeviceActionMenu from "@/components/DeviceActionMenu";

export const DeviceTableRow = ({ device }: { device: any }) => {
  const { status } = useDeviceStatus(device.id);

  return (
    <TableRow>
      <TableCell className="font-medium">{device.name}</TableCell>
      <TableCell>{device.type}</TableCell>
      <TableCell>{device.protocol}</TableCell>
      <TableCell>{device.model}</TableCell>
      <TableCell>
        {status ? (
          <span className={`font-semibold ${status.status === 'online' ? 'text-green-600' : 'text-red-500'}`}>
            {status.status}
          </span>
        ) : (
          <span className="text-muted">Loading...</span>
        )}
      </TableCell>
      <TableCell>
        {status?.voltage ? `${status.voltage} V` : '-'} / {status?.current ? `${status.current} A` : '-'}
      </TableCell>
      <TableCell>{status?.temperature ? `${status.temperature} °C` : '-'}</TableCell>
      <TableCell>
        <DeviceActionMenu deviceId={device.id} />
      </TableCell>
    </TableRow>
  );
};

export default DeviceTableRow;
