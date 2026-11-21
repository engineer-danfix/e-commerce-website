import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageCircle, 
  Send, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Banknote, 
  Package, 
  Copy, 
  Check, 
  User, 
  Phone, 
  MapPin, 
  FileText 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { 
  generateRegistrationPackageMessage, 
  generateRegistrationTelegramLink 
} from '../utils/whatsapp';

export const RegistrationPackageModal: React.FC = () => {
  const { requestingPackage, setRequestingPackage, vendorConfig } = useShop();

  // Customer form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [copiedBank, setCopiedBank] = useState(false);

  // Pre-fill from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('yesglobal_user_info');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.location) setLocation(parsed.location);
      }
    } catch {
      // ignore
    }
  }, [requestingPackage]);

  if (!requestingPackage) return null;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(vendorConfig.bankDetails.accountNumber);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleSubmitWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please enter your WhatsApp or phone number');
      return;
    }
    if (!location.trim()) {
      setErrorMsg('Please enter your delivery city / state');
      return;
    }

    setErrorMsg('');

    // Save to local storage for convenience
    try {
      localStorage.setItem(
        'yesglobal_user_info',
        JSON.stringify({ fullName, phone, location })
      );
    } catch {
      // ignore
    }

    const url = generateRegistrationPackageMessage(
      requestingPackage,
      { fullName, phone, location, notes },
      vendorConfig.vendorWhatsApp
    );

    setWhatsappUrl(url);
    setSubmitted(true);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleTelegramClick = () => {
    if (!fullName.trim() || !phone.trim() || !location.trim()) {
      setErrorMsg('Please enter your Name, Phone, and City before opening Telegram');
      return;
    }
    const tUrl = generateRegistrationTelegramLink(
      requestingPackage,
      { fullName, phone, location, notes },
      vendorConfig.vendorTelegram
    );
    window.open(tUrl, '_blank', 'noopener,noreferrer');
  };

  const handleClose = () => {
    setRequestingPackage(null);
    setSubmitted(false);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-5 sm:p-6 border-b border-emerald-500/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-amber-400 text-slate-950 shadow-sm">
              <Award className="w-3.5 h-3.5" />
              Official YES Global Membership Package
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-extrabold border border-emerald-400/30 uppercase">
              On Request
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug">
            {requestingPackage.name}
          </h2>
          <p className="text-xs text-emerald-200/90 mt-1 leading-relaxed">
            Fill in your details below to submit your official membership and product request directly to Ivy Imiavan's WhatsApp DM.
          </p>
        </div>

        {/* Package Summary Box */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-emerald-200 flex-shrink-0 flex items-center justify-center shadow-xs">
                <img
                  src={requestingPackage.image}
                  alt={requestingPackage.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  Selected Package Tier
                </div>
                <div className="text-sm font-black text-slate-900">
                  {requestingPackage.name}
                </div>
                <div className="text-xs text-slate-600 flex items-center gap-2 mt-0.5">
                  <span className="font-semibold text-emerald-700">
                    {requestingPackage.dosageForm || 'Official Membership'}
                  </span>
                  {requestingPackage.packagePoints?.pairingValue && (
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-emerald-300 font-bold text-emerald-800">
                      {requestingPackage.packagePoints.pairingValue} PV Points
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-emerald-200">
              <div className="text-lg sm:text-xl font-black text-emerald-800">
                ₦{requestingPackage.price.toLocaleString()}
              </div>
              {requestingPackage.originalPrice > requestingPackage.price && (
                <div className="text-[11px] text-slate-400 line-through">
                  ₦{requestingPackage.originalPrice.toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* Zenith Bank Settlement Callout */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center flex-shrink-0">
                <Banknote className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                  Zenith Bank Settlement
                </span>
                <div className="font-mono font-bold text-slate-900">
                  2177625439 • Osemwinvie Imiavan
                </div>
              </div>
            </div>
            <button
              onClick={handleCopyAccount}
              className="px-2.5 py-1.5 bg-white hover:bg-amber-100 text-amber-800 font-bold text-[11px] rounded-lg border border-amber-300 shadow-xs flex items-center gap-1 transition-colors"
            >
              {copiedBank ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Form */}
          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 text-center space-y-3 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-base font-black text-emerald-950">
                Request Prepared for WhatsApp!
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Your name, phone number, and package details have been formatted for Ivy's WhatsApp DM (<strong>+2347071252320</strong>).
              </p>
              
              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-98"
                >
                  <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                  <span>Open WhatsApp DM Now</span>
                </a>

                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline py-1"
                >
                  Edit your information
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitWhatsApp} className="space-y-3.5">
              {errorMsg && (
                <div className="bg-rose-50 border border-rose-300 text-rose-700 text-xs font-bold p-3 rounded-xl">
                  {errorMsg}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Your Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samuel Adekunle"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 outline-none"
                />
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Your WhatsApp / Phone Number *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 08012345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 outline-none"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Delivery City & State *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ikeja, Lagos State"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 outline-none"
                />
              </div>

              {/* Choice of Products or Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Preferred Products / Notes (Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. I prefer 1 SunRise and 1 AlphaMax M+, or I would like to know how the registration points work."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 outline-none resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-98"
                >
                  <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                  <span>Send Request to Vendor WhatsApp (+2347071252320)</span>
                </button>

                <button
                  type="button"
                  onClick={handleTelegramClick}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-sky-600" />
                  <span>Send Request via Telegram (+2349061443633)</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
