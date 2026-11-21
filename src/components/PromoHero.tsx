import React from 'react';
import { ShieldCheck, Truck, Banknote, MessageCircle, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const PromoHero: React.FC = () => {
  const { setSelectedCategory, vendorConfig } = useShop();

  return (
    <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
      {/* 3-column banner grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Main Banner (2 cols on lg) */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-6 sm:p-8 flex flex-col justify-between shadow-xl min-h-[260px] border border-emerald-500/20">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
          
          {/* Subtle real pack background silhouette */}
          <div className="absolute right-4 bottom-2 opacity-15 pointer-events-none hidden sm:block max-w-[200px]">
            <img src="/yes-global/yes-img-45.jpeg" alt="YES Global Stemcell" className="rounded-2xl" />
          </div>

          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Swiss PhytoCellTec™ Plant Stemcell Therapy
            </span>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight mb-2">
              Rejuvenate Your Cells with Genuine YES Global Products
            </h1>
            
            <p className="text-slate-300 text-xs sm:text-sm mb-4 leading-relaxed">
              Clinical stem cell solutions for Diabetes, High BP, Ulcers, Infertility, Prostate, and Joint Pains. Direct Zenith Bank checkout with automatic receipt verification & WhatsApp order dispatch.
            </p>
            
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedCategory('Combos & Value Packs')}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow transition-all transform active:scale-95"
              >
                Triangle Life-Saver Package
              </button>
              <button
                onClick={() => setSelectedCategory('Stem Cell Therapy')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all"
              >
                SunRise StemCell
              </button>
              <button
                onClick={() => setSelectedCategory("Men's Vitality")}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl backdrop-blur-sm transition-all"
              >
                AlphaMax M+
              </button>
            </div>
          </div>
        </div>

        {/* Side Feature Cards */}
        <div className="flex flex-col gap-3">
          {/* Card 1: Zenith Bank Verified Details */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center flex-shrink-0">
                <Banknote className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                  Official Zenith Bank Account
                </span>
                <div className="font-mono text-sm font-extrabold text-slate-900 mt-0.5">
                  2177625439
                </div>
                <div className="text-xs font-bold text-emerald-800">
                  Osemwinvie Imiavan
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 mt-2 leading-tight">
              Transfer to Zenith Bank, upload your receipt, and get verified in seconds!
            </p>
          </div>

          {/* Card 2: WhatsApp & Telegram Direct Dispatch */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-4 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/15 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 mb-0.5">
                Instant Vendor Handoff
              </h3>
              <p className="text-[11px] text-slate-600 leading-snug">
                Orders dispatch directly to Ivy's WhatsApp DM (<strong>+2347071252320</strong>) and Telegram (<strong>+2349061443633</strong>).
              </p>
            </div>
          </div>

          {/* Card 3: 100% Genuine Certified */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between text-xs text-slate-700">
            <span className="flex items-center gap-2 font-medium">
              <Truck className="w-4 h-4 text-emerald-600" /> Nationwide Sealed Delivery
            </span>
            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              Original Stock
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
