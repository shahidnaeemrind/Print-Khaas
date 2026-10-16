import React from 'react';
import { Heart, Sparkles, BookCheck, ShieldAlert, Smile, ArrowRight } from 'lucide-react';
import { CompanySettings } from '../types';
import { generateGeneralInquiryUrl } from '../utils/whatsapp';

interface ParentsSectionProps {
  settings: CompanySettings;
  onFilterForParents: () => void;
}

export const ParentsSection: React.FC<ParentsSectionProps> = ({
  settings,
  onFilterForParents,
}) => {
  const whatsappUrl = generateGeneralInquiryUrl(
    'Assalam-o-Alaikum Print Khaas. I am a parent looking for recommended home reading and activity books for my children. Please share guidance and catalog recommendations.',
    settings.whatsappNumber
  );

  return (
    <section id="for-parents" className="py-16 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column Text */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EB] border border-[#E5C06E]/50 text-[#996515] text-xs font-semibold uppercase tracking-wider mb-4">
              <Heart className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>For Parents & Home Learners</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B132B] mb-5 leading-tight">
              Screen-Free Learning That Nurtures Moral Character
            </h2>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6">
              In an era overflowing with fast-paced digital distractions, Print Khaas creates tactile, richly illustrated physical books that captivate young minds. We design publications that promote independent reading, emotional empathy, and proud appreciation of Urdu and Islamic heritage.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#B8860B]/15 text-[#996515] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#0B132B]">
                    Cultivating Character & Kindness
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Stories grounded in honesty, empathy, respect for grandparents, neighborhood goodwill, and Islamic manners.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#B8860B]/15 text-[#996515] flex items-center justify-center shrink-0 mt-0.5">
                  <BookCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#0B132B]">
                    Gentle Phonics & Nastaliq Mastery
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Clear bilingual font scaling that prevents eye fatigue and makes early reading enjoyable rather than stressful.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#B8860B]/15 text-[#996515] flex items-center justify-center shrink-0 mt-0.5">
                  <Smile className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#0B132B]">
                    Direct Doorstep Courier Delivery
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Order individual copies or gift bundles via WhatsApp. We deliver safely across Karachi, Lahore, Islamabad, Peshawar, Quetta, and all surrounding towns.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onFilterForParents}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#0B132B] hover:bg-[#1E293B] text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Browse Books For Home</span>
                <ArrowRight className="w-4 h-4 text-[#E8D099]" />
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
              >
                <span>Ask for Age Recommendations</span>
              </a>
            </div>
          </div>

          {/* Right Column Visual Banner */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-lg bg-[#F5F2EA] p-6 sm:p-8">
              <div className="w-12 h-12 rounded-xl bg-[#0B132B] text-[#E8D099] flex items-center justify-center mb-6 shadow-xs">
                <BookCheck className="w-6 h-6" />
              </div>
              <blockquote className="font-serif text-lg font-bold text-[#0B132B] leading-snug mb-4">
                &ldquo;A book read in childhood becomes part of the soul forever.&rdquo;
              </blockquote>
              <p className="text-xs text-stone-600 leading-relaxed mb-6">
                Print Khaas was established with a singular belief: Pakistani children deserve world-class book design, authentic cultural connection, and educational literature that uplifts their thinking.
              </p>
              <div className="pt-4 border-t border-stone-300/80 flex items-center justify-between text-xs text-stone-500 font-medium">
                <span>Print Khaas Lahore</span>
                <span className="text-[#B8860B] font-bold">Since 2014</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
