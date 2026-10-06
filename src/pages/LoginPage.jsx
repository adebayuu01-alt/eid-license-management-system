import React, { useState } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import eidLogo from '../assets/eid-logo.svg';
import Toast from '../components/Toast';
import { INITIAL_USERS } from '../data/mockData';

export default function LoginPage({ onLoginSuccess, users = INITIAL_USERS }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleCredentialLogin = (e) => {
    e.preventDefault();
    setIsInvalid(false);
    setErrorMsg('');

    const uTrim = username.trim().toLowerCase();
    const pTrim = password.trim();

    if (!uTrim || !pTrim) {
      setIsInvalid(true);
      setErrorMsg('Please enter both username and password.');
      return;
    }

    const userList = users && users.length > 0 ? users : INITIAL_USERS;
    let matched = userList.find(
      (u) =>
        u.username.toLowerCase() === uTrim &&
        u.password === pTrim
    );

    // Support quick credentials or fallback
    if (!matched) {
      if (uTrim === 'adebayu.eid' && pTrim === 'adebayu12345') {
        matched = userList.find((u) => u.username.toLowerCase() === 'adebayu.eid') || {
          id: 1,
          name: 'Ade Bayu',
          username: 'adebayu.eid',
          role: 'Superadmin',
          password: 'adebayu12345',
          datetime: '06/09/2026 12:00'
        };
      }
    }

    if (!matched) {
      setIsInvalid(true);
      setErrorMsg('Invalid username or password.');
      return;
    }

    setLoggedInUser(matched);
    setShowSuccessToast(true);

    setTimeout(() => {
      onLoginSuccess(matched);
    }, 600);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-[#F8F9FC] overflow-hidden select-none">
      {/* Background Decorative Polygons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-white/70 rotate-45 transform skew-x-12" />
        <div className="absolute top-1/4 -right-40 w-[700px] h-[700px] bg-emerald-50/50 -rotate-12 transform skew-y-6" />
        <div className="absolute -bottom-40 left-1/3 w-[800px] h-[800px] bg-white/60 rotate-12" />
      </div>

      {/* Top right toast */}
      {showSuccessToast && loggedInUser && (
        <Toast
          type="success"
          title="Login Berhasil"
          message={`Selamat datang, ${loggedInUser.name} (${loggedInUser.role})`}
          onClose={() => setShowSuccessToast(false)}
          duration={2000}
        />
      )}

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
        <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-xl border border-[#E4E7EC] p-6 sm:p-8 flex flex-col items-center">
          {/* EID Brand Logo */}
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="h-16 flex items-center justify-center mb-2">
              <img
                src={eidLogo}
                alt="EID - LICENSE MANAGEMENT"
                className="h-14 w-auto object-contain"
              />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-[#1E232F] uppercase">
              EID - LICENSE MANAGEMENT
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Enter your username and password to continue.
            </p>
          </div>

          {/* Form Username & Password */}
          <form onSubmit={handleCredentialLogin} className="w-full space-y-4 text-left">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (isInvalid) setIsInvalid(false);
                  }}
                  placeholder="Input username"
                  aria-label="Username"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none ${
                    isInvalid
                      ? 'border-red-500 focus:border-red-500 bg-red-50/20'
                      : 'border-[#D0D5DD] focus:border-[#00A854] bg-[#FAFAFA]'
                  }`}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (isInvalid) setIsInvalid(false);
                  }}
                  placeholder="Input Password"
                  aria-label="Password"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none ${
                    isInvalid
                      ? 'border-red-500 focus:border-red-500 bg-red-50/20'
                      : 'border-[#D0D5DD] focus:border-[#00A854] bg-[#FAFAFA]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {isInvalid && errorMsg && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-600 font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* LOG IN Button */}
            <button
              type="submit"
              className="w-full py-2.5 bg-[#00A854] hover:bg-[#008C45] text-white font-semibold rounded-lg text-sm transition-all shadow-sm active:scale-[0.99] mt-2 cursor-pointer"
            >
              LOG IN
            </button>
          </form>

          {/* Quick Default Accounts */}
          <div className="w-full mt-6 pt-5 border-t border-[#E4E7EC] text-left">
            <p className="text-xs font-semibold text-gray-700 mb-2">
              Akun Default (Demo):
            </p>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/40 text-xs text-gray-700">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-gray-900">adebayu.eid</span>
                    <span className="text-emerald-700 bg-emerald-100 text-[10px] font-medium px-1.5 py-0.5 rounded">Superadmin</span>
                  </div>
                  <span className="text-gray-400 text-[11px]">Password: adebayu12345</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setUsername('adebayu.eid');
                    setPassword('adebayu12345');
                    setIsInvalid(false);
                    setErrorMsg('');
                  }}
                  className="text-xs font-semibold text-[#00A854] hover:text-[#008C45] px-2.5 py-1 cursor-pointer bg-white border border-emerald-200 rounded-md shadow-xs hover:bg-emerald-50 transition-colors"
                >
                  Gunakan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-gray-400 z-10 border-t border-gray-200 bg-white/50">
        Copyright © 2026 PT. Electrindo Inti Dinamika
      </footer>
    </div>
  );
}
