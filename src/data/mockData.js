// ==========================================
// EID - LICENSE MANAGEMENT SYSTEM MOCK DATA
// ==========================================

export const INITIAL_USERS = [
  {
    id: 1,
    name: 'Ade Bayu',
    username: 'adebayu.eid',
    role: 'Superadmin',
    password: 'adebayu12345',
    datetime: '01/09/2026 08:30'
  },
  {
    id: 2,
    name: 'Budi Santoso',
    username: 'budi.santoso',
    role: 'Admin',
    password: 'adminbudi2026',
    datetime: '02/09/2026 09:15'
  },
  {
    id: 3,
    name: 'Hendra Gunawan',
    username: 'hendra.gunawan',
    role: 'Admin',
    password: 'hendra12345',
    datetime: '03/09/2026 11:00'
  },
  {
    id: 4,
    name: 'Siti Nurhaliza',
    username: 'siti.nurhaliza',
    role: 'Admin',
    password: 'sitinur2026',
    datetime: '04/09/2026 14:20'
  }
];

export const INITIAL_ROLES = [
  {
    id: 1,
    role: 'Superadmin',
    menus: [
      'License Management',
      'Product Key',
      'User Management',
      'Role Management',
      'Master Data'
    ],
    permissions: [
      'Create, Read, Update, Delete',
      'Create, Read, Update, Delete',
      'Create, Read, Update, Delete',
      'Create, Read, Update, Delete',
      'Create, Read, Update, Delete'
    ],
    datetime: '01/09/2026 08:00'
  },
  {
    id: 2,
    role: 'Admin',
    menus: [
      'License Management',
      'Product Key',
      'Master Data'
    ],
    permissions: [
      'Create, Read, Update, Delete',
      'Create, Read, Update, Delete',
      'Create, Read, Update, Delete'
    ],
    datetime: '01/09/2026 08:00'
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: 1,
    customer: 'PT. Astemo Bekasi Manufacture',
    projects: [
      { id: 1, name: 'Line Monitoring', noSpk: 'ABM-LM-2026-01' },
      { id: 2, name: 'Weighing System', noSpk: 'ABM-WS-2026-01' },
      { id: 3, name: 'Quality Development', noSpk: 'ABM-QD-2026-01' }
    ],
    datetime: '28/08/2026 09:00'
  },
  {
    id: 2,
    customer: 'PT. Aisan Nasmoco Industry',
    projects: [
      { id: 1, name: 'Line Production', noSpk: 'ANI-LP-2026-01' },
      { id: 2, name: 'Throttle Body Testing', noSpk: 'ANI-TBT-2026-01' },
      { id: 3, name: 'Fuel Pump Inspection', noSpk: 'ANI-FPI-2026-01' }
    ],
    datetime: '29/08/2026 10:15'
  },
  {
    id: 3,
    customer: 'PT. Asian Isuzu Casting Center',
    projects: [
      { id: 1, name: 'FMPC Monitoring', noSpk: 'AICC-FMPC-2026-01' },
      { id: 2, name: 'Log Sand System', noSpk: 'AICC-LS-2026-01' },
      { id: 3, name: 'Shotblast Quality', noSpk: 'AICC-SB-2026-01' }
    ],
    datetime: '30/08/2026 11:30'
  },
  {
    id: 4,
    customer: 'PT. Sugity Creatives',
    projects: [
      { id: 1, name: 'Plastic Molding Automation', noSpk: 'SC-PMA-2026-01' },
      { id: 2, name: 'Bumper Coating Line', noSpk: 'SC-BCL-2026-01' },
      { id: 3, name: 'Door Trim Assembly', noSpk: 'SC-DTA-2026-01' }
    ],
    datetime: '31/08/2026 13:45'
  },
  {
    id: 5,
    customer: 'PT. Yamaha Motor Parts Manufacturing Indonesia',
    projects: [
      { id: 1, name: 'CNC Milling Inspection', noSpk: 'YPMI-CMI-2026-01' },
      { id: 2, name: 'Casting Leak Tester', noSpk: 'YPMI-CLT-2026-01' },
      { id: 3, name: 'Piston Machining Line', noSpk: 'YPMI-PML-2026-01' }
    ],
    datetime: '01/09/2026 14:20'
  },
  {
    id: 6,
    customer: 'PT. Hino Motor Manufacturing Indonesia',
    projects: [
      { id: 1, name: 'Chassis Assembly Monitoring', noSpk: 'HMMI-CAM-2026-01' },
      { id: 2, name: 'Axle Press Machine', noSpk: 'HMMI-APM-2026-01' },
      { id: 3, name: 'Cabin Welding System', noSpk: 'HMMI-CWS-2026-01' }
    ],
    datetime: '02/09/2026 08:30'
  },
  {
    id: 7,
    customer: 'PT. Astra Honda Motor',
    projects: [
      { id: 1, name: 'Welding Automation', noSpk: 'AHM-WA-2026-01' },
      { id: 2, name: 'Frame Robotic Inspection', noSpk: 'AHM-FRI-2026-01' },
      { id: 3, name: 'Muffler Stamping Quality', noSpk: 'AHM-MSQ-2026-01' }
    ],
    datetime: '03/09/2026 09:40'
  },
  {
    id: 8,
    customer: 'PT. Denso Indonesia',
    projects: [
      { id: 1, name: 'Spark Plug Inspection', noSpk: 'DN-SPI-2026-01' },
      { id: 2, name: 'Radiator Leak Tester', noSpk: 'DN-RLT-2026-01' },
      { id: 3, name: 'O2 Sensor Assembly', noSpk: 'DN-OSA-2026-01' }
    ],
    datetime: '04/09/2026 11:10'
  },
  {
    id: 9,
    customer: 'PT. Toyota Motor Manufacturing Indonesia',
    projects: [
      { id: 1, name: 'Press Shop Quality', noSpk: 'TMMIN-PSQ-2026-01' },
      { id: 2, name: 'Engine Transfer Line', noSpk: 'TMMIN-ETL-2026-01' },
      { id: 3, name: 'Paint Shop Tracking', noSpk: 'TMMIN-PST-2026-01' }
    ],
    datetime: '05/09/2026 13:00'
  },
  {
    id: 10,
    customer: 'PT. Suzuki Indomobil Motor',
    projects: [
      { id: 1, name: 'Engine Testing Station', noSpk: 'SIM-ETS-2026-01' },
      { id: 2, name: 'Transmission Dyno Test', noSpk: 'SIM-TDT-2026-01' },
      { id: 3, name: 'Body Alignment System', noSpk: 'SIM-BAS-2026-01' }
    ],
    datetime: '06/09/2026 15:30'
  }
];

