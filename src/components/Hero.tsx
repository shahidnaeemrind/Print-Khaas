import React from 'react';
import { ArrowRight, Award, CheckCircle, PackageCheck, School, Users } from 'lucide-react';
import { CompanySettings } from '../types';

interface HeroProps {
  settings: CompanySettings;
  onExploreClick: () => void;
  onSchoolPackagesClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onExploreClick,
  onSchoolPackagesClick,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F2EA] via-[#FAFAF7] to-[#FAFAF7] border-b border-[#E8E5DD] pt-12 pb-16 lg:pt-16 lg:pb-20">
      {/* Decorative Subtle Background Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0B132B_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF5EB] border border-[#E5C06E]/40 text-[#996515] text-xs font-semibold tracking-wide uppercase mb-6 shadow-2xs">
            <img src="/logo-icon.svg" alt="Print Khaas" className="w-4 h-4 rounded-xs object-contain" />
            <span>Pakistani Educational Publishing • Est. {settings.establishedYear || '2014'}</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0B132B] leading-[1.2] mb-6">
            Books That Inspire Learning and Build Better Futures.
          </h1>

          {/* Subtitle / Introduction */}
          <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed mb-8 max-w-2xl mx-auto">
            {settings.tagline || 'Quality Books. Meaningful Learning.'} Based in Lahore, Print Khaas crafts curriculum-aligned children&apos;s books, school packages, activity workbooks, and character-building literature trusted by schools and families nationwide.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#0B132B] hover:bg-[#1E293B] text-white text-sm font-semibold shadow-md transition-all group"
            >
              <span>Explore Our Books</span>
              <ArrowRight className="w-4 h-4 text-[#E8D099] transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={onSchoolPackagesClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white hover:bg-stone-50 text-[#0B132B] text-sm font-semibold border border-stone-300 shadow-2xs transition-colors"
            >
              <School className="w-4 h-4 text-[#B8860B]" />
              <span>School Packages & Bulk Orders</span>
            </button>
          </div>

          {/* Value Props Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-[#E8E5DD]/70 text-left">
            <div className="p-3 rounded-lg bg-white/70 border border-stone-200/60 shadow-2xs">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs mb-1">
                <CheckCircle className="w-3.5 h-3.5 text-[#B8860B]" />
                <span>Established 2014</span>
              </div>
              <p className="text-[11px] text-stone-500">Over a decade of publishing pedigree in Lahore</p>
            </div>

            <div className="p-3 rounded-lg bg-white/70 border border-stone-200/60 shadow-2xs">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs mb-1">
                <School className="w-3.5 h-3.5 text-[#B8860B]" />
                <span>100+ Schools</span>
              </div>
              <p className="text-[11px] text-stone-500">Syllabus packages with custom school branding</p>
            </div>

            <div className="p-3 rounded-lg bg-white/70 border border-stone-200/60 shadow-2xs">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs mb-1">
                <PackageCheck className="w-3.5 h-3.5 text-[#B8860B]" />
                <span>Premium Quality</span>
              </div>
              <p className="text-[11px] text-stone-500">Bleed-proof paper, durable laminated binding</p>
            </div>

            <div className="p-3 rounded-lg bg-white/70 border border-stone-200/60 shadow-2xs">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs mb-1">
                <Users className="w-3.5 h-3.5 text-[#B8860B]" />
                <span>Direct WhatsApp</span>
              </div>
              <p className="text-[11px] text-stone-500">Seamless ordering with instant support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
