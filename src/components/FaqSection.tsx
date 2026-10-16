import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  School,
  User,
  Truck,
  CreditCard,
  MessageCircle,
  FileCheck,
  Package
} from 'lucide-react';
import { CompanySettings } from '../types';
import { generateGeneralInquiryUrl, WHATSAPP_NUMBER } from '../utils/whatsapp';

interface FaqItem {
  id: string;
  category: 'schools' | 'parents' | 'delivery' | 'curriculum';
  question: string;
  answer: string;
  icon?: React.ReactNode;
}

const FAQS_DATA: FaqItem[] = [
  // Schools & Wholesale
  {
    id: 'school-moq',
    category: 'schools',
    question: 'What is the Minimum Order Quantity (MOQ) and wholesale policy for schools?',
    answer:
      'For standard curriculum packages, our typical institutional minimum order quantity (MOQ) is 15 to 25 packages per grade. For bulk orders exceeding 50 copies, tiered institutional discounts ranging from 20% to 35% off the retail list price are applied. We also facilitate custom batch reprints for community schools and NGO-affiliated educational programs.',
  },
  {
    id: 'school-branding',
    category: 'schools',
    question: 'Can we have our school monogram, name, and customized academic diary printed on book covers?',
    answer:
      'Yes, absolutely. Since 2014, Print Khaas has offered custom cover branding for partner schools across Pakistan. We can embed your school’s crest, campus address, custom foreword by the principal, and customized school student diaries into the binding for orders placed at least 3 weeks before the start of the academic term.',
  },
  {
    id: 'school-specimens',
    category: 'schools',
    question: 'How can school principals or academic coordinators request evaluation specimen copies?',
    answer:
      'Certified school heads, directors, and syllabus committee members can request a physical specimen pack directly through our WhatsApp or official correspondence. We dispatch review copies along with sample teacher guides and discount schedules directly to your school campus for board evaluation.',
  },
  {
    id: 'payment-methods-schools',
    category: 'schools',
    question: 'What are the accepted payment methods and credit terms for educational institutions?',
    answer:
      'We accept official School Cheques, Direct Bank Transfers (IBFT) to our corporate bank account, and Pay Orders. For verified long-term partner schools, we offer structured payment plans (e.g., 50% advance upon purchase order confirmation and 50% upon campus delivery or term commencement). Official sales tax invoices and NTN receipts are provided with every shipment.',
  },

  // Parents & Home Orders
  {
    id: 'home-order-process',
    category: 'parents',
    question: 'How do I place an order for home or personal use? Do I need to create an account?',
    answer:
      'No account registration or online card details are required! Simply click the "ORDER" button on any book card and select "For Home / Parents". This opens a pre-filled WhatsApp message directly with our Lahore publishing team. Our representative confirms availability, gives you your total bill with courier charges, and books your dispatch immediately.',
  },
  {
    id: 'delivery-timelines',
    category: 'delivery',
    question: 'What are your delivery timelines and courier charges across Pakistan?',
    answer:
      'Orders are dispatched from our Lahore press via insured express couriers (TCS, Leopards, Trax, and Daewoo Cargo for heavy school cartons). Standard delivery takes 1 to 2 business days for Lahore, Islamabad, Rawalpindi, and Karachi, and 3 to 4 business days for other cities, towns, and rural districts nationwide. Standard courier fee for individual home parcels is Rs. 200–250.',
  },
  {
    id: 'payment-methods-parents',
    category: 'parents',
    question: 'What payment options are available for individual parent orders?',
    answer:
      'Parents can pay via Cash on Delivery (COD) across Pakistan, or through instant digital transfers via JazzCash, Easypaisa, Raast, or online bank transfer (IBFT). Account details are provided securely inside WhatsApp once your parcel weight and shipping address are confirmed.',
  },
  {
    id: 'damages-returns',
    category: 'parents',
    question: 'What is your return or replacement policy if a book arrives damaged or misprinted?',
    answer:
      'Every Print Khaas publication undergoes strict quality check before carton sealing. In the rare event that a book has a binding defect, missing pages, or transit damage, please send a quick photo on WhatsApp within 48 hours of delivery. We will courier a replacement copy to your doorstep free of charge.',
  },

  // Curriculum & Material Quality
  {
    id: 'curriculum-snc',
    category: 'curriculum',
    question: 'Are Print Khaas textbooks aligned with the Single National Curriculum (SNC)?',
    answer:
      'Yes. Our primary school textbooks and early years learning materials are carefully calibrated against the Pakistani Single National Curriculum (SNC) standards and early childhood education frameworks. They integrate phonetic English, classic Nastaliq Urdu handwriting, conceptual mathematics, and Islamic character foundations.',
  },
  {
    id: 'paper-quality',
    category: 'curriculum',
    question: 'What paper quality and binding techniques are used for children’s books?',
    answer:
      'We use high-grade 75–90 GSM bleed-proof opaque book paper that withstands pencil erasures and marker coloring. Covers are protected with matte lamination and spot UV coatings. Bindings utilize industrial machine stitching and heavy-duty wire-O or perfect PUR glue binding to ensure books remain intact throughout the demanding school year.',
  },
];