export const INITIAL_LICENSES = [
  // 1. PT. Astemo Bekasi Manufacture (3 Projects)
  {
    id: 1,
    customer: 'PT. Astemo Bekasi Manufacture',
    project: 'Line Monitoring',
    noSpk: 'ABM-LM-2026-01',
    devices: [
      { deviceName: 'ASTM-LM-001', biosSerial: 'PF3A7K29M481', productKey: 'EIREN-PRDCT-KEY-1' },
      { deviceName: 'ASTM-LM-002', biosSerial: 'PF3A7K29M482', productKey: 'EIREN-PRDCT-KEY-2' },
      { deviceName: 'ASTM-LM-003', biosSerial: 'PF3A7K29M483', productKey: 'EIREN-PRDCT-KEY-3' }
    ],
    status: 'Activated',
    datetime: '01/09/2026 09:15'
  },
  {
    id: 2,
    customer: 'PT. Astemo Bekasi Manufacture',
    project: 'Weighing System',
    noSpk: 'ABM-WS-2026-01',
    devices: [
      { deviceName: 'ASTM-WS-001', biosSerial: 'PF3A8L30M591', productKey: 'EIREN-PRDCT-KEY-4' },
      { deviceName: 'ASTM-WS-002', biosSerial: 'PF3A8L30M592', productKey: 'EIREN-PRDCT-KEY-5' }
    ],
    status: 'Activated',
    datetime: '01/09/2026 10:45'
  },
  {
    id: 3,
    customer: 'PT. Astemo Bekasi Manufacture',
    project: 'Quality Development',
    noSpk: 'ABM-QD-2026-01',
    devices: [
      { deviceName: 'ASTM-QD-001', biosSerial: 'PF3A9N41M603', productKey: 'EIREN-PRDCT-KEY-6' }
    ],
    status: 'Activated',
    datetime: '01/09/2026 11:30'
  },

  // 2. PT. Aisan Nasmoco Industry (3 Projects)
  {
    id: 4,
    customer: 'PT. Aisan Nasmoco Industry',
    project: 'Line Production',
    noSpk: 'ANI-LP-2026-01',
    devices: [
      { deviceName: 'ANI-LP-001', biosSerial: 'PF3B9L52N736', productKey: 'EIREN-PRDCT-KEY-7' }
    ],
    status: 'Activated',
    datetime: '02/09/2026 10:30'
  },
  {
    id: 5,
    customer: 'PT. Aisan Nasmoco Industry',
    project: 'Throttle Body Testing',
    noSpk: 'ANI-TBT-2026-01',
    devices: [
      { deviceName: 'ANI-TBT-001', biosSerial: 'PF3B1K63N847', productKey: 'EIREN-PRDCT-KEY-8' },
      { deviceName: 'ANI-TBT-002', biosSerial: 'PF3B1K63N848', productKey: 'EIREN-PRDCT-KEY-9' }
    ],
    status: 'Activated',
    datetime: '02/09/2026 13:15'
  },
  {
    id: 6,
    customer: 'PT. Aisan Nasmoco Industry',
    project: 'Fuel Pump Inspection',
    noSpk: 'ANI-FPI-2026-01',
    devices: [
      { deviceName: 'ANI-FPI-001', biosSerial: 'PF3B2P74N958', productKey: 'EIREN-PRDCT-KEY-10' }
    ],
    status: 'Activated',
    datetime: '02/09/2026 15:00'
  },

  // 3. PT. Asian Isuzu Casting Center (3 Projects)
  {
    id: 7,
    customer: 'PT. Asian Isuzu Casting Center',
    project: 'FMPC Monitoring',
    noSpk: 'AICC-FMPC-2026-01',
    devices: [
      { deviceName: 'AICC-FMPC-001', biosSerial: 'PF3C4M81Q925', productKey: 'EIREN-PRDCT-KEY-11' },
      { deviceName: 'AICC-FMPC-002', biosSerial: 'PF3C4M81Q926', productKey: 'EIREN-PRDCT-KEY-12' },
      { deviceName: 'AICC-FMPC-003', biosSerial: 'PF3C4M81Q927', productKey: 'EIREN-PRDCT-KEY-13' }
    ],
    status: 'Activated',
    datetime: '03/09/2026 11:45'
  },
  {
    id: 8,
    customer: 'PT. Asian Isuzu Casting Center',
    project: 'Log Sand System',
    noSpk: 'AICC-LS-2026-01',
    devices: [
      { deviceName: 'AICC-LS-001', biosSerial: 'PF3C5N92Q036', productKey: 'EIREN-PRDCT-KEY-14' },
      { deviceName: 'AICC-LS-002', biosSerial: 'PF3C5N92Q037', productKey: 'EIREN-PRDCT-KEY-15' }
    ],
    status: 'Activated',
    datetime: '03/09/2026 14:10'
  },
  {
    id: 9,
    customer: 'PT. Asian Isuzu Casting Center',
    project: 'Shotblast Quality',
    noSpk: 'AICC-SB-2026-01',
    devices: [
      { deviceName: 'AICC-SB-001', biosSerial: 'PF3C6P03Q147', productKey: 'EIREN-PRDCT-KEY-16' },
      { deviceName: 'AICC-SB-002', biosSerial: 'PF3C6P03Q148', productKey: 'EIREN-PRDCT-KEY-17' }
    ],
    status: 'Activated',
    datetime: '03/09/2026 16:30'
  },

  // 4. PT. Sugity Creatives (3 Projects)
  {
    id: 10,
    customer: 'PT. Sugity Creatives',
    project: 'Plastic Molding Automation',
    noSpk: 'SC-PMA-2026-01',
    devices: [
      { deviceName: 'SC-PMA-001', biosSerial: 'PF3D6P47R318', productKey: 'EIREN-PRDCT-KEY-18' },
      { deviceName: 'SC-PMA-002', biosSerial: 'PF3K6V82A351', productKey: 'EIREN-PRDCT-KEY-19' }
    ],
    status: 'Activated',
    datetime: '04/09/2026 13:20'
  },
  {
    id: 11,
    customer: 'PT. Sugity Creatives',
    project: 'Bumper Coating Line',
    noSpk: 'SC-BCL-2026-01',
    devices: [
      { deviceName: 'SC-BCL-001', biosSerial: 'PF3D7Q58R429', productKey: 'EIREN-PRDCT-KEY-20' }
    ],
    status: 'Activated',
    datetime: '04/09/2026 15:00'
  },
  {
    id: 12,
    customer: 'PT. Sugity Creatives',
    project: 'Door Trim Assembly',
    noSpk: 'SC-DTA-2026-01',
    devices: [
      { deviceName: 'SC-DTA-001', biosSerial: 'PF3D8R69R530', productKey: 'EIREN-PRDCT-KEY-21' },
      { deviceName: 'SC-DTA-002', biosSerial: 'PF3D8R69R531', productKey: 'EIREN-PRDCT-KEY-22' }
    ],
    status: 'Activated',
    datetime: '04/09/2026 16:45'
  },

  // 5. PT. Yamaha Motor Parts Manufacturing Indonesia (3 Projects)
  {
    id: 13,
    customer: 'PT. Yamaha Motor Parts Manufacturing Indonesia',
    project: 'CNC Milling Inspection',
    noSpk: 'YPMI-CMI-2026-01',
    devices: [
      { deviceName: 'YMPI-CMI-001', biosSerial: 'PF3E2T93V647', productKey: 'EIREN-PRDCT-KEY-23' }
    ],
    status: 'Duplicated',
    datetime: '05/09/2026 14:10'
  },
  {
    id: 14,
    customer: 'PT. Yamaha Motor Parts Manufacturing Indonesia',
    project: 'Casting Leak Tester',
    noSpk: 'YPMI-CLT-2026-01',
    devices: [
      { deviceName: 'YMPI-CLT-001', biosSerial: 'PF3E3U04V758', productKey: 'EIREN-PRDCT-KEY-24' },
      { deviceName: 'YMPI-CLT-002', biosSerial: 'PF3E3U04V759', productKey: 'EIREN-PRDCT-KEY-25' }
    ],
    status: 'Activated',
    datetime: '05/09/2026 15:30'
  },
  {
    id: 15,
    customer: 'PT. Yamaha Motor Parts Manufacturing Indonesia',
    project: 'Piston Machining Line',
    noSpk: 'YPMI-PML-2026-01',
    devices: [
      { deviceName: 'YMPI-PML-001', biosSerial: 'PF3E4V15V869', productKey: 'EIREN-PRDCT-KEY-26' }
    ],
    status: 'Activated',
    datetime: '05/09/2026 17:00'
  },

  // 6. PT. Hino Motor Manufacturing Indonesia (3 Projects)
  {
    id: 16,
    customer: 'PT. Hino Motor Manufacturing Indonesia',
    project: 'Chassis Assembly Monitoring',
    noSpk: 'HMMI-CAM-2026-01',
    devices: [
      { deviceName: 'HMMI-CAM-001', biosSerial: 'PF3F8N16W529', productKey: 'EIREN-PRDCT-KEY-27' }
    ],
    status: 'Duplicated',
    datetime: '06/09/2026 08:30'
  },
  {
    id: 17,
    customer: 'PT. Hino Motor Manufacturing Indonesia',
    project: 'Axle Press Machine',
    noSpk: 'HMMI-APM-2026-01',
    devices: [
      { deviceName: 'HMMI-APM-001', biosSerial: 'PF3F9P27W630', productKey: 'EIREN-PRDCT-KEY-28' },
      { deviceName: 'HMMI-APM-002', biosSerial: 'PF3F9P27W631', productKey: 'EIREN-PRDCT-KEY-29' }
    ],
    status: 'Activated',
    datetime: '06/09/2026 09:45'
  },
  {
    id: 18,
    customer: 'PT. Hino Motor Manufacturing Indonesia',
    project: 'Cabin Welding System',
    noSpk: 'HMMI-CWS-2026-01',
    devices: [
      { deviceName: 'HMMI-CWS-001', biosSerial: 'PF3F0Q38W741', productKey: 'EIREN-PRDCT-KEY-30' }
    ],
    status: 'Activated',
    datetime: '06/09/2026 10:50'
  },

  // 7. PT. Astra Honda Motor (3 Projects)
  {
    id: 19,
    customer: 'PT. Astra Honda Motor',
    project: 'Welding Automation',
    noSpk: 'AHM-WA-2026-01',
    devices: [
      { deviceName: 'AHM-WA-001', biosSerial: 'PF3L8K11B902', productKey: 'EIREN-PRDCT-KEY-31' },
      { deviceName: 'AHM-WA-002', biosSerial: 'PF3L8K11B903', productKey: 'EIREN-PRDCT-KEY-32' }
    ],
    status: 'Activated',
    datetime: '06/09/2026 10:00'
  },
  {
    id: 20,
    customer: 'PT. Astra Honda Motor',
    project: 'Frame Robotic Inspection',
    noSpk: 'AHM-FRI-2026-01',
    devices: [
      { deviceName: 'AHM-FRI-001', biosSerial: 'PF3L9L22B013', productKey: 'EIREN-PRDCT-KEY-33' }
    ],
    status: 'Activated',
    datetime: '06/09/2026 11:20'
  },
  {
    id: 21,
    customer: 'PT. Astra Honda Motor',
    project: 'Muffler Stamping Quality',
    noSpk: 'AHM-MSQ-2026-01',
    devices: [
      { deviceName: 'AHM-MSQ-001', biosSerial: 'PF3L0M33B124', productKey: 'EIREN-PRDCT-KEY-34' },
      { deviceName: 'AHM-MSQ-002', biosSerial: 'PF3L0M33B125', productKey: 'EIREN-PRDCT-KEY-35' }
    ],
    status: 'Activated',
    datetime: '06/09/2026 13:00'
  },

  // 8. PT. Denso Indonesia (3 Projects)
  {
    id: 22,
    customer: 'PT. Denso Indonesia',
    project: 'Spark Plug Inspection',
    noSpk: 'DN-SPI-2026-01',
    devices: [
      { deviceName: 'DN-SPI-001', biosSerial: 'PF3M2R44K618', productKey: 'EIREN-PRDCT-KEY-36' }
    ],
    status: 'Activated',
    datetime: '06/09/2026 11:30'
  },
  {
    id: 23,
    customer: 'PT. Denso Indonesia',
    project: 'Radiator Leak Tester',
    noSpk: 'DN-RLT-2026-01',
    devices: [
      { deviceName: 'DN-RLT-001', biosSerial: 'PF3M3S55K729', productKey: 'EIREN-PRDCT-KEY-37' },
      { deviceName: 'DN-RLT-002', biosSerial: 'PF3M3S55K730', productKey: 'EIREN-PRDCT-KEY-38' }
    ],
    status: 'Activated',
    datetime: '06/09/2026 14:15'
  },
  {
    id: 24,
    customer: 'PT. Denso Indonesia',
    project: 'O2 Sensor Assembly',
    noSpk: 'DN-OSA-2026-01',
    devices: [
      { deviceName: 'DN-OSA-001', biosSerial: 'PF3M4T66K841', productKey: 'EIREN-PRDCT-KEY-39' }
    ],
    status: 'Activated',
    datetime: '06/09/2026 15:40'
  },

  // 9. PT. Toyota Motor Manufacturing Indonesia (3 Projects)
  {
    id: 25,
    customer: 'PT. Toyota Motor Manufacturing Indonesia',
    project: 'Press Shop Quality',
    noSpk: 'TMMIN-PSQ-2026-01',
    devices: [
      { deviceName: 'TMMIN-PSQ-001', biosSerial: 'PF3G5Q74X181', productKey: 'EIREN-PRDCT-KEY-40' },
      { deviceName: 'TMMIN-PSQ-002', biosSerial: 'PF3G5Q74X182', productKey: 'EIREN-PRDCT-KEY-41' },
      { deviceName: 'TMMIN-PSQ-003', biosSerial: 'PF3G5Q74X183', productKey: 'EIREN-PRDCT-KEY-42' }
    ],
    status: 'Activated',
    datetime: '06/09/2026 14:00'
  },
  {
    id: 26,
    customer: 'PT. Toyota Motor Manufacturing Indonesia',
    project: 'Engine Transfer Line',
    noSpk: 'TMMIN-ETL-2026-01',
    devices: [
      { deviceName: 'TMMIN-ETL-001', biosSerial: 'PF3G6R85X292', productKey: 'EIREN-PRDCT-KEY-43' },
      { deviceName: 'TMMIN-ETL-002', biosSerial: 'PF3G6R85X293', productKey: 'EIREN-PRDCT-KEY-44' }
    ],
    status: 'Activated',
    datetime: '06/09/2026 15:20'
  },
  {
    id: 27,
    customer: 'PT. Toyota Motor Manufacturing Indonesia',
    project: 'Paint Shop Tracking',
    noSpk: 'TMMIN-PST-2026-01',
    devices: [
      { deviceName: 'TMMIN-PST-001', biosSerial: 'PF3G7S96X404', productKey: 'EIREN-PRDCT-KEY-45' }
    ],
    status: 'Activated',
    datetime: '06/09/2026 16:35'
  },

  // 10. PT. Suzuki Indomobil Motor (3 Projects)
  {
    id: 28,
    customer: 'PT. Suzuki Indomobil Motor',
    project: 'Engine Testing Station',
    noSpk: 'SIM-ETS-2026-01',
    devices: [
      { deviceName: 'SIM-ETS-001', biosSerial: 'PF3J9S35Z714', productKey: 'EIREN-PRDCT-KEY-46' },
      { deviceName: 'SIM-ETS-002', biosSerial: 'PF3J9S35Z715', productKey: 'EIREN-PRDCT-KEY-47' }
    ],
    status: 'Activated',
    datetime: '06/09/2026 16:00'
  },
  {
    id: 29,
    customer: 'PT. Suzuki Indomobil Motor',
    project: 'Transmission Dyno Test',
    noSpk: 'SIM-TDT-2026-01',
    devices: [
      { deviceName: 'SIM-TDT-001', biosSerial: 'PF3J0T46Z825', productKey: 'EIREN-PRDCT-KEY-48' }
    ],
    status: 'Activated',
    datetime: '06/09/2026 16:45'
  },
  {
    id: 30,
    customer: 'PT. Suzuki Indomobil Motor',
    project: 'Body Alignment System',
    noSpk: 'SIM-BAS-2026-01',
    devices: [
      { deviceName: 'SIM-BAS-001', biosSerial: 'PF3J1U57Z936', productKey: 'EIREN-PRDCT-KEY-49' },
      { deviceName: 'SIM-BAS-002', biosSerial: 'PF3J1U57Z937', productKey: 'EIREN-PRDCT-KEY-50' }
    ],
    status: 'Activated',
    datetime: '06/09/2026 17:15'
  }
];

