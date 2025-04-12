import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Stack,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { Device } from '@/types/device';
import { fetchDevice, updateDevice, deleteDevice } from '@/services/api/devices';
import { format } from 'date-fns';
import DeviceMetricsChart from './DeviceMetricsChart';
import DeviceSettingsForm from './DeviceSettingsForm';

interface DeviceDetailsProps {
  deviceId: string;
  onUpdate?: () => void;
  onDelete?: () => void;
}

const DeviceDetails: React.FC<DeviceDetailsProps> = ({ deviceId, onUpdate, onDelete }) => {
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const loadDevice = async () => {
    try {
      setLoading(true);
      const data = await fetchDevice(deviceId);
      setDevice(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load device');
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update device');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDevice(deviceId);
      onDelete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete device');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!device) return <Typography>Device not found</Typography>;

  return (
    <Card>
      <CardHeader
        title={device.name}
        subheader={`Type: ${device.type}`}
        action={
          <Stack direction="row" spacing={1}>
            <IconButton onClick={loadDevice} title="Refresh">
              <RefreshIcon />
            </IconButton>
            <IconButton onClick={() => setIsEditMode(true)} title="Edit">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => setShowDeleteDialog(true)} title="Delete">
              <DeleteIcon />
            </IconButton>
          </Stack>
        }
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2">Status</Typography>
                <Chip
                  label={device.status}
                  color={device.status === 'online' ? 'success' : 'error'}
                />
              </Box>
              <Box>
                <Typography variant="subtitle2">Location</Typography>
                <Typography>{device.location}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Last Seen</Typography>
                <Typography>
                  {format(new Date(device.lastSeen), 'PPpp')}
                </Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2">Metadata</Typography>
                <Stack spacing={1}>
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
          </Grid>
          <Grid item xs={12}>
            <DeviceMetricsChart deviceId={deviceId} />
          </Grid>
        </Grid>
      </CardContent>

      <Dialog open={isEditMode} onClose={() => setIsEditMode(false)}>
        <DialogTitle>Edit Device</DialogTitle>
        <DialogContent>
          <DeviceSettingsForm
            device={device}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditMode(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
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
  );
};

export default DeviceDetails; 