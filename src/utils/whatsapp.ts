import { Order, Product } from '../types';

/**
 * Formats WhatsApp message for an order that is already verified.
 */
export function generateWhatsAppMessage(order: Order, vendorWhatsApp: string): string {
  const cleanPhone = vendorWhatsApp.replace(/[^0-9]/g, '');

  const itemsList = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.product.name}*\n   • Qty: ${item.quantity} x ₦${item.product.price.toLocaleString()} = ₦${(
          item.product.price * item.quantity
        ).toLocaleString()}\n   • Form: ${item.product.dosageForm || 'Standard Pack'}`
    )
    .join('\n\n');

  const text = `*🌿 NEW YES GLOBAL ORDER RECEIVED 🌿*
*Order Reference:* #${order.orderReference}
*Date:* ${new Date(order.createdAt).toLocaleString()}
*Payment Status:* ✅ VERIFIED BANK TRANSFER (Zenith Bank)

-------------------------------------
*👤 CUSTOMER & DELIVERY DETAILS:*
• *Name:* ${order.customer.fullName}
• *Phone Call:* ${order.customer.phone}
• *WhatsApp:* ${order.customer.whatsappNumber || order.customer.phone}
• *Email:* ${order.customer.email || 'N/A'}
• *Delivery Address:* ${order.customer.deliveryAddress}
• *City / State:* ${order.customer.city}, ${order.customer.state}
• *Landmark:* ${order.customer.landmark || 'None specified'}
${order.customer.notes ? `• *Special Instructions / Preferences:* ${order.customer.notes}\n` : ''}
-------------------------------------
*🛒 ORDERED PRODUCTS:*
${itemsList}

-------------------------------------
*💳 PAYMENT BREAKDOWN:*
• *Products Subtotal:* ₦${order.subtotal.toLocaleString()}
• *Delivery Fee:* ₦${order.deliveryFee.toLocaleString()}
${order.discount > 0 ? `• *Discount:* -₦${order.discount.toLocaleString()}\n` : ''}
• *TOTAL AMOUNT TRANSFERRED:* *₦${order.total.toLocaleString()}*

-------------------------------------
*🏦 ZENITH BANK SETTLEMENT VERIFICATION:*
• *Paid To:* ${order.bankDetails.bankName}
• *Account Number:* ${order.bankDetails.accountNumber}
• *Account Name:* ${order.bankDetails.accountName}
• *Order Ref/Narration:* #${order.orderReference}
• *Optical Scanner Status:* 100% Match & Verified ✅

_Hello Ivy, please confirm this order and initiate dispatch/delivery immediately._`;

  const encoded = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

/**
 * Formats WhatsApp message when a customer is at the PAYMENT STEP
 * and clicks "Contact Vendor" to send what they want to buy,
 * product description, quantity, and total amount to Ivy.
 */
export function generateContactVendorPaymentMessage(order: Order, vendorWhatsApp: string): string {
  const cleanPhone = vendorWhatsApp.replace(/[^0-9]/g, '');

  const itemsList = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.product.name}*\n   • *Quantity:* ${item.quantity}\n   • *Unit Price:* ₦${item.product.price.toLocaleString()}\n   • *Subtotal:* ₦${(
          item.product.price * item.quantity
        ).toLocaleString()}\n   • *Key Details / Indication:* ${item.product.description.slice(0, 140)}...`
    )
    .join('\n\n');

  const text = `*🌿 HELLO IVY - YES GLOBAL ORDER INQUIRY & PAYMENT ASSISTANCE 🌿*
*Order Reference:* #${order.orderReference}
*Payment Stage:* ⏳ At Payment Checkout (Zenith Bank)

-------------------------------------
*👤 MY CUSTOMER & DELIVERY DETAILS:*
• *Name:* ${order.customer.fullName || 'Customer'}
• *Phone Call:* ${order.customer.phone || 'Provided on checkout'}
• *WhatsApp:* ${order.customer.whatsappNumber || order.customer.phone || 'This line'}
• *Delivery Address:* ${order.customer.deliveryAddress || 'Pending'}, ${order.customer.city}
• *Landmark:* ${order.customer.landmark || 'N/A'}
${order.customer.notes ? `• *Special Notes / Choice:* ${order.customer.notes}\n` : ''}
-------------------------------------
*🛒 THE PRODUCTS I AM ORDERING:*
${itemsList}

-------------------------------------
*💰 TOTAL PAYMENT AMOUNT:*
• *Products Subtotal:* ₦${order.subtotal.toLocaleString()}
• *Delivery Fee:* ₦${order.deliveryFee.toLocaleString()}
• *GRAND TOTAL TO PAY:* *₦${order.total.toLocaleString()}*

-------------------------------------
*🏦 ZENITH BANK DETAILS DISPLAYED ON SITE:*
• *Bank:* ${order.bankDetails.bankName}
• *Account Number:* ${order.bankDetails.accountNumber}
• *Account Name:* ${order.bankDetails.accountName}
• *Narration/Ref:* #${order.orderReference}

_Hello Ivy, I am currently at the payment step of this order on your website. I want to confirm the products with you and proceed with payment/delivery!_`;

  const encoded = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

