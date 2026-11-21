export interface Product {
  id: string;
  name: string;
  brand: string;
  category: MedicalCategory;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  image: string;
  additionalImages?: string[];
  description: string;
  dosageInstructions?: string;
  activeIngredients?: string;
  prescriptionRequired: boolean;
  inStock: boolean;
  stockCount: number;
  vendorName: string;
  vendorPhone: string;
  badge?: string;
  dosageForm?: string; // e.g. "Sublingual Powder", "Capsules", "Herbal Coffee", "Combo Pack"
  expiryDate?: string;
  nafdaqNo?: string;
  isRegistrationPackage?: boolean;
  packageTier?: 'Consultant' | 'Leader' | 'Builder' | 'Pioneer' | string;
  packagePoints?: {
    pairingValue?: number;
    sponsorValue?: number;
    productCount?: number;
  };
}

export type MedicalCategory = 
  | 'All'
  | 'Registration Packages'
  | 'Stem Cell Therapy'
  | "Men's Vitality"
  | "Women's Wellness"
  | 'Detox & Gut Health'
  | 'Sleep & Stress Relief'
  | 'Joints & Mobility'
  | 'Immunity & Vit C'
  | 'Oral Healthcare'
  | 'Targeted Protocols'
  | 'Combos & Value Packs';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  deliveryAddress: string;
  city: string;
  state: string;
  landmark: string;
  notes?: string;
  prescriptionImage?: string;
}

export interface BankAccountDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
  sortCode?: string;
}

export type PaymentStatus = 
  | 'AWAITING_TRANSFER'
  | 'RECEIPT_UPLOADED'
  | 'SCANNING_RECEIPT'
  | 'PAYMENT_VERIFIED'
  | 'PAYMENT_FAILED';

export interface ScannedReceiptData {
  detectedAmount: number;
  detectedRef: string;
  detectedSenderBank: string;
  detectedSenderName?: string;
  detectedDate: string;
  confidenceScore: number;
  isAmountMatch: boolean;
  isRefMatch: boolean;
  scanLog: string[];
}

export interface Order {
  id: string;
  orderNumber: string;
  orderReference: string;
  items: CartItem[];
  customer: CustomerDetails;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: PaymentStatus;
  bankDetails: BankAccountDetails;
  receiptImage?: string;
  receiptData?: ScannedReceiptData;
  createdAt: string;
  whatsappSent: boolean;
}

export interface VendorConfig {
  vendorName: string;
  vendorWhatsApp: string;
  vendorTelegram: string;
  vendorPhone: string;
  vendorEmail: string;
  bankDetails: BankAccountDetails;
  autoVerifyReceipts: boolean;
}
