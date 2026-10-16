import React, { useState } from 'react';
import { BookOpen, Menu, X, MessageCircle, Shield, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CompanySettings } from '../types';
import { generateGeneralInquiryUrl } from '../utils/whatsapp';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  settings: CompanySettings;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  settings,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, isAuthorizedAdmin } = useAuth();

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'catalog', label: 'All Books' },
    { id: 'school-packages', label: 'School Packages' },
    { id: 'for-parents', label: 'For Parents' },
    { id: 'about', label: 'About Us' },
    { id: 'faqs', label: 'FAQs' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappInquiryUrl = generateGeneralInquiryUrl('', settings.whatsappNumber);

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF7]/95 backdrop-blur-md border-b border-[#E8E5DD] shadow-xs">
      {/* Top Announcement Bar */}
      {settings.announcement && (
        <div className="bg-[#0B132B] text-[#E8D099] text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
          <span>✨</span>
          <span>{settings.announcement}</span>
          <span className="hidden sm:inline-block text-[#B8860B]">• Lahore, Pakistan</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none py-1"
          >
            <img
              src="/logo.svg"
              alt="Print Khaas - Quality Books & Educational Publishing"
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-102"
            />
            <div className="hidden lg:flex flex-col border-l border-stone-300 pl-3 py-0.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8860B]">
                Since 2014 &bull; Lahore
              </span>
              <p className="text-[10px] text-stone-500 font-medium tracking-wide">
                Quality Books. Meaningful Learning.
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === link.id
                    ? 'text-[#0B132B] bg-[#EFECE6] font-semibold'
                    : 'text-stone-600 hover:text-[#0B132B] hover:bg-[#F3F0EA]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* WhatsApp Contact */}
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#128C7E] hover:bg-[#075E54] text-white px-3.5 py-2 rounded-md text-xs font-semibold shadow-xs transition-colors"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>

            {/* Admin Portal Button */}
            <button
              onClick={onOpenAdmin}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium border transition-colors ${
                currentUser && isAuthorizedAdmin
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50 hover:text-stone-900'
              }`}
              title={currentUser ? `Signed in: ${currentUser.email}` : 'Administrator Portal'}
            >
              <Shield className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>{currentUser && isAuthorizedAdmin ? 'Admin Dashboard' : 'Admin'}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenAdmin}
              className="p-2 text-stone-600 hover:text-stone-900"
              title="Admin"
            >
              <Shield className="w-5 h-5 text-[#B8860B]" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-stone-700 hover:text-stone-900 hover:bg-stone-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#FAFAF7] border-b border-[#E8E5DD] px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`block w-full text-left px-3 py-2.5 rounded-md text-base font-medium ${
                activeTab === link.id
                  ? 'bg-[#EFECE6] text-[#0B132B] font-semibold'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-4 border-t border-stone-200 flex flex-col gap-2">
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#128C7E] text-white py-2.5 rounded-md text-sm font-semibold"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: +92 333 6474186</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-center gap-2 bg-stone-100 text-stone-800 py-2.5 rounded-md text-sm font-medium border border-stone-300"
            >
              <Shield className="w-4 h-4 text-[#B8860B]" />
              <span>{currentUser && isAuthorizedAdmin ? 'Open Admin Dashboard' : 'Admin Login'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
