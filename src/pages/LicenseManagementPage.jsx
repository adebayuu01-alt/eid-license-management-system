import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  Plus,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  AlertCircle,
  ChevronDown,
  Check
} from 'lucide-react';
import SkeletonTable from '../components/SkeletonTable';
import Toast from '../components/Toast';
import CustomDropdown from '../components/CustomDropdown';
import ModalPortal from '../components/ModalPortal';
import PageHeaderCard from '../components/PageHeaderCard';

// Helper to reliably derive Host Name based on Customer and Project
const getHostName = (item) => {
  if (item?.hostName && item.hostName !== '-') return item.hostName;
  if (item?.hostname && item.hostname !== '-') return item.hostname;

  const customerName = item?.customer || '';
  const projectName = item?.project || '';

  // Customer prefix
  let custCode = 'PC';
  if (/astemo/i.test(customerName)) custCode = 'ASTM';
  else if (/alsan/i.test(customerName)) custCode = 'ANI';
  else if (/isuzu/i.test(customerName)) custCode = 'AICC';
  else if (/sugity/i.test(customerName)) custCode = 'SC';
  else if (/yamaha/i.test(customerName)) custCode = 'YPMI';
  else if (/hino/i.test(customerName)) custCode = 'HMMI';
  else if (/honda/i.test(customerName)) custCode = 'AHM';
  else if (/denso/i.test(customerName)) custCode = 'DN';
  else if (/toyota/i.test(customerName)) custCode = 'TMMIN';
  else if (/suzuki/i.test(customerName)) custCode = 'SIM';
  else {
    custCode =
      customerName
        .replace(/PT\.\s*/i, '')
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 4)
        .toUpperCase() || 'DEV';
  }

  // Project code
  let projCode = 'SYS';
  if (/line monitoring/i.test(projectName)) projCode = 'LM';
  else if (/quality inspection/i.test(projectName)) projCode = 'QIS';
  else if (/traceability/i.test(projectName)) projCode = 'TRS';
  else if (/assembly/i.test(projectName)) projCode = 'AA';
  else if (/predictive/i.test(projectName)) projCode = 'PM';
  else if (/warehouse/i.test(projectName)) projCode = 'WT';
  else if (/casting/i.test(projectName)) projCode = 'CQV';
  else if (/furnace/i.test(projectName)) projCode = 'FTM';
  else if (/mold/i.test(projectName)) projCode = 'MTS';
  else if (/barcode/i.test(projectName)) projCode = 'BSS';
  else if (/final inspection/i.test(projectName)) projCode = 'FIG';
  else if (/engine/i.test(projectName)) projCode = 'EBI';
  else if (/cnc/i.test(projectName)) projCode = 'CPM';
  else if (/torque/i.test(projectName)) projCode = 'STS';
  else if (/chassis/i.test(projectName)) projCode = 'CAV';
  else if (/paint/i.test(projectName)) projCode = 'PSE';
  else if (/brake/i.test(projectName)) projCode = 'BTR';
  else if (/welding/i.test(projectName)) projCode = 'FWQ';
  else if (/flash|ecu/i.test(projectName)) projCode = 'EFV';
  else if (/roll/i.test(projectName)) projCode = 'FRT';
  else if (/leak/i.test(projectName)) projCode = 'RLD';
  else if (/alternator/i.test(projectName)) projCode = 'ATS';
  else if (/cleanroom/i.test(projectName)) projCode = 'CAQ';
  else if (/stamping/i.test(projectName)) projCode = 'SPM';
  else if (/fleet|agv/i.test(projectName)) projCode = 'AGV';
  else if (/powertrain/i.test(projectName)) projCode = 'PTD';
  else if (/robot/i.test(projectName)) projCode = 'BRM';
  else if (/logistic/i.test(projectName)) projCode = 'LGS';
  else {
    projCode =
      projectName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 3)
        .toUpperCase() || 'P01';
  }

  // Device index
  let devNum = '01';
  if (item?.fileName) {
    const match = item.fileName.match(/DEV0?(\d+)/i) || item.fileName.match(/PC-?0?(\d+)/i);
    if (match) devNum = String(match[1]).padStart(2, '0');
  } else if (item?.id) {
    devNum = String(((item.id - 1) % 3) + 1).padStart(2, '0');
  }

  return `${custCode}-${projCode}-PC${devNum}`;
};

