// ==========================================
// EID - LICENSE MANAGEMENT SYSTEM MOCK DATA
// ==========================================

export const INITIAL_USERS = [
  {
    id: 1,
    name: 'Kevin Astemo',
    username: 'kevin_astemo',
    role: 'Superadmin',
    password: 'password123',
    datetime: '06/09/2026 12:00'
  },
  {
    id: 2,
    name: 'Suep Astemo',
    username: 'suep_astemo',
    role: 'Admin',
    password: 'password123',
    datetime: '06/09/2026 12:00'
  },
  {
    id: 3,
    name: 'Admin EID',
    username: 'admin_eid',
    role: 'Superadmin',
    password: 'password123',
    datetime: '06/09/2026 12:00'
  },
  {
    id: 4,
    name: 'Operator EID',
    username: 'operator_eid',
    role: 'Admin',
    password: 'password123',
    datetime: '06/09/2026 12:00'
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
    datetime: '06/09/2026 12:00'
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
    datetime: '06/09/2026 12:00'
  }
];

export const INITIAL_CUSTOMERS = [
  { id: 1, customer: 'PT. Astemo Bekasi Manufacture', datetime: '06/09/2026 12:00' },
  { id: 2, customer: 'PT. Aisan Nasmoco Industry', datetime: '06/09/2026 12:00' },
  { id: 3, customer: 'PT. Asian Isuzu Casting Center', datetime: '06/09/2026 12:00' },
  { id: 4, customer: 'PT. Sugity Creatives', datetime: '06/09/2026 12:00' },
  { id: 5, customer: 'PT. Yamaha Motor Parts Manufacturing Indonesia', datetime: '06/09/2026 12:00' },
  { id: 6, customer: 'PT. Hino Motor Manufacturing Indonesia', datetime: '06/09/2026 12:00' },
  { id: 7, customer: 'PT. Astra Honda Motor', datetime: '06/09/2026 12:00' },
  { id: 8, customer: 'PT. Denso Indonesia', datetime: '06/09/2026 12:00' },
  { id: 9, customer: 'PT. Toyota Motor Manufacturing Indonesia', datetime: '06/09/2026 12:00' },
  { id: 10, customer: 'PT. Suzuki Indomobil Motor', datetime: '06/09/2026 12:00' }
];

