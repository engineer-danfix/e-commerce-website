import { VendorConfig } from '../types';

export const DEFAULT_VENDOR_CONFIG: VendorConfig = {
  vendorName: 'YES Global',
  vendorWhatsApp: '+2347071252320', // Official Vendor WhatsApp DM
  vendorTelegram: '+2349061443633', // Official Vendor Telegram Line
  vendorPhone: '+234 707 125 2320',
  vendorEmail: 'ivyimiavan226@gmail.com',
  bankDetails: {
    bankName: 'Zenith Bank',
    accountNumber: '2177625439',
    accountName: 'Osemwinvie Imiavan',
    sortCode: '057150013',
  },
  autoVerifyReceipts: true,
};

export const CITIES_DELIVERY_FEES: Record<string, number> = {
  'Lagos (Island)': 2500,
  'Lagos (Mainland)': 2000,
  'Benin City (Edo State)': 2000,
  'Abuja (FCT)': 3500,
  'Port Harcourt (Rivers)': 3500,
  'Ibadan (Oyo State)': 2500,
  'Warri / Asaba (Delta)': 2500,
  'Enugu': 3500,
  'Kano / Kaduna': 4500,
  'Other States (Nationwide Express)': 4000,
};
