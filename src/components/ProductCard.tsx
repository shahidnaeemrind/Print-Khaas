import React, { useState } from 'react';
import { Book, ChevronRight, Eye, ShoppingBag, School, User, Sparkles, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { formatPKR, generateSchoolOrderUrl, generateParentOrderUrl } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onOpenOrder: (product: Product) => void;
  whatsappNumber?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onOpenOrder,
  whatsappNumber,
}) => {
  const [imageError, setImageError] = useState(false);

  // Price formatting
  const hasParentPrice = typeof product.parentPrice === 'number' && product.parentPrice > 0;
  const hasSchoolPrice = typeof product.schoolPrice === 'number' && product.schoolPrice > 0;

  return (
    <div className="group relative flex flex-col bg-white rounded-xl border border-[#E8E5DD] hover:border-[#D4AF37]/50 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Cover Image Area */}
      <div
        onClick={() => onOpenDetails(product)}
        className="relative aspect-4/5 w-full bg-[#F4F1EA] cursor-pointer overflow-hidden flex items-center justify-center border-b border-[#E8E5DD]"
      >
        {product.coverImage && !imageError ? (
          <img
            src={product.coverImage}
            alt={product.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#F5F2EA] to-[#EBE7DC]">
            <div className="w-14 h-14 rounded-xl bg-white/90 border border-stone-200 flex items-center justify-center mb-3 shadow-2xs p-2">
              <img src="/logo-icon.svg" alt="Print Khaas" className="w-full h-full object-contain" />
            </div>
            <span className="font-serif text-xs font-semibold text-stone-700 line-clamp-2 px-2">
              {product.title}
            </span>
            <span className="text-[10px] text-stone-400 mt-1 uppercase tracking-wider font-mono">
              Print Khaas
            </span>
          </div>
        )}

        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-2.5 left-2.5 bg-[#0B132B] text-[#E8D099] text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
            <span>Featured</span>
          </div>
        )}

        {/* Product Type / Discount Badge */}
        <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1">
          {product.productType === 'package' ? (
            <span className="bg-[#B8860B] text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
              School Package
            </span>
          ) : (
            <span className="bg-white/90 text-stone-800 text-[10px] font-medium tracking-wider px-2 py-0.5 rounded shadow-xs border border-stone-200">
              Book
            </span>
          )}

          {product.discount && (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs">
              {product.discount}
            </span>
          )}
        </div>

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-[#0B132B]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-stone-900 text-xs font-semibold shadow-md">
            <Eye className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>Quick View</span>
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Meta tags: Grade & Category */}
        <div className="flex items-center justify-between gap-2 mb-2 text-[11px]">
          <span className="text-[#996515] font-semibold truncate">
            {product.category}
          </span>
          {product.gradeRange && (
            <span className="text-stone-500 font-medium bg-stone-100 px-1.5 py-0.5 rounded text-[10px] shrink-0">
              {product.gradeRange}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          onClick={() => onOpenDetails(product)}
          className="font-serif text-base font-bold text-[#0B132B] line-clamp-2 hover:text-[#996515] cursor-pointer transition-colors mb-1.5 leading-snug"
          title={product.title}
        >
          {product.title}
        </h3>

        {/* Short Description */}
        {product.shortDescription && (
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3">
            {product.shortDescription}
          </p>
        )}

        <div className="mt-auto pt-3 border-t border-[#F0EDE6]">
          {/* Price Section */}
          <div className="mb-3">
            {hasParentPrice || hasSchoolPrice ? (
              <div className="flex items-baseline justify-between gap-2">
                <div>
                  {hasParentPrice && (
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-bold text-[#0B132B]">
                        {formatPKR(product.parentPrice)}
                      </span>
                      {product.originalPrice && product.originalPrice > (product.parentPrice || 0) && (
                        <span className="text-xs text-stone-400 line-through">
                          {formatPKR(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  )}
                  {hasSchoolPrice && (
                    <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <span>School Rate:</span>
                      <span>{formatPKR(product.schoolPrice)}</span>
                    </div>
                  )}
                </div>

                {product.targetAudience && (
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider font-medium">
                    {product.targetAudience === 'both'
                      ? 'Schools & Parents'
                      : product.targetAudience === 'schools'
                      ? 'Schools Only'
                      : 'Home / Parents'}
                  </span>
                )}
              </div>
            ) : (
              <div className="text-xs text-stone-500 italic">
                Inquire via WhatsApp for custom rates
              </div>
            )}
          </div>

          {/* Action Buttons: DETAILS & ORDER */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpenDetails(product)}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-[#0B132B] text-xs font-semibold transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-stone-500" />
              <span>DETAILS</span>
            </button>

            <button
              onClick={() => onOpenOrder(product)}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#0B132B] hover:bg-[#1E293B] text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#E8D099]" />
              <span>ORDER</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