/**
 * Single product direct WhatsApp inquiry
 */
export function generateProductInquiryMessage(
  product: Product, 
  quantity: number, 
  vendorWhatsApp: string
): string {
  const cleanPhone = vendorWhatsApp.replace(/[^0-9]/g, '');
  const total = product.price * quantity;

  const text = `*🌿 HELLO IVY - YES GLOBAL PRODUCT INQUIRY 🌿*

• *Product:* *${product.name}*
• *Brand / Category:* ${product.brand} (${product.category})
• *Quantity:* ${quantity}
• *Price:* ₦${product.price.toLocaleString()} each (Total: *₦${total.toLocaleString()}*)
• *Description:* ${product.description.slice(0, 160)}...

_Hello Ivy, I am interested in purchasing this product from your website. Please confirm availability and guide me on ordering!_`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function generateTelegramLink(order: Order, vendorTelegram: string): string {
  const cleanPhone = vendorTelegram.replace(/[^0-9]/g, '');
  const itemsText = order.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ');
  const message = `Hello Ivy, I am placing an order on YES Global (#${order.orderReference}) for: ${itemsText}. Total: ₦${order.total.toLocaleString()} to Zenith Bank (Osemwinvie Imiavan - 2177625439). Customer: ${order.customer.fullName} (${order.customer.phone}). Delivery to ${order.customer.deliveryAddress}, ${order.customer.city}.`;
  return `https://t.me/+${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Formats WhatsApp message for requesting an official YES Global Membership / Registration Package
 */
export function generateRegistrationPackageMessage(
  pkg: Product,
  customerInfo: { fullName: string; phone: string; location: string; notes?: string },
  vendorWhatsApp: string
): string {
  const cleanPhone = vendorWhatsApp.replace(/[^0-9]/g, '');

  const text = `*🌟 YES GLOBAL OFFICIAL MEMBERSHIP & REGISTRATION REQUEST 🌟*

Hello Ivy Imiavan (YES Global Wellness Hub),
I would like to apply and register as an official YES Global member with the package below:

-------------------------------------
*📦 PACKAGE DETAILS (ON REQUEST):*
• *Package:* *${pkg.name}*
• *Official Price:* ₦${pkg.price.toLocaleString()}
• *Product Quantity:* ${pkg.dosageForm || 'Official Member Pack'}
${pkg.packagePoints?.pairingValue ? `• *Pairing Value:* ${pkg.packagePoints.pairingValue} PV\n• *Sponsor Value:* ${pkg.packagePoints.sponsorValue} PV\n` : ''}
-------------------------------------
*👤 MY REGISTRATION DETAILS:*
• *Full Name:* ${customerInfo.fullName}
• *Phone / WhatsApp:* ${customerInfo.phone}
• *City / State:* ${customerInfo.location}
${customerInfo.notes ? `• *Preferred Products / Notes:* ${customerInfo.notes}\n` : ''}
-------------------------------------
*🏦 ZENITH BANK SETTLEMENT ACCOUNT:*
• *Bank:* Zenith Bank PLC
• *Account Number:* 2177625439
• *Account Name:* Osemwinvie Imiavan

_Hello Ivy, please confirm my registration request, guide me through membership enrollment, and arrange my package delivery!_`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function generateRegistrationTelegramLink(
  pkg: Product,
  customerInfo: { fullName: string; phone: string; location: string; notes?: string },
  vendorTelegram: string
): string {
  const cleanPhone = vendorTelegram.replace(/[^0-9]/g, '');
  const message = `Hello Ivy, I want to apply for the YES Global Membership Package: ${pkg.name} (₦${pkg.price.toLocaleString()}). My details: Name: ${customerInfo.fullName}, Phone/WhatsApp: ${customerInfo.phone}, Location: ${customerInfo.location}. Notes: ${customerInfo.notes || 'None'}. Please guide me on payment to Zenith Bank (2177625439) and registration.`;
  return `https://t.me/+${cleanPhone}?text=${encodeURIComponent(message)}`;
}
