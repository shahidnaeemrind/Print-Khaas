import React from 'react';
import { X, School, User, MessageCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { formatPKR, generateSchoolOrderUrl, generateParentOrderUrl } from '../utils/whatsapp';

interface OrderModalProps {
  product: Product | null;
  onClose: () => void;
  whatsappNumber?: string;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  product,
  onClose,
  whatsappNumber,
}) => {
  if (!product) return null;

  const schoolOrderUrl = generateSchoolOrderUrl(product, whatsappNumber);
  const parentOrderUrl = generateParentOrderUrl(product, whatsappNumber);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B132B]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FAFAF7] border-b border-[#E8E5DD]">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo-icon.svg"
              alt="Print Khaas"
              className="w-6 h-6 object-contain rounded-md shadow-2xs"
            />
            <span className="font-serif text-base font-bold text-[#0B132B]">
              Order via WhatsApp
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6 p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-3">
            {product.coverImage && (
              <img
                src={product.coverImage}
                alt={product.title}
                className="w-12 h-16 object-cover rounded-md border border-stone-300 shrink-0"
              />
            )}
            <div>
              <span className="text-[10px] uppercase font-bold text-[#996515] tracking-wider block">
                {product.category}
              </span>
              <h4 className="font-serif text-sm font-bold text-[#0B132B] line-clamp-1">
                {product.title}
              </h4>
              <div className="text-xs text-stone-600 mt-0.5">
                {product.parentPrice && (
                  <span className="font-semibold text-stone-800">
                    {formatPKR(product.parentPrice)}
                  </span>
                )}
                {product.gradeRange && (
                  <span className="text-stone-400 ml-2">({product.gradeRange})</span>
                )}
              </div>
            </div>
          </div>

          <p className="text-xs text-stone-600 mb-4 font-medium">
            Please choose how you would like to order. WhatsApp will open in a new tab with your pre-filled inquiry:
          </p>

          <div className="space-y-3">
            {/* Option 1: For Schools */}
            <a
              href={schoolOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="group block p-4 rounded-xl border-2 border-stone-200 hover:border-[#0B132B] bg-white hover:bg-stone-50 transition-all text-left shadow-2xs"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                  <div className="w-8 h-8 rounded-lg bg-[#0B132B] text-[#E8D099] flex items-center justify-center">
                    <School className="w-4 h-4" />
                  </div>
                  <span>For Schools & Institutions</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Bulk Rates
                </span>
              </div>
              <p className="text-xs text-stone-500 pl-10">
                Inquire about institutional discounts, minimum quantities, custom school syllabus printing, and delivery to your campus.
              </p>
            </a>

            {/* Option 2: For Home / Parents */}
            <a
              href={parentOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="group block p-4 rounded-xl border-2 border-emerald-200 hover:border-[#128C7E] bg-emerald-50/30 hover:bg-emerald-50/60 transition-all text-left shadow-2xs"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 text-[#075E54] font-bold text-sm">
                  <div className="w-8 h-8 rounded-lg bg-[#128C7E] text-white flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span>For Home / Parents</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#128C7E] bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                  Personal Use
                </span>
              </div>
              <p className="text-xs text-stone-500 pl-10">
                Order individual copies for your children with fast nationwide doorstep courier delivery and cash on delivery/online transfer options.
              </p>
            </a>
          </div>

          <div className="mt-5 pt-3 border-t border-stone-200 flex items-center justify-center gap-2 text-[11px] text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official Print Khaas WhatsApp: +92 333 6474186</span>
          </div>
        </div>
      </div>
    </div>
  );
};
