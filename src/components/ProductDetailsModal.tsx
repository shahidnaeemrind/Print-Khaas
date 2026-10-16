import React, { useState } from 'react';
import {
  X,
  Book,
  Video,
  FileText,
  School,
  User,
  CheckCircle,
  ExternalLink,
  Layers,
  Globe,
  Tag,
  Package,
  Calendar,
  Share2,
  Copy,
  Check
} from 'lucide-react';
import { Product } from '../types';
import { formatPKR, generateSchoolOrderUrl, generateParentOrderUrl } from '../utils/whatsapp';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  whatsappNumber?: string;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  whatsappNumber,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [copiedSlug, setCopiedSlug] = useState(false);

  if (!product) return null;

  const currentCover = selectedImage || product.coverImage || '';
  const allImages = [
    product.coverImage,
    ...(Array.isArray(product.additionalImages) ? product.additionalImages : [])
  ].filter(Boolean) as string[];

  const schoolOrderUrl = generateSchoolOrderUrl(product, whatsappNumber);
  const parentOrderUrl = generateParentOrderUrl(product, whatsappNumber);

  // Validate real external URLs
  const hasValidVideoUrl = Boolean(
    product.youtubeUrl &&
    product.youtubeUrl.trim() !== '' &&
    (product.youtubeUrl.includes('youtube.com') || product.youtubeUrl.includes('youtu.be'))
  );

  const hasValidDrivePdfUrl = Boolean(
    product.drivePdfUrl &&
    product.drivePdfUrl.trim() !== '' &&
    (product.drivePdfUrl.startsWith('http://') || product.drivePdfUrl.startsWith('https://'))
  );

  const copyShareLink = () => {
    const url = `${window.location.origin}?book=${product.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(true);
    setTimeout(() => setCopiedSlug(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#0B132B]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FAFAF7] border-b border-[#E8E5DD]">
          <div className="flex items-center gap-3">
            <img
              src="/logo.svg"
              alt="Print Khaas"
              className="h-6 w-auto object-contain hidden sm:inline-block"
            />
            <span className="text-stone-300 hidden sm:inline-block">|</span>
            <span className="font-serif text-sm font-semibold text-stone-700">
              {product.category}
            </span>
            {product.gradeRange && (
              <>
                <span className="text-stone-300">•</span>
                <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                  {product.gradeRange}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyShareLink}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
              title="Copy share link"
            >
              {copiedSlug ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left: Book Cover Image & Gallery */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <div className="aspect-4/5 w-full bg-[#F5F2EA] rounded-xl border border-stone-200 overflow-hidden shadow-xs flex items-center justify-center relative">
                {currentCover ? (
                  <img
                    src={currentCover}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <Book className="w-12 h-12 text-stone-400 mb-2" />
                    <span className="text-xs text-stone-500">No cover photo provided</span>
                  </div>
                )}
                {product.featured && (
                  <span className="absolute top-3 left-3 bg-[#0B132B] text-[#E8D099] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-xs">
                    Featured Edition
                  </span>
                )}
              </div>

              {/* Thumbnail Gallery if multiple images */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-14 h-18 rounded-md overflow-hidden border-2 shrink-0 transition-all ${
                        currentCover === img ? 'border-[#B8860B] ring-2 ring-[#B8860B]/30' : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Resource Buttons (Video and PDF) */}
              {(hasValidVideoUrl || hasValidDrivePdfUrl) && (
                <div className="pt-2 flex flex-col gap-2">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    Verified Digital Previews
                  </span>

                  {hasValidVideoUrl && (
                    <a
                      href={product.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-semibold transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-rose-600" />
                        <span>Watch Video Walkthrough</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-rose-500" />
                    </a>
                  )}

                  {hasValidDrivePdfUrl && (
                    <a
                      href={product.drivePdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>View Sample Syllabus / PDF</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Right: Specifications & Pricing */}
            <div className="md:col-span-7 flex flex-col">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B132B] mb-2 leading-tight">
                {product.title}
              </h2>

              {/* Short & Full Description */}
              {product.shortDescription && (
                <p className="text-sm font-medium text-stone-700 mb-3">
                  {product.shortDescription}
                </p>
              )}

              {product.fullDescription && (
                <div className="text-xs text-stone-600 leading-relaxed space-y-2 mb-6 whitespace-pre-line bg-[#FAFAF7] p-3.5 rounded-lg border border-stone-200/70">
                  {product.fullDescription}
                </div>
              )}

              {/* Specifications Grid */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#B8860B]" />
                  <span>Product Specifications</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-md bg-stone-50 border border-stone-200/80">
                    <span className="text-[10px] text-stone-400 uppercase block font-semibold">Grade / Class</span>
                    <span className="font-semibold text-stone-800">{product.gradeRange || 'Not specified'}</span>
                  </div>

                  <div className="p-2.5 rounded-md bg-stone-50 border border-stone-200/80">
                    <span className="text-[10px] text-stone-400 uppercase block font-semibold">Language</span>
                    <span className="font-semibold text-stone-800">{product.language || 'English / Urdu'}</span>
                  </div>

                  <div className="p-2.5 rounded-md bg-stone-50 border border-stone-200/80">
                    <span className="text-[10px] text-stone-400 uppercase block font-semibold">Volume / Pages</span>
                    <span className="font-semibold text-stone-800">{product.pages || 'Full Edition'}</span>
                  </div>

                  <div className="p-2.5 rounded-md bg-stone-50 border border-stone-200/80">
                    <span className="text-[10px] text-stone-400 uppercase block font-semibold">Dimensions</span>
                    <span className="font-semibold text-stone-800">{product.dimensions || 'Standard Educational'}</span>
                  </div>

                  <div className="p-2.5 rounded-md bg-stone-50 border border-stone-200/80">
                    <span className="text-[10px] text-stone-400 uppercase block font-semibold">Binding</span>
                    <span className="font-semibold text-stone-800">{product.binding || 'Durable Stitch / Perfect'}</span>
                  </div>

                  <div className="p-2.5 rounded-md bg-stone-50 border border-stone-200/80">
                    <span className="text-[10px] text-stone-400 uppercase block font-semibold">Audience</span>
                    <span className="font-semibold text-stone-800 capitalize">{product.targetAudience}</span>
                  </div>
                </div>
              </div>

              {/* Table of Contents / Books in Package */}
              {product.tableOfContents && (
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                    {product.productType === 'package' ? 'Included Books in Package' : 'Table of Contents'}
                  </h4>
                  <pre className="text-xs text-stone-700 bg-stone-50 p-3 rounded-lg border border-stone-200 font-sans whitespace-pre-line leading-relaxed">
                    {product.tableOfContents}
                  </pre>
                </div>
              )}

              {/* Learning Outcomes */}
              {product.learningOutcomes && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                    Key Learning Outcomes & Skills
                  </h4>
                  <div className="text-xs text-stone-700 bg-[#FAF9F5] p-3 rounded-lg border border-[#EBE7DC] whitespace-pre-line leading-relaxed">
                    {product.learningOutcomes}
                  </div>
                </div>
              )}

              {/* Pricing Breakdown Box */}
              <div className="mt-auto p-4 rounded-xl bg-gradient-to-br from-[#F5F2EA] to-[#EFECE3] border border-[#E5DECD] mb-6">
                <div className="flex flex-wrap items-baseline justify-between gap-4 mb-2">
                  <div>
                    <span className="text-[11px] font-semibold uppercase text-stone-500 block">Retail / Parent Price</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-[#0B132B]">
                        {formatPKR(product.parentPrice) || 'Available on request'}
                      </span>
                      {product.originalPrice && product.originalPrice > (product.parentPrice || 0) && (
                        <span className="text-xs text-stone-500 line-through">
                          {formatPKR(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {product.schoolPrice && (
                    <div className="text-right">
                      <span className="text-[11px] font-bold uppercase text-emerald-800 block">School Bulk Rate</span>
                      <span className="text-lg font-bold text-emerald-800">
                        {formatPKR(product.schoolPrice)}
                      </span>
                      {product.minOrderQuantity && (
                        <span className="text-[10px] text-stone-500 block">
                          Min. MOQ: {product.minOrderQuantity} units
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-stone-600 border-t border-[#E0D9C7] pt-2 mt-2">
                  No online payment required. Orders and delivery logistics are handled directly via verified WhatsApp with our Lahore publishing team.
                </p>
              </div>

              {/* Two Direct WhatsApp Order Buttons */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-800 block">
                  Select Order Type to Continue on WhatsApp:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={schoolOrderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-3 rounded-lg bg-[#0B132B] hover:bg-[#1E293B] text-white text-xs font-semibold shadow-xs transition-colors text-center"
                  >
                    <School className="w-4 h-4 text-[#E8D099]" />
                    <div className="text-left">
                      <div className="leading-tight font-bold">For Schools</div>
                      <div className="text-[10px] text-stone-300">Bulk rates & syllabus inquiry</div>
                    </div>
                  </a>

                  <a
                    href={parentOrderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-3 rounded-lg bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-semibold shadow-xs transition-colors text-center"
                  >
                    <User className="w-4 h-4 text-[#E8D099]" />
                    <div className="text-left">
                      <div className="leading-tight font-bold">For Home / Parents</div>
                      <div className="text-[10px] text-emerald-100">Direct courier to your doorstep</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