// Product Keys 1 to 50 match the activated/duplicated devices above.
// Product Keys 51 to 75 are Available for testing Add License.
export const INITIAL_PRODUCT_KEYS = [
  ...Array.from({ length: 50 }, (_, i) => {
    const keyNum = i + 1;
    const isDup = keyNum === 23 || keyNum === 27;
    return {
      id: keyNum,
      productKey: `EIREN-PRDCT-KEY-${keyNum}`,
      status: isDup ? 'Duplicated' : 'Activated',
      datetime: '06/09/2026 12:00'
    };
  }),
  ...Array.from({ length: 25 }, (_, i) => {
    const keyNum = 51 + i;
    return {
      id: keyNum,
      productKey: `EIREN-PRDCT-KEY-${keyNum}`,
      status: 'Available',
      datetime: '06/09/2026 16:30'
    };
  })
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'New License Activated',
    description: 'Product Key EIREN-PRDCT-KEY-18 activated by PT. Sugity Creatives.',
    time: '1h Ago',
    severity: 'Info',
    isRead: false
  },
  {
    id: 2,
    title: 'Duplicate Bios Serial Detected',
    description: 'Hardware collision detected on EIREN-PRDCT-KEY-23 (PT. Yamaha Motor).',
    time: '2h Ago',
    severity: 'Warning',
    isRead: false
  }
];
