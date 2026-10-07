import React, { useState, useEffect } from 'react';
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
import AntDateRangePicker from '../components/AntDateRangePicker';
import ModalPortal from '../components/ModalPortal';
import PageHeaderCard from '../components/PageHeaderCard';

export default function MasterDataCustomerPage({ customers = [], onUpdateCustomers }) {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState(null);

  // Add / Edit Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formCustomerName, setFormCustomerName] = useState('');
  const [formProjects, setFormProjects] = useState([{ id: 1, name: '', noSpk: '' }]);

  // Delete State
  const [deleteId, setDeleteId] = useState(null);

  // Pagination & Sorting State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('no');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
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

  // Filter customers by Search and DateRange
  const filteredCustomers = customers.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;

    const matchCustomer = item.customer?.toLowerCase().includes(q);
    const matchProject = item.projects?.some((p) =>
      (typeof p === 'object' ? p.name : p)?.toLowerCase().includes(q)
    );
    const matchSpk = item.projects?.some((p) =>
      (typeof p === 'object' ? p.noSpk : '')?.toLowerCase().includes(q)
    );

    return matchCustomer || matchProject || matchSpk;
  });

  // Sort filtered customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let aVal = '';
    let bVal = '';

    if (sortField === 'customer') {
      aVal = a.customer || '';
      bVal = b.customer || '';
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    } else if (sortField === 'datetime') {
      aVal = a.datetime || '';
      bVal = b.datetime || '';
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return 0;
  });

  const totalEntries = sortedCustomers.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage) || 1;
  const paginatedCustomers = sortedCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormCustomerName('');
    setFormProjects([{ id: Date.now(), name: '', noSpk: '' }]);
    setShowAddModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingCustomer(item);
    setFormCustomerName(item.customer || '');
    if (item.projects && item.projects.length > 0) {
      setFormProjects(
        item.projects.map((p, idx) => ({
          id: p.id || Date.now() + idx,
          name: typeof p === 'object' ? p.name : p,
          noSpk: typeof p === 'object' ? p.noSpk || '' : ''
        }))
      );
    } else {
      setFormProjects([{ id: Date.now(), name: '', noSpk: '' }]);
    }
    setShowAddModal(true);
  };

  const handleAddProjectRow = () => {
    setFormProjects((prev) => [...prev, { id: Date.now(), name: '', noSpk: '' }]);
  };

  const handleRemoveProjectRow = (index) => {
    if (formProjects.length > 1) {
      setFormProjects((prev) => prev.filter((_, i) => i !== index));
    } else {
      setFormProjects([{ id: Date.now(), name: '', noSpk: '' }]);
    }
  };

  const handleProjectChange = (index, field, value) => {
    setFormProjects((prev) =>
      prev.map((proj, i) => (i === index ? { ...proj, [field]: value } : proj))
    );
  };

  const handleSaveCustomer = (e) => {
    e.preventDefault();
    if (!formCustomerName.trim()) {
      setToast({ type: 'error', title: 'Error', message: 'Customer name is required.' });
      return;
    }

    // Filter valid project rows (at least project name or SPK filled)
    const validProjects = formProjects
      .filter((p) => p.name.trim() || p.noSpk.trim())
      .map((p, idx) => ({
        id: p.id || idx + 1,
        name: p.name.trim(),
        noSpk: p.noSpk.trim()
      }));

    if (validProjects.length === 0) {
      setToast({
        type: 'error',
        title: 'Error',
        message: 'At least one Project & No. SPK is required.'
      });
      return;
    }

    if (editingCustomer) {
      const updated = customers.map((item) =>
        item.id === editingCustomer.id
          ? {
              ...item,
              customer: formCustomerName.trim(),
              projects: validProjects
            }
          : item
      );
      onUpdateCustomers(updated);
      setToast({
        type: 'success',
        title: 'Berhasil Diperbarui',
        message: `Data pelanggan ${formCustomerName} berhasil diperbarui.`
      });
    } else {
      const newCustomer = {
        id: Date.now(),
        customer: formCustomerName.trim(),
        projects: validProjects,
        datetime: new Date().toLocaleDateString('en-GB') + ' 12:00'
      };
      onUpdateCustomers([newCustomer, ...customers]);
      setToast({
        type: 'success',
        title: 'Berhasil Ditambahkan',
        message: `Pelanggan baru ${formCustomerName} berhasil ditambahkan.`
      });
    }

    setShowAddModal(false);
    setEditingCustomer(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      onUpdateCustomers(customers.filter((item) => item.id !== deleteId));
      setToast({
        type: 'success',
        title: 'Berhasil Dihapus',
        message: 'Data pelanggan berhasil dihapus.'
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
        <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 shadow-sm space-y-5">
          {/* Filters & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
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
            <SkeletonTable rows={5} cols={6} />
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
                    <th className="py-3.5 px-4 min-w-[200px]">
                      <div className="flex items-center gap-1.5 cursor-pointer select-none">
                        <span>Project</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 min-w-[200px]">
                      <div className="flex items-center gap-1.5 cursor-pointer select-none">
                        <span>No. SPK</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 w-48">
                      <div
                        className="flex items-center gap-1.5 cursor-pointer select-none"
                        onClick={() => handleSort('datetime')}
                      >
                        <span>Datetime</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 text-center w-28">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E7EC] bg-white">
                  {paginatedCustomers.map((item, index) => {
                    const rowProjects = item.projects || [];

                    return (
                      <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                        {/* No */}
                        <td className="py-3.5 px-4 text-gray-600 font-medium leading-5 align-middle">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>

                        {/* Customer */}
                        <td className="py-3.5 px-4 text-gray-800 font-semibold leading-5 align-middle">
                          {item.customer}
                        </td>

                        {/* Project (Bullet list) */}
                        <td className="py-3.5 px-4 text-gray-700 leading-5 align-middle">
                          {rowProjects.length > 0 ? (
                            <ul className="space-y-1.5">
                              {rowProjects.map((p, pIdx) => (
                                <li key={pIdx} className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-800 flex-shrink-0"></span>
                                  <span className="text-gray-800 font-normal">
                                    {typeof p === 'object' ? p.name : p}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        {/* No. SPK (Bullet list corresponding to projects) */}
                        <td className="py-3.5 px-4 text-gray-700 leading-5 align-middle">
                          {rowProjects.length > 0 ? (
                            <ul className="space-y-1.5">
                              {rowProjects.map((p, pIdx) => (
                                <li key={pIdx} className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-800 flex-shrink-0"></span>
                                  <span className="text-gray-800 font-normal">
                                    {typeof p === 'object' ? p.noSpk : '-'}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        {/* Datetime */}
                        <td className="py-3.5 px-4 text-gray-600 leading-5 align-middle">
                          {item.datetime}
                        </td>

                        {/* Action buttons */}
                        <td className="py-3.5 px-4 text-center leading-5 align-middle">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 border border-amber-300 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Customer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteId(item.id)}
                              className="p-1.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Customer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {paginatedCustomers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400 text-sm">
                        No customer data found.
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

      {/* Add / Edit Customer Modal (Matching Image 1) */}
      <ModalPortal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
          {/* Modal Header */}
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
              className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveCustomer} className="space-y-4">
            {/* Customer Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                Customer
              </label>
              <input
                type="text"
                value={formCustomerName}
                onChange={(e) => setFormCustomerName(e.target.value)}
                placeholder="Input Customer"
                className="w-full h-11 px-3.5 bg-white border border-[#D0D5DD] rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00A854]"
                required
              />
            </div>

            {/* Add More Section (Projects & No. SPK) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">Add More</span>
                <button
                  type="button"
                  onClick={handleAddProjectRow}
                  className="w-6 h-6 bg-[#00A854] hover:bg-[#008C45] text-white rounded flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                  title="Add more project"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-4 overflow-visible">
                {formProjects.map((proj, idx) => (
                  <div key={proj.id || idx}>
                    {/* Header labels only on first row */}
                    {idx === 0 && (
                      <div className="flex items-center gap-4 mb-1.5">
                        <div className="grid grid-cols-2 gap-4 flex-1">
                          <label className="text-sm font-semibold text-gray-900">Project</label>
                          <label className="text-sm font-semibold text-gray-900">No. SPK</label>
                        </div>
                        {/* Spacer to align with delete button when more than 1 row */}
                        {formProjects.length > 1 && <div className="w-11 flex-shrink-0" />}
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <div className="grid grid-cols-2 gap-4 flex-1">
                        <input
                          type="text"
                          value={proj.name}
                          onChange={(e) => handleProjectChange(idx, 'name', e.target.value)}
                          placeholder="Input Project"
                          className="w-full h-11 px-3.5 bg-white border border-[#D0D5DD] rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00A854]"
                        />
                        <input
                          type="text"
                          value={proj.noSpk}
                          onChange={(e) => handleProjectChange(idx, 'noSpk', e.target.value)}
                          placeholder="Input No. SPK"
                          className="w-full h-11 px-3.5 bg-white border border-[#D0D5DD] rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00A854]"
                        />
                      </div>
                      {/* Delete button - only shown when more than 1 row (appears on all rows including field 1) */}
                      {formProjects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveProjectRow(idx)}
                          className="w-11 h-11 flex-shrink-0 flex items-center justify-center border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
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
          <h3 className="text-base font-bold text-gray-900">Delete Customer?</h3>
          <p className="text-xs text-gray-500">
            Are you sure you want to delete this customer? This action cannot be undone.
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
