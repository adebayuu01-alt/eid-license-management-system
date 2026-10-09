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
import StatusBadge from '../components/StatusBadge';
import AntDateRangePicker from '../components/AntDateRangePicker';
import ModalPortal from '../components/ModalPortal';
import PageHeaderCard from '../components/PageHeaderCard';

export default function ProductKeyPage({ productKeys, onUpdateProductKeys }) {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState(null);

  // Add Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [formProductKey, setFormProductKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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

  const filteredKeys = productKeys.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.productKey.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q)
    );
  });

  const totalEntries = filteredKeys.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage) || 1;
  const paginatedKeys = filteredKeys.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleGenerateKey = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setTimeout(() => {
      const nextIndex = productKeys.length + 1;
      const nextKey = `EIREN-PRDCT-KEY-${nextIndex}`;
      setFormProductKey(nextKey);
      setIsGenerating(false);
    }, 700);
  };

  const handleOpenAdd = () => {
    setFormProductKey('');
    setIsGenerating(false);
    setShowAddModal(true);
  };

  const handleSaveProductKey = (e) => {
    e.preventDefault();
    if (!formProductKey.trim()) {
      setToast({ type: 'error', title: 'Error', message: 'Product Key is required.' });
      return;
    }

    const newKey = {
      id: Date.now(),
      productKey: formProductKey.trim(),
      status: 'Available',
      datetime: new Date().toLocaleDateString('en-GB') + ' 12:00'
    };
    onUpdateProductKeys([...productKeys, newKey]);
    setToast({
      type: 'success',
      title: 'Berhasil Ditambahkan',
      message: `Product Key ${formProductKey} berhasil ditambahkan ke sistem.`
    });

    setShowAddModal(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      onUpdateProductKeys(productKeys.filter((item) => item.id !== deleteId));
      setToast({
        type: 'success',
        title: 'Berhasil Dihapus',
        message: 'Product Key berhasil dihapus.'
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
          title="Product Key"
          subtitle="List product key data"
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
                <span>Add Product Key</span>
              </button>
            </div>
          </div>

          {/* Table / Skeleton */}
          {loading ? (
            <SkeletonTable rows={5} cols={5} />
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
                        <span>Status</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 cursor-pointer select-none">
                        <span>Datetime</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E7EC] bg-white">
                  {paginatedKeys.map((item, index) => {
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
                              className="text-gray-400 hover:text-gray-600 p-0.5"
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
                        <td className="py-3.5 px-4 leading-5">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="py-3.5 px-4 text-gray-600 leading-5">
                          {item.datetime}
                        </td>
                        <td className="py-3.5 px-4 text-center leading-5">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => setDeleteId(item.id)}
                              className="p-1.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Product Key"
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

      {/* Add Product Key Modal */}
      <ModalPortal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
          <div className="flex items-start justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Add Product Key
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

          <form onSubmit={handleSaveProductKey} className="space-y-4">
            {/* Product Key with side-by-side Generator */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                Product Key
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formProductKey}
                  onChange={(e) => setFormProductKey(e.target.value)}
                  placeholder="XXXXXX-XXXXX-XXX-XX"
                  className="flex-1 h-11 px-3.5 bg-white border border-[#D0D5DD] rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00A854]"
                />
                <button
                  type="button"
                  onClick={handleGenerateKey}
                  disabled={isGenerating}
                  className="h-11 px-4 bg-[#00A854] hover:bg-[#008C45] text-white rounded-xl text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-75 flex-shrink-0"
                >
                  <RotateCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>Generate</span>
                </button>
              </div>
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
          <h3 className="text-base font-bold text-gray-900">Delete Product Key?</h3>
          <p className="text-xs text-gray-500">
            Are you sure you want to delete this product key? This action cannot be undone.
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
