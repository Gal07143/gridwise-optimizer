import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Devices from './pages/Devices';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';
import ModbusDevicesPage from './pages/modbus/ModbusDevices';
import ModbusDeviceDetails from './pages/modbus/ModbusDeviceDetails';
import ModbusDeviceForm from './pages/modbus/ModbusDeviceForm';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/devices" element={<Devices />} />
      <Route path="/settings/*" element={<Settings />} />
      
      {/* Modbus Routes */}
      <Route path="/modbus/devices" element={<ModbusDevicesPage />} />
      <Route path="/modbus/devices/:deviceId" element={<ModbusDeviceDetails />} />
      <Route path="/modbus/devices/:deviceId/edit" element={<ModbusDeviceForm />} />
      <Route path="/modbus/devices/new" element={<ModbusDeviceForm />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
