import React, { useState, useEffect } from 'react';
import { Truck, Banknote, MessageCircle, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const HERO_COVER_IMAGES = [
  {
    src: '/yes-global/sunrise-cover-spoon.jpeg',
    alt: 'YES Global SunRise StemCell Box, Sachet & Sublingual Powder',
    caption: 'Sublingual Powder & Sealed Sachet',
  },
  {
    src: '/yes-global/sunrise-cover-box.jpeg',
    alt: 'YES Global SunRise StemCell 2000mg x 15 Sachets Box',
    caption: 'SunRise • 2000mg x 15 Sachets',
  },
];

export const PromoHero: React.FC = () => {
  const { setSelectedCategory } = useShop();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_COVER_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-5">
        {/* 3-column banner grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Cover Banner (2 cols on lg) - Clean Pure White Studio Look */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-white text-slate-900 border border-slate-200 shadow-[0_10px_35px_-12px_rgba(15,23,42,0.08)] flex flex-col justify-between">
            {/* Crisp brand top accent line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-amber-500 to-rose-600" />

            <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-12 gap-5 items-center flex-1">
              {/* Left Copy & Category Quick Actions */}
              <div className="md:col-span-6 lg:col-span-6 z-10 order-2 md:order-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Swiss PhytoCellTec™ Plant Stemcell Therapy
                </span>

                <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-slate-900 mb-2">
                  Defy Age, Embrace Life with{' '}
                  <span className="text-emerald-700">YES Global</span>
                </h1>

                <p className="text-slate-600 text-xs sm:text-sm mb-4 leading-relaxed">
                  Clinical stem cell solutions for Diabetes, High BP, Ulcers, Infertility, Prostate, and Joint Pains. Direct Zenith Bank checkout with automatic receipt verification & WhatsApp order dispatch.
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setSelectedCategory('Registration Packages')}
                    className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-sm transition-all transform active:scale-95"
                  >
                    ⭐ Membership Packages (On Request)
                  </button>
                  <button
                    onClick={() => setSelectedCategory('Combos & Value Packs')}
                    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                  >
                    Triangle Life-Saver Package
                  </button>
                  <button
                    onClick={() => setSelectedCategory('Targeted Protocols')}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                  >
                    Targeted Protocols
                  </button>
                  <button
                    onClick={() => setSelectedCategory('Stem Cell Therapy')}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-all"
                  >
                    SunRise StemCell
                  </button>
                </div>
              </div>

              {/* Right Pure White Product Photography Stage */}
              <div className="md:col-span-6 lg:col-span-6 bg-white flex flex-col items-center justify-center order-1 md:order-2">
                <div className="relative w-full h-[210px] sm:h-[250px] bg-white flex items-center justify-center overflow-hidden">
                  <img
                    src={HERO_COVER_IMAGES[activeSlide].src}
                    alt={HERO_COVER_IMAGES[activeSlide].alt}
                    className="w-full h-full object-contain transition-all duration-500"
                  />
                </div>

                {/* Clean Thumbnail Switcher showing both pure-white studio photos */}
                <div className="mt-2.5 flex items-center justify-center gap-2.5 w-full">
                  {HERO_COVER_IMAGES.map((img, idx) => (
                    <button
                      key={img.src}
                      type="button"
                      onClick={() => setActiveSlide(idx)}
                      className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-xl border bg-white transition-all ${
                        activeSlide === idx
                          ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img.src}
                        alt={img.caption}
                        className="w-11 h-8 object-contain rounded bg-white"
                      />
                      <span className="text-[10px] font-bold text-slate-700 hidden sm:inline">
                        {img.caption}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Side Feature Cards - Crisp White Surface Aesthetic */}
          <div className="flex flex-col gap-3">
            {/* Card 1: Zenith Bank Verified Details */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between flex-1">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center flex-shrink-0">
                  <Banknote className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">
                    Official Zenith Bank Account
                  </span>
                  <div className="font-mono text-sm font-extrabold text-slate-900 mt-0.5">
                    2177625439
                  </div>
                  <div className="text-xs font-bold text-emerald-700">
                    Osemwinvie Imiavan
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 mt-2 leading-tight">
                Transfer to Zenith Bank, upload your receipt, and get verified in seconds!
              </p>
            </div>

            {/* Card 2: WhatsApp & Telegram Direct Dispatch */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center flex-shrink-0">
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
            <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm flex items-center justify-between text-xs text-slate-700">
              <span className="flex items-center gap-2 font-semibold">
                <Truck className="w-4 h-4 text-emerald-600" /> Nationwide Sealed Delivery
              </span>
              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                Original Stock
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
