import React, { useState, useEffect } from 'react';
import { deviceCatalog } from '@/data/deviceCatalog';
import { createClient } from '@supabase/supabase-js';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

const DeviceCatalogAdd: React.FC = () => {
  const [category, setCategory] = useState<string>('evcharger');
  const [vendor, setVendor] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [deviceName, setDeviceName] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  // List of available categories from catalog
  const categories = Object.keys(deviceCatalog);
  // Vendors for the selected category
  const vendors = category in deviceCatalog ? Object.keys(deviceCatalog[category].vendors) : [];
  // Models for the selected vendor
  const models = vendor ? deviceCatalog[category].vendors[vendor] : [];

  // When vendor/model selection changes, update parameters
  useEffect(() => {
    if (vendor && model) {
      const selected = models.find((m: any) => m.model === model);
      if (selected) {
        setParameters(selected.parameters);
      } else {
        setParameters({});
      }
    } else {
      setParameters({});
    }
  }, [vendor, model, models]);

  // Submit form: add new device to Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newDevice = {
      name: deviceName || model,
      type: category,
      vendor,
      model,
      parameters,
      status: 'offline', // default status
    };

    const { error } = await supabase.from('devices').insert([newDevice]);
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Device added successfully!');
      setDeviceName('');
      setVendor('');
      setModel('');
      setParameters({});
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add Device from Catalog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setVendor(''); setModel(''); }}
            className="w-full border rounded p-2"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Vendor</label>
          <select
            value={vendor}
            onChange={(e) => { setVendor(e.target.value); setModel(''); }}
            className="w-full border rounded p-2"
          >
            <option value="">Select Vendor</option>
            {vendors.map((ven) => (
              <option key={ven} value={ven}>
                {ven}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full border rounded p-2"
            disabled={!vendor}
          >
            <option value="">Select Model</option>
            {models.map((m: any) => (
              <option key={m.model} value={m.model}>
                {m.model}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Device Name</label>
          <Input
            type="text"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            placeholder="Optional: custom device name"
          />
        </div>

        <div>
          <label className="block mb-1">Parameters</label>
          <div className="p-2 border rounded bg-gray-50">
            {Object.entries(parameters).length > 0 ? (
              <ul>
                {Object.entries(parameters).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No parameters available.</p>
            )}
          </div>
        </div>

        <Button type="submit">Add Device</Button>

        {message && <p className="mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default DeviceCatalogAdd;
