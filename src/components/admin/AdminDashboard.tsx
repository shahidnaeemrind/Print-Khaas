import React, { useState, useEffect } from 'react';
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  CheckCircle,
  XCircle,
  Search,
  SlidersHorizontal,
  Settings,
  HelpCircle,
  Database,
  ArrowLeft,
  Sparkles,
  BookOpen,
  LogOut,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { Product, CompanySettings, GlobalSeoSettings } from '../../types';
import {
  getAllProductsAdmin,
  deleteProduct,
  updateProduct,
  duplicateProduct,
  seedInitialProducts
} from '../../services/productService';
import { formatPKR } from '../../utils/whatsapp';
import { useAuth } from '../../context/AuthContext';
import { ProductForm } from './ProductForm';
import { CompanySettingsForm } from './CompanySettingsForm';
import { SeoSettingsForm } from './SeoSettingsForm';
import { ProductPreviewModal } from './ProductPreviewModal';
import { AdminAccessGuideModal } from './AdminAccessGuideModal';
import { Globe } from 'lucide-react';

interface AdminDashboardProps {
  onBackToStore: () => void;
  companySettings: CompanySettings;
  onCompanySettingsUpdated: (newSettings: CompanySettings) => void;
  seoSettings: GlobalSeoSettings;
  onSeoSettingsUpdated: (newSettings: GlobalSeoSettings) => void;
  onProductChange: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToStore,
  companySettings,
  onCompanySettingsUpdated,
  seoSettings,
  onSeoSettingsUpdated,
  onProductChange,
}) => {
  const { adminUser, logout } = useAuth();

  // Navigation tabs
  const [currentTab, setCurrentTab] = useState<'products' | 'add' | 'edit' | 'settings' | 'seo'>('products');

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Search and filter in admin
  const [adminSearch, setAdminSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modals state
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null);
  const [selectedProductForPreview, setSelectedProductForPreview] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [showSecurityGuide, setShowSecurityGuide] = useState(false);
  const [seedingLoading, setSeedingLoading] = useState(false);

  // Categories list derived from existing products
  const defaultCategories = [
    'School Packages',
    'Character Building',
    'Early Learning',
    'Urdu Literature',
    'Science & Exploration',
    'Activity & Workbooks',
  ];
  const allCategories = Array.from(
    new Set([...defaultCategories, ...products.map((p) => p.category).filter(Boolean)])
  );

  const fetchAdminProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProductsAdmin();
      setProducts(data);
    } catch (err: any) {
      console.error('Error fetching admin products:', err);
      setError('Failed to load products from Cloud Firestore. Verify security rules.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProducts();
  }, []);

  const handleTogglePublish = async (product: Product) => {
    const newStatus = product.status === 'published' ? 'draft' : 'published';
    try {
      await updateProduct(product.id, { status: newStatus });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, status: newStatus } : p))
      );
      setSuccessMsg(
        `"${product.title}" is now ${newStatus === 'published' ? 'Published live' : 'moved to Draft'}.`
      );
      onProductChange();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error('Error toggling status:', err);
      setError(`Failed to update status for ${product.title}.`);
    }
  };

  const handleDuplicate = async (product: Product) => {
    try {
      setLoading(true);
      await duplicateProduct(product);
      await fetchAdminProducts();
      onProductChange();
      setSuccessMsg(`Created draft duplicate of "${product.title}".`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error('Error duplicating product:', err);
      setError('Failed to duplicate product.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setSuccessMsg(`Deleted "${productToDelete.title}" permanently.`);
      setProductToDelete(null);
      onProductChange();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product from Cloud Firestore.');
    }
  };

  const handleSeedInitial = async () => {
    setSeedingLoading(true);
    setError(null);
    try {
      const count = await seedInitialProducts();
      await fetchAdminProducts();
      onProductChange();
      setSuccessMsg(`Successfully populated ${count} curated Print Khaas catalog publications.`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Error seeding data:', err);
      setError('Failed to seed catalog items.');
    } finally {
      setSeedingLoading(false);
    }
  };

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      adminSearch === '' ||
      p.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(adminSearch.toLowerCase()) ||
      p.slug.toLowerCase().includes(adminSearch.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Overview statistics
  const totalCount = products.length;
  const publishedCount = products.filter((p) => p.status === 'published').length;
  const draftCount = products.filter((p) => p.status === 'draft').length;
  const packagesCount = products.filter((p) => p.productType === 'package').length;

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#0B132B]">
      {/* Top Admin Nav */}
      <header className="bg-[#0B132B] text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToStore}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-300 hover:text-white transition-colors py-1 px-2.5 rounded bg-white/10 hover:bg-white/15"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Storefront</span>
              </button>

              <div className="flex items-center gap-2.5">
                <img
                  src="/logo-white.svg"
                  alt="Print Khaas"
                  className="h-8 w-auto object-contain hidden sm:inline-block"
                />
                <span className="font-serif text-lg font-bold tracking-tight">
                  Admin Console
                </span>
                <span className="text-[10px] uppercase font-bold text-[#B8860B] bg-[#B8860B]/20 px-2 py-0.5 rounded border border-[#B8860B]/30 hidden md:inline-block">
                  Verified
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSecurityGuide(true)}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs text-stone-300 hover:text-white py-1 px-2 rounded hover:bg-white/5 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#B8860B]" />
                <span>Security Guide</span>
              </button>

              {adminUser && (
                <div className="text-right hidden md:block">
                  <span className="text-xs font-semibold text-white block">
                    {adminUser.email}
                  </span>
                  <span className="text-[10px] text-emerald-400 block">
                    Verified Administrator
                  </span>
                </div>
              )}

              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-white/10 hover:bg-rose-900/60 text-stone-200 hover:text-white text-xs font-medium transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sub-tabs bar */}
        <div className="bg-[#121B33] border-t border-stone-800 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center space-x-2 py-2 overflow-x-auto">
            <button
              onClick={() => {
                setCurrentTab('products');
                setSelectedProductForEdit(null);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors shrink-0 ${
                currentTab === 'products'
                  ? 'bg-white text-[#0B132B]'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              All Products ({totalCount})
            </button>

            <button
              onClick={() => {
                setSelectedProductForEdit(null);
                setCurrentTab('add');
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors shrink-0 ${
                currentTab === 'add'
                  ? 'bg-white text-[#0B132B]'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Add New Product</span>
            </button>

            <button
              onClick={() => setCurrentTab('settings')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors shrink-0 ${
                currentTab === 'settings'
                  ? 'bg-white text-[#0B132B]'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>Company & WhatsApp Settings</span>
            </button>

            <button
              onClick={() => setCurrentTab('seo')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors shrink-0 ${
                currentTab === 'seo'
                  ? 'bg-white text-[#0B132B]'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-[#E8D099]" />
              <span>Global SEO & Metadata</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Tab 1: Products Overview & Table */}
        {currentTab === 'products' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                  Total Catalog
                </span>
                <span className="text-2xl font-serif font-bold text-[#0B132B]">
                  {totalCount}
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
                  Published Live
                </span>
                <span className="text-2xl font-serif font-bold text-emerald-700">
                  {publishedCount}
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
                  Drafts
                </span>
                <span className="text-2xl font-serif font-bold text-amber-700">
                  {draftCount}
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
                <span className="text-[11px] font-bold text-[#996515] uppercase tracking-wider block">
                  School Packages
                </span>
                <span className="text-2xl font-serif font-bold text-[#0B132B]">
                  {packagesCount}
                </span>
              </div>
            </div>

            {/* Filter and Action Header */}
            <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-1 items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    placeholder="Search by title or category..."
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-stone-200 focus:border-[#0B132B]"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="py-2 px-2.5 text-xs rounded-lg border border-stone-200 font-medium"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Drafts</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="py-2 px-2.5 text-xs rounded-lg border border-stone-200 font-medium hidden md:inline-block"
                >
                  <option value="all">All Categories</option>
                  {allCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {products.length === 0 && (
                  <button
                    onClick={handleSeedInitial}
                    disabled={seedingLoading}
                    className="inline-flex items-center gap-1.5 py-2 px-3 rounded-lg bg-[#EFECE3] hover:bg-[#E5DECD] text-[#0B132B] text-xs font-bold border border-[#DCD5C0] transition-colors"
                  >
                    <Database className="w-3.5 h-3.5 text-[#B8860B]" />
                    <span>{seedingLoading ? 'Populating...' : 'Seed Initial Catalog'}</span>
                  </button>
                )}

                <button
                  onClick={fetchAdminProducts}
                  className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50"
                  title="Refresh list"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setSelectedProductForEdit(null);
                    setCurrentTab('add');
                  }}
                  className="inline-flex items-center gap-1.5 py-2 px-4 rounded-lg bg-[#0B132B] hover:bg-[#1E293B] text-white text-xs font-bold shadow-xs transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4 text-[#E8D099]" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-xs text-stone-500">
                  Loading publications from Cloud Firestore...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <BookOpen className="w-10 h-10 text-stone-400 mx-auto" />
                  <h3 className="font-serif text-base font-bold text-stone-800">
                    No publications found
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    {products.length === 0
                      ? 'Your Firestore database has no products yet. Click "Seed Initial Catalog" or create your first publication.'
                      : 'No publications match your search query.'}
                  </p>
                  {products.length === 0 && (
                    <button
                      onClick={handleSeedInitial}
                      disabled={seedingLoading}
                      className="inline-flex items-center gap-2 py-2.5 px-4 rounded-lg bg-[#0B132B] text-white text-xs font-bold mt-2 shadow-xs"
                    >
                      <Database className="w-4 h-4 text-[#E8D099]" />
                      <span>Seed Curated Catalog Publications</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAFAF7] border-b border-stone-200 text-stone-500 uppercase font-semibold">
                      <tr>
                        <th className="py-3 px-4">Publication</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Pricing</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Featured</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              {p.coverImage ? (
                                <img
                                  src={p.coverImage}
                                  alt=""
                                  className="w-10 h-14 object-cover rounded border border-stone-200 shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-14 bg-stone-100 rounded border border-stone-200 flex items-center justify-center shrink-0">
                                  <BookOpen className="w-4 h-4 text-stone-400" />
                                </div>
                              )}
                              <div>
                                <span className="font-serif font-bold text-stone-900 block line-clamp-1">
                                  {p.title}
                                </span>
                                <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
                                  <span className="font-mono">{p.slug}</span>
                                  {p.gradeRange && <span>&bull; {p.gradeRange}</span>}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-stone-100 text-stone-700">
                              {p.category}
                            </span>
                            <span className="text-[10px] text-stone-400 block mt-0.5 capitalize">
                              {p.productType}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            {p.parentPrice ? (
                              <span className="font-bold text-stone-800 block">
                                {formatPKR(p.parentPrice)}
                              </span>
                            ) : null}
                            {p.schoolPrice ? (
                              <span className="text-[11px] text-emerald-700 font-semibold block">
                                School: {formatPKR(p.schoolPrice)}
                              </span>
                            ) : null}
                            {!p.parentPrice && !p.schoolPrice && (
                              <span className="text-stone-400 italic">Inquiry only</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleTogglePublish(p)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                                p.status === 'published'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                              }`}
                              title="Click to toggle publish status"
                            >
                              {p.status === 'published' ? (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                  <span>Published</span>
                                </>
                              ) : (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                                  <span>Draft</span>
                                </>
                              )}
                            </button>
                          </td>

                          <td className="py-3.5 px-4">
                            {p.featured ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#996515]">
                                <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
                                <span>Yes</span>
                              </span>
                            ) : (
                              <span className="text-stone-400 text-[11px]">No</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedProductForPreview(p)}
                                className="p-1.5 text-stone-500 hover:text-stone-900 rounded hover:bg-stone-100"
                                title="Live Preview"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedProductForEdit(p);
                                  setCurrentTab('edit');
                                }}
                                className="p-1.5 text-stone-500 hover:text-stone-900 rounded hover:bg-stone-100"
                                title="Edit Product"
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDuplicate(p)}
                                className="p-1.5 text-stone-500 hover:text-stone-900 rounded hover:bg-stone-100"
                                title="Duplicate to draft"
                              >
                                <Copy className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => setProductToDelete(p)}
                                className="p-1.5 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Add Product */}
        {currentTab === 'add' && (
          <ProductForm
            categoriesList={allCategories}
            onSuccess={() => {
              fetchAdminProducts();
              onProductChange();
              setCurrentTab('products');
              setSuccessMsg('New publication successfully created!');
              setTimeout(() => setSuccessMsg(null), 3000);
            }}
            onCancel={() => setCurrentTab('products')}
          />
        )}

        {/* Tab 3: Edit Product */}
        {currentTab === 'edit' && selectedProductForEdit && (
          <ProductForm
            initialProduct={selectedProductForEdit}
            categoriesList={allCategories}
            onSuccess={() => {
              fetchAdminProducts();
              onProductChange();
              setCurrentTab('products');
              setSelectedProductForEdit(null);
              setSuccessMsg('Publication successfully updated in Cloud Firestore!');
              setTimeout(() => setSuccessMsg(null), 3000);
            }}
            onCancel={() => {
              setSelectedProductForEdit(null);
              setCurrentTab('products');
            }}
          />
        )}

        {/* Tab 4: Company Settings */}
        {currentTab === 'settings' && (
          <CompanySettingsForm
            initialSettings={companySettings}
            onSaved={(newSettings) => {
              onCompanySettingsUpdated(newSettings);
            }}
          />
        )}

        {/* Tab 5: Global SEO Settings */}
        {currentTab === 'seo' && (
          <SeoSettingsForm
            initialSeoSettings={seoSettings}
            onSaved={(newSeo) => {
              onSeoSettingsUpdated(newSeo);
            }}
          />
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B132B]/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Confirm Product Deletion
              </h3>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-stone-900">&ldquo;{productToDelete.title}&rdquo;</strong> from Cloud Firestore? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-xs"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {selectedProductForPreview && (
        <ProductPreviewModal
          product={selectedProductForPreview}
          onClose={() => setSelectedProductForPreview(null)}
        />
      )}

      {/* Security Guide Modal */}
      {showSecurityGuide && (
        <AdminAccessGuideModal onClose={() => setShowSecurityGuide(false)} />
      )}
    </div>
  );
};
