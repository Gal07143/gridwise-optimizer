import React from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Device } from '@/types/device';

interface DeviceSettingsFormProps {
  device: Device;
  onSubmit: (values: Partial<Device>) => void;
  onCancel: () => void;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  type: Yup.string().oneOf(['sensor', 'actuator', 'controller'], 'Invalid device type').required('Type is required'),
  location: Yup.string().required('Location is required'),
  metadata: Yup.object({
    manufacturer: Yup.string().required('Manufacturer is required'),
    model: Yup.string().required('Model is required'),
    serialNumber: Yup.string().required('Serial number is required'),
    firmwareVersion: Yup.string().required('Firmware version is required'),
  }),
  settings: Yup.object({
    enabled: Yup.boolean(),
    autoUpdate: Yup.boolean(),
    alertThresholds: Yup.object({
      min: Yup.number().nullable(),
      max: Yup.number().nullable(),
    }),
  }),
});

const DeviceSettingsForm: React.FC<DeviceSettingsFormProps> = ({
  device,
  onSubmit,
  onCancel,
}) => {
  const formik = useFormik({
    initialValues: {
      name: device.name,
      type: device.type,
      location: device.location,
      metadata: {
        manufacturer: device.metadata.manufacturer,
        model: device.metadata.model,
        serialNumber: device.metadata.serialNumber,
        firmwareVersion: device.metadata.firmwareVersion,
      },
      settings: {
        enabled: device.settings.enabled,
        autoUpdate: device.settings.autoUpdate,
        alertThresholds: {
          min: device.settings.alertThresholds?.min ?? null,
          max: device.settings.alertThresholds?.max ?? null,
        },
      },
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={3} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          id="name"
          name="name"
          label="Device Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />

        <FormControl fullWidth error={formik.touched.type && Boolean(formik.errors.type)}>
          <InputLabel>Device Type</InputLabel>
          <Select
            id="type"
            name="type"
            value={formik.values.type}
            label="Device Type"
            onChange={formik.handleChange}
          >
            <MenuItem value="sensor">Sensor</MenuItem>
            <MenuItem value="actuator">Actuator</MenuItem>
            <MenuItem value="controller">Controller</MenuItem>
          </Select>
          {formik.touched.type && formik.errors.type && (
            <FormHelperText>{formik.errors.type}</FormHelperText>
          )}
        </FormControl>

        <TextField
          fullWidth
          id="location"
          name="location"
          label="Location"
          value={formik.values.location}
          onChange={formik.handleChange}
          error={formik.touched.location && Boolean(formik.errors.location)}
          helperText={formik.touched.location && formik.errors.location}
        />

        <Box sx={{ border: 1, borderColor: 'divider', p: 2, borderRadius: 1 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              id="metadata.manufacturer"
              name="metadata.manufacturer"
              label="Manufacturer"
              value={formik.values.metadata.manufacturer}
              onChange={formik.handleChange}
              error={
                formik.touched.metadata?.manufacturer &&
                Boolean(formik.errors.metadata?.manufacturer)
              }
              helperText={
                formik.touched.metadata?.manufacturer &&
                formik.errors.metadata?.manufacturer
              }
            />

            <TextField
              fullWidth
              id="metadata.model"
              name="metadata.model"
              label="Model"
              value={formik.values.metadata.model}
              onChange={formik.handleChange}
              error={
                formik.touched.metadata?.model &&
                Boolean(formik.errors.metadata?.model)
              }
              helperText={
                formik.touched.metadata?.model && formik.errors.metadata?.model
              }
            />

            <TextField
              fullWidth
              id="metadata.serialNumber"
              name="metadata.serialNumber"
              label="Serial Number"
              value={formik.values.metadata.serialNumber}
              onChange={formik.handleChange}
              error={
                formik.touched.metadata?.serialNumber &&
                Boolean(formik.errors.metadata?.serialNumber)
              }
              helperText={
                formik.touched.metadata?.serialNumber &&
                formik.errors.metadata?.serialNumber
              }
            />

            <TextField
              fullWidth
              id="metadata.firmwareVersion"
              name="metadata.firmwareVersion"
              label="Firmware Version"
              value={formik.values.metadata.firmwareVersion}
              onChange={formik.handleChange}
              error={
                formik.touched.metadata?.firmwareVersion &&
                Boolean(formik.errors.metadata?.firmwareVersion)
              }
              helperText={
                formik.touched.metadata?.firmwareVersion &&
                formik.errors.metadata?.firmwareVersion
              }
            />
          </Stack>
        </Box>

        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Save Changes
          </Button>
        </Box>
      </Stack>
    </form>
  );
};

export default DeviceSettingsForm; 