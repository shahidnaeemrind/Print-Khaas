import React, { useState } from 'react';
import { Save, AlertCircle, CheckCircle, Building, MessageCircle } from 'lucide-react';
import { CompanySettings } from '../../types';
import { updateCompanySettings } from '../../services/settingsService';

interface CompanySettingsFormProps {
  initialSettings: CompanySettings;
  onSaved: (newSettings: CompanySettings) => void;
}

export const CompanySettingsForm: React.FC<CompanySettingsFormProps> = ({
  initialSettings,
  onSaved,
}) => {
  const [brandName, setBrandName] = useState(initialSettings.brandName || 'Print Khaas');
  const [tagline, setTagline] = useState(initialSettings.tagline || 'Quality Books. Meaningful Learning.');
  const [establishedYear, setEstablishedYear] = useState(initialSettings.establishedYear || '2014');
  const [address, setAddress] = useState(initialSettings.address || '283A, Dream Garden, Lahore, Pakistan');
  const [phone, setPhone] = useState(initialSettings.phone || '+92 333 6474186');
  const [whatsappNumber, setWhatsappNumber] = useState(initialSettings.whatsappNumber || '923336474186');
  const [email, setEmail] = useState(initialSettings.email || 'info@printkhaas.com');
  const [announcement, setAnnouncement] = useState(initialSettings.announcement || '');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const updated: CompanySettings = {
        brandName: brandName.trim(),
        tagline: tagline.trim(),
        establishedYear: establishedYear.trim(),
        address: address.trim(),
        phone: phone.trim(),
        whatsappNumber: whatsappNumber.trim().replace(/[^0-9]/g, ''),
        email: email.trim(),
        announcement: announcement.trim(),
      };

      await updateCompanySettings(updated);
      setSuccess(true);
      onSaved(updated);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error updating company settings:', err);
      setError(err.message || 'Failed to update settings in Firestore.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-2.5 pb-4 border-b border-stone-200 mb-6">
        <Building className="w-5 h-5 text-[#B8860B]" />
        <div>
          <h3 className="font-serif text-xl font-bold text-[#0B132B]">
            Company Information & WhatsApp Settings
          </h3>
          <p className="text-xs text-stone-500">
            Updating the WhatsApp number here immediately updates all order buttons across the entire public store.
          </p>
        </div>
      </div>

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">Company settings successfully updated in Cloud Firestore!</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Brand Name</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:border-[#0B132B]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Established Year</label>
            <input
              type="text"
              value={establishedYear}
              onChange={(e) => setEstablishedYear(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:border-[#0B132B]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1">Official Tagline</label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:border-[#0B132B]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              WhatsApp Number (International without +)
            </label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="e.g. 923336474186"
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs font-mono text-stone-900 focus:border-[#0B132B]"
              required
            />
            <span className="text-[10px] text-stone-400 mt-1 block">
              Used in wa.me links for one-click school and parent ordering.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Display Phone / Landline
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +92 333 6474186"
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:border-[#0B132B]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Contact Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:border-[#0B132B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Header Announcement Banner (Optional)
            </label>
            <input
              type="text"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder="e.g. Now taking orders for 2026 Academic Term!"
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:border-[#0B132B]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1">Business Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 283A, Dream Garden, Lahore, Pakistan"
            className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:border-[#0B132B]"
          />
        </div>

        <div className="pt-4 border-t border-stone-200 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0B132B] hover:bg-[#1E293B] text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#E8D099]" />
            <span>{saving ? 'Updating...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
