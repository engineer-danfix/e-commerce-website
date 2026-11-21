import React from 'react';
import { 
  Search, 
  ShoppingCart, 
  ShieldCheck, 
  PhoneCall, 
  Settings, 
  Package, 
  Send,
  MessageCircle,
  Sparkles,
  Building2,
  Award
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/products';
import { MedicalCategory } from '../types';

export const Header: React.FC = () => {
  const { 
    cartCount, 
    setIsCartOpen, 
    cartSubtotal,
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    setIsSettingsOpen,
    setIsOrdersOpen,
    orders,
    vendorConfig
  } = useShop();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value as MedicalCategory);
  };

  const telegramDigits = vendorConfig.vendorTelegram.replace(/[^0-9]/g, '');

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-slate-200">
      {/* Top Banner with Direct Contact Lines (WhatsApp, Telegram, Verified Zenith Bank) */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold flex items-center gap-1.5 text-emerald-300">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              YES Global Official Stemcell & Wellness Hub
            </span>
            <span className="hidden lg:inline text-slate-300">
              • Direct Zenith Bank Transfer Verified: <strong className="text-amber-300">Osemwinvie Imiavan</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            {/* Telegram Link */}
            <a 
              href={`https://t.me/+${telegramDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sky-300 hover:text-white transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-sky-400" />
              <span>Telegram: {vendorConfig.vendorTelegram}</span>
            </a>

            {/* WhatsApp Link */}
            <a 
              href={`https://wa.me/${vendorConfig.vendorWhatsApp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-300 hover:text-white transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp: {vendorConfig.vendorWhatsApp}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo - YES Global */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 stroke-[2.2] text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  YES<span className="text-emerald-600"> Global</span>
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider">
                  Wellness
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium hidden sm:block">
                Plant Stemcell Therapy • Cellular Regeneration • Herbal Vitality
              </p>
            </div>
          </a>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl hidden md:block">
          <div className="flex rounded-xl border-2 border-emerald-600/80 bg-white shadow-inner overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 focus-within:border-emerald-600 transition-all">
            <select
              value={selectedCategory}
              onChange={handleCategorySelect}
              className="bg-slate-50 border-r border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-100 transition-colors cursor-pointer max-w-[160px]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="relative flex-1 flex items-center">
              <input
                type="text"
                placeholder="Search SunRise, SunSet, ColonGuard, AlphaMax M+, J'Flex..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 flex items-center justify-center gap-1.5 font-medium text-sm transition-colors">
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Orders Button */}
          <button
            onClick={() => setIsOrdersOpen(true)}
            className="relative flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
          >
            <Package className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Orders</span>
            {orders.length > 0 && (
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {orders.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl shadow-md shadow-emerald-600/20 transition-all active:scale-95"
          >
            <ShoppingCart className="w-5 h-5" />
            <div className="text-left hidden sm:block">
              <div className="text-[10px] uppercase tracking-wider font-semibold opacity-90 leading-none">
                Cart
              </div>
              <div className="text-xs font-bold leading-tight">
                ₦{cartSubtotal.toLocaleString()}
              </div>
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-950 text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search input */}
      <div className="px-4 pb-2.5 md:hidden">
        <div className="flex rounded-lg border border-slate-300 overflow-hidden shadow-sm">
          <input
            type="text"
            placeholder="Search SunRise, ColonGuard, AlphaMax..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-1 px-3 py-2 text-sm outline-none"
          />
          <button className="bg-emerald-600 text-white px-4 flex items-center justify-center">
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
