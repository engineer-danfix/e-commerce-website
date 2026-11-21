import React from 'react';
import { ShieldCheck, Activity, PhoneCall, Mail, Heart, Sparkles, Send, MessageCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { vendorConfig, setSelectedCategory } = useShop();

  const telegramDigits = vendorConfig.vendorTelegram.replace(/[^0-9]/g, '');
  const waDigits = vendorConfig.vendorWhatsApp.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">100% Genuine YES Global</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Authentic Swiss PhytoCellTec plant stemcell products sourced directly from the authorized distributor.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Zenith Bank Settlement</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Secure bank transfer directly into verified vendor account (Osemwinvie Imiavan).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center flex-shrink-0">
              <Activity className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Automated Receipt Scan</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Optical receipt scanning verifies your payment instantly for priority order fulfillment.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">WhatsApp & Telegram Alert</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Verified orders immediately route to Ivy's direct WhatsApp DM and Telegram lines.
              </p>
            </div>
          </div>
        </div>

        {/* Links & Information */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10 border-b border-slate-800 text-xs">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                YES<span className="text-emerald-400"> Global</span> Wellness
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Leading the cellular regeneration revolution with breakthrough Swiss plant stem cells, male and female botanical vitality, colon detox, and deep restorative sleep therapies.
            </p>
            <div className="text-[11px] text-slate-300 space-y-1.5 pt-1">
              <p className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp: 
                <a href={`https://wa.me/${waDigits}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold hover:underline">
                  {vendorConfig.vendorWhatsApp}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Send className="w-3.5 h-3.5 text-sky-400" /> Telegram: 
                <a href={`https://t.me/+${telegramDigits}`} target="_blank" rel="noopener noreferrer" className="text-sky-400 font-bold hover:underline">
                  {vendorConfig.vendorTelegram}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" /> Email: 
                <a href={`mailto:${vendorConfig.vendorEmail}`} className="text-amber-300 hover:underline">
                  {vendorConfig.vendorEmail}
                </a>
              </p>
            </div>
          </div>

          {/* Quick Category Links */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-xs">
              Therapy Categories
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => setSelectedCategory('Combos & Value Packs')} className="hover:text-emerald-400">
                  Triangle Life-Saver Package
                </button>
              </li>
              <li>
                <button onClick={() => setSelectedCategory('Stem Cell Therapy')} className="hover:text-emerald-400">
                  SunRise StemCell Rejuvenation
                </button>
              </li>
              <li>
                <button onClick={() => setSelectedCategory("Men's Vitality")} className="hover:text-emerald-400">
                  AlphaMax M+ & Herbal Coffee
                </button>
              </li>
              <li>
                <button onClick={() => setSelectedCategory("Women's Wellness")} className="hover:text-emerald-400">
                  AlphaMax V+ Hormonal Balance
                </button>
              </li>
              <li>
                <button onClick={() => setSelectedCategory('Detox & Gut Health')} className="hover:text-emerald-400">
                  ColonGuard Phyto-Fiber Cleanse
                </button>
              </li>
              <li>
                <button onClick={() => setSelectedCategory('Joints & Mobility')} className="hover:text-emerald-400">
                  J'Flex Arthritis & Cartilage
                </button>
              </li>
            </ul>
          </div>

          {/* Official Zenith Account Box */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-xs">
              Zenith Bank Account Details
            </h4>
            <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1.5 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">Bank:</span>
                <span className="text-rose-400 font-black">Zenith Bank PLC</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">Account No:</span>
                <span className="font-mono text-sm font-black text-amber-300">2177625439</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">Account Name:</span>
                <span className="text-white font-bold text-[11px]">Osemwinvie Imiavan</span>
              </div>
              <p className="text-[10px] text-slate-500 pt-1">
                Accepted from all Nigerian commercial banks, USSD codes, OPay, Palmpay, and Kuda.
              </p>
            </div>
          </div>

          {/* Usage & Administration Guide */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-xs">
              Sublingual Protocol
            </h4>
            <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed space-y-1.5">
              <p>
                <strong>Under the Tongue:</strong> For maximum bio-availability, pour SunRise, SunSet, and AlphaMax directly under the tongue (sublingual).
              </p>
              <p>
                <strong>Hydration:</strong> Drink 2-3 liters of clean water daily to facilitate toxin flushing and stemcell regeneration.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p>© 2026 YES Global Wellness Hub • Authorized Distributor: Ivy Imiavan.</p>
          <p className="flex items-center gap-1">
            Dedicated to total healing & cellular restoration with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
