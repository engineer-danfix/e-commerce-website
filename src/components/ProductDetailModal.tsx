import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShoppingCart, 
  ShieldCheck, 
  Plus, 
  Minus, 
  Truck, 
  MessageCircle,
  Award
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { generateProductInquiryMessage } from '../utils/whatsapp';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    addToCart, 
    setIsCheckoutOpen, 
    setIsCartOpen, 
    vendorConfig,
    setRequestingPackage 
  } = useShop();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'dosage' | 'details'>('overview');

  if (!selectedProduct) return null;

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleChatWithVendor = () => {
    const waUrl = generateProductInquiryMessage(selectedProduct, quantity, vendorConfig.vendorWhatsApp);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
          {/* Product Image Section */}
          <div className="p-6 bg-white flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-200 flex items-center justify-center">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-contain p-2"
              />
              {selectedProduct.originalPrice > selectedProduct.price ? (
                <span className="absolute top-3 left-3 bg-gradient-to-r from-rose-600 to-amber-600 text-white text-xs font-black px-2.5 py-1 rounded-md shadow">
                  PROMO • SAVE ₦{(selectedProduct.originalPrice - selectedProduct.price).toLocaleString()}
                </span>
              ) : selectedProduct.discountPercent > 0 ? (
                <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-1 rounded-md shadow">
                  -{selectedProduct.discountPercent}% OFF
                </span>
              ) : null}
            </div>

            {/* Quality & Trust badging */}
            <div className="mt-4 w-full bg-white rounded-xl p-3 border border-slate-200 flex flex-col gap-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-medium text-emerald-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{selectedProduct.nafdaqNo || '100% Genuine Botanical Formulation'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-slate-500" />
                <span>Nationwide Express Doorstep Delivery</span>
              </div>
            </div>
          </div>

          {/* Product Details & Actions */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              {/* Category & Brand */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <span className="text-emerald-700 uppercase tracking-wide">
                  {selectedProduct.category}
                </span>
                <span>•</span>
                <span>{selectedProduct.brand}</span>
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug mb-2">
                {selectedProduct.name}
              </h2>

              {/* Rating & Stock */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                  <span className="text-xs font-bold ml-1 text-slate-800">{selectedProduct.rating}</span>
                  <span className="text-xs text-slate-400 ml-1">({selectedProduct.reviewCount} customer reviews)</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  In Stock ({selectedProduct.stockCount} units)
                </span>
              </div>

              {/* Price */}
              <div className="mb-4 bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200/60">
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">
                    ₦{selectedProduct.price.toLocaleString()}
                  </span>
                  {selectedProduct.originalPrice > selectedProduct.price && (
                    <>
                      <span className="text-sm sm:text-base text-slate-400 line-through font-medium">
                        ₦{selectedProduct.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-xs font-black text-rose-700 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-full">
                        PROMO: Slashed ₦{(selectedProduct.originalPrice - selectedProduct.price).toLocaleString()} off!
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-emerald-800 font-semibold mt-1">
                  ✓ Special Promo Price: Pay ₦{selectedProduct.price.toLocaleString()} instead of ₦{selectedProduct.originalPrice.toLocaleString()}!
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Direct Zenith Bank transfer with instant optical verification & WhatsApp dispatch
                </p>
              </div>

              {/* Tabs for Information */}
              <div className="border-b border-slate-200 mb-3 flex gap-4 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === 'overview'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Overview & Benefits
                </button>
                <button
                  onClick={() => setActiveTab('dosage')}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === 'dosage'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  How to Use / Dosage
                </button>
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === 'details'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Ingredients & Vendor
                </button>
              </div>

              {/* Tab Contents */}
              <div className="text-xs text-slate-600 leading-relaxed min-h-[90px] mb-4">
                {activeTab === 'overview' && (
                  <p>{selectedProduct.description}</p>
                )}
                {activeTab === 'dosage' && (
                  <div>
                    <p className="mb-2 font-medium text-slate-800">
                      {selectedProduct.dosageInstructions || 'Administer strictly as directed on the sachet.'}
                    </p>
                    <p className="text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200 text-[11px]">
                      💡 <strong>Sublingual Administration:</strong> Pour powder under your tongue for immediate cellular absorption into the bloodstream.
                    </p>
                  </div>
                )}
                {activeTab === 'details' && (
                  <div className="space-y-1.5">
                    {selectedProduct.activeIngredients && (
                      <p><strong>Active Ingredients:</strong> {selectedProduct.activeIngredients}</p>
                    )}
                    <p><strong>Vendor:</strong> {selectedProduct.vendorName}</p>
                    <p><strong>Hotline:</strong> {selectedProduct.vendorPhone}</p>
                    <p><strong>Form:</strong> {selectedProduct.dosageForm || 'Standard Pack'}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="pt-4 border-t border-slate-200 space-y-2.5">
              {selectedProduct.isRegistrationPackage ? (
                <div className="space-y-3 pt-2">
                  <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-3.5 text-xs text-amber-950 flex items-start gap-2.5 shadow-xs">
                    <Award className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold text-amber-900">Official Membership Registration (On Request)</strong>
                      <span className="text-amber-800 leading-snug block mt-0.5">
                        Registration packages are processed on request. Clicking below allows you to enter your name and details, and sends your package application directly to Ivy Imiavan's WhatsApp DM.
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const pkg = selectedProduct;
                      setSelectedProduct(null);
                      setRequestingPackage(pkg);
                    }}
                    className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                    <span>Request Registration via Vendor WhatsApp</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-slate-700">Quantity:</span>
                    <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 text-xs font-bold text-slate-800">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-xs text-slate-500">
                      Total: <strong className="text-slate-800">₦{(selectedProduct.price * quantity).toLocaleString()}</strong>
                    </span>
                  </div>

                  {/* Main Store Actions */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={handleAddToCart}
                      className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4 text-emerald-700" />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                    >
                      Proceed to Pay
                    </button>
                  </div>

                  {/* Direct WhatsApp Contact Button */}
                  <button
                    type="button"
                    onClick={handleChatWithVendor}
                    className="w-full py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                    <span>Contact Vendor on WhatsApp about this Product</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
