import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Copy, 
  Upload, 
  ShieldCheck, 
  MessageCircle, 
  AlertCircle, 
  Building2, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  Download,
  Sparkles,
  Send,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShop } from '../context/ShopContext';
import { CITIES_DELIVERY_FEES } from '../data/defaultConfig';
import { CustomerDetails, Order, ScannedReceiptData } from '../types';
import { scanAndVerifyReceipt } from '../utils/receiptVerifier';
import { 
  generateWhatsAppMessage, 
  generateTelegramLink, 
  generateContactVendorPaymentMessage 
} from '../utils/whatsapp';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartSubtotal, 
    vendorConfig, 
    clearCart,
    addOrder,
    updateOrder
  } = useShop();

  // Step state: 1 = Details, 2 = Bank Details, 3 = Receipt Upload/Scan, 4 = Success & WhatsApp
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCity, setSelectedCity] = useState('Lagos (Mainland)');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [notes, setNotes] = useState('');

  // Generated Order state
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // Copy feedbacks
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  // Receipt Scanner states
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusMessage, setScanStatusMessage] = useState('');
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [_verifiedData, setVerifiedData] = useState<ScannedReceiptData | null>(null);

  // Calculations
  const deliveryFee = CITIES_DELIVERY_FEES[selectedCity] || 2500;
  const grandTotal = cartSubtotal + deliveryFee;

  // Reset or prepare initial order ref on open
  useEffect(() => {
    if (isCheckoutOpen && !currentOrder && cart.length > 0) {
      const orderRef = `YES-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder: Order = {
        id: 'ord-' + Date.now(),
        orderNumber: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        orderReference: orderRef,
        items: [...cart],
        customer: {
          fullName: '',
          phone: '',
          whatsappNumber: '',
          email: '',
          deliveryAddress: '',
          city: selectedCity,
          state: 'Lagos',
          landmark: '',
        },
        subtotal: cartSubtotal,
        deliveryFee,
        discount: 0,
        total: grandTotal,
        status: 'AWAITING_TRANSFER',
        bankDetails: vendorConfig.bankDetails,
        createdAt: new Date().toISOString(),
        whatsappSent: false,
      };
      setCurrentOrder(newOrder);
    }
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen || !currentOrder) return null;

  // Handle Copy to Clipboard
  const handleCopy = (text: string, type: 'account' | 'ref') => {
    navigator.clipboard.writeText(text);
    if (type === 'account') {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    } else {
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  // Step 1: Submit Customer Info
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !deliveryAddress) {
      alert('Please fill in your Full Name, Phone Number, and Delivery Address.');
      return;
    }

    const updatedCustomer: CustomerDetails = {
      fullName,
      phone,
      whatsappNumber: whatsappNumber || phone,
      email,
      deliveryAddress,
      city: selectedCity,
      state: selectedCity.includes('Lagos') ? 'Lagos' : selectedCity.split(' ')[0],
      landmark,
      notes,
    };

    const updatedOrder: Order = {
      ...currentOrder,
      customer: updatedCustomer,
      deliveryFee,
      total: currentOrder.subtotal + deliveryFee,
    };

    setCurrentOrder(updatedOrder);
    setStep(2);
  };

  // Direct Contact Vendor via WhatsApp (at Payment step)
  const handleContactVendorWhatsApp = () => {
    if (!currentOrder) return;
    const waUrl = generateContactVendorPaymentMessage(currentOrder, vendorConfig.vendorWhatsApp);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Step 2: Customer indicates they transferred
  const handleProceedToUploadReceipt = () => {
    setStep(3);
  };

  // Step 3: Handle Receipt File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick Demo Receipt Generator for Zenith Bank
  const handleUseDemoReceipt = () => {
    setReceiptFileName('Zenith_Bank_Transfer_Receipt.png');
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 400, 600);
      
      // Zenith Bank header styling
      ctx.fillStyle = '#990000'; // Zenith red
      ctx.fillRect(0, 0, 400, 85);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('ZENITH BANK PLC', 90, 50);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('E-TRANSACTION RECEIPT', 95, 130);

      ctx.font = '13px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Transfer Amount:', 40, 180);
      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = '#990000';
      ctx.fillText(`NGN ${currentOrder.total.toLocaleString()}`, 40, 215);

      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Beneficiary Account Name:', 40, 260);
      ctx.font = 'bold 15px sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(vendorConfig.bankDetails.accountName, 40, 280);
      
      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Beneficiary Bank & Account:', 40, 310);
      ctx.font = 'bold 15px sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(`${vendorConfig.bankDetails.bankName} - ${vendorConfig.bankDetails.accountNumber}`, 40, 330);

      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Payment Reference / Narration:', 40, 370);
      ctx.font = 'bold 16px sans-serif';
      ctx.fillStyle = '#059669';
      ctx.fillText(currentOrder.orderReference, 40, 395);

      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Transaction Date & Time:', 40, 435);
      ctx.fillText(new Date().toLocaleString(), 40, 455);

      ctx.fillStyle = '#059669';
      ctx.fillRect(40, 495, 320, 45);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('STATUS: SUCCESSFUL / SETTLED', 60, 523);

      setReceiptImage(canvas.toDataURL('image/png'));
    }
  };

  // Run the Automated Optical Receipt Scanner & Verifier
  const handleStartScanAndVerification = async () => {
    if (!receiptImage) {
      alert('Please upload your receipt or click "Use Sample Bank Receipt".');
      return;
    }

    setIsScanning(true);
    setScanProgress(5);
    setScanLogs([]);

    try {
      const result = await scanAndVerifyReceipt(
        {
          expectedAmount: currentOrder.total,
          expectedReference: currentOrder.orderReference,
          expectedBankName: vendorConfig.bankDetails.bankName,
          fileBase64: receiptImage,
        },
        (stepMsg, pct) => {
          setScanStatusMessage(stepMsg);
          setScanProgress(pct);
          setScanLogs((prev) => [...prev, stepMsg]);
        }
      );

      setVerifiedData(result);
      setIsScanning(false);

      // Update Order Status to Verified
      const verifiedOrder: Order = {
        ...currentOrder,
        status: 'PAYMENT_VERIFIED',
        receiptImage,
        receiptData: result,
      };

      setCurrentOrder(verifiedOrder);
      addOrder(verifiedOrder);
      clearCart();

      // Trigger Confetti!
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });

      // Move to Step 4 (Success + WhatsApp handoff)
      setStep(4);
    } catch (err) {
      console.error(err);
      setIsScanning(false);
      alert('Scan error occurred. Please try again.');
    }
  };

  // Trigger WhatsApp Redirection
  const handleSendToWhatsApp = () => {
    if (!currentOrder) return;
    const waUrl = generateWhatsAppMessage(currentOrder, vendorConfig.vendorWhatsApp);
    
    const updated = { ...currentOrder, whatsappSent: true };
    setCurrentOrder(updated);
    updateOrder(updated);

    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Trigger Telegram Redirection
  const handleSendToTelegram = () => {
    if (!currentOrder) return;
    const tgUrl = generateTelegramLink(currentOrder, vendorConfig.vendorTelegram);
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header with Stepper */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Order Ref: #{currentOrder.orderReference}
              </span>
              <span className="text-xs text-slate-300">
                Total: <strong className="text-white">₦{currentOrder.total.toLocaleString()}</strong>
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white mt-1">
              {step === 1 && 'Step 1: Delivery & Customer Information'}
              {step === 2 && 'Step 2: Zenith Bank Transfer Payment Details'}
              {step === 3 && 'Step 3: Receipt Upload & Optical Verification'}
              {step === 4 && 'Step 4: Payment Verified • Dispatch to Vendor'}
            </h2>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-[11px] font-bold text-slate-600">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-emerald-700 font-extrabold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-300'}`}>1</span>
            <span>Delivery</span>
          </div>
          <div className="w-6 h-0.5 bg-slate-300" />
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-emerald-700 font-extrabold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-300'}`}>2</span>
            <span>Transfer</span>
          </div>
          <div className="w-6 h-0.5 bg-slate-300" />
          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-emerald-700 font-extrabold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-300'}`}>3</span>
            <span>Verify Receipt</span>
          </div>
          <div className="w-6 h-0.5 bg-slate-300" />
          <div className={`flex items-center gap-1.5 ${step >= 4 ? 'text-emerald-700 font-extrabold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 4 ? 'bg-emerald-600 text-white' : 'bg-slate-300'}`}>4</span>
            <span>Dispatch</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
          {/* ================= STEP 1: CUSTOMER & DELIVERY FORM ================= */}
          {step === 1 && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chief Emeka Obi"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number for Delivery <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0803 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp Number (for order confirmation)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 0803 123 4567 (if different)"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address (optional)
                  </label>
                  <input
                    type="email"
                    placeholder="customer@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* City Selection with automatic delivery fee */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Delivery City / State <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium"
                  >
                    {Object.keys(CITIES_DELIVERY_FEES).map((city) => (
                      <option key={city} value={city}>
                        {city} (₦{CITIES_DELIVERY_FEES[city].toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nearest Landmark / Bustop
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Near Ring Road / King Square"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Street Delivery Address <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Apartment / House number, Street name, Area"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product Choice / Special Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. For Consultant combo, specify which 2 products you prefer"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Cost Summary Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Items Subtotal ({cart.length} items):</span>
                  <span className="font-bold text-slate-800">₦{cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery to {selectedCity}:</span>
                  <span className="font-bold text-slate-800">₦{deliveryFee.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                  <span>Grand Total to Transfer:</span>
                  <span className="text-emerald-700">₦{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors"
              >
                <span>Proceed to Zenith Bank Transfer Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ================= STEP 2: BANK TRANSFER DETAILS ================= */}
          {step === 2 && (
            <div className="space-y-4">
              {/* SPECIAL OPTION: CONTACT VENDOR ON WHATSAPP DIRECTLY */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-[#25D366]/40 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                    <MessageCircle className="w-5 h-5 fill-white stroke-none" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">
                      Need help or want to pay via WhatsApp?
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      Click <strong className="text-emerald-800">Contact Vendor</strong> to send your ordered products, amount, and details directly to Ivy on WhatsApp.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleContactVendorWhatsApp}
                  className="w-full sm:w-auto px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all transform active:scale-95 whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                  <span>Contact Vendor</span>
                </button>
              </div>

              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3.5 flex items-start gap-3 text-xs text-emerald-950">
                <AlertCircle className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Instructions for Direct Zenith Bank Transfer:</strong>
                  <p className="mt-0.5 text-emerald-900 leading-relaxed">
                    Make a mobile transfer or USSD transfer of the EXACT amount below. Please ensure you input the Reference Code in your transfer remark/narration so our scanner can automatically verify your payment.
                  </p>
                </div>
              </div>

              {/* Zenith Bank Official Account Card */}
              <div className="bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-emerald-500/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 rounded-full bg-emerald-500/20 blur-2xl" />
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                      Official Payment Account
                    </span>
                  </div>
                  <span className="text-xs font-black bg-rose-700/80 px-3 py-1 rounded-full text-white shadow border border-rose-500">
                    {vendorConfig.bankDetails.bankName}
                  </span>
                </div>

                {/* Account Number with 1-click COPY */}
                <div className="mb-4">
                  <span className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">
                    Zenith Bank Account Number
                  </span>
                  <div className="flex items-center justify-between mt-1 bg-black/40 p-3 rounded-2xl border border-white/15">
                    <span className="text-2xl sm:text-3xl font-mono font-black tracking-widest text-emerald-300">
                      {vendorConfig.bankDetails.accountNumber}
                    </span>
                    <button
                      onClick={() => handleCopy(vendorConfig.bankDetails.accountNumber, 'account')}
                      className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow"
                    >
                      {copiedAccount ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Account Name */}
                <div className="mb-4">
                  <span className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">
                    Beneficiary Account Name
                  </span>
                  <div className="text-base font-black text-white mt-0.5 tracking-wide">
                    {vendorConfig.bankDetails.accountName}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/15">
                  {/* Exact Amount */}
                  <div>
                    <span className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">
                      Exact Amount to Transfer
                    </span>
                    <div className="text-xl font-black text-amber-400 mt-0.5">
                      ₦{currentOrder.total.toLocaleString()}
                    </div>
                  </div>

                  {/* Payment Narration Reference */}
                  <div>
                    <span className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">
                      Transfer Narration / Ref Code
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono font-bold text-emerald-300 text-base">
                        {currentOrder.orderReference}
                      </span>
                      <button
                        onClick={() => handleCopy(currentOrder.orderReference, 'ref')}
                        className="text-xs text-slate-300 hover:text-white underline font-bold"
                      >
                        {copiedRef ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Delivery</span>
                </button>
                <button
                  type="button"
                  onClick={handleProceedToUploadReceipt}
                  className="w-full sm:flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors"
                >
                  <span>I Have Made The Transfer • Upload Receipt</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: RECEIPT UPLOAD & SCANNER ================= */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Upload Zenith Bank Transfer Receipt
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Our scanner verifies amount (₦{currentOrder.total.toLocaleString()}) and Order Ref ({currentOrder.orderReference}).
                  </p>
                </div>

                {/* Option to Contact Vendor via WhatsApp here as well */}
                <button
                  type="button"
                  onClick={handleContactVendorWhatsApp}
                  className="text-xs font-bold text-[#25D366] hover:text-[#20ba59] bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-[#25D366] stroke-none" />
                  <span>Contact Vendor</span>
                </button>
              </div>

              {/* Upload Dropzone */}
              {!receiptImage ? (
                <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-3xl p-6 text-center bg-slate-50 hover:bg-emerald-50/30 transition-all flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                    <Upload className="w-7 h-7" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 mb-1">
                    Upload Bank Transfer Screenshot or PDF
                  </p>
                  <p className="text-[11px] text-slate-400 mb-3">
                    Screenshot from Zenith Mobile, GTWorld, AccessMore, OPay, Palmpay, Kuda, etc.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <label className="cursor-pointer px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition-colors">
                      <span>Choose File</span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    {/* Quick Demo Receipt Button */}
                    <button
                      type="button"
                      onClick={handleUseDemoReceipt}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Use Sample Zenith Receipt</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Receipt Preview with Laser Scanner Effect */}
                  <div className="relative rounded-2xl overflow-hidden border-2 border-slate-300 bg-slate-900 flex justify-center max-h-[300px]">
                    <img
                      src={receiptImage}
                      alt="Uploaded Receipt"
                      className="max-h-[300px] object-contain"
                    />

                    {/* Laser Scanner Line when scanning */}
                    {isScanning && <div className="scanner-laser" />}

                    {/* Scanning Status Badge */}
                    {isScanning && (
                      <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-sm text-white px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between border border-emerald-500/50">
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                          <span className="truncate max-w-[280px]">{scanStatusMessage}</span>
                        </span>
                        <span className="font-bold text-emerald-400">{scanProgress}%</span>
                      </div>
                    )}
                  </div>

                  {/* Change Receipt Button */}
                  {!isScanning && (
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="truncate font-medium">{receiptFileName}</span>
                      <button
                        onClick={() => {
                          setReceiptImage(null);
                          setReceiptFileName('');
                        }}
                        className="text-rose-600 hover:underline font-bold"
                      >
                        Upload Different Receipt
                      </button>
                    </div>
                  )}

                  {/* Terminal Log Console */}
                  {scanLogs.length > 0 && (
                    <div className="bg-slate-950 rounded-xl p-3 text-[11px] font-mono text-emerald-400 space-y-1 max-h-24 overflow-y-auto border border-emerald-900/50">
                      {scanLogs.map((log, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span className="text-slate-500">&gt;</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Verification Trigger Button */}
                  {!isScanning && (
                    <button
                      type="button"
                      onClick={handleStartScanAndVerification}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-200" />
                      <span>Scan & Verify Receipt Now</span>
                    </button>
                  )}
                </div>
              )}

              {/* Navigation Back & Direct Vendor Assistance */}
              {!isScanning && (
                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Zenith Bank Details</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleContactVendorWhatsApp}
                    className="text-xs text-slate-500 hover:text-emerald-700 font-semibold flex items-center gap-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Having issues? Contact Vendor</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 4: PAYMENT VERIFIED & WHATSAPP / TELEGRAM DISPATCH ================= */}
          {step === 4 && (
            <div className="space-y-4 text-center">
              {/* Big Success Icon */}
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-in zoom-in-75 duration-300">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  Payment Verified Successfully!
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Zenith Bank transfer confirmed by automated optical scanner. Order is ready to dispatch directly to Ivy Imiavan's WhatsApp or Telegram!
                </p>
              </div>

              {/* Order & Verification Summary Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left text-xs space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Order Reference:</span>
                  <span className="font-mono font-bold text-slate-900">#{currentOrder.orderReference}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Customer Name:</span>
                  <span className="font-bold text-slate-800">{currentOrder.customer.fullName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Delivery Address:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[240px]">
                    {currentOrder.customer.deliveryAddress}, {currentOrder.customer.city}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Items Ordered:</span>
                  <span className="font-bold text-slate-800">{currentOrder.items.length} YES Global products</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Verified Amount Paid:</span>
                  <span className="font-black text-emerald-700 text-sm">₦{currentOrder.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-slate-500">Bank Destination:</span>
                  <span className="text-[11px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">
                    Zenith Bank (Osemwinvie Imiavan - 2177625439) ✅
                  </span>
                </div>
              </div>

              {/* Primary Actions: Send to WhatsApp & Telegram */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="button"
                  onClick={handleSendToWhatsApp}
                  className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-green-500/25 flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.01] active:scale-98"
                >
                  <MessageCircle className="w-5 h-5 fill-white stroke-none" />
                  <span>Send Order to Vendor on WhatsApp (+2347071252320)</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendToTelegram}
                  className="w-full py-2.5 bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Order via Telegram (+2349061443633)</span>
                </button>

                <p className="text-[11px] text-slate-400">
                  Vendor: <strong className="text-slate-700">{vendorConfig.vendorName}</strong> ({vendorConfig.vendorEmail})
                </p>
              </div>

              {/* Secondary Options */}
              <div className="flex items-center justify-center gap-4 pt-1 text-xs">
                <button
                  onClick={() => window.print()}
                  className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <span className="text-slate-300">•</span>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="text-emerald-700 hover:text-emerald-800 font-bold"
                >
                  Return to Storefront
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
