import React from 'react';
import { X, Package, MessageCircle, ExternalLink, ShieldCheck, Clock } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { generateWhatsAppMessage } from '../utils/whatsapp';

export const OrdersModal: React.FC = () => {
  const { isOrdersOpen, setIsOrdersOpen, orders, vendorConfig } = useShop();

  if (!isOrdersOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-black text-white">Order History & Dispatches</h2>
              <p className="text-xs text-slate-400">
                {orders.length} past orders recorded in this session
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOrdersOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Orders list */}
        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {orders.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No orders placed yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Add medical products to your cart and complete checkout to see them here.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const waUrl = generateWhatsAppMessage(order, vendorConfig.vendorWhatsApp);

              return (
                <div 
                  key={order.id}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                    <div>
                      <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        #{order.orderReference}
                      </span>
                      <span className="text-xs text-slate-400 ml-2">
                        {new Date(order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Payment Verified
                    </span>
                  </div>

                  {/* Customer details & address */}
                  <div className="text-xs text-slate-600 space-y-0.5">
                    <div>
                      <strong>Customer:</strong> {order.customer.fullName} ({order.customer.phone})
                    </div>
                    <div>
                      <strong>Delivery:</strong> {order.customer.deliveryAddress}, {order.customer.city}
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="bg-white rounded-xl p-2.5 border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700 block mb-1">Items ({order.items.length}):</span>
                    <ul className="space-y-1">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between text-slate-600">
                          <span className="truncate max-w-[280px]">
                            {item.quantity}x {item.product.name}
                          </span>
                          <span className="font-semibold text-slate-800">
                            ₦{(item.product.price * item.quantity).toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Total & WhatsApp Button */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="text-xs">
                      <span className="text-slate-500">Total Paid: </span>
                      <span className="font-black text-slate-900 text-sm">
                        ₦{order.total.toLocaleString()}
                      </span>
                    </div>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white" />
                      <span>Re-send to WhatsApp DM</span>
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
