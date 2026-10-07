import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';
import SkeletonTable from '../components/SkeletonTable';
import Toast from '../components/Toast';
import CustomDropdown from '../components/CustomDropdown';
import StatusBadge from '../components/StatusBadge';
import AntDateRangePicker from '../components/AntDateRangePicker';
import ModalPortal from '../components/ModalPortal';
import PageHeaderCard from '../components/PageHeaderCard';

export default function LicenseManagementPage({
  licenses = [],
  onUpdateLicenses,
  customers = [],
  productKeys = [],
  onUpdateProductKeys
}) {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterProject, setFilterProject] = useState('');

  // Add / Edit Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLicense, setEditingLicense] = useState(null);
  const [formCustomer, setFormCustomer] = useState('');
  const [formProject, setFormProject] = useState('');
  const [formNoSpk, setFormNoSpk] = useState('');

  // Dynamic Devices & Keys: default 1 item
  const [deviceRows, setDeviceRows] = useState([
    { id: 1, productKey: '', deviceName: '', biosSerial: '' }
  ]);

  // Delete State
  const [deleteId, setDeleteId] = useState(null);

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('no');
  const [sortOrder, setSortOrder] = useState('asc');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Available Product Keys from props (only status 'Available')
  const availableProductKeys = productKeys.filter((p) => {
    if (typeof p === 'object' && p !== null) {
      return (p.status || '').toLowerCase() === 'available';
    }
    return true;
  });

  const customerOptions = customers.map((c) =>
    typeof c === 'object' ? c.customer : c
  );

  // Top Filter Customer Options
  const filterCustomerOptions = useMemo(() => {
    return customers.map((c) => (typeof c === 'object' ? c.customer : c));
  }, [customers]);

  // Top Filter Project Options based on filterCustomer
  const filterProjectOptions = useMemo(() => {
    if (filterCustomer) {
      const matchCustomer = customers.find(
        (c) => (typeof c === 'object' ? c.customer : c) === filterCustomer
      );
      if (matchCustomer && matchCustomer.projects) {
        return matchCustomer.projects.map((p) => (typeof p === 'object' ? p.name : p));
      }
      return [];
    }
    const allProj = new Set();
    customers.forEach((c) => {
      if (c.projects) {
        c.projects.forEach((p) => {
          allProj.add(typeof p === 'object' ? p.name : p);
        });
      }
    });
    return Array.from(allProj);
  }, [customers, filterCustomer]);

  const handleFilterCustomerChange = (val) => {
    setFilterCustomer(val);
    setFilterProject('');
    setCurrentPage(1);
  };

  const handleFilterProjectChange = (val) => {
    setFilterProject(val);
    setCurrentPage(1);
  };

  // Find customer object currently selected
  const selectedCustomerObj = customers.find((c) =>
    (typeof c === 'object' ? c.customer : c) === formCustomer
  );

  // Available projects for the selected customer
  const projectOptions = (selectedCustomerObj?.projects || []).map((p) =>
    typeof p === 'object' ? p.name : p
  );

  // Handle Customer Change in Modal
  const handleCustomerChange = (customerName) => {
    setFormCustomer(customerName);
    setFormProject('');
    setFormNoSpk('');
  };

  // Handle Project Change in Modal: Auto-populate No. SPK from Master Data
  const handleProjectChange = (projectName) => {
    setFormProject(projectName);
    if (selectedCustomerObj?.projects) {
      const matchProj = selectedCustomerObj.projects.find(
        (p) => (typeof p === 'object' ? p.name : p) === projectName
      );
      if (matchProj && typeof matchProj === 'object' && matchProj.noSpk) {
        setFormNoSpk(matchProj.noSpk);
      } else {
        setFormNoSpk('');
      }
    } else {
      setFormNoSpk('');
    }
  };

  // Add more device row
  const handleAddDeviceRow = () => {
    setDeviceRows((prev) => [
      ...prev,
      { id: Date.now(), productKey: '', deviceName: '', biosSerial: '' }
    ]);
  };

  // Remove device row (any row can be removed when > 1 item)
  const handleRemoveDeviceRow = (index) => {
    if (deviceRows.length > 1) {
      setDeviceRows((prev) => prev.filter((_, i) => i !== index));
    } else {
      // Reset if only 1 row
      setDeviceRows([
        { id: Date.now(), productKey: '', deviceName: '', biosSerial: '' }
      ]);
    }
  };

  // Update specific field in device row
  const handleDeviceRowChange = (index, field, value) => {
    setDeviceRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  // Get available keys for a specific row (excluding keys already chosen in other rows, but keeping the row's own key if editing)
  const getAvailableKeysForRow = (currentRowKey) => {
    const keysChosenInOtherRows = new Set(
      deviceRows
        .filter((r) => r.productKey && r.productKey !== currentRowKey)
        .map((r) => r.productKey)
    );

    const availableKeyStrings = availableProductKeys
      .map((p) => (typeof p === 'object' ? p.productKey : p))
      .filter((key) => !keysChosenInOtherRows.has(key));

    // If current row already has a key (e.g. while editing), keep it selectable
    if (currentRowKey && !availableKeyStrings.includes(currentRowKey)) {
      return [currentRowKey, ...availableKeyStrings];
    }
    return availableKeyStrings;
  };

  // Filter licenses by Search, Customer, Project, and DateRange
  const filteredLicenses = licenses.filter((item) => {
    // 1. Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchCustomer = item.customer?.toLowerCase().includes(q);
      const matchProject = item.project?.toLowerCase().includes(q);
      const matchSpk = item.noSpk?.toLowerCase().includes(q);
      const matchStatus = item.status?.toLowerCase().includes(q);

      const matchDevices = (item.devices || []).some(
        (d) =>
          d.deviceName?.toLowerCase().includes(q) ||
          d.biosSerial?.toLowerCase().includes(q) ||
          d.productKey?.toLowerCase().includes(q)
      );

      const matchLegacy =
        item.productKey?.toLowerCase().includes(q) ||
        item.deviceName?.toLowerCase().includes(q) ||
        item.biosSerial?.toLowerCase().includes(q);

      const matchAny = matchCustomer || matchProject || matchSpk || matchStatus || matchDevices || matchLegacy;
      if (!matchAny) return false;
    }

    // 2. Customer Filter
    if (filterCustomer && item.customer !== filterCustomer) {
      return false;
    }

    // 3. Project Filter
    if (filterProject && item.project !== filterProject) {
      return false;
    }

    // 4. Date Range Filter
    if (dateRange && dateRange[0] && dateRange[1]) {
      const parts = (item.datetime || '').split(' ')[0].split('/');
      if (parts.length === 3) {
        const itemDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        const startDate = dateRange[0].startOf('day').toDate();
        const endDate = dateRange[1].endOf('day').toDate();
        if (itemDate < startDate || itemDate > endDate) {
          return false;
        }
      }
    }

    return true;
  });

  // Sort licenses
  const sortedLicenses = [...filteredLicenses].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';
    if (typeof aVal === 'string') {
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return 0;
  });

  const totalEntries = sortedLicenses.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage) || 1;
  const paginatedLicenses = sortedLicenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAdd = () => {
    setEditingLicense(null);
    setFormCustomer('');
    setFormProject('');
    setFormNoSpk('');
    setDeviceRows([
      { id: Date.now(), productKey: '', deviceName: '', biosSerial: '' }
    ]);
    setShowAddModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingLicense(item);
    setFormCustomer(item.customer || '');
    setFormProject(item.project || '');
    setFormNoSpk(item.noSpk || '');

    const devicesList = item.devices || (item.deviceName ? [{
      deviceName: item.deviceName,
      biosSerial: item.biosSerial,
      productKey: item.productKey
    }] : []);

    if (devicesList.length > 0) {
      setDeviceRows(
        devicesList.map((d, idx) => ({
          id: Date.now() + idx,
          productKey: d.productKey || '',
          deviceName: d.deviceName || '',
          biosSerial: d.biosSerial || ''
        }))
      );
    } else {
      setDeviceRows([
        { id: Date.now(), productKey: '', deviceName: '', biosSerial: '' }
      ]);
    }
    setShowAddModal(true);
  };

  const handleSaveLicense = (e) => {
    e.preventDefault();

    if (!formCustomer) {
      setToast({ type: 'error', title: 'Error', message: 'Please select a Customer.' });
      return;
    }
    if (!formProject) {
      setToast({ type: 'error', title: 'Error', message: 'Please select a Project.' });
      return;
    }

    // Filter valid device rows
    const validDeviceRows = deviceRows.filter(
      (r) => r.productKey || r.deviceName.trim() || r.biosSerial.trim()
    );

    if (validDeviceRows.length === 0) {
      setToast({
        type: 'error',
        title: 'Error',
        message: 'At least one device entry is required.'
      });
      return;
    }

    // Validate each device row
    for (let i = 0; i < validDeviceRows.length; i++) {
      const row = validDeviceRows[i];
      if (!row.productKey) {
        setToast({
          type: 'error',
          title: 'Error',
          message: `Please select a Product Key for device #${i + 1}.`
        });
        return;
      }
      if (!row.deviceName.trim()) {
        setToast({
          type: 'error',
          title: 'Error',
          message: `Device Name is required for device #${i + 1}.`
        });
        return;
      }
      if (!row.biosSerial.trim()) {
        setToast({
          type: 'error',
          title: 'Error',
          message: `Bios Serial is required for device #${i + 1}.`
        });
        return;
      }
    }

    // Check for duplicate keys in current submission
    const keysArray = validDeviceRows.map((r) => r.productKey);
    const uniqueKeys = new Set(keysArray);
    if (uniqueKeys.size !== keysArray.length) {
      setToast({
        type: 'error',
        title: 'Error',
        message: 'Duplicate Product Key detected within your entries.'
      });
      return;
    }

    const devicesData = validDeviceRows.map((r) => ({
      productKey: r.productKey,
      deviceName: r.deviceName.trim(),
      biosSerial: r.biosSerial.trim()
    }));

    if (editingLicense) {
      const updated = licenses.map((item) =>
        item.id === editingLicense.id
          ? {
              ...item,
              customer: formCustomer,
              project: formProject,
              noSpk: formNoSpk,
              devices: devicesData
            }
          : item
      );
      onUpdateLicenses(updated);

      // Update product keys
      if (onUpdateProductKeys) {
        const newlyUsedKeys = new Set(keysArray);
        onUpdateProductKeys(
          productKeys.map((pk) => {
            const keyVal = typeof pk === 'object' ? pk.productKey : pk;
            if (newlyUsedKeys.has(keyVal)) {
              return typeof pk === 'object' ? { ...pk, status: 'Activated' } : pk;
            }
            return pk;
          })
        );
      }

      setToast({
        type: 'success',
        title: 'Berhasil Diperbarui',
        message: `Data lisensi ${formCustomer} (${formProject}) berhasil diperbarui.`
      });
    } else {
      const newLicense = {
        id: Date.now(),
        customer: formCustomer,
        project: formProject,
        noSpk: formNoSpk,
        devices: devicesData,
        status: 'Activated',
        datetime: new Date().toLocaleDateString('en-GB') + ' 12:00'
      };

      onUpdateLicenses([newLicense, ...licenses]);

      // Update Product Keys status to 'Activated'
      if (onUpdateProductKeys) {
        const newlyActivatedKeys = new Set(keysArray);
        onUpdateProductKeys(
          productKeys.map((pk) => {
            const keyVal = typeof pk === 'object' ? pk.productKey : pk;
            if (newlyActivatedKeys.has(keyVal)) {
              return typeof pk === 'object' ? { ...pk, status: 'Activated' } : pk;
            }
            return pk;
          })
        );
      }

      setToast({
        type: 'success',
        title: 'Berhasil Ditambahkan',
        message: `Lisensi untuk ${formCustomer} (${formProject}) berhasil ditambahkan ke sistem.`
      });
    }

    setShowAddModal(false);
    setEditingLicense(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      const targetLicense = licenses.find((item) => item.id === deleteId);
      onUpdateLicenses(licenses.filter((item) => item.id !== deleteId));

      // Revert product keys to 'Available'
      if (targetLicense && onUpdateProductKeys) {
        const releasedKeys = new Set();
        if (targetLicense.devices) {
          targetLicense.devices.forEach((d) => releasedKeys.add(d.productKey));
        } else if (targetLicense.productKey) {
          releasedKeys.add(targetLicense.productKey);
        }

        onUpdateProductKeys(
          productKeys.map((pk) => {
            const keyVal = typeof pk === 'object' ? pk.productKey : pk;
            if (releasedKeys.has(keyVal)) {
              return typeof pk === 'object' ? { ...pk, status: 'Available' } : pk;
            }
            return pk;
          })
        );
      }

      setToast({
        type: 'success',
        title: 'Berhasil Dihapus',
        message: 'Data lisensi berhasil dihapus.'
      });
      setDeleteId(null);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header Card */}
        <PageHeaderCard
          title="License Management"
          subtitle="List license data"
        />

        {/* Table Card */}
        <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 shadow-sm space-y-5">
          {/* Filters & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left: Search Bar */}
            <div className="relative w-64 min-w-[200px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search"
                className="w-full h-[38px] pl-10 pr-9 border border-[#D0D5DD] rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Right: Nama PT, Project, DateRangePicker, Add Button */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Filter Nama PT / Customer */}
              <div className="w-56 min-w-[190px]">
                <CustomDropdown
                  value={filterCustomer}
                  onChange={handleFilterCustomerChange}
                  options={filterCustomerOptions}
                  placeholder="All Customer"
                  includeAllOption={true}
                  allOptionLabel="All Customer"
                  placement="bottom"
                  buttonClassName="h-[38px] border-[#D0D5DD]"
                />
              </div>

              {/* Filter Project */}
              <div className="w-52 min-w-[175px]">
                <CustomDropdown
                  value={filterProject}
                  onChange={handleFilterProjectChange}
                  options={filterProjectOptions}
                  placeholder="All Project"
                  includeAllOption={true}
                  allOptionLabel="All Project"
                  placement="bottom"
                  buttonClassName="h-[38px] border-[#D0D5DD]"
                />
              </div>

              {/* Ant Design DateRangePicker */}
              <AntDateRangePicker
                value={dateRange}
                onChange={(dates) => {
                  setDateRange(dates);
                  setCurrentPage(1);
                }}
              />

              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-2 h-[38px] px-4 bg-[#00A854] hover:bg-[#008C45] text-white rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Add Data</span>
              </button>
            </div>
          </div>

          {/* Table / Skeleton - Matching Screenshot Layout */}
          {loading ? (
            <SkeletonTable rows={5} cols={9} />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-[#D0D5DD]">
              <table className="w-full text-left border-collapse text-sm font-sans">
                <thead className="bg-[#F2F2F7] border-b border-[#D0D5DD]">
                  <tr className="text-[#23262B] font-semibold">
                    <th className="py-3.5 px-4 w-16">
                      <div
                        className="flex items-center gap-1.5 cursor-pointer select-none"
                        onClick={() => handleSort('no')}
                      >
                        <span>No</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 min-w-[220px]">
                      <div
                        className="flex items-center gap-1.5 cursor-pointer select-none"
                        onClick={() => handleSort('customer')}
                      >
                        <span>Customer</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 min-w-[180px]">
                      <div
                        className="flex items-center gap-1.5 cursor-pointer select-none"
                        onClick={() => handleSort('project')}
                      >
                        <span>Project</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 min-w-[160px]">
                      <div
                        className="flex items-center gap-1.5 cursor-pointer select-none"
                        onClick={() => handleSort('noSpk')}
                      >
                        <span>No. SPK</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 min-w-[170px]">
                      <div
                        className="flex items-center gap-1.5 cursor-pointer select-none"
                        onClick={() => handleSort('deviceName')}
                      >
                        <span>Device Name</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 min-w-[170px]">
                      <div
                        className="flex items-center gap-1.5 cursor-pointer select-none"
                        onClick={() => handleSort('biosSerial')}
                      >
                        <span>Bios Serial</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 min-w-[200px]">
                      <div
                        className="flex items-center gap-1.5 cursor-pointer select-none"
                        onClick={() => handleSort('productKey')}
                      >
                        <span>Product Key</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 w-36">
                      <div
                        className="flex items-center gap-1.5 cursor-pointer select-none"
                        onClick={() => handleSort('status')}
                      >
                        <span>License Status</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 text-center w-28">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E7EC] bg-white">
                  {paginatedLicenses.map((item, index) => {
                    const devicesList = item.devices || (item.deviceName ? [{
                      deviceName: item.deviceName,
                      biosSerial: item.biosSerial,
                      productKey: item.productKey
                    }] : []);

                    return (
                      <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                        {/* 1. No */}
                        <td className="py-3.5 px-4 text-gray-600 font-medium leading-5 align-middle">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>

                        {/* 2. Customer */}
                        <td className="py-3.5 px-4 text-gray-800 font-medium leading-5 align-middle">
                          {item.customer}
                        </td>

                        {/* 3. Project */}
                        <td className="py-3.5 px-4 text-gray-700 leading-5 align-middle">
                          {item.project || <span className="text-gray-400">-</span>}
                        </td>

                        {/* 4. No. SPK */}
                        <td className="py-3.5 px-4 text-gray-700 leading-5 align-middle">
                          {item.noSpk || <span className="text-gray-400">-</span>}
                        </td>

                        {/* 5. Device Name (Bulleted list) */}
                        <td className="py-3.5 px-4 text-gray-700 leading-5 align-middle">
                          {devicesList.length > 0 ? (
                            <ul className="space-y-1.5">
                              {devicesList.map((d, dIdx) => (
                                <li key={dIdx} className="flex items-center gap-2 whitespace-nowrap">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-800 flex-shrink-0"></span>
                                  <span className="text-gray-800 font-normal">
                                    {d.deviceName}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        {/* 6. Bios Serial (Bulleted list) */}
                        <td className="py-3.5 px-4 text-gray-700 leading-5 align-middle">
                          {devicesList.length > 0 ? (
                            <ul className="space-y-1.5">
                              {devicesList.map((d, dIdx) => (
                                <li key={dIdx} className="flex items-center gap-2 whitespace-nowrap">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-800 flex-shrink-0"></span>
                                  <span className="text-gray-800 font-normal">
                                    {d.biosSerial}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        {/* 7. Product Key (Bulleted list) */}
                        <td className="py-3.5 px-4 text-gray-700 leading-5 align-middle">
                          {devicesList.length > 0 ? (
                            <ul className="space-y-1.5">
                              {devicesList.map((d, dIdx) => (
                                <li key={dIdx} className="flex items-center gap-2 whitespace-nowrap">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-800 flex-shrink-0"></span>
                                  <span className="text-gray-800 font-normal">
                                    {d.productKey}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        {/* 8. License Status */}
                        <td className="py-3.5 px-4 leading-5 align-middle">
                          <StatusBadge status={item.status} />
                        </td>

                        {/* 9. Action (Edit & Delete) */}
                        <td className="py-3.5 px-4 text-center leading-5 align-middle">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 border border-amber-300 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit License"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteId(item.id)}
                              className="p-1.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete License"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {paginatedLicenses.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-gray-400 text-sm">
                        No license data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-500">
            <div>
              Showing <span className="font-semibold text-gray-700">
                {totalEntries === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
              </span> to{' '}
              <span className="font-semibold text-gray-700">
                {Math.min(currentPage * itemsPerPage, totalEntries)}
              </span>{' '}
              of <span className="font-semibold text-gray-700">{totalEntries}</span>{' '}
              entries
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="w-7 h-7 flex items-center justify-center border border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold rounded-lg text-xs">
                  {currentPage}
                </span>
                <span>/ {totalPages}</span>

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <span>Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 border border-gray-200 rounded-lg bg-white text-gray-700 text-xs focus:outline-none"
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

      {/* Add / Edit License Modal */}
      <ModalPortal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4">
          {/* Modal Header */}
          <div className="flex items-start justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {editingLicense ? 'Edit License Management' : 'Add License Management'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                This field is for desc terms of service
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveLicense} className="space-y-4">
            {/* 1. Customer Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                Customer
              </label>
              <CustomDropdown
                value={formCustomer}
                onChange={handleCustomerChange}
                options={customerOptions}
                placeholder="Select Customer"
                buttonClassName="h-11 rounded-xl"
              />
            </div>

            {/* 2. Project Dropdown (options depend on selected customer) */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                Project
              </label>
              <CustomDropdown
                value={formProject}
                onChange={handleProjectChange}
                options={projectOptions}
                placeholder="Select Project"
                disabled={!formCustomer}
                noOptionsText={formCustomer ? 'No projects for this customer' : 'Please select customer first'}
                buttonClassName="h-11 rounded-xl"
              />
            </div>

            {/* 3. No. SPK (Readonly, auto-populated from project) */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                No. SPK
              </label>
              <input
                type="text"
                value={formNoSpk}
                readOnly
                placeholder="Select No. SPK"
                className="w-full h-11 px-3.5 bg-[#F9FAFB] border border-[#D0D5DD] rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none cursor-not-allowed select-none"
              />
            </div>

            {/* 4. Add More Section (Dynamic Devices & Product Keys) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">Add More</span>
                <button
                  type="button"
                  onClick={handleAddDeviceRow}
                  className="w-6 h-6 bg-[#00A854] hover:bg-[#008C45] text-white rounded flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                  title="Add more device"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Dynamic Rows with 16px gap (space-y-4) */}
              <div className="space-y-4 overflow-visible">
                {deviceRows.map((row, idx) => {
                  const availableForRow = getAvailableKeysForRow(row.productKey);

                  return (
                    <div key={row.id || idx}>
                      {/* Header labels only on first row */}
                      {idx === 0 && (
                        <div className="flex items-center gap-4 mb-1.5">
                          <div className="grid grid-cols-3 gap-4 flex-1">
                            <label className="text-sm font-semibold text-gray-900">
                              Product Key
                            </label>
                            <label className="text-sm font-semibold text-gray-900">
                              Device Name
                            </label>
                            <label className="text-sm font-semibold text-gray-900">
                              Bios Serial
                            </label>
                          </div>
                          {/* Spacer to align header with delete button column when more than 1 row */}
                          {deviceRows.length > 1 && <div className="w-11 flex-shrink-0" />}
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        <div className="grid grid-cols-3 gap-4 flex-1">
                          {/* Product Key Dropdown - opens downward */}
                          <div className="relative">
                            <CustomDropdown
                              value={row.productKey}
                              onChange={(val) =>
                                handleDeviceRowChange(idx, 'productKey', val)
                              }
                              options={availableForRow}
                              placeholder="Select Product Key"
                              noOptionsText="No available keys"
                              buttonClassName="h-11 rounded-xl text-xs"
                              placement="bottom"
                            />
                          </div>

                          {/* Device Name */}
                          <div>
                            <input
                              type="text"
                              value={row.deviceName}
                              onChange={(e) =>
                                handleDeviceRowChange(idx, 'deviceName', e.target.value)
                              }
                              placeholder="Input Device Name"
                              className="w-full h-11 px-3.5 bg-white border border-[#D0D5DD] rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00A854]"
                            />
                          </div>

                          {/* Bios Serial */}
                          <div>
                            <input
                              type="text"
                              value={row.biosSerial}
                              onChange={(e) =>
                                handleDeviceRowChange(idx, 'biosSerial', e.target.value)
                              }
                              placeholder="Input Bios Serial"
                              className="w-full h-11 px-3.5 bg-white border border-[#D0D5DD] rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00A854]"
                            />
                          </div>
                        </div>

                        {/* Delete row button - only shown when more than 1 row */}
                        {deviceRows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveDeviceRow(idx)}
                            className="w-11 h-11 flex-shrink-0 flex items-center justify-center border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete device row"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#00A854] hover:bg-[#008C45] text-white rounded-lg text-sm font-medium shadow-sm transition-colors cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </ModalPortal>

      {/* Delete Confirmation Modal */}
      <ModalPortal isOpen={!!deleteId} onClose={() => setDeleteId(null)}>
        <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
          <h3 className="text-base font-bold text-gray-900">Delete License?</h3>
          <p className="text-xs text-gray-500">
            Are you sure you want to delete this license entry? This action cannot be undone.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setDeleteId(null)}
              className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-6 py-2.5 bg-[#F04438] hover:bg-[#D92D20] text-white rounded-lg text-sm font-medium shadow-sm transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </ModalPortal>

      {/* Toast Alert */}
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