interface FaqSectionProps {
  settings: CompanySettings;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ settings }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'schools' | 'parents' | 'delivery' | 'curriculum'>('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>('school-moq');

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const filteredFaqs = FAQS_DATA.filter(
    (faq) => activeCategory === 'all' || faq.category === activeCategory
  );

  const whatsappInquiryUrl = generateGeneralInquiryUrl(
    'Assalam-o-Alaikum Print Khaas. I have a question regarding ordering, syllabus delivery, or school wholesale policies that was not in the FAQs.',
    settings.whatsappNumber || WHATSAPP_NUMBER
  );

  return (
    <section id="faqs" className="py-16 bg-[#FAFAF7] border-t border-[#E8E5DD]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EB] border border-[#E5C06E]/50 text-[#996515] text-xs font-semibold uppercase tracking-wider mb-4 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>Got Questions? We Have Answers</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B132B] mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Everything you need to know about school wholesale policies, delivery timelines across Pakistan, payment options, and curriculum quality.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === 'all'
                ? 'bg-[#0B132B] text-white shadow-2xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            All Questions ({FAQS_DATA.length})
          </button>

          <button
            onClick={() => setActiveCategory('schools')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === 'schools'
                ? 'bg-[#0B132B] text-white shadow-2xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <School className="w-3 h-3 text-[#B8860B]" />
            <span>For Schools & Wholesale</span>
          </button>

          <button
            onClick={() => setActiveCategory('parents')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === 'parents'
                ? 'bg-[#0B132B] text-white shadow-2xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <User className="w-3 h-3 text-[#128C7E]" />
            <span>For Parents & Home Orders</span>
          </button>

          <button
            onClick={() => setActiveCategory('delivery')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === 'delivery'
                ? 'bg-[#0B132B] text-white shadow-2xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Truck className="w-3 h-3 text-stone-500" />
            <span>Delivery & Courier</span>
          </button>

          <button
            onClick={() => setActiveCategory('curriculum')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === 'curriculum'
                ? 'bg-[#0B132B] text-white shadow-2xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <FileCheck className="w-3 h-3 text-stone-500" />
            <span>Curriculum & Paper Quality</span>
          </button>
        </div>

        {/* Accordion Questions List */}
        <div className="space-y-3 mb-10">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden shadow-2xs ${
                  isOpen ? 'border-[#B8860B]/50 ring-1 ring-[#B8860B]/20' : 'border-[#E8E5DD] hover:border-stone-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-sm sm:text-base font-bold text-[#0B132B] leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-[#0B132B] text-[#E8D099] rotate-180' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 animate-in fade-in duration-150">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Help Box */}
        <div className="bg-[#FAF5EB] rounded-2xl p-6 sm:p-8 border border-[#E5C06E]/40 text-center max-w-2xl mx-auto shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-[#128C7E] text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#0B132B] mb-1.5">
            Still Have Questions?
          </h3>
          <p className="text-xs text-stone-600 mb-5 leading-relaxed">
            Our Lahore customer support team is available Monday to Saturday to answer inquiries about customized syllabuses, bulk quotation rates, or parcel tracking.
          </p>
          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold shadow-xs transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat Directly on WhatsApp: +92 333 6474186</span>
          </a>
        </div>
      </div>
    </section>
  );
};
