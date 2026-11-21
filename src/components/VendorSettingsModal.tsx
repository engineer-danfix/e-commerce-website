import React, { useState } from 'react';
import { X, Save, Building2, MessageCircle, Check, Send, Mail } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { VendorConfig } from '../types';

export const VendorSettingsModal: React.FC = () => {
  const { isSettingsOpen, setIsSettingsOpen, vendorConfig, setVendorConfig } = useShop();

  const [vendorName, setVendorName] = useState(vendorConfig.vendorName);
  const [vendorWhatsApp, setVendorWhatsApp] = useState(vendorConfig.vendorWhatsApp);
  const [vendorTelegram, setVendorTelegram] = useState(vendorConfig.vendorTelegram);
  const [vendorPhone, setVendorPhone] = useState(vendorConfig.vendorPhone);
  const [vendorEmail, setVendorEmail] = useState(vendorConfig.vendorEmail);
  const [bankName, setBankName] = useState(vendorConfig.bankDetails.bankName);
  const [accountNumber, setAccountNumber] = useState(vendorConfig.bankDetails.accountNumber);
  const [accountName, setAccountName] = useState(vendorConfig.bankDetails.accountName);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isSettingsOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: VendorConfig = {
      ...vendorConfig,
      vendorName,
      vendorWhatsApp,
      vendorTelegram,
      vendorPhone,
      vendorEmail,
      bankDetails: {
        bankName,
        accountNumber,
        accountName,
      },
    };
    setVendorConfig(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsSettingsOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-white">Vendor Contact & Zenith Bank Settings</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Configured for Ivy Imiavan (YES Global Official Vendor)
            </p>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4">
          {/* Vendor Details */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              Vendor Contact Channels (WhatsApp & Telegram)
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Vendor / Business Name
                </label>
                <input
                  type="text"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+2347071252320"
                    value={vendorWhatsApp}
                    onChange={(e) => setVendorWhatsApp(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Telegram Line
                  </label>
                  <input
                    type="text"
                    placeholder="+2349061443633"
                    value={vendorTelegram}
                    onChange={(e) => setVendorTelegram(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={vendorEmail}
                  onChange={(e) => setVendorEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Bank Transfer Details */}
          <div className="pt-3 border-t border-slate-200">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Customer Transfer Bank Account (Zenith Bank)
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none font-mono font-bold tracking-wider"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
                  required
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow ${
                savedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
