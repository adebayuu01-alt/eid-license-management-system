import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Copy,
  Check
} from 'lucide-react';
import SkeletonTable from '../components/SkeletonTable';
import Toast from '../components/Toast';
import CustomDropdown from '../components/CustomDropdown';
import StatusBadge from '../components/StatusBadge';
import AntDateRangePicker from '../components/AntDateRangePicker';
import ModalPortal from '../components/ModalPortal';
import PageHeaderCard from '../components/PageHeaderCard';

export default function LicenseManagementPage({
  licenses,
  onUpdateLicenses,
  customers = [],
  productKeys = [],
  onUpdateProductKeys
}) {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState(null);

  // Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [formProductKey, setFormProductKey] = useState('');
  const [formCustomer, setFormCustomer] = useState('');
  const [formDeviceName, setFormDeviceName] = useState('');
  const [formBiosSerial, setFormBiosSerial] = useState('');

  // Delete State
  const [deleteId, setDeleteId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [toast, setToast] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Filter options from props:
  // For Product Key, only show product keys that have status 'Available' (Requirement 2)
  const availableProductKeys = productKeys.filter((p) => {
    if (typeof p === 'object' && p !== null) {
      return (p.status || '').toLowerCase() === 'available';
    }
    return true;
  });
  const customerOptions = customers.map((c) => (typeof c === 'object' ? c.customer : c));
  const productKeyOptions = availableProductKeys.map((p) =>
    typeof p === 'object' ? p.productKey : p
  );

  const filteredLicenses = licenses.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.productKey.toLowerCase().includes(q) ||
      item.customer.toLowerCase().includes(q) ||
      item.deviceName.toLowerCase().includes(q) ||
      item.biosSerial.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q)
    );
  });

  const totalEntries = filteredLicenses.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage) || 1;
  const paginatedLicenses = filteredLicenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAdd = () => {
    // Ensure all form inputs have no data by default
    setFormProductKey('');
    setFormCustomer('');
    setFormDeviceName('');
    setFormBiosSerial('');
    setShowAddModal(true);
  };

  const handleSaveLicense = (e) => {
    e.preventDefault();
    if (!formProductKey) {
      setToast({ type: 'error', title: 'Error', message: 'Please select a Product Key.' });
      return;
    }
    if (!formCustomer) {
      setToast({ type: 'error', title: 'Error', message: 'Please select a Customer.' });
      return;
    }
    if (!formDeviceName.trim()) {
      setToast({ type: 'error', title: 'Error', message: 'Device Name is required.' });
      return;
    }
    if (!formBiosSerial.trim()) {
      setToast({ type: 'error', title: 'Error', message: 'Device Bios Serial is required.' });
      return;
    }

    const newLicense = {
      id: Date.now(),
      productKey: formProductKey,
      customer: formCustomer,
      deviceName: formDeviceName.trim(),
      biosSerial: formBiosSerial.trim(),
      status: 'Activated',
      datetime: new Date().toLocaleDateString('en-GB') + ' 12:00'
    };
    onUpdateLicenses([newLicense, ...licenses]);

    // Update the product key's status to 'Activated' in productKeys state
    if (onUpdateProductKeys) {
      onUpdateProductKeys(
        productKeys.map((pk) =>
          (typeof pk === 'object' ? pk.productKey : pk) === formProductKey
            ? typeof pk === 'object'
              ? { ...pk, status: 'Activated' }
              : pk
            : pk
        )
      );
    }

    setToast({
      type: 'success',
      title: 'Berhasil Ditambahkan',
      message: `Lisensi ${formProductKey} berhasil ditambahkan ke sistem.`
    });

    setShowAddModal(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      const targetLicense = licenses.find((item) => item.id === deleteId);
      onUpdateLicenses(licenses.filter((item) => item.id !== deleteId));

      // Revert the product key's status to 'Available' in productKeys state
      if (targetLicense && onUpdateProductKeys) {
        onUpdateProductKeys(
          productKeys.map((pk) =>
            (typeof pk === 'object' ? pk.productKey : pk) === targetLicense.productKey
              ? typeof pk === 'object'
                ? { ...pk, status: 'Available' }
                : pk
              : pk
          )
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

  const handleCopyKey = (key) => {
    navigator.clipboard?.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
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
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full pl-10 pr-9 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Ant Design DateRangePicker */}
              <AntDateRangePicker
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
              />

              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-2 px-4 py-2 bg-[#00A854] hover:bg-[#008C45] text-white rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Data</span>
              </button>
            </div>
          </div>

          {/* Table / Skeleton */}
          {loading ? (
            <SkeletonTable rows={5} cols={7} />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-[#D0D5DD]">
              <table className="w-full text-left border-collapse text-sm font-sans">
                <thead className="bg-[#F2F2F7] border-b border-[#D0D5DD]">
                  <tr className="text-[#23262B] font-semibold">
                    <th className="py-3.5 px-4 w-16">
                      <div className="flex items-center gap-1.5 cursor-pointer select-none">
                        <span>No</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 cursor-pointer select-none">
                        <span>Product Key</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 cursor-pointer select-none">
                        <span>Customer</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 cursor-pointer select-none">
                        <span>Device Name</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 cursor-pointer select-none">
                        <span>Device Bios Serial</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 cursor-pointer select-none">
                        <span>License Status</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E7EC] bg-white">
                  {paginatedLicenses.map((item, index) => {
                    const isActivated = item.status === 'Activated';
                    return (
                      <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-4 text-gray-600 font-medium leading-5">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="py-3.5 px-4 text-gray-800 font-medium text-xs leading-5">
                          <div className="flex items-center gap-2">
                            <span>{item.productKey}</span>
                            <button
                              onClick={() => handleCopyKey(item.productKey)}
                              className="text-gray-400 hover:text-gray-600"
                              title="Copy Product Key"
                            >
                              {copiedKey === item.productKey ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-gray-700 font-medium leading-5">
                          {item.customer}
                        </td>
                        <td className="py-3.5 px-4 text-gray-800 font-medium leading-5">
                          {item.deviceName}
                        </td>
                        <td className="py-3.5 px-4 text-gray-600 text-xs leading-5">
                          {item.biosSerial}
                        </td>
                        <td className="py-3.5 px-4 leading-5">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="py-3.5 px-4 text-center leading-5">
                          <div className="flex items-center justify-center">
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
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-500">
            <div>
              Showing <span className="font-semibold text-gray-700">1</span> to{' '}
              <span className="font-semibold text-gray-700">
                {Math.min(itemsPerPage, totalEntries)}
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

      {/* Add License Modal */}
      <ModalPortal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
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
              onClick={() => setShowAddModal(false)}
              className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveLicense} className="space-y-4">
            {/* Product Key */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-gray-900">
                  Product Key
                </label>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {productKeyOptions.length} Available
                </span>
              </div>
              <CustomDropdown
                value={formProductKey}
                onChange={(val) => setFormProductKey(val)}
                options={productKeyOptions}
                placeholder="Select Product Key"
                noOptionsText="No available product keys"
                buttonClassName="h-11 rounded-xl"
              />
              {productKeyOptions.length === 0 && (
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <span>⚠️ No available product keys. Please generate a new product key in the Product Key menu first.</span>
                </p>
              )}
            </div>

            {/* Customer */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                Customer
              </label>
              <CustomDropdown
                value={formCustomer}
                onChange={(val) => setFormCustomer(val)}
                options={customerOptions}
                placeholder="Select Customer"
                buttonClassName="h-11 rounded-xl"
              />
            </div>

            {/* Device Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                Device Name
              </label>
              <input
                type="text"
                value={formDeviceName}
                onChange={(e) => setFormDeviceName(e.target.value)}
                placeholder="Input Device Name"
                className="w-full h-11 px-3.5 bg-white border border-[#D0D5DD] rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00A854]"
              />
            </div>

            {/* Device Bios Serial */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                Device Bios Serial
              </label>
              <input
                type="text"
                value={formBiosSerial}
                onChange={(e) => setFormBiosSerial(e.target.value)}
                placeholder="Input Device Bios Serial"
                className="w-full h-11 px-3.5 bg-white border border-[#D0D5DD] rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00A854]"
              />
            </div>

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
