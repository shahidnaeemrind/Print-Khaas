import React from 'react';
import { X, Eye } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../ProductCard';
import { ProductDetailsModal } from '../ProductDetailsModal';

interface ProductPreviewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductPreviewModal: React.FC<ProductPreviewModalProps> = ({
  product,
  onClose,
}) => {
  const [showDetailPreview, setShowDetailPreview] = React.useState(false);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B132B]/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FAFAF7] border-b border-[#E8E5DD]">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#B8860B]" />
            <span className="font-serif text-base font-bold text-[#0B132B]">
              Live Catalog Preview
            </span>
            <span className="text-xs text-stone-500">
              ({product.status === 'published' ? 'Published View' : 'Draft Simulation'})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <p className="text-xs text-stone-500 mb-4">
            This is how your publication card will appear in the public catalog grid:
          </p>

          <div className="max-w-xs mx-auto mb-6">
            <ProductCard
              product={product}
              onOpenDetails={() => setShowDetailPreview(true)}
              onOpenOrder={() => {}}
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setShowDetailPreview(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B132B] text-white text-xs font-semibold hover:bg-[#1E293B]"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Full Details Modal</span>
            </button>
          </div>
        </div>
      </div>

      {showDetailPreview && (
        <ProductDetailsModal
          product={product}
          onClose={() => setShowDetailPreview(false)}
        />
      )}
    </div>
  );
};
