import React from 'react';

/**
 * StatusBadge component following Figma Badges - XL specifications:
 *
 * 1. Available / Active:
 *    - width: 86px, height: 27px
 *    - background: #E6F8EF, border: 1px solid #34C582, border-radius: 4px
 *
 * 2. Activated:
 *    - width: 91px, height: 27px
 *    - background: #E9F5FF, border: 1px solid #52ADFF, border-radius: 4px
 *
 * 3. Duplicated / Expired:
 *    - width: 100px, height: 27px
 *    - background: #FEF3F2, border: 1px solid #F97066, border-radius: 4px
 */
export default function StatusBadge({ status, className = '' }) {
  if (!status) return null;

  const normalized = String(status).trim();
  const lower = normalized.toLowerCase();

  // Green Badge (Available / Active) - width 86px
  if (lower === 'available' || lower === 'active') {
    return (
      <span
        className={`badge-xl badge-xl-green inline-flex items-center justify-center w-[86px] h-[27px] px-2 py-1 gap-1 bg-[#E6F8EF] border border-[#34C582] rounded-[4px] text-xs font-semibold text-[#018246] select-none ${className}`}
      >
        {normalized}
      </span>
    );
  }

  // Blue Badge (Activated / Info / Pending) - width 91px
  if (lower === 'activated' || lower === 'info' || lower === 'pending') {
    return (
      <span
        className={`badge-xl badge-xl-blue inline-flex items-center justify-center w-[91px] h-[27px] px-2 py-1 gap-1 bg-[#E9F5FF] border border-[#52ADFF] rounded-[4px] text-xs font-semibold text-[#1C6CB5] select-none ${className}`}
      >
        {normalized}
      </span>
    );
  }

  // Red Badge (Duplicated / Expired / Revoked / Inactive) - width 100px
  if (
    lower === 'duplicated' ||
    lower === 'expired' ||
    lower === 'revoked' ||
    lower === 'inactive' ||
    lower === 'error'
  ) {
    return (
      <span
        className={`badge-xl badge-xl-red inline-flex items-center justify-center w-[100px] h-[27px] px-2 py-1 gap-1 bg-[#FEF3F2] border border-[#F97066] rounded-[4px] text-xs font-semibold text-[#D92D20] select-none ${className}`}
      >
        {normalized}
      </span>
    );
  }

  // Fallback Badge
  return (
    <span
      className={`badge-xl inline-flex items-center justify-center min-w-[80px] h-[27px] px-2 py-1 gap-1 bg-[#F9F9FB] border border-[#D0D1DD] rounded-[4px] text-xs font-semibold text-[#4C4E67] select-none ${className}`}
    >
      {normalized}
    </span>
  );
}
