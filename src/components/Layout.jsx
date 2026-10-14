import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  ShieldCheck,
  Users,
  Database,
  ChevronDown,
  ChevronRight,
  LogOut,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import eidBrandLogo from '../assets/eid-license-management-logo.png';

export default function Layout({
  activeMenu,
  onNavigate,
  onLogout,
  currentUser,
  children
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [masterDataOpen, setMasterDataOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Realtime clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');

    return {
      dateStr: `${dayName}, ${day} ${month} ${year}`,
      timeStr: `${hh}:${mm}:${ss}`
    };
  };

  const { dateStr, timeStr } = formatDate(currentTime);
  const isMasterDataActive = activeMenu === 'master-data-customer';

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F8F9FC] overflow-hidden">
      {/* Top Navbar */}
      <header className="h-[64px] bg-white border-b border-[#E4E7EC] px-6 flex items-center justify-between flex-shrink-0 z-40">
        <div className="flex items-center gap-5">
          {/* EiD LICENSE MANAGEMENT Brand */}
          <div
            className="flex items-center cursor-pointer select-none"
            onClick={() => onNavigate('license-management')}
            title="EiD License Management"
          >
            <img
              src={eidBrandLogo}
              alt="EiD License Management"
              className="h-[40px] w-auto object-contain"
            />
          </div>

          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            title="Toggle Sidebar"
          >
            {sidebarOpen ? (
              <PanelLeftClose className="w-5 h-5 text-[#475467]" />
            ) : (
              <PanelLeft className="w-5 h-5 text-[#475467]" />
            )}
          </button>
        </div>

        {/* Top Right: Realtime Date & Time */}
        <div className="flex items-center select-none">
          <div className="flex items-center gap-2.5 text-sm sm:text-base text-[#475467] font-medium">
            <span>{dateStr}</span>
            <span className="text-gray-300">|</span>
            <span className="font-bold text-[#1E232F]">{timeStr}</span>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Sidebar - Pinned stay, never scrolls with page content */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-20'
          } h-full bg-white border-r border-[#E4E7EC] flex flex-col justify-between transition-all duration-300 ease-in-out select-none flex-shrink-0 z-20`}
        >
          {/* Menu Sections */}
          <div className="py-6 px-4 space-y-6 overflow-y-auto">
            {/* APPLICATION */}
            <div>
              {sidebarOpen && (
                <p className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase mb-2 px-2">
                  APPLICATION
                </p>
              )}
              <div className="space-y-1">
                {/* License Management */}
                <button
                  onClick={() => onNavigate('license-management')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    activeMenu === 'license-management'
                      ? 'bg-[#EAF8F1] text-[#00A854] font-semibold'
                      : 'text-[#475467] hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  title="License Management"
                >
                  <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span>License Management</span>}
                </button>
              </div>
            </div>

            {/* DATABASE (Master Data -> Customer) */}
            <div>
              {sidebarOpen && (
                <p className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase mb-2 px-2">
                  DATABASE
                </p>
              )}

              <div className="space-y-2">
                {/* Master Data Collapsible Treeview */}
                <div>
                  <button
                    onClick={() => {
                      if (sidebarOpen) {
                        setMasterDataOpen(!masterDataOpen);
                      } else {
                        onNavigate('master-data-customer');
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      isMasterDataActive
                        ? 'text-[#00A854] font-semibold'
                        : 'text-[#475467] hover:bg-gray-50'
                    }`}
                    title="Master Data"
                  >
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 flex-shrink-0" />
                      {sidebarOpen && <span>Master Data</span>}
                    </div>
                    {sidebarOpen &&
                      (masterDataOpen ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      ))}
                  </button>

                  {/* Master Data Treeview Sub-item: Customer */}
                  {sidebarOpen && masterDataOpen && (
                    <div className="relative pl-[36px] pt-1 space-y-1">
                      {/* Tree vertical guide line */}
                      <div className="absolute left-[20px] top-1 bottom-3 w-[1.5px] bg-[#D0D5DD] pointer-events-none" />

                      {/* Customer */}
                      <div className="relative flex items-center">
                        <div className="absolute left-[-16px] top-1/2 w-3.5 h-[1.5px] bg-[#D0D5DD] pointer-events-none" />
                        <button
                          onClick={() => onNavigate('master-data-customer')}
                          className={`w-full flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                            activeMenu === 'master-data-customer'
                              ? 'bg-[#EAF8F1] text-[#00A854] font-semibold'
                              : 'text-[#475467] hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <span>Customer</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Area: Request License + Logout */}
          <div className="p-4 border-t border-[#E4E7EC] space-y-1.5">
            <button
              onClick={() => onNavigate('request-license')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeMenu === 'request-license'
                  ? 'bg-[#EAF8F1] text-[#00A854] font-semibold'
                  : 'text-[#475467] hover:bg-emerald-50/60 hover:text-[#00A854]'
              }`}
              title="Request License Portal"
            >
              <KeyRound className="w-5 h-5 flex-shrink-0 text-[#00A854]" />
              {sidebarOpen && <span>Request License</span>}
            </button>

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#FF4D4F] hover:bg-red-50 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-5 h-5 flex-shrink-0 text-[#FF4D4F]" />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Right Section: Content + Footer */}
        <div className="flex-1 flex flex-col justify-between min-w-0 min-h-0 overflow-hidden">
          <main className="p-5 w-full max-w-[1720px] mx-auto flex-1 overflow-y-auto min-h-0">
            {children}
          </main>

          <footer className="w-full bg-white border-t border-[#D0D5DD] px-6 py-4 flex items-center justify-end text-sm text-[#23262B] font-normal select-none flex-shrink-0 z-10">
            <span>Copyright © 2026 PT. Electrindo Inti Dinamika</span>
          </footer>
        </div>
      </div>
    </div>
  );
}
