import React, { useState } from 'react';
import { MapPin, Phone, MessageCircle, Mail, Send, Clock, School, User } from 'lucide-react';
import { CompanySettings } from '../types';
import { WHATSAPP_NUMBER } from '../utils/whatsapp';

interface ContactSectionProps {
  settings: CompanySettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const [inquirerName, setInquirerName] = useState('');
  const [inquiryType, setInquiryType] = useState<'School' | 'Parent' | 'General'>('School');
  const [cityName, setCityName] = useState('');
  const [message, setMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = (settings.whatsappNumber || WHATSAPP_NUMBER).replace(/[^0-9]/g, '');
    const greeting = 'Assalam-o-Alaikum Print Khaas.';
    const details = [
      greeting,
      inquirerName ? `My name is ${inquirerName}.` : '',
      `Inquiry Type: ${inquiryType}.`,
      cityName ? `Location / City: ${cityName}.` : '',
      message ? `Message: ${message}` : 'I would like to inquire about your books and school packages.',
    ]
      .filter(Boolean)
      .join(' ');

    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(details)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const whatsappDirectUrl = `https://wa.me/${(settings.whatsappNumber || WHATSAPP_NUMBER).replace(
    /[^0-9]/g,
    ''
  )}`;

  return (
    <section id="contact" className="py-16 bg-[#FAFAF7] border-t border-[#E8E5DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EB] border border-[#E5C06E]/50 text-[#996515] text-xs font-semibold uppercase tracking-wider mb-4">
            <Phone className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>Connect With Our Team</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B132B] mb-4">
            Contact Print Khaas
          </h2>
          <p className="text-stone-600 text-base leading-relaxed">
            Whether you are ordering textbooks for a multi-campus school system or seeking individual books for your family, our Lahore team is ready to assist you promptly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Direct Contact Information */}
          <div className="lg:col-span-5 space-y-4">
            {/* Address Card */}
            <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-2xs">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-[#0B132B] text-[#E8D099] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#0B132B] mb-1">
                    Head Office & Publishing Press
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed font-medium">
                    {settings.address || '283A, Dream Garden, Lahore, Pakistan'}
                  </p>
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    Lahore, Punjab, Pakistan
                  </span>
                </div>
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-2xs">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-[#128C7E] text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#0B132B] mb-1">
                    WhatsApp Orders & Inquiries
                  </h4>
                  <p className="text-xs text-stone-600 font-medium mb-2">
                    {settings.phone || '+92 333 6474186'}
                  </p>
                  <a
                    href={whatsappDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#128C7E] hover:underline"
                  >
                    <span>Open Direct WhatsApp Chat</span>
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Email & Hours */}
            <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-2xs">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#0B132B] mb-1">
                    Email Correspondence
                  </h4>
                  <p className="text-xs text-stone-600 font-medium mb-1">
                    {settings.email || 'info@printkhaas.com'}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-2">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>Monday &ndash; Saturday: 9:00 AM &ndash; 6:00 PM PKT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive WhatsApp Message Builder */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4 text-[#128C7E]" />
              <h3 className="font-serif text-lg font-bold text-[#0B132B]">
                Start Instant WhatsApp Inquiry
              </h3>
            </div>
            <p className="text-xs text-stone-500 mb-6">
              Fill out this quick form to automatically format a comprehensive inquiry message on WhatsApp. No account required.
            </p>

            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Name or School Name
                  </label>
                  <input
                    type="text"
                    value={inquirerName}
                    onChange={(e) => setInquirerName(e.target.value)}
                    placeholder="e.g. Principal Ahmed / Beacon School"
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-200 text-xs sm:text-sm text-stone-900 focus:border-[#0B132B] focus:ring-1 focus:ring-[#0B132B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    placeholder="e.g. Lahore, Faisalabad, Karachi, etc."
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-200 text-xs sm:text-sm text-stone-900 focus:border-[#0B132B] focus:ring-1 focus:ring-[#0B132B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  I Am Inquiring As:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setInquiryType('School')}
                    className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all ${
                      inquiryType === 'School'
                        ? 'bg-[#0B132B] text-white border-[#0B132B]'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    School / Institution
                  </button>
                  <button
                    type="button"
                    onClick={() => setInquiryType('Parent')}
                    className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all ${
                      inquiryType === 'Parent'
                        ? 'bg-[#0B132B] text-white border-[#0B132B]'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    Parent / Home Use
                  </button>
                  <button
                    type="button"
                    onClick={() => setInquiryType('General')}
                    className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all ${
                      inquiryType === 'General'
                        ? 'bg-[#0B132B] text-white border-[#0B132B]'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    Printing Services
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Message or Specific Books Needed
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share the grade levels, books, or quantities you need quotation for..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-xs sm:text-sm text-stone-900 focus:border-[#0B132B] focus:ring-1 focus:ring-[#0B132B]"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#128C7E] hover:bg-[#075E54] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Send to Print Khaas on WhatsApp (+92 333 6474186)</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
