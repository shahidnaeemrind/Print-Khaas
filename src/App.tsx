import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Product, CompanySettings, GlobalSeoSettings, FilterState } from './types';
import { getPublishedProducts, seedInitialProducts } from './services/productService';
import {
  getCompanySettings,
  DEFAULT_SETTINGS,
  getGlobalSeoSettings,
  DEFAULT_SEO_SETTINGS
} from './services/settingsService';
import { INITIAL_PRODUCTS } from './data/initialProducts';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductFilters } from './components/ProductFilters';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { OrderModal } from './components/OrderModal';
import { SchoolPackagesSection } from './components/SchoolPackagesSection';
import { ParentsSection } from './components/ParentsSection';
import { AboutSection } from './components/AboutSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { BookOpen, SearchX, RefreshCw, AlertCircle } from 'lucide-react';

function StoreApp() {
  const { currentUser, isAuthorizedAdmin } = useAuth();

  // Navigation & View state
  const [isAdminView, setIsAdminView] = useState(() => {
    return window.location.pathname.startsWith('/admin') || window.location.search.includes('admin=true');
  });
  const [activeTab, setActiveTab] = useState('home');

  // Products and Settings data
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [companySettings, setCompanySettings] = useState<CompanySettings>(DEFAULT_SETTINGS);
  const [seoSettings, setSeoSettings] = useState<GlobalSeoSettings>(DEFAULT_SEO_SETTINGS);

  // Modals state
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [selectedProductOrder, setSelectedProductOrder] = useState<Product | null>(null);

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    grade: 'all',
    audience: 'all',
    productType: 'all',
    sortBy: 'featured',
  });

  // Load Company and SEO Settings
  useEffect(() => {
    async function loadSettings() {
      try {
        const s = await getCompanySettings();
        setCompanySettings(s);
      } catch (e) {
        console.warn('Using default settings');
      }

      try {
        const seo = await getGlobalSeoSettings();
        setSeoSettings(seo);
      } catch (e) {
        console.warn('Using default SEO settings');
      }
    }
    loadSettings();
  }, []);

  // Dynamically apply site-wide SEO metadata (Title prefix, description, favicon, keywords, OG tags)
  useEffect(() => {
    const prefix = seoSettings.titlePrefix || 'Print Khaas';
    if (selectedProductDetails) {
      document.title = `${prefix} - ${selectedProductDetails.title}`;
    } else {
      document.title = `${prefix} - Quality Books & Educational Publishing`;
    }

    // Helper to safely set or create head meta tags
    const setMetaTag = (attr: 'name' | 'property', attrValue: string, content: string) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, attrValue);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMetaTag('name', 'description', seoSettings.defaultDescription || '');
    if (seoSettings.keywords) {
      setMetaTag('name', 'keywords', seoSettings.keywords);
    }
    setMetaTag('property', 'og:title', `${prefix} - Quality Books & Educational Publishing`);
    setMetaTag('property', 'og:description', seoSettings.defaultDescription || '');
    if (seoSettings.ogImageUrl) {
      setMetaTag('property', 'og:image', seoSettings.ogImageUrl);
    }
    if (seoSettings.googleVerification) {
      setMetaTag('name', 'google-site-verification', seoSettings.googleVerification);
    }

    // Update favicon if provided
    if (seoSettings.faviconUrl) {
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.head.appendChild(link);
      }
      link.href = seoSettings.faviconUrl;
    }
  }, [seoSettings, selectedProductDetails]);

  // Fetch Published Products
  const loadProducts = async () => {
    setLoadingProducts(true);
    setFetchError(null);
    try {
      let published = await getPublishedProducts();
      // If Firestore is fresh and has no products yet, automatically seed the initial catalog
      if (published.length === 0) {
        try {
          await seedInitialProducts();
          published = await getPublishedProducts();
        } catch (seedErr) {
          console.warn('Initial seeding note:', seedErr);
        }
      }
      setProducts(published);
    } catch (err: any) {
      console.error('Error loading products from Firestore:', err);
      setFetchError('Unable to load catalog from Firestore. Please try again.');
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Check URL query parameters for ?book=slug on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bookSlug = params.get('book');
    if (bookSlug && products.length > 0) {
      const match = products.find((p) => p.slug === bookSlug);
      if (match) {
        setSelectedProductDetails(match);
      }
    }
  }, [products]);

  // Handle URL history state for admin
  const handleOpenAdmin = () => {
    setIsAdminView(true);
    window.history.pushState({}, '', '/admin');
  };

  const handleBackToStore = () => {
    setIsAdminView(false);
    window.history.pushState({}, '', '/');
  };

  // Derive unique categories from products
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search filter
        if (filters.search) {
          const q = filters.search.toLowerCase().trim();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          const matchGrade = p.gradeRange?.toLowerCase().includes(q) || false;
          const matchDesc = p.shortDescription?.toLowerCase().includes(q) || false;
          if (!matchTitle && !matchCategory && !matchGrade && !matchDesc) {
            return false;
          }
        }

        // Category filter
        if (filters.category !== 'all' && p.category !== filters.category) {
          return false;
        }

        // Grade filter
        if (filters.grade !== 'all' && p.gradeRange) {
          if (!p.gradeRange.toLowerCase().includes(filters.grade.toLowerCase())) {
            return false;
          }
        }

        // Audience filter
        if (filters.audience !== 'all') {
          if (p.targetAudience !== 'both' && p.targetAudience !== filters.audience) {
            return false;
          }
        }

        // Product Type filter
        if (filters.productType !== 'all' && p.productType !== filters.productType) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'featured') {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (a.sortOrder ?? 99) - (b.sortOrder ?? 99);
        }
        if (filters.sortBy === 'newest') {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeB - timeA;
        }
        if (filters.sortBy === 'priceAsc') {
          const priceA = a.parentPrice || a.schoolPrice || 0;
          const priceB = b.parentPrice || b.schoolPrice || 0;
          return priceA - priceB;
        }
        if (filters.sortBy === 'priceDesc') {
          const priceA = a.parentPrice || a.schoolPrice || 0;
          const priceB = b.parentPrice || b.schoolPrice || 0;
          return priceB - priceA;
        }
        if (filters.sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [products, filters]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      grade: 'all',
      audience: 'all',
      productType: 'all',
      sortBy: 'featured',
    });
  };

  // If in Admin View
  if (isAdminView) {
    if (currentUser && isAuthorizedAdmin) {
      return (
        <AdminDashboard
          onBackToStore={handleBackToStore}
          companySettings={companySettings}
          onCompanySettingsUpdated={(newSettings) => setCompanySettings(newSettings)}
          seoSettings={seoSettings}
          onSeoSettingsUpdated={(newSeo) => setSeoSettings(newSeo)}
          onProductChange={loadProducts}
        />
      );
    }
    return <AdminLogin onBackToStore={handleBackToStore} />;
  }

  // Public Storefront View
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7] text-[#0B132B]">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={companySettings}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Hero Section */}
      <Hero
        settings={companySettings}
        onExploreClick={() => {
          setActiveTab('catalog');
          const element = document.getElementById('catalog');
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
        onSchoolPackagesClick={() => {
          setActiveTab('school-packages');
          const element = document.getElementById('school-packages');
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Catalogue Section */}
      <main id="catalog" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E8E5DD]">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#B8860B] block mb-1">
                Print Khaas Publications
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B132B]">
                Books, Workbooks & School Packages
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md">
              Order directly on WhatsApp for institutional school discounts or doorstep home courier across Pakistan.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <ProductFilters
          filters={filters}
          setFilters={setFilters}
          categories={categoriesList}
          totalResults={filteredProducts.length}
          onResetFilters={handleResetFilters}
        />

        {/* Error message if Firestore fetch fails */}
        {fetchError && (
          <div className="p-4 mb-6 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>{fetchError}</span>
            </div>
            <button
              onClick={loadProducts}
              className="inline-flex items-center gap-1 font-semibold text-[#0B132B] hover:underline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Products Grid */}
        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs animate-pulse flex flex-col"
              >
                <div className="aspect-4/5 bg-stone-200 rounded-lg mb-4" />
                <div className="h-4 bg-stone-200 rounded w-1/3 mb-2" />
                <div className="h-5 bg-stone-200 rounded w-3/4 mb-3" />
                <div className="h-3 bg-stone-100 rounded w-full mb-2" />
                <div className="h-3 bg-stone-100 rounded w-2/3 mb-4" />
                <div className="mt-auto pt-3 border-t border-stone-100 flex gap-2">
                  <div className="h-8 bg-stone-200 rounded flex-1" />
                  <div className="h-8 bg-stone-200 rounded flex-1" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-lg mx-auto shadow-2xs my-8">
            <div className="w-16 h-16 rounded-full bg-stone-100 mx-auto flex items-center justify-center mb-4 text-stone-400">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#0B132B] mb-2">
              No matching publications found
            </h3>
            <p className="text-xs text-stone-500 mb-6 leading-relaxed">
              We couldn&apos;t find any books matching your current search or filters. Try adjusting your search keywords or resetting filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0B132B] hover:bg-[#1E293B] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetails={(p) => setSelectedProductDetails(p)}
                onOpenOrder={(p) => setSelectedProductOrder(p)}
                whatsappNumber={companySettings.whatsappNumber}
              />
            ))}
          </div>
        )}
      </main>

      {/* Institutional School Packages Showcase */}
      <SchoolPackagesSection
        settings={companySettings}
        onViewSchoolPackages={() => {
          setFilters((prev) => ({
            ...prev,
            productType: 'package',
            category: 'all',
            search: '',
          }));
          const element = document.getElementById('catalog');
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* For Parents Section */}
      <ParentsSection
        settings={companySettings}
        onFilterForParents={() => {
          setFilters((prev) => ({
            ...prev,
            audience: 'parents',
            productType: 'all',
            category: 'all',
            search: '',
          }));
          const element = document.getElementById('catalog');
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* About Us Section */}
      <AboutSection settings={companySettings} />

      {/* Frequently Asked Questions */}
      <FaqSection settings={companySettings} />

      {/* Contact Section */}
      <ContactSection settings={companySettings} />

      {/* Footer */}
      <Footer
        settings={companySettings}
        onNavigate={(id) => {
          setActiveTab(id);
          const element = document.getElementById(id);
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Floating WhatsApp Action */}
      <FloatingWhatsApp whatsappNumber={companySettings.whatsappNumber} />

      {/* Product Details Modal */}
      {selectedProductDetails && (
        <ProductDetailsModal
          product={selectedProductDetails}
          onClose={() => setSelectedProductDetails(null)}
          whatsappNumber={companySettings.whatsappNumber}
        />
      )}

      {/* Quick Order Modal */}
      {selectedProductOrder && (
        <OrderModal
          product={selectedProductOrder}
          onClose={() => setSelectedProductOrder(null)}
          whatsappNumber={companySettings.whatsappNumber}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreApp />
    </AuthProvider>
  );
}
