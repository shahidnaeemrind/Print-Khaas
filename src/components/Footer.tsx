import React from 'react';
import { BookOpen, Shield, MessageCircle, MapPin, Phone, Mail, ArrowUp } from 'lucide-react';
import { CompanySettings } from '../types';
import { generateGeneralInquiryUrl } from '../utils/whatsapp';

interface FooterProps {
  settings: CompanySettings;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate,
  onOpenAdmin,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappInquiryUrl = generateGeneralInquiryUrl('', settings.whatsappNumber);

  return (
    <footer className="bg-[#0B132B] text-white pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex flex-col items-start gap-2">
              <img
                src="/logo-white.svg"
                alt="Print Khaas Logo"
                className="h-12 w-auto object-contain"
              />
              <span className="text-[10px] text-[#B8860B] font-semibold uppercase tracking-widest">
                Quality Books. Meaningful Learning. &bull; Est. 2014
              </span>
            </div>

            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Publishing house and high-precision printing press established in Lahore in {settings.establishedYear || '2014'}. Dedicated to inspiring Pakistani students with curriculum packages, phonics, and moral storybooks.
            </p>

            <div className="text-xs text-stone-400 space-y-1.5 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
                <span>{settings.address || '283A, Dream Garden, Lahore, Pakistan'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
                <span>{settings.phone || '+92 333 6474186'}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#FAF5EB] tracking-wider uppercase">
              Explore Catalog
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-[#E8D099] transition-colors"
                >
                  All Published Books
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('school-packages')}
                  className="hover:text-[#E8D099] transition-colors"
                >
                  School Packages & Syllabus Bundles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('for-parents')}
                  className="hover:text-[#E8D099] transition-colors"
                >
                  Character Building For Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-[#E8D099] transition-colors"
                >
                  Urdu Kaidah & Calligraphy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faqs')}
                  className="hover:text-[#E8D099] transition-colors"
                >
                  Frequently Asked Questions (FAQs)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#E8D099] transition-colors"
                >
                  Our Lahore Heritage Since 2014
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Inquiries & WhatsApp */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-serif text-sm font-bold text-[#FAF5EB] tracking-wider uppercase">
              Direct Ordering
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              No online card payments needed. Chat directly with our publishing team to finalize syllabus discounts, custom bindings, and shipping across Pakistan.
            </p>
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: +92 333 6474186</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            &copy; {new Date().getFullYear()} Print Khaas. Established Since 2014 &bull; Lahore, Pakistan. All Rights Reserved.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 text-stone-400 hover:text-[#E8D099] transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>Publisher Portal (Admin)</span>
            </button>

            <span className="text-stone-700">|</span>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-stone-400 hover:text-white transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
