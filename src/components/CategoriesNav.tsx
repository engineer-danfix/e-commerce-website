import React from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/products';
import { MedicalCategory } from '../types';
import { 
  Sparkles, 
  Flame, 
  Heart, 
  Layers, 
  Activity, 
  Moon, 
  ShieldCheck, 
  PackageCheck,
  Zap,
  Smile,
  HeartPulse,
  Award
} from 'lucide-react';

const CATEGORY_ICONS: Record<MedicalCategory, React.ReactNode> = {
  'All': <Layers className="w-4 h-4" />,
  'Registration Packages': <Award className="w-4 h-4 text-amber-500" />,
  'Stem Cell Therapy': <Sparkles className="w-4 h-4 text-emerald-500" />,
  "Men's Vitality": <Flame className="w-4 h-4 text-rose-500" />,
  "Women's Wellness": <Heart className="w-4 h-4 text-pink-500" />,
  'Detox & Gut Health': <Activity className="w-4 h-4 text-teal-500" />,
  'Sleep & Stress Relief': <Moon className="w-4 h-4 text-purple-500" />,
  'Joints & Mobility': <Zap className="w-4 h-4 text-amber-500" />,
  'Immunity & Vit C': <ShieldCheck className="w-4 h-4 text-orange-500" />,
  'Oral Healthcare': <Smile className="w-4 h-4 text-cyan-500" />,
  'Targeted Protocols': <HeartPulse className="w-4 h-4 text-red-500" />,
  'Combos & Value Packs': <PackageCheck className="w-4 h-4 text-indigo-500" />,
};

export const CategoriesNav: React.FC = () => {
  const { selectedCategory, setSelectedCategory, products } = useShop();

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar scroll-smooth">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = cat === 'All' 
              ? products.length 
              : products.filter(p => p.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-600/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{CATEGORY_ICONS[cat]}</span>
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isSelected
                      ? 'bg-emerald-900 text-emerald-200'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
