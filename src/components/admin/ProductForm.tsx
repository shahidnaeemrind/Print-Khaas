import React, { useState, useEffect } from 'react';
import {
  Save,
  Eye,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Link2,
  Image as ImageIcon,
  Book,
  Package,
  Layers,
  Search
} from 'lucide-react';
import { Product, ProductType, TargetAudience, StockStatus, ProductStatus } from '../../types';
import { slugify, createProduct, updateProduct } from '../../services/productService';
import { ProductPreviewModal } from './ProductPreviewModal';

interface ProductFormProps {
  initialProduct?: Product | null;
  onSuccess: (savedProduct: Product) => void;
  onCancel: () => void;
  categoriesList: string[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialProduct,
  onSuccess,
  onCancel,
  categoriesList,
}) => {
  const isEditing = Boolean(initialProduct?.id);

  // Form State
  const [title, setTitle] = useState(initialProduct?.title || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [shortDescription, setShortDescription] = useState(initialProduct?.shortDescription || '');
  const [fullDescription, setFullDescription] = useState(initialProduct?.fullDescription || '');
  const [productType, setProductType] = useState<ProductType>(initialProduct?.productType || 'individual');
  const [category, setCategory] = useState(initialProduct?.category || categoriesList[0] || 'Early Learning');
  const [customCategory, setCustomCategory] = useState('');
  const [targetAudience, setTargetAudience] = useState<TargetAudience>(initialProduct?.targetAudience || 'both');
  const [gradeRange, setGradeRange] = useState(initialProduct?.gradeRange || '');
  const [language, setLanguage] = useState(initialProduct?.language || 'English & Urdu');
  const [pages, setPages] = useState(initialProduct?.pages || '');
  const [dimensions, setDimensions] = useState(initialProduct?.dimensions || '');
  const [binding, setBinding] = useState(initialProduct?.binding || '');
  const [coverImage, setCoverImage] = useState(initialProduct?.coverImage || '');
  const [additionalImagesText, setAdditionalImagesText] = useState(
    initialProduct?.additionalImages?.join('\n') || ''
  );
  const [parentPrice, setParentPrice] = useState<string>(
    initialProduct?.parentPrice !== undefined ? String(initialProduct.parentPrice) : ''
  );
  const [schoolPrice, setSchoolPrice] = useState<string>(
    initialProduct?.schoolPrice !== undefined ? String(initialProduct.schoolPrice) : ''
  );
  const [originalPrice, setOriginalPrice] = useState<string>(
    initialProduct?.originalPrice !== undefined ? String(initialProduct.originalPrice) : ''
  );
  const [discount, setDiscount] = useState(initialProduct?.discount || '');
  const [youtubeUrl, setYoutubeUrl] = useState(initialProduct?.youtubeUrl || '');
  const [drivePdfUrl, setDrivePdfUrl] = useState(initialProduct?.drivePdfUrl || '');
  const [tableOfContents, setTableOfContents] = useState(initialProduct?.tableOfContents || '');
  const [learningOutcomes, setLearningOutcomes] = useState(initialProduct?.learningOutcomes || '');
  const [minOrderQuantity, setMinOrderQuantity] = useState<string>(
    initialProduct?.minOrderQuantity !== undefined ? String(initialProduct.minOrderQuantity) : ''
  );
  const [stockStatus, setStockStatus] = useState<StockStatus>(initialProduct?.stockStatus || 'in_stock');
  const [featured, setFeatured] = useState<boolean>(initialProduct?.featured || false);
  const [status, setStatus] = useState<ProductStatus>(initialProduct?.status || 'published');
  const [sortOrder, setSortOrder] = useState<number>(initialProduct?.sortOrder ?? 10);
  const [seoTitle, setSeoTitle] = useState(initialProduct?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(initialProduct?.seoDescription || '');

  // UI state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Auto slug generation if not manually customized
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManuallyEdited && !isEditing) {
      setSlug(slugify(val));
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim()) {
      errs.title = 'Product title is required';
    }
    if (!slug.trim()) {
      errs.slug = 'URL slug is required';
    }
    const finalCategory = customCategory.trim() || category;
    if (!finalCategory) {
      errs.category = 'Please select or enter a category';
    }
    if (youtubeUrl && !youtubeUrl.startsWith('http')) {
      errs.youtubeUrl = 'YouTube link must start with http:// or https://';
    }
    if (drivePdfUrl && !drivePdfUrl.startsWith('http')) {
      errs.drivePdfUrl = 'Drive PDF link must start with http:// or https://';
    }
    if (coverImage && !coverImage.startsWith('http')) {
      errs.coverImage = 'Cover image URL must start with http:// or https://';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const getCleanProductObject = (): Product => {
    const additionalImages = additionalImagesText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && (s.startsWith('http://') || s.startsWith('https://')));

    const finalCategory = customCategory.trim() || category;

    return {
      id: initialProduct?.id || slug,
      title: title.trim(),
      slug: slug.trim() || slugify(title),
      shortDescription: shortDescription.trim() || undefined,
      fullDescription: fullDescription.trim() || undefined,
      productType,
      category: finalCategory,
      targetAudience,
      gradeRange: gradeRange.trim() || undefined,
      language: language.trim() || undefined,
      pages: pages.trim() || undefined,
      dimensions: dimensions.trim() || undefined,
      binding: binding.trim() || undefined,
      coverImage: coverImage.trim() || undefined,
      additionalImages: additionalImages.length > 0 ? additionalImages : undefined,
      parentPrice: parentPrice ? parseFloat(parentPrice) : undefined,
      schoolPrice: schoolPrice ? parseFloat(schoolPrice) : undefined,
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      discount: discount.trim() || undefined,
      youtubeUrl: youtubeUrl.trim() || undefined,
      drivePdfUrl: drivePdfUrl.trim() || undefined,
      tableOfContents: tableOfContents.trim() || undefined,
      learningOutcomes: learningOutcomes.trim() || undefined,
      minOrderQuantity: minOrderQuantity ? parseInt(minOrderQuantity, 10) : undefined,
      stockStatus,
      featured,
      status,
      sortOrder: Number(sortOrder) || 10,
      seoTitle: seoTitle.trim() || undefined,
      seoDescription: seoDescription.trim() || undefined,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      const productData = getCleanProductObject();
      if (isEditing && initialProduct?.id) {
        await updateProduct(initialProduct.id, productData);
        onSuccess(productData);
      } else {
        const newId = await createProduct(productData, productData.slug);
        onSuccess({ ...productData, id: newId });
      }
    } catch (err: any) {
      console.error('Error saving product:', err);
      setSaveError(err.message || 'Failed to save product to Firestore. Check permissions.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products List</span>
          </button>
          <h2 className="font-serif text-2xl font-bold text-[#0B132B]">
            {isEditing ? `Edit: ${initialProduct?.title}` : 'Add New Book or School Package'}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Complete the 25 product attributes. You can preview before publishing or save as Draft.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
          >
            <Eye className="w-4 h-4 text-[#B8860B]" />
            <span>Preview in Catalog</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#0B132B] hover:bg-[#1E293B] text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#E8D099]" />
            <span>{saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Publication'}</span>
          </button>
        </div>
      </div>

      {saveError && (
        <div className="my-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Save Error:</span>
            <span>{saveError}</span>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Section 1: Core Essentials */}
        <div className="space-y-4">
          <h3 className="font-serif text-base font-bold text-[#0B132B] flex items-center gap-2 pb-2 border-b border-stone-100">
            <Book className="w-4 h-4 text-[#B8860B]" />
            <span>1. Core Essentials</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8">
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Product Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Asan Urdu Kaidah & Haroof Silsila (Level 1)"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm text-stone-900 focus:ring-1 ${
                  errors.title ? 'border-rose-300 focus:border-rose-500' : 'border-stone-300 focus:border-[#0B132B]'
                }`}
              />
              {errors.title && <p className="text-[11px] text-rose-600 mt-1">{errors.title}</p>}
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Product Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value as ProductType)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-xs sm:text-sm text-stone-900 focus:border-[#0B132B]"
              >
                <option value="individual">Individual Book</option>
                <option value="package">School Book Package</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6">
              <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center justify-between">
                <span>URL Slug <span className="text-rose-500">*</span></span>
                <span className="text-[10px] text-stone-400 font-normal">Used in page links</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setIsSlugManuallyEdited(true);
                }}
                className={`w-full px-3.5 py-2 rounded-lg border text-xs font-mono text-stone-800 ${
                  errors.slug ? 'border-rose-300' : 'border-stone-300'
                }`}
              />
              {errors.slug && <p className="text-[11px] text-rose-600 mt-1">{errors.slug}</p>}
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-stone-800 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900"
              >
                {categoriesList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value="custom">+ Add Custom Category</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-stone-800 mb-1">Target Audience</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as TargetAudience)}
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900"
              >
                <option value="both">Both Schools & Parents</option>
                <option value="schools">Schools Only (Bulk)</option>
                <option value="parents">Parents / Home Only</option>
              </select>
            </div>
          </div>

          {category === 'custom' && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Custom Category Name
              </label>
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter new category name..."
                className="w-full max-w-sm px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Short Description (Catalog cards)
            </label>
            <textarea
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="1-2 sentences highlighting age, subject, and value proposition..."
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm text-stone-900 focus:border-[#0B132B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Full Description (Details modal)
            </label>
            <textarea
              rows={4}
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="In-depth overview, pedagogical alignment, teacher recommendations, etc."
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm text-stone-900 focus:border-[#0B132B]"
            />
          </div>
        </div>

        {/* Section 2: Book Specifications */}
        <div className="space-y-4 pt-4 border-t border-stone-200">
          <h3 className="font-serif text-base font-bold text-[#0B132B] flex items-center gap-2 pb-2 border-b border-stone-100">
            <Layers className="w-4 h-4 text-[#B8860B]" />
            <span>2. Academic & Physical Specifications</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Grade / Class Range</label>
              <input
                type="text"
                value={gradeRange}
                onChange={(e) => setGradeRange(e.target.value)}
                placeholder="e.g. Nursery - Prep, Class 1-3, or Class 5"
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Language</label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="e.g. English, Urdu, or Bilingual"
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Volume / Pages</label>
              <input
                type="text"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                placeholder="e.g. 80 Pages or 5 Books Set"
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Dimensions</label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="e.g. 8.5 x 11 inches or Standard A4"
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Binding Type</label>
              <input
                type="text"
                value={binding}
                onChange={(e) => setBinding(e.target.value)}
                placeholder="e.g. Saddle Stitch, Wire-O Spiral, Perfect Bound Hardcover"
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Pricing & Minimum Orders */}
        <div className="space-y-4 pt-4 border-t border-stone-200">
          <h3 className="font-serif text-base font-bold text-[#0B132B] flex items-center gap-2 pb-2 border-b border-stone-100">
            <span>3. Pricing & Minimum Quantities (PKR)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Parent / Retail Price</label>
              <input
                type="number"
                min="0"
                step="10"
                value={parentPrice}
                onChange={(e) => setParentPrice(e.target.value)}
                placeholder="e.g. 650"
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">School Institutional Price</label>
              <input
                type="number"
                min="0"
                step="10"
                value={schoolPrice}
                onChange={(e) => setSchoolPrice(e.target.value)}
                placeholder="e.g. 480"
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Original Price (Before discount)</label>
              <input
                type="number"
                min="0"
                step="10"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="e.g. 750"
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Discount Tag (Optional)</label>
              <input
                type="text"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="e.g. 15% Off or Special Bundle"
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Minimum Order Qty (MOQ for Schools)</label>
              <input
                type="number"
                min="1"
                value={minOrderQuantity}
                onChange={(e) => setMinOrderQuantity(e.target.value)}
                placeholder="e.g. 20 (leave blank if no minimum)"
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Stock Availability</label>
              <select
                value={stockStatus}
                onChange={(e) => setStockStatus(e.target.value as StockStatus)}
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900"
              >
                <option value="in_stock">In Stock (Immediate Dispatch)</option>
                <option value="pre_order">Pre-Order / Print on Demand</option>
                <option value="out_of_stock">Temporarily Out of Print</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Imagery & Real External Resources */}
        <div className="space-y-4 pt-4 border-t border-stone-200">
          <h3 className="font-serif text-base font-bold text-[#0B132B] flex items-center gap-2 pb-2 border-b border-stone-100">
            <ImageIcon className="w-4 h-4 text-[#B8860B]" />
            <span>4. Media & Resource Links</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Cover Image URL
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/cover.jpg"
              className={`w-full px-3.5 py-2 rounded-lg border text-xs text-stone-900 ${
                errors.coverImage ? 'border-rose-300' : 'border-stone-300'
              }`}
            />
            {errors.coverImage && <p className="text-[11px] text-rose-600 mt-1">{errors.coverImage}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Additional Image URLs (One URL per line)
            </label>
            <textarea
              rows={2}
              value={additionalImagesText}
              onChange={(e) => setAdditionalImagesText(e.target.value)}
              placeholder="https://example.com/page1.jpg&#10;https://example.com/page2.jpg"
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs font-mono text-stone-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center justify-between">
                <span>YouTube Video Walkthrough URL</span>
                <span className="text-[10px] text-stone-400">Optional</span>
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className={`w-full px-3.5 py-2 rounded-lg border text-xs text-stone-900 ${
                  errors.youtubeUrl ? 'border-rose-300' : 'border-stone-300'
                }`}
              />
              {errors.youtubeUrl && <p className="text-[11px] text-rose-600 mt-1">{errors.youtubeUrl}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center justify-between">
                <span>Google Drive / Sample PDF Preview URL</span>
                <span className="text-[10px] text-stone-400">Optional</span>
              </label>
              <input
                type="url"
                value={drivePdfUrl}
                onChange={(e) => setDrivePdfUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/.../view"
                className={`w-full px-3.5 py-2 rounded-lg border text-xs text-stone-900 ${
                  errors.drivePdfUrl ? 'border-rose-300' : 'border-stone-300'
                }`}
              />
              {errors.drivePdfUrl && <p className="text-[11px] text-rose-600 mt-1">{errors.drivePdfUrl}</p>}
            </div>
          </div>
        </div>

        {/* Section 5: Curriculum Contents & Learning Outcomes */}
        <div className="space-y-4 pt-4 border-t border-stone-200">
          <h3 className="font-serif text-base font-bold text-[#0B132B] flex items-center gap-2 pb-2 border-b border-stone-100">
            <span>5. Syllabus Content & Learning Outcomes</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Table of Contents / Included Books
              </label>
              <textarea
                rows={4}
                value={tableOfContents}
                onChange={(e) => setTableOfContents(e.target.value)}
                placeholder="List chapters or titles included in this book or package..."
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Key Learning Outcomes & Pedagogical Features
              </label>
              <textarea
                rows={4}
                value={learningOutcomes}
                onChange={(e) => setLearningOutcomes(e.target.value)}
                placeholder="Key skills developed: fine motor control, phonetics, moral empathy, etc."
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900"
              />
            </div>
          </div>
        </div>

        {/* Section 6: Publishing Status & SEO */}
        <div className="space-y-4 pt-4 border-t border-stone-200">
          <h3 className="font-serif text-base font-bold text-[#0B132B] flex items-center gap-2 pb-2 border-b border-stone-100">
            <span>6. Publication Status & Sorting</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Publication Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
                className={`w-full px-3.5 py-2 rounded-lg border text-xs font-semibold ${
                  status === 'published'
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : 'border-amber-300 bg-amber-50 text-amber-800'
                }`}
              >
                <option value="published">Published (Visible to Public)</option>
                <option value="draft">Draft (Admin Only)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Sort Priority</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 1)}
                placeholder="1 (highest)"
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900"
              />
              <span className="text-[10px] text-stone-400">Lower numbers appear first</span>
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0B132B] focus:ring-[#0B132B]"
                />
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
                  <span>Highlight as Featured on Homepage</span>
                </span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">SEO Title (Optional)</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Custom title tag for search engines..."
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">SEO Description (Optional)</label>
              <input
                type="text"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Custom meta description..."
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
            >
              Preview
            </button>

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#0B132B] hover:bg-[#1E293B] text-white text-xs font-bold shadow-md transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Publication'}
            </button>
          </div>
        </div>
      </form>

      {/* Live Preview Modal */}
      {showPreviewModal && (
        <ProductPreviewModal
          product={getCleanProductObject()}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </div>
  );
};
