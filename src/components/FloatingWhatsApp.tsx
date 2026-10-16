import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { WHATSAPP_NUMBER, generateGeneralInquiryUrl } from '../utils/whatsapp';

interface FloatingWhatsAppProps {
  whatsappNumber?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ whatsappNumber }) => {
  const [showTooltip, setShowTooltip] = useState(true);

  const cleanNum = whatsappNumber || WHATSAPP_NUMBER;
  const inquiryUrl = generateGeneralInquiryUrl('', cleanNum);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-auto">
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="mb-2 bg-white text-stone-900 border border-[#128C7E]/40 text-xs py-2 px-3.5 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <span className="font-semibold">Need books or school quotation?</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-stone-400 hover:text-stone-700"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={inquiryUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-[#128C7E] hover:bg-[#075E54] text-white flex items-center justify-center shadow-xl hover:scale-105 transition-all group ring-4 ring-[#128C7E]/20"
        title="Chat on WhatsApp (+92 333 6474186)"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="sr-only">Order via WhatsApp</span>
      </a>
    </div>
  );
};
