import React from 'react';

/**
 * StatusBadge component following the refined badge design system:
 * Light colored background, vibrant border, vibrant bold text, rounded rectangular corners (rounded-[6px]), no icons.
 */
export default function StatusBadge({ status, className = '' }) {
  if (!status) return null;

  const normalized = String(status).trim();

  if (normalized === 'Activated') {
    return (
      <span
        className={`inline-flex items-center justify-center px-3 py-0.5 rounded-[6px] text-xs sm:text-[13px] font-bold bg-[#EBF5FF] text-[#2F80ED] border border-[#3FA9F5] select-none ${className}`}
      >
        Activated
      </span>
    );
  }

  if (normalized === 'Duplicated') {
    return (
      <span
        className={`inline-flex items-center justify-center px-3 py-0.5 rounded-[6px] text-xs sm:text-[13px] font-bold bg-[#FFF1F0] text-[#E03131] border border-[#FF7875] select-none ${className}`}
      >
        Duplicated
      </span>
    );
  }

  if (normalized === 'Available') {
    return (
      <span
        className={`inline-flex items-center justify-center px-3 py-0.5 rounded-[6px] text-xs sm:text-[13px] font-bold bg-[#F6FFED] text-[#389E0D] border border-[#73D13D] select-none ${className}`}
      >
        Available
      </span>
    );
  }

  // Fallback for custom or role badges
  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-0.5 rounded-[6px] text-xs sm:text-[13px] font-bold bg-gray-50 text-gray-700 border border-gray-300 select-none ${className}`}
    >
      {status}
    </span>
  );
}
