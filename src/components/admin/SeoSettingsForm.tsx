import React, { useState } from 'react';
import {
  Globe,
  Save,
  CheckCircle,
  AlertCircle,
  Search,
  Eye,
  Image as ImageIcon,
  Key,
  Smartphone,
  Monitor,
  ExternalLink
} from 'lucide-react';
import { GlobalSeoSettings } from '../../types';
import { updateGlobalSeoSettings } from '../../services/settingsService';

interface SeoSettingsFormProps {
  initialSeoSettings: GlobalSeoSettings;
  onSaved: (newSeoSettings: GlobalSeoSettings) => void;
}

export const SeoSettingsForm: React.FC<SeoSettingsFormProps> = ({
  initialSeoSettings,
  onSaved,
}) => {
  const [titlePrefix, setTitlePrefix] = useState(initialSeoSettings.titlePrefix || 'Print Khaas');
  const [defaultDescription, setDefaultDescription] = useState(
    initialSeoSettings.defaultDescription || ''
  );
  const [faviconUrl, setFaviconUrl] = useState(initialSeoSettings.faviconUrl || '');
  const [keywords, setKeywords] = useState(initialSeoSettings.keywords || '');
  const [ogImageUrl, setOgImageUrl] = useState(initialSeoSettings.ogImageUrl || '');
  const [googleVerification, setGoogleVerification] = useState(
    initialSeoSettings.googleVerification || ''
  );

  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const descLength = defaultDescription.length;
  const isDescIdealLength = descLength >= 120 && descLength <= 160;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titlePrefix.trim()) {
      setError('Title prefix is required');
      return;
    }
    if (!defaultDescription.trim()) {
      setError('Default meta description is required');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const updated: GlobalSeoSettings = {
        titlePrefix: titlePrefix.trim(),
        defaultDescription: defaultDescription.trim(),
        faviconUrl: faviconUrl.trim() || undefined,
        keywords: keywords.trim() || undefined,
        ogImageUrl: ogImageUrl.trim() || undefined,
        googleVerification: googleVerification.trim() || undefined,
      };

      await updateGlobalSeoSettings(updated);
      setSuccess(true);
      onSaved(updated);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error updating SEO settings in Firestore:', err);
      setError(err.message || 'Failed to update SEO settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 pb-5 border-b border-stone-200">
        <div className="w-10 h-10 rounded-xl bg-[#0B132B] text-[#E8D099] flex items-center justify-center shadow-xs">
          <Globe className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif text-xl font-bold text-[#0B132B]">
            Global Site-Wide SEO & Search Appearance
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure how Print Khaas appears on Google, Bing, social media previews, and browser tab headers.
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">
            Global SEO metadata successfully saved and applied to your storefront!
          </span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Google Search Result Preview Simulator */}
      <div className="p-5 rounded-xl bg-stone-50 border border-stone-200/90 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>Google Search Result Snippet Preview</span>
          </span>

          <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-stone-200">
            <button
              type="button"
              onClick={() => setPreviewDevice('desktop')}
              className={`p-1 rounded text-xs flex items-center gap-1 font-medium transition-colors ${
                previewDevice === 'desktop' ? 'bg-[#0B132B] text-white' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('mobile')}
              className={`p-1 rounded text-xs flex items-center gap-1 font-medium transition-colors ${
                previewDevice === 'mobile' ? 'bg-[#0B132B] text-white' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>
        </div>

        {/* The Google Card Simulation */}
        <div className="bg-white p-4 rounded-xl border border-stone-300 font-sans shadow-2xs max-w-xl">
          {/* Breadcrumb / URL */}
          <div className="flex items-center gap-2 text-xs text-stone-700 mb-1">
            {faviconUrl ? (
              <img
                src={faviconUrl}
                alt="Favicon preview"
                className="w-4 h-4 rounded-full object-cover border border-stone-200"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-4 h-4 rounded-full bg-stone-300 flex items-center justify-center text-[8px] font-bold">
                P
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-stone-900 leading-none">
                {titlePrefix || 'Print Khaas'}
              </span>
              <span className="text-[10px] text-stone-500 leading-none mt-0.5 font-mono">
                https://printkhaas.com &rsaquo; lahore
              </span>
            </div>
          </div>

          {/* Title */}
          <h4 className="text-base sm:text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug line-clamp-1">
            {titlePrefix ? `${titlePrefix} - Quality Books & Educational Publishing` : 'Print Khaas'}
          </h4>

          {/* Description */}
          <p className="text-xs text-[#4d5156] mt-1 leading-relaxed line-clamp-2">
            {defaultDescription ||
              'Quality children books, school syllabus packages, and educational publishing based in Lahore, Pakistan.'}
          </p>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Field 1: Title Prefix */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-stone-800">
              Global Title Prefix / Brand Name <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-stone-400">Pre-pended to all page and product titles</span>
          </div>
          <input
            type="text"
            value={titlePrefix}
            onChange={(e) => setTitlePrefix(e.target.value)}
            placeholder="e.g. Print Khaas"
            className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-xs sm:text-sm text-stone-900 focus:border-[#0B132B] focus:ring-1 focus:ring-[#0B132B]"
            required
          />
          <p className="text-[11px] text-stone-500 mt-1">
            Format: <strong className="font-mono">{titlePrefix || 'Print Khaas'} - [Product / Page Name]</strong>
          </p>
        </div>

        {/* Field 2: Default Description */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-stone-800">
              Default Meta Description <span className="text-rose-500">*</span>
            </label>
            <span
              className={`text-[11px] font-semibold ${
                isDescIdealLength
                  ? 'text-emerald-600'
                  : descLength > 160
                  ? 'text-rose-600'
                  : 'text-stone-400'
              }`}
            >
              {descLength} / 160 chars {isDescIdealLength && '(Optimal Google length)'}
            </span>
          </div>
          <textarea
            rows={3}
            value={defaultDescription}
            onChange={(e) => setDefaultDescription(e.target.value)}
            placeholder="Comprehensive description of Print Khaas, books published, Lahore heritage, and school package offerings..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-xs sm:text-sm text-stone-900 focus:border-[#0B132B] focus:ring-1 focus:ring-[#0B132B]"
            required
          />
          <p className="text-[11px] text-stone-500 mt-1">
            Google typically displays the first 150&ndash;160 characters in search results.
          </p>
        </div>

        {/* Field 3: Favicon URL */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1">
            Browser Favicon URL (.ico / .png / .svg)
          </label>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0 overflow-hidden">
              {faviconUrl ? (
                <img
                  src={faviconUrl}
                  alt="Favicon"
                  className="w-7 h-7 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <Globe className="w-5 h-5 text-stone-400" />
              )}
            </div>
            <input
              type="url"
              value={faviconUrl}
              onChange={(e) => setFaviconUrl(e.target.value)}
              placeholder="https://example.com/favicon.png"
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:border-[#0B132B]"
            />
          </div>
          <span className="text-[10px] text-stone-400 mt-1 block">
            This icon appears on browser tabs and Google mobile search results.
          </span>
        </div>

        {/* Field 4: OpenGraph Social Image URL */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1">
            Social Share Preview Image URL (og:image)
          </label>
          <div className="flex items-start gap-4">
            <input
              type="url"
              value={ogImageUrl}
              onChange={(e) => setOgImageUrl(e.target.value)}
              placeholder="https://example.com/og-banner.jpg"
              className="flex-1 px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:border-[#0B132B]"
            />
            {ogImageUrl && (
              <img
                src={ogImageUrl}
                alt="OG Preview"
                className="w-20 h-12 rounded object-cover border border-stone-300 shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            )}
          </div>
          <span className="text-[10px] text-stone-400 mt-1 block">
            Recommended size: 1200 x 630 pixels. Appears when sharing links on WhatsApp, Facebook, or Twitter.
          </span>
        </div>

        {/* Field 5: Keywords */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1">
            Meta Keywords (Comma separated)
          </label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="print khaas, lahore books, school syllabus packages, urdu kaidah, children books pakistan"
            className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:border-[#0B132B]"
          />
        </div>

        {/* Field 6: Google Site Verification */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center justify-between">
            <span>Google Search Console Verification Code</span>
            <span className="text-[10px] text-stone-400 font-normal">Optional</span>
          </label>
          <input
            type="text"
            value={googleVerification}
            onChange={(e) => setGoogleVerification(e.target.value)}
            placeholder="e.g. google-site-verification=abc123xyz"
            className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs font-mono text-stone-900 focus:border-[#0B132B]"
          />
          <span className="text-[10px] text-stone-400 mt-1 block">
            Paste your Google Search Console HTML meta tag content code to claim your domain ownership.
          </span>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-stone-200 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0B132B] hover:bg-[#1E293B] text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#E8D099]" />
            <span>{saving ? 'Updating SEO...' : 'Save Global SEO Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
