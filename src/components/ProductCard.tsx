import React from 'react';
import { 
  Star, 
  ShoppingCart, 
  Plus, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  Eye 
} from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProduct, cart } = useShop();
  const [justAdded, setJustAdded] = React.useState(false);

  const cartItem = cart.find(item => item.product.id === product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div 
      onClick={() => setSelectedProduct(product)}
      className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between cursor-pointer"
    >
      {/* Top Badges */}
      <div className="relative pt-[75%] bg-slate-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Discount / Promo Badge */}
        {product.originalPrice > product.price ? (
          <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-rose-600 to-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm">
            PROMO • SAVE ₦{(product.originalPrice - product.price).toLocaleString()}
          </span>
        ) : product.discountPercent > 0 ? (
          <span className="absolute top-2.5 left-2.5 bg-jumia-orange text-white text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
            -{product.discountPercent}%
          </span>
        ) : null}

        {/* Prescription or Special Badge */}
        {product.prescriptionRequired ? (
          <span className="absolute top-2.5 right-2.5 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Rx Required
          </span>
        ) : product.badge ? (
          <span className="absolute top-2.5 right-2.5 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
            {product.badge}
          </span>
        ) : null}

        {/* Quick View Button overlay */}
        <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow">
            <Eye className="w-3.5 h-3.5 text-emerald-600" /> Quick View
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-semibold text-emerald-700 truncate max-w-[150px]">
              {product.brand}
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
              {product.dosageForm || 'Medical'}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-emerald-700 transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Ratings */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              <span className="text-xs font-bold ml-1 text-slate-800">{product.rating}</span>
            </div>
            <span className="text-[11px] text-slate-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              ₦{product.price.toLocaleString()}
            </div>
            {product.originalPrice > product.price && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-400 line-through font-medium">
                  ₦{product.originalPrice.toLocaleString()}
                </span>
                <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-1 rounded border border-rose-200">
                  -₦{(product.originalPrice - product.price).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleAdd}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : cartItem
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                : 'bg-jumia-orange hover:bg-jumia-darkOrange text-white active:scale-95'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Added</span>
              </>
            ) : cartItem ? (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>({cartItem.quantity}) Add</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
