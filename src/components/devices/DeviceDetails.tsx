import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { SxProps } from '@mui/system';
import { Edit as EditIcon, Delete as DeleteIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { Device } from '@/types/device';
import { fetchDevice, updateDevice, deleteDevice } from '@/services/api/devices';
import { format } from 'date-fns';
import DeviceMetricsChart from './DeviceMetricsChart';
import DeviceSettingsForm from './DeviceSettingsForm';
import Skeleton from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import ErrorBoundary from '@/components/ErrorBoundary';
import { EnergyDashboard } from '@/components/energy/EnergyDashboard';
import { fetchEnergyMetrics, getEnergyOptimizationSuggestions } from '@/lib/api/energy';

interface DeviceDetailsProps {
  deviceId: string;
  onUpdate?: () => void;
  onDelete?: () => void;
}

const DeviceDetailsSkeleton: React.FC = () => (
  <Card>
    <CardHeader
      title={<Skeleton className="h-8 w-1/3" />}
      subheader={<Skeleton className="h-6 w-1/4 mt-2" />}
    />
    <CardContent>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <Stack spacing={2}>
            {[1, 2, 3].map((i) => (
              <Box key={i}>
                <Skeleton className="h-6 w-1/4 mb-1" />
                <Skeleton className="h-8 w-3/4" />
              </Box>
            ))}
          </Stack>
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <Stack spacing={2}>
            {[1, 2, 3, 4].map((i) => (
              <Box key={i}>
                <Skeleton className="h-6 w-1/4 mb-1" />
                <Skeleton className="h-8 w-3/4" />
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const DeviceDetails: React.FC<DeviceDetailsProps> = ({ deviceId, onUpdate, onDelete }) => {
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { showToast } = useToast();

  const loadDevice = async () => {
    try {
      setLoading(true);
      const data = await fetchDevice(deviceId);
      setDevice(data);
      setError(null);
      setRetryCount(0);

      // Fetch energy metrics
      const metrics = await fetchEnergyMetrics(deviceId, '24h');

      // Get optimization suggestions
      const suggestions = await getEnergyOptimizationSuggestions(deviceId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load device');
      showToast({
        message: 'Failed to load device details',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevice();
  }, [deviceId]);

  const handleUpdate = async (updatedData: Partial<Device>) => {
    try {
      const updated = await updateDevice(deviceId, updatedData);
      setDevice(updated);
      setIsEditMode(false);
      onUpdate?.();
      showToast({
        message: 'Device updated successfully',
        severity: 'success',
      });
    } catch (err) {
      showToast({
        message: err instanceof Error ? err.message : 'Failed to update device',
        severity: 'error',
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDevice(deviceId);
      onDelete?.();
      showToast({
        message: 'Device deleted successfully',
        severity: 'success',
      });
    } catch (err) {
      showToast({
        message: err instanceof Error ? err.message : 'Failed to delete device',
        severity: 'error',
      });
    }
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    loadDevice();
  };

  if (loading) return <DeviceDetailsSkeleton />;
  
  if (error) {
    return (
      <Card>
        <CardContent>
          <Stack spacing={2} alignItems="center">
            <Typography color="error">{error}</Typography>
            {retryCount < 3 && (
              <Button
                variant="contained"
                onClick={handleRetry}
                startIcon={<RefreshIcon />}
              >
                Retry Loading
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (!device) return <Typography>Device not found</Typography>;

  return (
    <ErrorBoundary>
      <Card>
        <CardHeader
          title={device.name}
          subheader={`Type: ${device.type}`}
          action={
            <Stack
              direction="row"
              spacing={1}
              sx={isMobile ? { 
                position: 'absolute',
                top: theme.spacing(1),
                right: theme.spacing(1),
              } : undefined}
            >
              <IconButton
                onClick={loadDevice}
                title="Refresh"
                size={isMobile ? 'small' : 'medium'}
              >
                <RefreshIcon />
              </IconButton>
              <IconButton
                onClick={() => setIsEditMode(true)}
                title="Edit"
                size={isMobile ? 'small' : 'medium'}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={() => setShowDeleteDialog(true)}
                title="Delete"
                size={isMobile ? 'small' : 'medium'}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          }
        />
        <CardContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2">Status</Typography>
                  <Chip
                    label={device.status}
                    color={device.status === 'online' ? 'success' : 'error'}
                    sx={{ mt: 1 }}
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2">Location</Typography>
                  <Typography sx={{ mt: 1 }}>{device.location.zone}</Typography>
                  {device.location.coordinates && (
                    <Typography sx={{ mt: 1 }}>
                      Coordinates: {device.location.coordinates.lat}, {device.location.coordinates.lng}
                    </Typography>
                  )}
                </Box>
                <Box>
                  <Typography variant="subtitle2">Last Seen</Typography>
                  <Typography sx={{ mt: 1 }}>
                    {format(new Date(device.lastSeen), 'PPpp')}
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2">Metadata</Typography>
                  <Stack spacing={1} sx={{ mt: 1 }}>
                    <Typography>
                      Manufacturer: {device.metadata.manufacturer}
                    </Typography>
                    <Typography>
                      Model: {device.metadata.model}
                    </Typography>
                    <Typography>
                      Serial Number: {device.metadata.serialNumber}
                    </Typography>
                    <Typography>
                      Firmware Version: {device.metadata.firmwareVersion}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Box>
            <Box sx={{ width: '100%' }}>
              <DeviceMetricsChart deviceId={deviceId} />
            </Box>
          </Box>
        </CardContent>

        <Dialog
          open={isEditMode}
          onClose={() => setIsEditMode(false)}
          fullScreen={isMobile}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Edit Device</DialogTitle>
          <DialogContent>
            <DeviceSettingsForm
              device={device}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditMode(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Delete Device</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this device? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
      <EnergyDashboard devices={[device].filter((d): d is Device => d !== null)} />
    </ErrorBoundary>
  );
};

export default DeviceDetails;