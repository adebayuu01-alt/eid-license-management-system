import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';
import SkeletonTable from '../components/SkeletonTable';
import Toast from '../components/Toast';
import AntDateRangePicker from '../components/AntDateRangePicker';
import ModalPortal from '../components/ModalPortal';
import PageHeaderCard from '../components/PageHeaderCard';

export default function MasterDataCustomerPage({ customers = [], onUpdateCustomers }) {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState(null);

  // Modal 1: Add / Edit Customer
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formCustomer, setFormCustomer] = useState('');
  const [formProject, setFormProject] = useState('');
  const [formNoSpk, setFormNoSpk] = useState('');

  // Modal 2: Generated Public Key Modal
  const [showPublicKeyModal, setShowPublicKeyModal] = useState(false);
  const [generatedPublicKey, setGeneratedPublicKey] = useState('');
  const [pendingCustomerData, setPendingCustomerData] = useState(null);
  const [hasCopied, setHasCopied] = useState(false);

  // Modal 3: Delete Confirmation
  const [deleteId, setDeleteId] = useState(null);

  // Pagination & Sorting State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('no');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
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

  // Helper to generate realistic Public Key based on customer, project, spk
  const createPublicKey = (customerName, projectName, spkNo) => {
    // Encoded format matching Image 3: Q1VTVE9NRVI6IFBULiBBc3RlbW8gQmVrYXNpIE1hbnVmYWN0dXJl...
    try {
      const line1 = `CUSTOMER: ${customerName}`;
      const line2 = `PROJECT: ${projectName} PK: ${spkNo}`;
      const b64_1 = btoa(line1);
      const b64_2 = btoa(line2);
      return `${b64_1}\n${b64_2}`;
    } catch (e) {
      return `Q1VTVE9NRVI6IFBULiBBc3RlbW8gQmVrYXNpIE1hbnVmYWN0dXJl\nUFJPSkVLVDoUgTGluZSBNb25pdG9yaW5nIFBLOiBBQk0tTE0tMjAyNi0wMQ==`;
    }
  };

  // Normalize customer records to flat rows (handling both new flat schema & legacy projects array)
  const normalizedCustomers = useMemo(() => {
    const list = [];
    customers.forEach((item) => {
      if (item.projects && Array.isArray(item.projects) && item.projects.length > 0) {
        // Expand or take first project
        item.projects.forEach((p, pIdx) => {
          list.push({
            id: `${item.id}-${p.id || pIdx}`,
            originalId: item.id,
            customer: item.customer,
            project: typeof p === 'object' ? p.name : p,
            noSpk: typeof p === 'object' ? p.noSpk : '',
            publicKey:
              item.publicKey ||
              createPublicKey(item.customer, typeof p === 'object' ? p.name : p, typeof p === 'object' ? p.noSpk : ''),
            datetime: item.datetime || '06/09/2026 12:00'
          });
        });
      } else {
        list.push({
          id: item.id,
          originalId: item.id,
          customer: item.customer,
          project: item.project || 'Line Monitoring',
          noSpk: item.noSpk || 'ABM-LM-2026-01',
          publicKey:
            item.publicKey ||
            createPublicKey(item.customer, item.project || 'Line Monitoring', item.noSpk || 'ABM-LM-2026-01'),
          datetime: item.datetime || '06/09/2026 12:00'
        });
      }
    });
    return list;
  }, [customers]);

  // Filter customers by Search and DateRange
  const filteredCustomers = useMemo(() => {
    return normalizedCustomers.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchCustomer = item.customer?.toLowerCase().includes(q);
        const matchProject = item.project?.toLowerCase().includes(q);
        const matchSpk = item.noSpk?.toLowerCase().includes(q);
        const matchKey = item.publicKey?.toLowerCase().includes(q);
        if (!matchCustomer && !matchProject && !matchSpk && !matchKey) {
          return false;
        }
      }

      // Date Range Filter
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
  }, [normalizedCustomers, searchQuery, dateRange]);

  // Sort filtered customers
  const sortedCustomers = useMemo(() => {
    return [...filteredCustomers].sort((a, b) => {
      let aVal = a[sortField] || '';
      let bVal = b[sortField] || '';

      if (sortField === 'no') {
        return sortOrder === 'asc' ? Number(a.id) - Number(b.id) : Number(b.id) - Number(a.id);
      }

      if (typeof aVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
    });
  }, [filteredCustomers, sortField, sortOrder]);

  const totalEntries = sortedCustomers.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage) || 1;
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedCustomers.slice(start, start + itemsPerPage);
  }, [sortedCustomers, currentPage, itemsPerPage]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormCustomer('');
    setFormProject('');
    setFormNoSpk('');
    setShowAddModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setEditingCustomer(item);
    setFormCustomer(item.customer || '');
    setFormProject(item.project || '');
    setFormNoSpk(item.noSpk || '');
    setShowAddModal(true);
  };

  // Handle Submit on Add Customer Modal (triggers Public Key generation)
  const handleSubmitCustomer = (e) => {
    e.preventDefault();
    if (!formCustomer.trim()) {
      setToast({ type: 'error', title: 'Error', message: 'Customer name is required.' });
      return;
    }
    if (!formProject.trim()) {
      setToast({ type: 'error', title: 'Error', message: 'Project is required.' });
      return;
    }
    if (!formNoSpk.trim()) {
      setToast({ type: 'error', title: 'Error', message: 'No. SPK is required.' });
      return;
    }

    // Generate Public Key
    const generatedKey = createPublicKey(formCustomer.trim(), formProject.trim(), formNoSpk.trim());
    setGeneratedPublicKey(generatedKey);

    if (editingCustomer) {
      // Update existing customer
      const updated = customers.map((c) => {
        if (
          c.id === editingCustomer.originalId ||
          c.id === editingCustomer.id ||
          String(c.id) === String(editingCustomer.originalId) ||
          String(c.id) === String(editingCustomer.id)
        ) {
          return {
            ...c,
            customer: formCustomer.trim(),
            project: formProject.trim(),
            noSpk: formNoSpk.trim(),
            publicKey: generatedKey,
            datetime: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
          };
        }
        return c;
      });
      onUpdateCustomers(updated);
      setToast({
        type: 'success',
        title: 'Berhasil Diperbarui',
        message: `Data pelanggan ${formCustomer.trim()} berhasil diperbarui dengan Public Key baru.`
      });
    } else {
      // Add new customer
      const newCustomer = {
        id: Date.now(),
        customer: formCustomer.trim(),
        project: formProject.trim(),
        noSpk: formNoSpk.trim(),
        publicKey: generatedKey,
        datetime: new Date().toLocaleDateString('en-GB') + ' 12:00'
      };
      onUpdateCustomers([newCustomer, ...customers]);
      setToast({
        type: 'success',
        title: 'Berhasil Ditambahkan',
        message: `Customer ${formCustomer.trim()} berhasil ditambahkan dengan Public Key!`
      });
    }

    // Close Add Modal, Open Public Key Modal (which only has close X button)
    setShowAddModal(false);
    setHasCopied(false);
    setShowPublicKeyModal(true);
    setEditingCustomer(null);
  };

  // Copy to clipboard helper
  const handleCopyPublicKey = (keyText) => {
    if (!keyText) return;
    navigator.clipboard.writeText(keyText);
    setHasCopied(true);
    setToast({
      type: 'success',
      title: 'Disalin!',
      message: 'Public Key berhasil disalin ke clipboard.'
    });
    setTimeout(() => setHasCopied(false), 2000);
  };

  // Handle Delete
  const handleDeleteConfirm = () => {
    if (deleteId) {
      onUpdateCustomers(
        customers.filter((c) => c.id !== deleteId && `${c.id}` !== `${deleteId}`)
      );
      setToast({
        type: 'success',
        title: 'Berhasil Dihapus',
        message: 'Data customer berhasil dihapus.'
      });
      setDeleteId(null);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header Card */}
        <PageHeaderCard
          title="Customer"
          subtitle="List customer data"
        />

        {/* Table Card */}
        <div className="bg-white rounded-xl border border-[#E4E7EC] p-5 shadow-sm space-y-4">
          {/* Filters & Actions - Matching Image 4 */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search Input with Clear X */}
            <div className="relative w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search"
                className="w-full h-[38px] pl-10 pr-9 border border-[#D0D5DD] rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-[#00A854]"
              />
              {searchQuery ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                  ✕
                </span>
              )}
            </div>

            {/* Right: Date Range Picker & Add Data Button */}
            <div className="flex items-center gap-3">
              {/* Ant Design DateRangePicker */}
              <AntDateRangePicker
                value={dateRange}
                onChange={(dates) => {
                  setDateRange(dates);
                  setCurrentPage(1);
                }}
              />

              {/* + Add Data Button */}
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-2 h-[38px] px-4 bg-[#00A854] hover:bg-[#008C45] text-white rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Add Data</span>
              </button>
            </div>
          </div>

          {/* Table View - Matching Image 4 */}
          {loading ? (
            <SkeletonTable rows={6} cols={6} />
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

                    {/* 5. Public Key */}
                    <th className="py-3.5 px-4 min-w-[280px] whitespace-nowrap">
                      <div
                        className="flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap"
                        onClick={() => handleSort('publicKey')}
                      >
                        <span className="whitespace-nowrap">Public Key</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                      </div>
                    </th>

                    {/* 6. Action */}
                    <th className="py-3.5 px-4 text-center w-28 whitespace-nowrap">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E4E7EC] bg-white">
                  {paginatedCustomers.map((item, index) => {
                    const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                    const truncatedKey =
                      (item.publicKey || '').replace(/\n/g, ' ').slice(0, 26) + '...';

                    return (
                      <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                        {/* 1. No */}
                        <td className="py-3.5 px-4 text-gray-600 font-medium leading-5 align-middle">
                          {rowNumber}
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

                        {/* 5. Public Key (Truncated text + Copy Icon) */}
                        <td className="py-3.5 px-4 leading-5 align-middle">
                          <div className="flex items-center gap-2">
                            <span
                              className="font-mono text-xs text-gray-700 select-all truncate max-w-[220px]"
                              title={item.publicKey}
                            >
                              {truncatedKey}
                            </span>
                            <button
                              onClick={() => handleCopyPublicKey(item.publicKey)}
                              className="p-1 text-gray-500 hover:text-[#00A854] hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                              title="Salin Public Key"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                        {/* 6. Action buttons (Edit & Delete) */}
                        <td className="py-3.5 px-4 text-center leading-5 align-middle">
                          <div className="flex items-center justify-center gap-2">
                            {/* Edit Button (Yellow outline) */}
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="w-7 h-7 flex items-center justify-center border border-[#FADB14] bg-[#FFFBE6] hover:bg-[#FFF1B8] text-[#D48806] rounded transition-colors cursor-pointer"
                              title="Edit Customer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Button (Red outline) */}
                            <button
                              onClick={() => setDeleteId(item.originalId || item.id)}
                              className="w-7 h-7 flex items-center justify-center border border-[#FFA39E] bg-[#FFF1F0] hover:bg-[#FFCCC7] text-[#FF4D4F] rounded transition-colors cursor-pointer"
                              title="Hapus Customer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {paginatedCustomers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-gray-400 text-sm">
                        No customer data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
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

      {/* MODAL 1: Add Customer (Images 1 & 2) */}
      <ModalPortal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {editingCustomer ? 'Edit Customer' : 'Add Customer'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                This field is for desc terms of service
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmitCustomer} className="space-y-4">
            {/* Field 1: Customer (Full width) */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                Customer
              </label>
              <input
                type="text"
                value={formCustomer}
                onChange={(e) => setFormCustomer(e.target.value)}
                placeholder="Input Customer"
                className="w-full h-10 px-3 border border-[#D0D5DD] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00A854]"
              />
            </div>

            {/* Row 2: Project & No. SPK (Grid 2 columns) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                  Project
                </label>
                <input
                  type="text"
                  value={formProject}
                  onChange={(e) => setFormProject(e.target.value)}
                  placeholder="Input Project"
                  className="w-full h-10 px-3 border border-[#D0D5DD] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00A854]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                  No. SPK
                </label>
                <input
                  type="text"
                  value={formNoSpk}
                  onChange={(e) => setFormNoSpk(e.target.value)}
                  placeholder="Input No. SPK"
                  className="w-full h-10 px-3 border border-[#D0D5DD] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00A854]"
                />
              </div>
            </div>

            {/* Action Buttons (Cancel & Submit) - Right aligned matching screenshot */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="min-w-[105px] h-[38px] px-6 py-2 border border-[#667085] bg-white text-[#475467] hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-w-[105px] h-[38px] px-7 py-2 bg-[#00A854] hover:bg-[#008C45] text-white rounded-lg text-sm font-semibold transition-colors shadow-sm cursor-pointer"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </ModalPortal>

      {/* MODAL 2: Public Key (Image 3) */}
      <ModalPortal isOpen={showPublicKeyModal} onClose={() => setShowPublicKeyModal(false)}>
        <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">Public Key</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                This field is for desc terms of service
              </p>
            </div>
            <button
              onClick={() => setShowPublicKeyModal(false)}
              className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Public Key Display Box */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-900">
              Public Key
            </label>
            <div className="relative border border-[#D0D5DD] rounded-lg p-3 bg-white">
              <textarea
                readOnly
                value={generatedPublicKey}
                rows={3}
                className="w-full text-xs font-mono text-gray-800 bg-transparent resize-none border-none focus:outline-none pr-8 select-all leading-relaxed"
              />
              <button
                onClick={() => handleCopyPublicKey(generatedPublicKey)}
                className="absolute top-2.5 right-2.5 p-1 text-gray-400 hover:text-[#00A854] rounded transition-colors cursor-pointer"
                title="Salin Public Key"
              >
                {hasCopied ? (
                  <Check className="w-4 h-4 text-[#00A854]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

        </div>
      </ModalPortal>

      {/* MODAL 3: Delete Confirmation */}
      <ModalPortal isOpen={!!deleteId} onClose={() => setDeleteId(null)}>
        <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <h3 className="text-base font-bold text-gray-900">Hapus Data Customer</h3>
          </div>
          <p className="text-sm text-gray-600">
            Apakah Anda yakin ingin menghapus data customer ini?
          </p>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setDeleteId(null)}
              className="px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              Hapus
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