export const INITIAL_LICENSES = [
  {
    id: 1,
    productKey: 'EIREN-PRDCT-KEY-1',
    customer: 'PT. Astemo Bekasi Manufacture',
    deviceName: 'ASTM-PC-001',
    biosSerial: 'PF3A7K29M481',
    status: 'Activated',
    datetime: '06/09/2026 12:00'
  },
  {
    id: 2,
    productKey: 'EIREN-PRDCT-KEY-2',
    customer: 'PT. Aisan Nasmoco Industry',
    deviceName: 'ANI-PC-001',
    biosSerial: 'PF3B9L52N736',
    status: 'Activated',
    datetime: '06/09/2026 12:00'
  },
  {
    id: 3,
    productKey: 'EIREN-PRDCT-KEY-3',
    customer: 'PT. Asian Isuzu Casting Center',
    deviceName: 'AICC-PC-001',
    biosSerial: 'PF3C4M81Q925',
    status: 'Activated',
    datetime: '06/09/2026 12:00'
  },
  {
    id: 4,
    productKey: 'EIREN-PRDCT-KEY-4',
    customer: 'PT. Sugity Creatives',
    deviceName: 'SGTY-PC-001',
    biosSerial: 'PF3D6P47R318',
    status: 'Activated',
    datetime: '06/09/2026 12:00'
  },
  {
    id: 5,
    productKey: 'EIREN-PRDCT-KEY-5',
    customer: 'PT. Yamaha Motor Parts Manufacturing Indonesia',
    deviceName: 'YMPI-PC-001',
    biosSerial: 'PF3E2T93V647',
    status: 'Duplicated',
    datetime: '06/09/2026 12:00'
  },
  {
    id: 6,
    productKey: 'EIREN-PRDCT-KEY-6',
    customer: 'PT. Hino Motor Manufacturing Indonesia',
    deviceName: 'HMMI-PC-001',
    biosSerial: 'PF3F8N16W529',
    status: 'Duplicated',
    datetime: '06/09/2026 12:00'
  },
  {
    id: 7,
    productKey: 'EIREN-PRDCT-KEY-7',
    customer: 'PT. Astemo Bekasi Manufacture',
    deviceName: 'ASTM-PC-002',
    biosSerial: 'PF3G5Q74X183',
    status: 'Activated',
    datetime: '06/09/2026 12:00'
  },
  {
    id: 8,
    productKey: 'EIREN-PRDCT-KEY-8',
    customer: 'PT. Aisan Nasmoco Industry',
    deviceName: 'ANI-PC-002',
    biosSerial: 'PF3H1R68Y492',
    status: 'Activated',
    datetime: '06/09/2026 12:00'
  },
  {
    id: 9,
    productKey: 'EIREN-PRDCT-KEY-9',
    customer: 'PT. Asian Isuzu Casting Center',
    deviceName: 'AICC-PC-002',
    biosSerial: 'PF3J9S35Z714',
    status: 'Duplicated',
    datetime: '06/09/2026 12:00'
  },
  {
    id: 10,
    productKey: 'EIREN-PRDCT-KEY-10',
    customer: 'PT. Sugity Creatives',
    deviceName: 'SGTY-PC-002',
    biosSerial: 'PF3K6V82A351',
    status: 'Activated',
    datetime: '06/09/2026 12:00'
  }
];

export const INITIAL_PRODUCT_KEYS = [
  { id: 1, productKey: 'EIREN-PRDCT-KEY-1', status: 'Available', datetime: '06/09/2026 12:00' },
  { id: 2, productKey: 'EIREN-PRDCT-KEY-2', status: 'Available', datetime: '06/09/2026 12:00' },
  { id: 3, productKey: 'EIREN-PRDCT-KEY-3', status: 'Activated', datetime: '06/09/2026 12:00' },
  { id: 4, productKey: 'EIREN-PRDCT-KEY-4', status: 'Activated', datetime: '06/09/2026 12:00' },
  { id: 5, productKey: 'EIREN-PRDCT-KEY-5', status: 'Duplicated', datetime: '06/09/2026 12:00' },
  { id: 6, productKey: 'EIREN-PRDCT-KEY-6', status: 'Duplicated', datetime: '06/09/2026 12:00' },
  { id: 7, productKey: 'EIREN-PRDCT-KEY-7', status: 'Activated', datetime: '06/09/2026 12:00' },
  { id: 8, productKey: 'EIREN-PRDCT-KEY-8', status: 'Activated', datetime: '06/09/2026 12:00' },
  { id: 9, productKey: 'EIREN-PRDCT-KEY-9', status: 'Duplicated', datetime: '06/09/2026 12:00' },
  { id: 10, productKey: 'EIREN-PRDCT-KEY-10', status: 'Activated', datetime: '06/09/2026 12:00' },
  { id: 11, productKey: 'EIREN-PRDCT-KEY-11', status: 'Available', datetime: '06/09/2026 12:00' },
  { id: 12, productKey: 'EIREN-PRDCT-KEY-12', status: 'Available', datetime: '06/09/2026 12:00' }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'New License Activated',
    description: 'Product Key EIREN-PRDCT-KEY-10 activated by PT. Sugity Creatives.',
    time: '1h Ago',
    severity: 'Info',
    isRead: false
  },
  {
    id: 2,
    title: 'Duplicate Bios Serial Detected',
    description: 'Hardware collision detected on EIREN-PRDCT-KEY-5 (PT. Yamaha Motor).',
    time: '2h Ago',
    severity: 'Warning',
    isRead: false
  }
];
