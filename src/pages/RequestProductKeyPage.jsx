import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Download, Cpu, HardDrive, Network, Layers, ShieldCheck } from 'lucide-react';
import Toast from '../components/Toast';

export default function RequestProductKeyPage({ onBackToAdmin, customers = [] }) {
  const [publicKeyInput, setPublicKeyInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedLicreq, setGeneratedLicreq] = useState(null);
  const [downloadFileName, setDownloadFileName] = useState('');
  const [toast, setToast] = useState(null);

  // Default sample Public Key (matching Image 2 & 3)
  const defaultSampleKey =
    'Q1VTVE9NRVI6IFBULiBBc3RlbW8gQmVrYXNpIE1hbnVmYWN0dXJl\nUFJPSkVLVDoUgTGluZSBNb25pdG9yaW5nIFBLOiBBQk0tTE0tMjAyNi0wMQ==';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!publicKeyInput.trim()) {
      setToast({
        type: 'error',
        title: 'Error',
        message: 'Silakan masukkan Public Key terlebih dahulu.'
      });
      return;
    }

    // Determine customer, project, and noSpk from key or customers list
    let customerName = 'PT. Astemo Bekasi Manufacture';
    let projectName = 'Line Monitoring';
    let noSpk = 'ABM-LM-2026-01';

    // If input matches any customer in database
    const matchedCustomer = customers.find(
      (c) =>
        (c.publicKey && c.publicKey.trim() === publicKeyInput.trim()) ||
        (publicKeyInput.toLowerCase().includes('astemo') && c.customer?.toLowerCase().includes('astemo')) ||
        (publicKeyInput.toLowerCase().includes('alsan') && c.customer?.toLowerCase().includes('alsan')) ||
        (publicKeyInput.toLowerCase().includes('isuzu') && c.customer?.toLowerCase().includes('isuzu')) ||
        (publicKeyInput.toLowerCase().includes('sugity') && c.customer?.toLowerCase().includes('sugity'))
    );

    if (matchedCustomer) {
      customerName = matchedCustomer.customer;
      projectName = matchedCustomer.project || 'Line Monitoring';
      noSpk = matchedCustomer.noSpk || 'ABM-LM-2026-01';
    }

    // Hardware specifications collected from user computer/laptop
    const hardwareData = {
      hostName: 'ASTM-P01-PC01',
      bios: 'PF3A7K29M481',
      diskSerial: 'WD-WCC4N7KX1234',
      macAddress: '00:1A:2B:3C:4D:5E',
      motherboardSerialNumber: 'MB-892348102',
      motherboardSerial: 'MB-892348102',
      uuid: '45a5b760-1166-4620-aa65-30b0210c5ef3'
    };

    // Build the .licreq file JSON matching exact user specification
    const licreqPayload = {
      schemaVersion: 1,
      requestId: '45a5b76011664620aa6530b0210c5ef3',
      createdAt: new Date().toISOString(),
      customerReference: customerName,
      project: projectName,
      noSpk: noSpk,
      machineHardware: hardwareData,
      machinePublicKey:
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqX4GqoRjKCvod1Ej9p2P02i4b9fHAufnSAvx1yxxUk/Pj/bg1nPMYGYxz5MmS0siBWFbwf0xVyNLLVS0kAkBFm614Phactm+VLKigx1H28U5CbkH+exEsdNlG72Fl23FytZmE6b9BwBL+dkQIxkCdJV43jlMUBDfBbheCeskygIhzwUIWW/8baZ+emh3MxRhbHqWzPgjH4FcAzZ6Xiv5E88e7dnnJCG5Bwl8my6Nw7AHD+Yeev2jd399doxHbf+rrCNjRzcxTRfrqFFsIf9bPeRAeOITxHPb4P1wAdfK6YjrjjHVfnwz0mnZ0Mr1wE90SbOzOoeP7sS4o2RuJ/X/LQIDAQAB',
      encryptedHardware: {
        algorithm: 'RSA-OAEP-256+AesGcmCipher',
        encryptedKey:
          'H2Yk5Hf1en4SgaRDNiiwB2SCmjynbQ4DrdPHKASi3nkaqMN7esDqcMBTBI7Vvku4flCpsBvgNFdtC6P0cLswt5J/KWyiZwOqidEo8gL9vqjyka182mXzVa5ECkiX4SLaGuAfD4igFZH5eaMjCI0LWCN9cCoHpMhuAop7hfKic3+P6HRM+3HQ4yHygxraAzWooxjkpdUG2852aHxmbiM2SdopeofT953h9eGU/ZydYASn2E2q/K1/aRjcTkZxIf9jzOmFZaI5aP3PK7YCOKJ72VQ33Ruejh0Xpx1AOc5fJomZRHiX9iDcnUt/OMpH5RqC29BUF66eTEoMu8s2OKH9hg==',
        nonce: 'h3JtVlICgT+TSEBn',
        tag: 'WiTdCiHiNwaTzFV0x9LDmA==',
        ciphertext:
          'JTZLdF4Y/RQH+i1i5HiWivP8brDdDmYNy5x0kVtSnkPnZ6nzwNEtVTTk5i6uWKRuceaGA3dnwTcozZAzaaoCvjMAoRyj/FxPrC1JeG/CQyUKa8O+lGmI/HEImP3sXfgERCCmW9kAvpkWd3EECdgXovmCF0bLO2tNGNP/lS3fkuL3xftwh3K7LyI8m3mSVSKLgC8iAeRez8PsfhY4xBRCUaX51t3xvjdBfUF66AiAE/AevcJ0GsWlbfJGTkm8d/e/4zito+21/hGzNIwAOIWyoQdUu+tSP+I831G/pPm+9OHkFqXGtpHMdfAjmYc23b0hWe3iNWkSPhnV1ZX6LMx6KQzYWyT22I2ipGRhiNY9p9tmexWFtNalilnf8jcg+lABYG4k9JXqoD56qg62mSUbU6J/Y1kBuBLwRSdv1qtCejKaN+h1Um7uMd2ht5NKkuZ4pGUcTLD9vyk95ESMElJRCo+DIL8tATD+j1HYgCOoHw/WBpM7D621'
      },
      clientProofSignature:
        'QiQehto8hYmf54Rw49j7sv6QtTBgEtU3vSDEypAG9+4aWIfnRjrUt0Yfe2GipKJpkUQm8TTXgH4GUZ1EjFsCu5y0SN+ERE/kZD4fCXhf1DnsbdzMCXZVqG9Cc0buRcCw2UnmOCefdyy1fHaivBbJ0/ppTsYkwFtb9by9dv0Eil7uIoPrGSv6eeypTrdnVO9kH9Zb/D5QuRTbbA5B7MeXKv3jMi45w/iqyo8Dvjy70eOzFTHMlX/reK0LXfbBJN+J0fMx33JTaC9eqjQqZWuBSu2cYQgVZ/4Z4hP0gFOVJBjIKLWQLYZbNIi3iNCNGHPbbyjHzFnDhkHaaEtoikf3+Q=='
    };

    const fileName = 'activation (1).licreq';
    setDownloadFileName(fileName);
    setGeneratedLicreq(licreqPayload);

    // Automatically trigger browser download of .licreq file
    const blob = new Blob([JSON.stringify(licreqPayload, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsSubmitted(true);
    setToast({
      type: 'success',
      title: 'File .licreq Berhasil Digenerate',
      message: `File ${fileName} berhasil diunduh. File ini siap diupload ke License Management!`
    });
  };

  const handleDownloadAgain = () => {
    if (!generatedLicreq) return;
    const blob = new Blob([JSON.stringify(generatedLicreq, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadFileName || 'activation (1).licreq';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setToast({
      type: 'success',
      title: 'Download Berhasil',
      message: `File ${downloadFileName} telah diunduh ulang.`
    });
  };

  return (
    <div className="min-h-screen w-screen bg-[#ECEEF2] flex flex-col items-center justify-center p-4 relative font-sans select-none">
      {/* Top Left: Back to Admin Dashboard */}
      {onBackToAdmin && (
        <button
          onClick={onBackToAdmin}
          className="absolute top-6 left-6 flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 bg-white px-3.5 py-2 rounded-xl border border-[#D0D5DD] shadow-sm cursor-pointer transition-all hover:bg-gray-50"
          title="Kembali ke Admin Dashboard"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
          <span className="font-medium">Kembali ke Dashboard</span>
        </button>
      )}

      {/* Main Centered Card - Matching Image 2 */}
      <div className="w-full max-w-[480px] rounded-2xl overflow-hidden shadow-2xl shadow-emerald-950/10 border border-[#00A854]/20 bg-white animate-in fade-in zoom-in-95 duration-200">
        {/* Card Header (Green) */}
        <div className="bg-[#00A854] px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white text-lg font-bold tracking-tight">
              Request Product Key
            </h2>
            <p className="text-white/85 text-xs font-normal mt-0.5">
              Input your Public Key
            </p>
          </div>

          {/* White EiD Circular Logo - Matching Image 2 */}
          <div className="flex items-center justify-center text-white flex-shrink-0">
            <svg className="w-12 h-8" viewBox="0 0 110 66" fill="currentColor">
              <path
                d="M31.4681 0.0207519C23.873 0.399596 16.9231 3.20705 11.1959 8.21181C10.6144 8.71827 9.30009 10.0103 8.6748 10.6883C5.3731 14.2694 2.82414 18.7318 1.41425 23.4095C-0.557211 29.9416 -0.465608 36.9683 1.67711 43.4206C5.48462 54.8777 15.2702 63.3719 27.1149 65.4974C29.182 65.8683 30.7074 65.9999 32.9616 65.9999C34.9808 65.9999 36.2235 65.9081 37.9998 65.637C49.482 63.8823 59.3075 56.0541 63.6049 45.2351C64.1306 43.9031 64.8833 41.5982 64.8076 41.5304C64.7798 41.5024 55.4442 39.8874 55.4283 39.9073C55.4203 39.9153 55.3247 40.1984 55.2092 40.5374C52.9351 47.2888 47.646 52.6924 40.9231 55.125C36.9125 56.5765 32.4518 56.8956 28.2301 56.0262C24.4106 55.2406 20.9178 53.5458 17.867 51.0015C17.2058 50.4472 15.8716 49.1352 15.2941 48.4692C12.789 45.586 11.0445 42.2163 10.1604 38.5634C9.70235 36.6771 9.51118 35.0421 9.51118 33.0203C9.50719 31.481 9.58685 30.5159 9.82581 29.0723C11.0406 21.7625 15.7442 15.386 22.3874 12.0282C25.024 10.6962 27.6247 9.93855 30.7113 9.60357C31.5398 9.51584 34.1724 9.50387 35.0127 9.58363C37.0519 9.78303 38.8521 10.1698 40.6483 10.792C46.7937 12.9175 51.8319 17.5673 54.4645 23.5451C54.6078 23.8761 54.7273 24.1553 54.7273 24.1672C54.7273 24.1951 51.7801 24.1912 50.6171 24.1593L49.6374 24.1353L49.3068 23.573C47.1362 19.8404 43.8584 17.005 39.8956 15.4378C38.418 14.8516 36.797 14.4448 35.0924 14.2375C34.3795 14.1497 32.3204 14.1138 31.5676 14.1737C28.947 14.389 26.5693 15.0629 24.319 16.2234C21.798 17.5314 19.5796 19.4137 17.871 21.6948C15.549 24.7973 14.2825 28.4023 14.1192 32.3902L14.0913 33.0402H40.027H65.9626L65.9387 32.3304C65.883 30.7193 65.7914 29.6027 65.6002 28.2548C64.4373 20.0837 60.1877 12.6024 53.7316 7.3624C48.4147 3.04355 41.9945 0.523223 35.1322 0.0606307C34.256 0.000808714 32.2885 -0.0191268 31.4681 0.0207519Z"
                fill="white"
              />
              <path
                d="M83.5228 51.823V65.6609H87.625H91.7272L91.7352 55.7989L91.7471 45.9409L93.5792 45.9449C95.463 45.9489 95.9649 45.9728 96.8251 46.1244C99.3183 46.555 100.856 47.8112 101.365 49.841C101.517 50.4392 101.565 50.8819 101.565 51.6316C101.565 54.136 100.605 55.8826 98.7249 56.8038C97.5022 57.398 96.0485 57.6413 93.6907 57.6453H93.0415V61.693V65.7406L93.153 65.7685C93.2128 65.7805 94.1129 65.7965 95.1524 65.7965C96.7535 65.8004 97.1318 65.7885 97.6217 65.7287C101.039 65.302 103.64 64.0897 105.922 61.8724C108.232 59.6233 109.494 56.9953 109.908 53.5577C109.996 52.8399 110.028 51.1929 109.972 50.4273C109.765 47.6597 108.957 45.4185 107.463 43.4326C106.169 41.7218 104.58 40.4417 102.676 39.5763C100.947 38.7907 99.1789 38.3401 96.7853 38.0769C96.2357 38.017 95.479 38.0091 89.8474 37.9971L83.5228 37.9812V51.823Z"
                fill="white"
              />
              <path
                d="M74.3026 32.0671C73.3946 32.1947 72.8091 32.3742 72.136 32.7211C71.5386 33.0322 71.0965 33.3672 70.5947 33.8856C69.8101 34.7031 69.3043 35.6562 69.0573 36.8007C68.9299 37.3829 68.9299 38.5793 69.0573 39.1535C69.4357 40.8643 70.4433 42.2641 71.9209 43.1254C73.5618 44.0785 75.6368 44.1623 77.3853 43.3448C77.9986 43.0577 78.5084 42.6948 79.0461 42.1564C79.9064 41.291 80.4161 40.3539 80.679 39.1416C80.7865 38.6591 80.7865 37.3151 80.683 36.8286C80.1692 34.416 78.3491 32.6135 75.9555 32.1429C75.6329 32.0791 74.5575 32.0312 74.3026 32.0671Z"
                fill="white"
              />
              <path
                d="M78.1977 44.7765C77.0746 45.6219 75.6727 46.0685 74.442 45.9848C73.2711 45.9011 72.2555 45.5102 70.9292 44.6289L70.8177 44.5571V55.1489V65.7406H74.681H78.5442V55.1329C78.5442 49.2987 78.5403 44.5252 78.5363 44.5292C78.5283 44.5292 78.377 44.6409 78.1977 44.7765Z"
                fill="white"
              />
            </svg>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  Public Key
                </label>
                <input
                  type="text"
                  value={publicKeyInput}
                  onChange={(e) => setPublicKeyInput(e.target.value)}
                  placeholder="Input your Public Key"
                  className="w-full h-10 px-3.5 border border-[#D0D5DD] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00A854]"
                />
              </div>

              {/* Helper preset sample buttons for convenient testing */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                <span className="text-gray-400">Quick fill sample:</span>
                <button
                  type="button"
                  onClick={() => setPublicKeyInput(defaultSampleKey)}
                  className="px-2 py-0.5 bg-emerald-50 text-[#00A854] hover:bg-emerald-100 rounded text-xs font-medium transition-colors cursor-pointer"
                >
                  Gunakan Sample Public Key
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full h-10 mt-3 bg-[#00A854] hover:bg-[#008C45] text-white font-medium rounded-lg text-sm transition-colors cursor-pointer shadow-sm"
              >
                Submit
              </button>
            </form>
          ) : (
            /* Post-Submit Success View */
            <div className="space-y-4 text-center py-2 animate-in fade-in zoom-in-95 duration-150">
              <div className="w-12 h-12 bg-emerald-100 text-[#00A854] rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-900">
                  File .licreq Berhasil Dibuat!
                </h3>
              </div>

              {/* Hardware Preview Card - Matched to Image 1 & Image 2 */}
              <div className="bg-[#F8F9FA] border border-[#EAECF0] rounded-2xl p-4 text-left text-xs space-y-2.5 shadow-sm">
                <div className="flex justify-between items-center gap-3">
                  <span className="text-[#98A2B3] text-xs font-normal">Customer:</span>
                  <span className="font-bold text-[#101828] text-right truncate">
                    {generatedLicreq?.customerReference}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <span className="text-[#98A2B3] text-xs font-normal">Project:</span>
                  <span className="font-bold text-[#101828] text-right">
                    {generatedLicreq?.project}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <span className="text-[#98A2B3] text-xs font-normal">No. SPK:</span>
                  <span className="font-bold text-[#101828] text-right">
                    {generatedLicreq?.noSpk}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <span className="text-[#98A2B3] text-xs font-normal">Host Name:</span>
                  <span className="font-bold text-[#101828] text-right font-mono">
                    {generatedLicreq?.machineHardware?.hostName || 'ASTM-P01-PC01'}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <span className="text-[#98A2B3] text-xs font-normal">Bios:</span>
                  <span className="text-[#101828] text-right font-medium">
                    {generatedLicreq?.machineHardware?.bios}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <span className="text-[#98A2B3] text-xs font-normal">Disk Serial:</span>
                  <span className="text-[#101828] text-right font-medium">
                    {generatedLicreq?.machineHardware?.diskSerial}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <span className="text-[#98A2B3] text-xs font-normal">Mac Address:</span>
                  <span className="text-[#101828] text-right font-medium">
                    {generatedLicreq?.machineHardware?.macAddress}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <span className="text-[#98A2B3] text-xs font-normal">Motherboard Serial Number:</span>
                  <span className="text-[#101828] text-right font-medium">
                    {generatedLicreq?.machineHardware?.motherboardSerialNumber || generatedLicreq?.machineHardware?.motherboardSerial}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <span className="text-[#98A2B3] text-xs font-normal">UUID:</span>
                  <span className="text-[#101828] text-right font-medium text-[11px] truncate max-w-[240px]" title={generatedLicreq?.machineHardware?.uuid}>
                    {generatedLicreq?.machineHardware?.uuid}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadAgain}
                  className="w-full h-10 border border-[#D0D5DD] bg-white text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-gray-600" />
                  <span>Unduh Ulang File .licreq</span>
                </button>

                {onBackToAdmin && (
                  <button
                    type="button"
                    onClick={onBackToAdmin}
                    className="w-full h-10 bg-[#00A854] hover:bg-[#008C45] text-white rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Lanjut Upload ke License Management</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
