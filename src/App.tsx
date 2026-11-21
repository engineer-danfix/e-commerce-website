import React, { useState, useMemo } from 'react';
import { useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { CategoriesNav } from './components/CategoriesNav';
import { PromoHero } from './components/PromoHero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrdersModal } from './components/OrdersModal';
import { RegistrationPackageModal } from './components/RegistrationPackageModal';
import { Footer } from './components/Footer';
import { SlidersHorizontal, ArrowUpDown, Sparkles, AlertCircle } from 'lucide-react';

export function AppContent() {
  const { products, selectedCategory, searchQuery, setSelectedCategory, setSearchQuery } = useShop();

  // Sorting
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [onlyRx, setOnlyRx] = useState(false);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category match
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesIngredients = p.activeIngredients?.toLowerCase().includes(q) || false;
        if (!matchesName && !matchesBrand && !matchesDesc && !matchesIngredients) {
          return false;
        }
      }

      // Prescription only filter toggle
      if (onlyRx && !p.prescriptionRequired) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default
    });
  }, [products, selectedCategory, searchQuery, onlyRx, sortBy]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* Top Header */}
      <Header />

      {/* Categories Bar */}
      <CategoriesNav />

      {/* Main Container */}
      <main className="flex-1">
        {/* Promotional Hero Banner */}
        <PromoHero />

        {/* Product Catalog Section */}
        <div className="max-w-7xl mx-auto px-4 pt-6">
          {/* Section Header & Toolbar (Jumia/Jiji style toolbar) */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {selectedCategory === 'All' ? 'Medical Products Catalog' : selectedCategory}
                </h2>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {filteredProducts.length} items
                </span>
              </div>
              {searchQuery && (
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing search results matching: <strong className="text-emerald-700">"{searchQuery}"</strong>
                </p>
              )}
            </div>

            {/* Sorting & Filters */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Prescription only toggle */}
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={onlyRx}
                  onChange={(e) => setOnlyRx(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Rx Required Only</span>
              </label>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                <span>Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent outline-none font-semibold text-slate-800 cursor-pointer"
                >
                  <option value="featured">Featured (Recommended)</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters Badges */}
          {(selectedCategory !== 'All' || searchQuery || onlyRx) && (
            <div className="flex items-center gap-2 mb-4 text-xs">
              <span className="text-slate-500 font-medium">Active filters:</span>
              {selectedCategory !== 'All' && (
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 hover:bg-emerald-200"
                >
                  <span>Category: {selectedCategory}</span>
                  <span>×</span>
                </button>
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 hover:bg-emerald-200"
                >
                  <span>Keyword: "{searchQuery}"</span>
                  <span>×</span>
                </button>
              )}
              {onlyRx && (
                <button
                  onClick={() => setOnlyRx(false)}
                  className="bg-rose-100 text-rose-800 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 hover:bg-rose-200"
                >
                  <span>Rx Only</span>
                  <span>×</span>
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setOnlyRx(false);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto my-8">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">
                No matching medical products found
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                We couldn't find any medications or health equipment matching your criteria. Try adjusting your search query or category filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setOnlyRx(false);
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modals & Overlays */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrdersModal />
      <RegistrationPackageModal />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
