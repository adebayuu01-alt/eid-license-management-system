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

// Helper for base64 encoding safe in browser & node
const safeBtoa = (str) => {
  if (typeof window !== 'undefined' && window.btoa) {
    return window.btoa(str);
  }
  try {
    return Buffer.from(str).toString('base64');
  } catch (e) {
    return 'Q1VTVE9NRVI6IFBULiBBc3RlbW8gQmVrYXNpIE1hbnVmYWN0dXJl';
  }
};

export const COMPANY_SPECS = [
  {
    customer: 'PT. Astemo Bekasi Manufacture',
    code: 'ASTM',
    projects: [
      { name: 'Line Monitoring System', spk: 'ABM-LM-2026-01', code: 'LM' },
      { name: 'Quality Inspection System', spk: 'ABM-QIS-2026-02', code: 'QIS' },
      { name: 'Traceability System', spk: 'ABM-TRS-2026-03', code: 'TRS' }
    ]
  },
  {
    customer: 'PT. Alsan Nasmoco Industry',
    code: 'ANI',
    projects: [
      { name: 'Assembly Automation', spk: 'ANI-AA-2026-01', code: 'AA' },
      { name: 'Predictive Maintenance', spk: 'ANI-PM-2026-02', code: 'PM' },
      { name: 'Warehouse Tracking', spk: 'ANI-WT-2026-03', code: 'WT' }
    ]
  },
  {
    customer: 'PT. Asian Isuzu Casting Center',
    code: 'AICC',
    projects: [
      { name: 'Casting Quality Vision', spk: 'AICC-CQV-2026-01', code: 'CQV' },
      { name: 'Furnace Temperature Monitor', spk: 'AICC-FTM-2026-02', code: 'FTM' },
      { name: 'Mold Tracking System', spk: 'AICC-MTS-2026-03', code: 'MTS' }
    ]
  },
  {
    customer: 'PT. Sugity Creatives',
    code: 'SC',
    projects: [
      { name: 'Line Monitoring System', spk: 'SC-LM-2026-01', code: 'LM' },
      { name: 'Barcode Scanning Station', spk: 'SC-BSS-2026-02', code: 'BSS' },
      { name: 'Final Inspection Gate', spk: 'SC-FIG-2026-03', code: 'FIG' }
    ]
  },
  {
    customer: 'PT. Yamaha Motor Parts Manufacturing Indonesia',
    code: 'YPMI',
    projects: [
      { name: 'Engine Block Inspection', spk: 'YPMI-EBI-2026-01', code: 'EBI' },
      { name: 'CNC Performance Monitor', spk: 'YPMI-CPM-2026-02', code: 'CPM' },
      { name: 'Smart Torque System', spk: 'YPMI-STS-2026-03', code: 'STS' }
    ]
  },
  {
    customer: 'PT. Hino Motor Manufacturing Indonesia',
    code: 'HMMI',
    projects: [
      { name: 'Chassis Assembly Vision', spk: 'HMMI-CAV-2026-01', code: 'CAV' },
      { name: 'Paint Shop Environmental Monitor', spk: 'HMMI-PSE-2026-02', code: 'PSE' },
      { name: 'Brake Test Rig System', spk: 'HMMI-BTR-2026-03', code: 'BTR' }
    ]
  },
  {
    customer: 'PT. Astra Honda Motor',
    code: 'AHM',
    projects: [
      { name: 'Frame Welding QC', spk: 'AHM-FWQ-2026-01', code: 'FWQ' },
      { name: 'ECU Flash Verification', spk: 'AHM-EFV-2026-02', code: 'EFV' },
      { name: 'Final Roll Test Monitor', spk: 'AHM-FRT-2026-03', code: 'FRT' }
    ]
  },
  {
    customer: 'PT. Denso Indonesia',
    code: 'DN',
    projects: [
      { name: 'Radiator Leak Detector', spk: 'DN-RLD-2026-01', code: 'RLD' },
      { name: 'Alternator Testing Station', spk: 'DN-ATS-2026-02', code: 'ATS' },
      { name: 'Cleanroom Air Quality', spk: 'DN-CAQ-2026-03', code: 'CAQ' }
    ]
  },
  {
    customer: 'PT. Toyota Motor Manufacturing Indonesia',
    code: 'TMMIN',
    projects: [
      { name: 'Stamping Press Monitor', spk: 'TMMIN-SPM-2026-01', code: 'SPM' },
      { name: 'Engine Assembly Tracking', spk: 'TMMIN-EAT-2026-02', code: 'EAT' },
      { name: 'AGV Fleet Management', spk: 'TMMIN-AGV-2026-03', code: 'AGV' }
    ]
  },
  {
    customer: 'PT. Suzuki Indomobil Motor',
    code: 'SIM',
    projects: [
      { name: 'Powertrain Diagnostic', spk: 'SIM-PTD-2026-01', code: 'PTD' },
      { name: 'Body Shop Robot Monitor', spk: 'SIM-BRM-2026-02', code: 'BRM' },
      { name: 'Logistic Gate Scanner', spk: 'SIM-LGS-2026-03', code: 'LGS' }
    ]
  }
];