export default function LicenseManagementPage({
  licenses = [],
  onUpdateLicenses,
  customers = [],
  productKeys = [],
  onUpdateProductKeys
}) {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterSpk, setFilterSpk] = useState('');

  // Sorting State
  const [sortField, setSortField] = useState('no');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal 1: Add License Management (File Upload)
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);


  // Modal 3: Delete Confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Modal 4: Hardware Details Modal
  const [detailTarget, setDetailTarget] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Status Badge Dropdown in Table
  const [statusDropdownId, setStatusDropdownId] = useState(null);
  const statusDropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setStatusDropdownId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toast Notification
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Filter Customer dropdown options
  const filterCustomerOptions = useMemo(() => {
    const list = new Set();
    licenses.forEach((lic) => {
      if (lic.customer) list.add(lic.customer);
    });
    customers.forEach((c) => {
      const name = typeof c === 'object' ? c.customer : c;
      if (name) list.add(name);
    });
    return Array.from(list);
  }, [licenses, customers]);

  // Filter SPK dropdown options (dynamically based on selected filterCustomer)
  const filterSpkOptions = useMemo(() => {
    const list = new Set();
    const sourceLicenses = filterCustomer
      ? licenses.filter((lic) => lic.customer === filterCustomer)
      : licenses;

    sourceLicenses.forEach((lic) => {
      if (lic.noSpk) list.add(lic.noSpk);
    });

    const sourceCustomers = filterCustomer
      ? customers.filter((c) =>
          typeof c === 'object' ? c.customer === filterCustomer : c === filterCustomer
        )
      : customers;

    sourceCustomers.forEach((c) => {
      if (typeof c === 'object' && c.noSpk) list.add(c.noSpk);
    });

    return Array.from(list);
  }, [licenses, customers, filterCustomer]);

  const handleCustomerFilterChange = (val) => {
    setFilterCustomer(val);
    setCurrentPage(1);

    // If currently selected SPK does not belong to the newly selected customer, clear SPK filter
    if (val) {
      const spksForCustomer = new Set();
      licenses
        .filter((l) => l.customer === val)
        .forEach((l) => l.noSpk && spksForCustomer.add(l.noSpk));
      customers
        .filter((c) => (typeof c === 'object' ? c.customer === val : c === val))
        .forEach((c) => c.noSpk && spksForCustomer.add(c.noSpk));

      if (filterSpk && !spksForCustomer.has(filterSpk)) {
        setFilterSpk('');
      }
    }
  };

  // Handle Sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filtered & Sorted Data
  const filteredLicenses = useMemo(() => {
    return licenses.filter((item) => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchCustomer = item.customer?.toLowerCase().includes(q);
        const matchProject = item.project?.toLowerCase().includes(q);
        const matchSpk = item.noSpk?.toLowerCase().includes(q);
        const matchHostName = getHostName(item).toLowerCase().includes(q);
        const matchStatus = item.status?.toLowerCase().includes(q);
        const matchKey = item.productKey?.toLowerCase().includes(q);
        if (!matchCustomer && !matchProject && !matchSpk && !matchHostName && !matchStatus && !matchKey) {
          return false;
        }
      }

      // Customer filter
      if (filterCustomer && item.customer !== filterCustomer) {
        return false;
      }

      // SPK filter
      if (filterSpk && item.noSpk !== filterSpk) {
        return false;
      }

      return true;
    });
  }, [licenses, searchQuery, filterCustomer, filterSpk]);

  const sortedLicenses = useMemo(() => {
    return [...filteredLicenses].sort((a, b) => {
      let aVal = a[sortField] || '';
      let bVal = b[sortField] || '';

      if (sortField === 'hostName') {
        aVal = getHostName(a);
        bVal = getHostName(b);
      }

      if (sortField === 'no') {
        aVal = a.id || 0;
        bVal = b.id || 0;
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      if (typeof aVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
    });
  }, [filteredLicenses, sortField, sortOrder]);

  // Pagination calculation
  const totalEntries = sortedLicenses.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage) || 1;
  const paginatedLicenses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedLicenses.slice(start, start + itemsPerPage);
  }, [sortedLicenses, currentPage, itemsPerPage]);

  // Handle Upload Modal Open
  const handleOpenUploadModal = () => {
    setSelectedFile(null);
    setFileContent(null);
    setShowUploadModal(true);
  };

  // Handle Drag & Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processSelectedFile(e.target.files[0]);
    }
  };

  // Process File (.licreq or json)
  const processSelectedFile = (file) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const parsed = JSON.parse(text);
        setFileContent(parsed);
      } catch (err) {
        // Fallback if not pure JSON
        setFileContent({ raw: true, name: file.name });
      }
    };
    reader.readAsText(file);
  };

  // Quick preset sample helper
  const handleLoadSampleFile = (sampleName) => {
    if (sampleName === 'activation (1).licreq') {
      const sampleData = {
        schemaVersion: 1,
        requestId: '45a5b76011664620aa6530b0210c5ef3',
        createdAt: '2026-10-08T10:56:34.0393062+00:00',
        customerReference: 'PT. Astemo Bekasi Manufacture',
        project: 'Line Monitoring',
        noSpk: 'ABM-LM-2026-01',
        machineHardware: {
          hostName: 'ASTM-P01-PC01',
          bios: 'PF3A7K29M481',
          diskSerial: 'WD-WCC4N7KX1234',
          macAddress: '00:1A:2B:3C:4D:5E',
          motherboardSerialNumber: 'MB-892348102',
          motherboardSerial: 'MB-892348102',
          uuid: '45a5b760-1166-4620-aa65-30b0210c5ef3'
        },
        machinePublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqX4...',
        encryptedHardware: {
          algorithm: 'RSA-OAEP-256+AesGcmCipher',
          encryptedKey: 'H2Yk5Hf1en4SgaRDNiiwB2SCmjynbQ4DrdPHKASi3nkaqMN7esDqc...',
          nonce: 'h3JtVlICgT+TSEBn',
          tag: 'WiTdCiHiNwaTzFV0x9LDmA==',
          ciphertext: 'JTZLdF4Y/RQH+i1i5HiWivP8brDdDmYNy5x0kVtSnkPnZ6nzwNEtVTTk...'
        },
        clientProofSignature: 'QiQehto8hYmf54Rw49j7sv6QtTBgEtU3vSDEypAG9+4aWIfnRjrUt0Y...'
      };
      setSelectedFile({ name: 'activation (1).licreq', size: 1024 });
      setFileContent(sampleData);
    } else {
      const sampleData = {
        schemaVersion: 1,
        requestId: '89b7201c905342ea9f8812e4312ab29f',
        createdAt: '2026-10-09T08:15:20.1248910+00:00',
        customerReference: 'PT. Astemo Bekasi Manufacture',
        project: 'Line Monitoring',
        noSpk: 'ABM-LM-2026-01',
        machineHardware: {
          hostName: 'ASTM-PC-01',
          bios: 'PF3A7K29M481',
          diskSerial: 'WD-WCC4N7KX1234',
          macAddress: '00:1A:2B:3C:4D:5E',
          motherboardSerialNumber: 'MB-892348102',
          motherboardSerial: 'MB-892348102',
          uuid: '45a5b760-1166-4620-aa65-30b0210c5ef3'
        },
        machinePublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyK7L...'
      };
      setSelectedFile({ name: 'ASTM-PC-01.licreq', size: 856 });
      setFileContent(sampleData);
    }
  };

  // Handle Save Uploaded License
  const handleSaveUpload = () => {
    if (!selectedFile) {
      setToast({ type: 'error', title: 'Error', message: 'Silakan pilih file .licreq terlebih dahulu.' });
      return;
    }

    // Determine customer, project, spk from parsed file or defaults
    const customer =
      fileContent?.customerReference ||
      fileContent?.customer ||
      'PT. Astemo Bekasi Manufacture';

    const project =
      fileContent?.project ||
      'Line Monitoring';

    const noSpk =
      fileContent?.noSpk ||
      'ABM-LM-2026-01';

    const newKeyId = `EIREN-PRDCT-KEY-${Math.floor(10 + Math.random() * 90)}`;

    const hardware = fileContent?.machineHardware || {};
    const hostName =
      hardware.hostName ||
      hardware.hostname ||
      fileContent?.hostName ||
      fileContent?.hostname ||
      (selectedFile.name ? selectedFile.name.replace(/\.licreq$/, '') : 'ASTM-P01-PC01');
    const bios = hardware.bios || fileContent?.bios || 'PF3A7K29M481';
    const diskSerial = hardware.diskSerial || fileContent?.diskSerial || 'WD-WCC4N7KX1234';
    const macAddress = hardware.macAddress || fileContent?.macAddress || '00:1A:2B:3C:4D:5E';
    const motherboardSerialNumber = hardware.motherboardSerialNumber || hardware.motherboardSerial || fileContent?.motherboardSerialNumber || fileContent?.motherboardSerial || 'MB-892348102';
    const uuid = hardware.uuid || fileContent?.uuid || '45a5b760-1166-4620-aa65-30b0210c5ef3';

    const newLicense = {
      id: Date.now(),
      customer,
      project,
      noSpk,
      hostName,
      productKey: newKeyId,
      status: 'Activated',
      fileName: selectedFile.name,
      bios,
      diskSerial,
      macAddress,
      motherboardSerialNumber,
      motherboardSerial: motherboardSerialNumber,
      uuid,
      licreqData: fileContent,
      datetime: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    };

    onUpdateLicenses([newLicense, ...licenses]);

    // Also register key in productKeys if available
    if (onUpdateProductKeys) {
      onUpdateProductKeys([
        {
          id: Date.now(),
          productKey: newKeyId,
          status: 'Activated',
          datetime: newLicense.datetime
        },
        ...productKeys
      ]);
    }

    setToast({
      type: 'success',
      title: 'Berhasil Ditambahkan',
      message: `File ${selectedFile.name} berhasil diunggah. Lisensi ${customer} (${project}) telah aktif!`
    });

    setShowUploadModal(false);
    setSelectedFile(null);
    setFileContent(null);
  };


  // Handle Select Status from badge dropdown
  const handleSelectStatus = (item, newStatus) => {
    if (item.status === newStatus) {
      setStatusDropdownId(null);
      return;
    }

    const updated = licenses.map((lic) =>
      lic.id === item.id ? { ...lic, status: newStatus } : lic
    );
    onUpdateLicenses(updated);

    if (onUpdateProductKeys && item.productKey) {
      const updatedKeys = productKeys.map((pk) =>
        pk.productKey === item.productKey ? { ...pk, status: newStatus } : pk
      );
      onUpdateProductKeys(updatedKeys);
    }

    setToast({
      type: 'success',
      title: 'Status Diperbarui',
      message: `Status lisensi ${item.customer} diubah menjadi ${newStatus}.`
    });

    setStatusDropdownId(null);
  };


  // Handle Delete
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    const updated = licenses.filter((item) => item.id !== deleteTarget.id);
    onUpdateLicenses(updated);

    setToast({
      type: 'success',
      title: 'Berhasil Dihapus',
      message: `Data lisensi ${deleteTarget.customer} berhasil dihapus.`
    });

    setDeleteTarget(null);
  };

  // Handle Download Product Key Link
  const handleDownloadKey = (item) => {
    const keyData = {
      licenseId: `EID-LIC-${item.id}`,
      customer: item.customer,
      project: item.project,
      noSpk: item.noSpk,
      productKey: item.productKey || `EIREN-PRDCT-KEY-${item.id}`,
      status: item.status,
      issuedAt: new Date().toISOString(),
      expiryDate: '2027-10-09T00:00:00.000Z',
      digitalSignature: 'SHA256withRSA:MIIBCgKCAQEAqX4GqoRjKCvod1Ej9p2P02i4b9fHAufnSAvx1yxxUk...'
    };

    const blob = new Blob([JSON.stringify(keyData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeCustomer = (item.customer || 'customer').replace(/[^a-zA-Z0-9]/g, '_');
    const safeProject = (item.project || 'project').replace(/[^a-zA-Z0-9]/g, '_');
    a.href = url;
    a.download = `${safeCustomer}_${safeProject}_ProductKey.key`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setToast({
      type: 'success',
      title: 'Download Product Key',
      message: `Product Key untuk ${item.customer} (${item.productKey || 'Key'}) berhasil didownload.`
    });
  };

  // Helper to render Status Badge Dropdown (Available = Green, Activated = Blue)
  const renderStatusBadge = (item, index) => {
    const isAvailable = (item?.status || '').toLowerCase() === 'available';
    const currentStatus = isAvailable ? 'Available' : 'Activated';
    const isOpen = statusDropdownId === item.id;
    const isNearBottom = paginatedLicenses.length > 2 && index >= paginatedLicenses.length - 2;

    return (
      <div
        className="relative inline-block text-left"
        ref={isOpen ? statusDropdownRef : null}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setStatusDropdownId(isOpen ? null : item.id);
          }}
          className={`inline-flex items-center justify-between gap-1.5 px-2.5 py-0.5 rounded border text-xs font-normal cursor-pointer transition-all duration-150 select-none shadow-xs hover:shadow-sm ${
            isAvailable
              ? 'border-[#B7EB8F] bg-[#F6FFED] text-[#52C41A] hover:bg-[#D9F7BE] hover:border-[#95DE64]'
              : 'border-[#91D5FF] bg-[#E6F7FF] text-[#1890FF] hover:bg-[#BAE7FF] hover:border-[#69C0FF]'
          }`}
          title="Klik untuk memilih status"
        >
          <span>{currentStatus}</span>
          <ChevronDown
            className={`w-3 h-3 transition-transform duration-200 opacity-80 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute left-0 w-36 bg-white border border-[#E4E7EC] rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100 ${
              isNearBottom ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
            }`}
          >
            <div className="px-3 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1">
              Pilih Status
            </div>

            {/* Option 1: Activated (Blue) */}
            <button
              type="button"
              onClick={() => handleSelectStatus(item, 'Activated')}
              className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors cursor-pointer hover:bg-gray-50 ${
                currentStatus === 'Activated'
                  ? 'font-semibold text-[#1890FF] bg-[#E6F7FF]/50'
                  : 'text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1890FF]" />
                <span>Activated</span>
              </div>
              {currentStatus === 'Activated' && (
                <Check className="w-3.5 h-3.5 text-[#1890FF]" />
              )}
            </button>

            {/* Option 2: Available (Green) */}
            <button
              type="button"
              onClick={() => handleSelectStatus(item, 'Available')}
              className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors cursor-pointer hover:bg-gray-50 ${
                currentStatus === 'Available'
                  ? 'font-semibold text-[#52C41A] bg-[#F6FFED]'
                  : 'text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#52C41A]" />
                <span>Available</span>
              </div>
              {currentStatus === 'Available' && (
                <Check className="w-3.5 h-3.5 text-[#52C41A]" />
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header Card */}
        <PageHeaderCard
          title="License Management"
          subtitle="List license data"
        />

        {/* Main Content Card */}
        <div className="bg-white rounded-xl border border-[#E4E7EC] p-5 shadow-sm space-y-4">
          {/* Top Filter & Action Bar - Matching Image 3 */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left: Search Bar with Clear X */}
            <div className="relative w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search"
                className="w-full h-[38px] pl-10 pr-9 border border-[#D0D5DD] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00A854]"
              />
              {searchQuery ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                  ✕
                </span>
              )}
            </div>

            {/* Right: Customer Dropdown, SPK Dropdown & Upload Data Button */}
            <div className="flex items-center gap-3">
              {/* All Customer Filter */}
              <div className="w-56">
                <CustomDropdown
                  value={filterCustomer}
                  onChange={handleCustomerFilterChange}
                  options={filterCustomerOptions}
                  placeholder="All Customer"
                  includeAllOption={true}
                  allOptionLabel="All Customer"
                  placement="bottom"
                  buttonClassName="h-[38px] border-[#D0D5DD] rounded-lg text-sm text-gray-700"
                />
              </div>

              {/* All SPK Filter (Placed to the right of Customer filter, options adapt to selected customer) */}
              <div className="w-52">
                <CustomDropdown
                  value={filterSpk}
                  onChange={(val) => {
                    setFilterSpk(val);
                    setCurrentPage(1);
                  }}
                  options={filterSpkOptions}
                  placeholder="All SPK"
                  includeAllOption={true}
                  allOptionLabel="All SPK"
                  placement="bottom"
                  buttonClassName="h-[38px] border-[#D0D5DD] rounded-lg text-sm text-gray-700"
                />
              </div>

              {/* + Upload Data Button (Green) */}
              <button
                onClick={handleOpenUploadModal}
                className="flex items-center gap-2 h-[38px] px-4 bg-[#00A854] hover:bg-[#008C45] text-white rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Data</span>
              </button>
            </div>
          </div>

          {/* Table View - Matching Image 3 */}
          {loading ? (
            <SkeletonTable rows={6} cols={8} />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-[#D0D5DD]">
              <table className="w-full text-left border-collapse text-sm font-sans">
                <thead className="bg-[#F2F2F7] border-b border-[#D0D5DD]">
                  <tr className="text-[#23262B] font-semibold whitespace-nowrap">
                    {/* 1. No */}
                    <th className="py-3.5 px-4 w-16 whitespace-nowrap">
                      <div
                        className="flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap"
                        onClick={() => handleSort('no')}
                      >
                        <span className="whitespace-nowrap">No</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                      </div>
                    </th>

                    {/* 2. Customer */}
                    <th className="py-3.5 px-4 min-w-[240px] whitespace-nowrap">
                      <div
                        className="flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap"
                        onClick={() => handleSort('customer')}
                      >
                        <span className="whitespace-nowrap">Customer</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                      </div>
                    </th>

                    {/* 3. Project */}
                    <th className="py-3.5 px-4 min-w-[180px] whitespace-nowrap">
                      <div
                        className="flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap"
                        onClick={() => handleSort('project')}
                      >
                        <span className="whitespace-nowrap">Project</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                      </div>
                    </th>

                    {/* 4. No. SPK */}
                    <th className="py-3.5 px-4 min-w-[180px] whitespace-nowrap">
                      <div
                        className="flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap"
                        onClick={() => handleSort('noSpk')}
                      >
                        <span className="whitespace-nowrap">No. SPK</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                      </div>
                    </th>

                    {/* 5. Host Name */}
                    <th className="py-3.5 px-4 min-w-[170px] whitespace-nowrap">
                      <div
                        className="flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap"
                        onClick={() => handleSort('hostName')}
                      >
                        <span className="whitespace-nowrap">Host Name</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                      </div>
                    </th>

                    {/* 6. Product Key */}
                    <th className="py-3.5 px-4 min-w-[160px] whitespace-nowrap">
                      <div
                        className="flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap"
                        onClick={() => handleSort('productKey')}
                      >
                        <span className="whitespace-nowrap">Product Key</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                      </div>
                    </th>

                    {/* 6. License Status */}
                    <th className="py-3.5 px-4 min-w-[160px] whitespace-nowrap">
                      <div
                        className="flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap"
                        onClick={() => handleSort('status')}
                      >
                        <span className="whitespace-nowrap">License Status</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                      </div>
                    </th>

                    {/* 7. Action */}
                    <th className="py-3.5 px-4 text-center w-28 whitespace-nowrap">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E4E7EC] bg-white">
                  {paginatedLicenses.map((item, index) => {
                    const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50/80 transition-colors"
                      >
                        {/* 1. No */}
                        <td className="py-3.5 px-4 text-gray-600 font-medium leading-5 align-middle">
                          {rowNumber}
                        </td>

                        {/* 2. Customer */}
                        <td className="py-3.5 px-4 font-medium leading-5 align-middle">
                          <button
                            type="button"
                            onClick={() => {
                              setDetailTarget(item);
                              setShowDetailModal(true);
                            }}
                            className="text-left font-medium text-gray-800 hover:text-[#00A854] hover:underline cursor-pointer transition-colors"
                            title="Klik untuk melihat detail hardware komputer"
                          >
                            {item.customer}
                          </button>
                        </td>

                        {/* 3. Project */}
                        <td className="py-3.5 px-4 text-gray-700 leading-5 align-middle">
                          {item.project || <span className="text-gray-400">-</span>}
                        </td>

                        {/* 4. No. SPK */}
                        <td className="py-3.5 px-4 text-gray-700 leading-5 align-middle">
                          {item.noSpk || <span className="text-gray-400">-</span>}
                        </td>

                        {/* 5. Host Name */}
                        <td className="py-3.5 px-4 text-gray-700 font-mono text-xs font-semibold leading-5 align-middle">
                          {getHostName(item)}
                        </td>

                        {/* 6. Product Key (Download Link) */}
                        <td className="py-3.5 px-4 leading-5 align-middle">
                          <button
                            onClick={() => handleDownloadKey(item)}
                            className="text-[#00A854] font-medium underline hover:text-[#008C45] cursor-pointer inline-flex items-center gap-1"
                            title="Download Product Key"
                          >
                            <span>Download</span>
                          </button>
                        </td>

                        {/* 6. License Status (Badge Dropdown) */}
                        <td className="py-3.5 px-4 leading-5 align-middle">
                          {renderStatusBadge(item, index)}
                        </td>

                        {/* 7. Action (Delete) */}
                        <td className="py-3.5 px-4 text-center leading-5 align-middle">
                          <div className="flex items-center justify-center">
                            {/* Delete Button (Red outline) */}
                            <button
                              onClick={() => setDeleteTarget(item)}
                              className="w-7 h-7 flex items-center justify-center border border-[#FFA39E] bg-[#FFF1F0] hover:bg-[#FFCCC7] text-[#FF4D4F] rounded transition-colors cursor-pointer"
                              title="Delete License"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {paginatedLicenses.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-gray-400 text-sm">
                        No license data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer - Matching Screenshot */}
          <div className="flex flex-wrap items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-500 gap-3">
            <div>
              Showing{' '}
              <span className="font-semibold text-gray-700">
                {totalEntries === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-gray-700">
                {Math.min(currentPage * itemsPerPage, totalEntries)}
              </span>{' '}
              of <span className="font-semibold text-gray-700">{totalEntries}</span>{' '}
              entries
            </div>

            <div className="flex items-center gap-3">
              {/* Page Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-gray-600" />
                </button>

                <span className="w-7 h-7 flex items-center justify-center border border-gray-200 bg-white text-gray-700 font-semibold rounded-lg text-xs">
                  {currentPage}
                </span>

                <span className="text-gray-500">/ {totalPages}</span>

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                </button>
              </div>

              {/* Show Entries Dropdown */}
              <div className="flex items-center gap-1.5">
                <span>Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 border border-gray-200 rounded-lg bg-white text-gray-700 text-xs focus:outline-none cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span>entries</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Add License Management (Image 2 & Image 4) */}
      <ModalPortal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)}>
        <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Add License Management
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                This field is for desc terms of service
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(false)}
              className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Upload Drag & Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center select-none ${
              isDragging
                ? 'border-[#00A854] bg-[#EAF8F1]'
                : selectedFile
                ? 'border-[#00A854]/40 bg-[#FAFDFA]'
                : 'border-[#D0D5DD] bg-[#FCFCFD] hover:border-[#00A854]/60 hover:bg-[#FAFDFA]'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".licreq,application/json"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {/* Cloud Icon with Arrow - Matching Screenshot */}
            <div className="w-12 h-12 flex items-center justify-center text-[#00A854] mb-3">
              <svg
                className="w-10 h-10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                <path d="M12 12v9" />
                <path d="m8 16 4-4 4 4" />
              </svg>
            </div>

            {/* Content based on state */}
            {selectedFile ? (
              // Selected State (Image 4)
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-900 tracking-tight">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-400">Click to replace file</p>
              </div>
            ) : (
              // Empty State (Image 2)
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-900">
                  Click or drag file to this area to upload
                </p>
                <p className="text-xs text-gray-400">
                  Only .licreq files are supported.
                </p>
              </div>
            )}
          </div>

          {/* Quick preset helper for instant testing */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
            <span className="text-gray-400">Quick sample test:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleLoadSampleFile('activation (1).licreq')}
                className="px-2.5 py-1 bg-emerald-50 text-[#00A854] hover:bg-emerald-100 rounded text-xs font-medium transition-colors cursor-pointer"
              >
                activation (1).licreq
              </button>
              <button
                type="button"
                onClick={() => handleLoadSampleFile('ASTM-PC-01.licreq')}
                className="px-2.5 py-1 bg-emerald-50 text-[#00A854] hover:bg-emerald-100 rounded text-xs font-medium transition-colors cursor-pointer"
              >
                ASTM-PC-01.licreq
              </button>
            </div>
          </div>

          {/* Parsed Hardware Info Preview Card (Matched to Image 1 & Image 2) */}
          {selectedFile && fileContent && (
            <div className="bg-[#F8F9FA] border border-[#EAECF0] rounded-2xl p-4 text-left text-xs space-y-2 shadow-sm animate-in fade-in duration-150">
              <div className="flex justify-between items-center gap-2">
                <span className="text-[#98A2B3] text-xs font-normal">Customer:</span>
                <span className="font-bold text-[#101828] text-right truncate">
                  {fileContent?.customerReference || fileContent?.customer || 'PT. Astemo Bekasi Manufacture'}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-[#98A2B3] text-xs font-normal">Project:</span>
                <span className="font-bold text-[#101828] text-right">
                  {fileContent?.project || 'Line Monitoring'}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-[#98A2B3] text-xs font-normal">No. SPK:</span>
                <span className="font-bold text-[#101828] text-right font-mono">
                  {fileContent?.noSpk || 'ABM-LM-2026-01'}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-[#98A2B3] text-xs font-normal">Host Name:</span>
                <span className="font-bold text-[#101828] text-right font-mono">
                  {fileContent?.machineHardware?.hostName || fileContent?.hostName || fileContent?.hostname || (selectedFile?.name ? selectedFile.name.replace(/\.licreq$/, '') : 'ASTM-P01-PC01')}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-[#98A2B3] text-xs font-normal">Bios:</span>
                <span className="text-[#101828] text-right font-medium">
                  {fileContent?.machineHardware?.bios || fileContent?.bios || 'PF3A7K29M481'}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-[#98A2B3] text-xs font-normal">Disk Serial:</span>
                <span className="text-[#101828] text-right font-medium">
                  {fileContent?.machineHardware?.diskSerial || fileContent?.diskSerial || 'WD-WCC4N7KX1234'}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-[#98A2B3] text-xs font-normal">Mac Address:</span>
                <span className="text-[#101828] text-right font-medium">
                  {fileContent?.machineHardware?.macAddress || fileContent?.macAddress || '00:1A:2B:3C:4D:5E'}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-[#98A2B3] text-xs font-normal">Motherboard Serial Number:</span>
                <span className="text-[#101828] text-right font-medium">
                  {fileContent?.machineHardware?.motherboardSerialNumber || fileContent?.machineHardware?.motherboardSerial || fileContent?.motherboardSerialNumber || 'MB-892348102'}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-[#98A2B3] text-xs font-normal">UUID:</span>
                <span className="text-[#101828] text-right font-medium text-[11px] truncate max-w-[240px]" title={fileContent?.machineHardware?.uuid || fileContent?.uuid}>
                  {fileContent?.machineHardware?.uuid || fileContent?.uuid || '45a5b760-1166-4620-aa65-30b0210c5ef3'}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons - Right aligned matching screenshot */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowUploadModal(false)}
              className="min-w-[105px] h-[38px] px-6 py-2 border border-[#667085] bg-white text-[#475467] hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveUpload}
              disabled={!selectedFile}
              className="min-w-[105px] h-[38px] px-7 py-2 bg-[#00A854] hover:bg-[#008C45] disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </ModalPortal>


      {/* MODAL 3: Delete Confirmation */}
      <ModalPortal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <h3 className="text-base font-bold text-gray-900">Hapus Lisensi</h3>
          </div>
          <p className="text-sm text-gray-600">
            Apakah Anda yakin ingin menghapus lisensi untuk pelanggan{' '}
            <span className="font-semibold text-gray-900">
              {deleteTarget?.customer}
            </span>{' '}
            ({deleteTarget?.project})?
          </p>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              Hapus
            </button>
          </div>
        </div>
      </ModalPortal>

      {/* MODAL 4: Hardware Details Modal (Matched to Image 1 & Image 2) */}
      <ModalPortal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)}>
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-start justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Hardware Details
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Client machine specifications from .licreq
              </p>
            </div>
            <button
              onClick={() => setShowDetailModal(false)}
              className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* The Exact Card from Image 1 & Image 2 */}
          <div className="bg-[#F8F9FA] border border-[#EAECF0] rounded-2xl p-4 text-left text-xs space-y-2.5 shadow-sm">
            <div className="flex justify-between items-center gap-3">
              <span className="text-[#98A2B3] text-xs font-normal">Customer:</span>
              <span className="font-bold text-[#101828] text-right truncate">
                {detailTarget?.customer}
              </span>
            </div>
            <div className="flex justify-between items-center gap-3">
              <span className="text-[#98A2B3] text-xs font-normal">Project:</span>
              <span className="font-bold text-[#101828] text-right">
                {detailTarget?.project}
              </span>
            </div>
            <div className="flex justify-between items-center gap-3">
              <span className="text-[#98A2B3] text-xs font-normal">No. SPK:</span>
              <span className="font-bold text-[#101828] text-right font-mono">
                {detailTarget?.noSpk}
              </span>
            </div>
            <div className="flex justify-between items-center gap-3">
              <span className="text-[#98A2B3] text-xs font-normal">Host Name:</span>
              <span className="font-bold text-[#101828] text-right font-mono">
                {getHostName(detailTarget)}
              </span>
            </div>
            <div className="flex justify-between items-center gap-3">
              <span className="text-[#98A2B3] text-xs font-normal">Bios:</span>
              <span className="text-[#101828] text-right font-medium">
                {detailTarget?.bios || 'PF3A7K29M481'}
              </span>
            </div>
            <div className="flex justify-between items-center gap-3">
              <span className="text-[#98A2B3] text-xs font-normal">Disk Serial:</span>
              <span className="text-[#101828] text-right font-medium">
                {detailTarget?.diskSerial || 'WD-WCC4N7KX1234'}
              </span>
            </div>
            <div className="flex justify-between items-center gap-3">
              <span className="text-[#98A2B3] text-xs font-normal">Mac Address:</span>
              <span className="text-[#101828] text-right font-medium">
                {detailTarget?.macAddress || '00:1A:2B:3C:4D:5E'}
              </span>
            </div>
            <div className="flex justify-between items-center gap-3">
              <span className="text-[#98A2B3] text-xs font-normal">Motherboard Serial Number:</span>
              <span className="text-[#101828] text-right font-medium">
                {detailTarget?.motherboardSerialNumber || detailTarget?.motherboardSerial || 'MB-892348102'}
              </span>
            </div>
            <div className="flex justify-between items-center gap-3">
              <span className="text-[#98A2B3] text-xs font-normal">UUID:</span>
              <span className="text-[#101828] text-right font-medium text-[11px] truncate max-w-[240px]" title={detailTarget?.uuid}>
                {detailTarget?.uuid || '45a5b760-1166-4620-aa65-30b0210c5ef3'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowDetailModal(false)}
              className="min-w-[105px] h-[38px] px-6 py-2 border border-[#667085] bg-white text-[#475467] hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </ModalPortal>

      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
