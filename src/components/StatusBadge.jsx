import React from 'react';

/**
 * StatusBadge component:
 * Menggunakan gaya layout/bentuk sebelumnya (px-3 py-0.5 rounded-[6px] text-xs sm:text-[13px] font-bold border)
 * dengan skema warna yang disesuaikan dari CSS Figma:
 * - Green (Available / Active): bg #E6F8EF, border #34C582, text #01A75A
 * - Blue (Activated / Info): bg #E9F5FF, border #52ADFF, text #238AE8
 * - Red (Duplicated / Expired): bg #FEF3F2, border #F97066, text #F04438
 */
export default function StatusBadge({ status, className = '' }) {
  if (!status) return null;

  const normalized = String(status).trim();
  const lower = normalized.toLowerCase();

  // Blue Badge (Activated, Info, Pending)
  if (lower === 'activated' || lower === 'info' || lower === 'pending') {
    return (
      <span
        className={`inline-flex items-center justify-center px-3 py-0.5 rounded-[6px] text-xs sm:text-[13px] font-bold bg-[#E9F5FF] text-[#238AE8] border border-[#52ADFF] select-none ${className}`}
      >
        {normalized}
      </span>
    );
  }

  // Red Badge (Duplicated, Expired, Revoked, Inactive, Error)
  if (
    lower === 'duplicated' ||
    lower === 'expired' ||
    lower === 'revoked' ||
    lower === 'inactive' ||
    lower === 'error'
  ) {
    return (
      <span
        className={`inline-flex items-center justify-center px-3 py-0.5 rounded-[6px] text-xs sm:text-[13px] font-bold bg-[#FEF3F2] text-[#F04438] border border-[#F97066] select-none ${className}`}
      >
        {normalized}
      </span>
    );
  }

  // Green Badge (Available, Active, Success)
  if (lower === 'available' || lower === 'active' || lower === 'success') {
    return (
      <span
        className={`inline-flex items-center justify-center px-3 py-0.5 rounded-[6px] text-xs sm:text-[13px] font-bold bg-[#E6F8EF] text-[#01A75A] border border-[#34C582] select-none ${className}`}
      >
        {normalized}
      </span>
    );
  }

  // Fallback for custom badges
  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-0.5 rounded-[6px] text-xs sm:text-[13px] font-bold bg-gray-50 text-gray-700 border border-gray-300 select-none ${className}`}
    >
      {status}
    </span>
  );
}
