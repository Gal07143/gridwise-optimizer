export const deviceCatalog = {
  evcharger: {
    vendors: {
      Tesla: [
        { 
          model: 'Tesla Wall Connector', 
          parameters: { power: '48 kW', voltage: '240V', current: '200A' } 
        },
        { 
          model: 'Tesla Mobile Connector', 
          parameters: { power: '22 kW', voltage: '240V', current: '32A' } 
        },
      ],
      ChargePoint: [
        { 
          model: 'ChargePoint Home Flex', 
          parameters: { power: '50 kW', voltage: '240V', current: '200A' } 
        },
        { 
          model: 'ChargePoint Express', 
          parameters: { power: '150 kW', voltage: '480V', current: '300A' } 
        },
      ],
    },
  },
  inverter: {
    vendors: {
      SMA: [
        { 
          model: 'Sunny Boy 5.0', 
          parameters: { capacity: '5 kW', efficiency: '97%', voltage: '240V' } 
        },
      ],
      Fronius: [
        { 
          model: 'Fronius Primo', 
          parameters: { capacity: '3.5 kW', efficiency: '96%', voltage: '240V' } 
        },
      ],
    },
  },
  battery: {
    vendors: {
      LG: [
        { 
          model: 'LG Chem RESU', 
          parameters: { capacity: '9.8 kWh', voltage: '400V', weight: '110kg' } 
        },
      ],
      Tesla: [
        { 
          model: 'Powerwall', 
          parameters: { capacity: '13.5 kWh', voltage: '350V', weight: '120kg' } 
        },
      ],
    },
  },
  // Add more categories as needed...
};