export const INITIAL_CUSTOMERS = COMPANY_SPECS.flatMap((comp, compIdx) =>
  comp.projects.map((proj, projIdx) => {
    const id = compIdx * 3 + projIdx + 1;
    const line1 = `CUSTOMER: ${comp.customer}`;
    const line2 = `PROJECT: ${proj.name} PK: ${proj.spk}`;
    const b64_1 = safeBtoa(line1);
    const b64_2 = safeBtoa(line2);
    const day = String(Math.min(28, compIdx * 2 + projIdx + 1)).padStart(2, '0');
    return {
      id,
      customer: comp.customer,
      project: proj.name,
      noSpk: proj.spk,
      publicKey: `${b64_1}\n${b64_2}`,
      datetime: `${day}/09/2026 09:${String(projIdx * 15).padStart(2, '0')}`
    };
  })
);

const DRIVE_MODELS = [
  'WD-WCC4N7KX',
  'SAMSUNG-MZVLB',
  'KINGSTON-SA400',
  'CRUCIAL-CT1000',
  'SEAGATE-ST2000',
  'KIOXIA-EXCERIA'
];

export const INITIAL_LICENSES = COMPANY_SPECS.flatMap((comp, compIdx) =>
  comp.projects.flatMap((proj, projIdx) =>
    [1, 2, 3].map((devNum) => {
      const id = compIdx * 9 + projIdx * 3 + devNum;
      const devPad = String(devNum).padStart(2, '0');
      const projPad = String(projIdx + 1).padStart(2, '0');
      const compPad = String(compIdx + 1).padStart(2, '0');
      const keyId = `EIREN-PRDCT-KEY-${String(id).padStart(2, '0')}`;
      // Dev 1 & 2 are Activated (Blue), Dev 3 is Available (Green)
      const status = devNum === 3 ? 'Available' : 'Activated';
      const driveModel = DRIVE_MODELS[(compIdx + projIdx + devNum) % DRIVE_MODELS.length];
      const day = String(Math.min(28, compIdx * 2 + projIdx + 1)).padStart(2, '0');
      const hour = String(8 + devNum * 2).padStart(2, '0');
      const min = String((devNum * 15) % 60).padStart(2, '0');

      const hostName = `${comp.code}-${proj.code}-PC${devPad}`;

      return {
        id,
        customer: comp.customer,
        project: proj.name,
        noSpk: proj.spk, // Same SPK for all 3 devices of this project
        hostName, // Host name of the computer/PC based on customer & project
        productKey: keyId,
        status,
        fileName: `${comp.code}-${proj.code}-DEV${devPad}.licreq`,
        bios: `PF${compPad}K${projPad}M${devPad}N${800 + id}`,
        diskSerial: `${driveModel}-${comp.code}${projPad}${devPad}`,
        macAddress: `00:1A:${compPad}:${projPad}:${devPad}:${String(10 + id).slice(-2)}`,
        motherboardSerialNumber: `MB-${comp.code}-${projPad}${devPad}-${1000 + id}`,
        motherboardSerial: `MB-${comp.code}-${projPad}${devPad}-${1000 + id}`,
        uuid: `45a5b${compPad}-${projPad}166-4620-aa65-${devPad}0b0210c5${String(100 + id).slice(-3)}`,
        datetime: `${day}/09/2026 ${hour}:${min}`
      };
    })
  )
);

export const INITIAL_PRODUCT_KEYS = [
  ...INITIAL_LICENSES.map((lic) => ({
    id: lic.id,
    productKey: lic.productKey,
    status: lic.status,
    datetime: lic.datetime
  })),
  ...Array.from({ length: 25 }, (_, i) => {
    const id = 91 + i;
    return {
      id,
      productKey: `EIREN-PRDCT-KEY-${id}`,
      status: 'Available',
      datetime: '06/09/2026 16:30'
    };
  })
];

