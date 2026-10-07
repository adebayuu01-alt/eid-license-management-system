import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, X, Check } from 'lucide-react';

export default function CustomDropdown({
  value,
  onChange,
  options = [],
  placeholder = 'Select option',
  includeAllOption = false,
  allOptionLabel = 'All',
  disabled = false,
  className = '',
  buttonClassName = '',
  searchable = true,
  showSearchIcon = false,
  noOptionsText = 'No options found',
  placement = 'auto'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [openUpward, setOpenUpward] = useState(false);

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Close when clicking outside & revert search
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsTyping(false);
        setSearchTerm('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format options: support strings, numbers, or objects
  const formattedOptions = [];
  if (includeAllOption) {
    formattedOptions.push({ label: allOptionLabel, value: '' });
  }
  options.forEach((opt) => {
    if (opt === null || opt === undefined) return;
    if (typeof opt === 'string' || typeof opt === 'number') {
      formattedOptions.push({ label: String(opt), value: opt });
    } else if (typeof opt === 'object') {
      const label =
        opt.label ||
        opt.customer ||
        opt.productKey ||
        opt.role ||
        opt.name ||
        opt.line ||
        opt.machine ||
        opt.model ||
        String(opt.value !== undefined ? opt.value : '');
      const val =
        opt.value !== undefined
          ? opt.value
          : opt.customer ||
            opt.productKey ||
            opt.role ||
            opt.name ||
            opt.line ||
            opt.machine ||
            opt.model;
      formattedOptions.push({
        label: String(label),
        value: val
      });
    }
  });

  const selectedOption = formattedOptions.find((opt) => opt.value === value);

  // Filter options based on searchTerm
  const filteredOptions = formattedOptions.filter((opt) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const labelMatch = (opt.label || '').toLowerCase().includes(term);
    const valueMatch = String(opt.value || '').toLowerCase().includes(term);
    return labelMatch || valueMatch;
  });

  // Reset highlighted index when filtered options change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchTerm]);

  // Check viewport bounds to flip dropdown upward if needed or based on placement prop
  useEffect(() => {
    if (placement === 'top') {
      setOpenUpward(true);
      return;
    }
    if (placement === 'bottom') {
      setOpenUpward(false);
      return;
    }
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      if (spaceBelow < 280 && spaceAbove > spaceBelow) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }
  }, [isOpen, placement]);

  // Keep highlighted item visible when scrolling via keyboard
  useEffect(() => {
    if (isOpen && listRef.current) {
      const highlightedEl = listRef.current.querySelector(`[data-index="${highlightedIndex}"]`);
      if (highlightedEl) {
        highlightedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleTriggerClick = (e) => {
    if (disabled) return;
    if (!searchable) {
      setIsOpen((prev) => !prev);
      return;
    }
    if (!isOpen) {
      setIsOpen(true);
      setIsTyping(false);
      setSearchTerm('');
      setTimeout(() => inputRef.current?.focus(), 10);
    } else {
      if (e && e.target !== inputRef.current) {
        setIsOpen(false);
        setIsTyping(false);
        setSearchTerm('');
      }
    }
  };

  const handleFocus = () => {
    if (disabled) return;
    setIsOpen(true);
    setIsTyping(false);
    setSearchTerm('');
    setTimeout(() => {
      inputRef.current?.select();
    }, 40);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setIsTyping(true);
    setSearchTerm(val);
    if (!isOpen) setIsOpen(true);
  };

  const handleChevronClick = (e) => {
    e.stopPropagation();
    if (disabled) return;
    if (isOpen) {
      setIsOpen(false);
      setIsTyping(false);
      setSearchTerm('');
    } else {
      setIsOpen(true);
      setIsTyping(false);
      setSearchTerm('');
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (disabled) return;
    onChange('');
    setSearchTerm('');
    setIsTyping(false);
    setIsOpen(false);
    setTimeout(() => inputRef.current?.blur(), 0);
  };

  const handleSelectOption = (opt) => {
    onChange(opt.value);
    setIsOpen(false);
    setIsTyping(false);
    setSearchTerm('');
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && filteredOptions.length > 0) {
        const target = filteredOptions[highlightedIndex] || filteredOptions[0];
        if (target) {
          handleSelectOption(target);
        }
      } else if (!isOpen) {
        setIsOpen(true);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setIsTyping(false);
      setSearchTerm('');
      inputRef.current?.blur();
    } else if (e.key === 'Tab') {
      setIsOpen(false);
      setIsTyping(false);
      setSearchTerm('');
    }
  };

  // Helper to highlight matching characters in option label
  const renderHighlightedLabel = (text, query) => {
    if (!query || !query.trim()) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span
          key={i}
          className="font-semibold text-emerald-700 bg-emerald-100/80 rounded px-0.5"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block w-full text-left select-none ${
        isOpen ? 'z-[90]' : 'z-0'
      } ${className}`}
    >
      {/* Trigger Box */}
      <div
        onClick={handleTriggerClick}
        className={`w-full flex items-center justify-between px-3.5 bg-white border text-sm transition-all duration-150 ${
          isOpen
            ? 'border-[#00A854] ring-2 ring-emerald-500/20'
            : 'border-[#D0D5DD] hover:border-gray-400'
        } rounded-lg ${buttonClassName || 'h-[38px]'} ${
          disabled
            ? 'opacity-50 cursor-not-allowed bg-gray-50'
            : 'cursor-pointer'
        }`}
      >
        <div className="flex items-center flex-1 min-w-0 mr-2">
          {searchable && showSearchIcon && (
            <Search
              className={`w-4 h-4 mr-2 flex-shrink-0 transition-colors ${
                isOpen ? 'text-[#00A854]' : 'text-gray-400'
              }`}
            />
          )}

          {searchable ? (
            <input
              ref={inputRef}
              type="text"
              disabled={disabled}
              value={
                isOpen
                  ? isTyping
                    ? searchTerm
                    : selectedOption
                    ? selectedOption.label
                    : ''
                  : selectedOption
                  ? selectedOption.label
                  : ''
              }
              onChange={handleInputChange}
              onFocus={handleFocus}
              onClick={() => {
                if (!isOpen) {
                  setIsOpen(true);
                  setIsTyping(false);
                  setSearchTerm('');
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full bg-transparent text-sm text-[#1E232F] focus:outline-none placeholder-gray-400 cursor-pointer truncate font-normal"
            />
          ) : (
            <span
              className={`truncate cursor-pointer ${
                !value && !selectedOption ? 'text-gray-400' : 'text-[#1E232F]'
              }`}
            >
              {selectedOption ? selectedOption.label : value || placeholder}
            </span>
          )}
        </div>

        {/* Action icon: X icon when value is selected (replaces down arrow), Chevron when empty */}
        <div className="flex items-center flex-shrink-0">
          {value && !disabled ? (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-[#667085] hover:text-[#1E232F] hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
              title="Clear selection"
            >
              <X className="w-4 h-4 flex-shrink-0" />
            </button>
          ) : (
            <button
              type="button"
              disabled={disabled}
              onClick={handleChevronClick}
              className="p-1 text-[#475467] hover:text-gray-800 rounded-md transition-colors cursor-pointer"
            >
              {isOpen ? (
                <ChevronUp className="w-4 h-4 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Dropdown Menu Popup */}
      {isOpen && (
        <div
          ref={listRef}
          className={`absolute left-0 right-0 w-full ${
            openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          } bg-white border border-[#D0D5DD] rounded-lg shadow-2xl z-[100] overflow-hidden py-1 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100`}
        >
          {filteredOptions.length > 0 ? (
            <>
              {filteredOptions.map((opt, index) => {
                const isSelected = opt.value === value;
                const isHighlighted = index === highlightedIndex;
                return (
                  <div
                    key={opt.value + '_' + index}
                    data-index={index}
                    onClick={() => handleSelectOption(opt)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`px-3.5 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between ${
                      index < filteredOptions.length - 1
                        ? 'border-b border-[#F2F4F7]'
                        : ''
                    } ${
                      isHighlighted
                        ? 'bg-emerald-50/70 text-[#1E232F]'
                        : 'text-[#1E232F] hover:bg-[#F8F9FC]'
                    } ${
                      isSelected
                        ? 'bg-emerald-50/90 font-semibold text-[#00A854]'
                        : ''
                    }`}
                  >
                    <span className="truncate mr-2">
                      {renderHighlightedLabel(opt.label, searchTerm)}
                    </span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#00A854] flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            <div className="px-4 py-5 text-center text-xs text-gray-400">
              {showSearchIcon && (
                <Search className="w-5 h-5 mx-auto mb-1.5 text-gray-300" />
              )}
              <p className="font-medium text-gray-600">
                {searchTerm ? `No results for "${searchTerm}"` : noOptionsText}
              </p>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setIsTyping(false);
                    inputRef.current?.focus();
                  }}
                  className="mt-2 text-xs text-[#00A854] hover:underline cursor-pointer"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
