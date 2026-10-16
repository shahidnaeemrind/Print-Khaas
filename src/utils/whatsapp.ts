import { Product } from '../types';

export const WHATSAPP_NUMBER = '923336474186';

export function formatPKR(amount?: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) return '';
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

export function generateSchoolOrderUrl(product: Product, whatsappNumber: string = WHATSAPP_NUMBER): string {
  const parts: string[] = ['Assalam-o-Alaikum Print Khaas. I am interested in ordering for my school.'];

  parts.push(`Product: ${product.title}.`);

  if (product.gradeRange && product.gradeRange.trim()) {
    parts.push(`Grade/Class: ${product.gradeRange.trim()}.`);
  }

  const priceToDisplay = product.schoolPrice
    ? formatPKR(product.schoolPrice) + ' (School Rate)'
    : product.parentPrice
    ? formatPKR(product.parentPrice)
    : '';

  if (priceToDisplay) {
    parts.push(`Listed Price: ${priceToDisplay}.`);
  }

  if (product.minOrderQuantity) {
    parts.push(`Indicated Min MOQ: ${product.minOrderQuantity} units.`);
  }

  parts.push('Please share school rates, minimum order quantity, available discounts, delivery details, and how to place the order.');

  const fullMessage = parts.join(' ');
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '') || WHATSAPP_NUMBER;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(fullMessage)}`;
}

export function generateParentOrderUrl(product: Product, whatsappNumber: string = WHATSAPP_NUMBER): string {
  const parts: string[] = ['Assalam-o-Alaikum Print Khaas. I want to order for home/personal use.'];

  parts.push(`Product: ${product.title}.`);

  const priceToDisplay = product.parentPrice
    ? formatPKR(product.parentPrice)
    : product.schoolPrice
    ? formatPKR(product.schoolPrice)
    : '';

  if (priceToDisplay) {
    parts.push(`Listed Price: ${priceToDisplay}.`);
  }

  parts.push('Quantity: [Please specify quantity].');
  parts.push('Please confirm availability, delivery charges, and payment options.');

  const fullMessage = parts.join(' ');
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '') || WHATSAPP_NUMBER;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(fullMessage)}`;
}

export function generateGeneralInquiryUrl(customMessage?: string, whatsappNumber: string = WHATSAPP_NUMBER): string {
  const message =
    customMessage?.trim() ||
    'Assalam-o-Alaikum Print Khaas. I would like to inquire about your books, school packages, and educational printing services.';
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '') || WHATSAPP_NUMBER;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
