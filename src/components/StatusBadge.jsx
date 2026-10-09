import React from 'react';

/**
 * StatusBadge component:
 * Menampilkan badge status lisensi (hanya 2 status):
 * - Available (Green): bg #E6F8EF, border #34C582, text #01A75A
 * - Activated (Blue): bg #E9F5FF, border #52ADFF, text #238AE8
 */
export default function StatusBadge({ status, className = '' }) {
  if (!status) return null;

  const isAvailable = String(status).trim().toLowerCase() === 'available';

  if (isAvailable) {
    return (
      <span
        className={`inline-flex items-center justify-center px-3 py-0.5 rounded-[6px] text-xs sm:text-[13px] font-bold bg-[#E6F8EF] text-[#01A75A] border border-[#34C582] select-none ${className}`}
      >
        Available
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-0.5 rounded-[6px] text-xs sm:text-[13px] font-bold bg-[#E9F5FF] text-[#238AE8] border border-[#52ADFF] select-none ${className}`}
    >
      Activated
    </span>
  );
}

