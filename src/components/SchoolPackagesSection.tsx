import React from 'react';
import { School, Award, CheckCircle, Package, Truck, FileCheck, ArrowRight } from 'lucide-react';
import { generateSchoolOrderUrl, WHATSAPP_NUMBER } from '../utils/whatsapp';
import { CompanySettings } from '../types';

interface SchoolPackagesSectionProps {
  settings: CompanySettings;
  onViewSchoolPackages: () => void;
}

export const SchoolPackagesSection: React.FC<SchoolPackagesSectionProps> = ({
  settings,
  onViewSchoolPackages,
}) => {
  const whatsappSchoolUrl = `https://wa.me/${settings.whatsappNumber || WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Assalam-o-Alaikum Print Khaas. I am a School Principal / Administrator inquiring about your complete school book packages, custom syllabus printing, and institutional bulk rates for our upcoming academic session.'
  )}`;

  return (
    <section id="school-packages" className="py-16 bg-[#F4F1EA] border-y border-[#E8E5DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EB] border border-[#E5C06E]/50 text-[#996515] text-xs font-semibold uppercase tracking-wider mb-4">
            <School className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>Institutional Solutions</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B132B] mb-4">
            Turnkey Book Packages for Modern Pakistani Schools
          </h2>
          <p className="text-stone-600 text-base leading-relaxed">
            Since 2014, Print Khaas has partnered with over 100 private school chains and community institutions across Punjab, Sindh, and Khyber Pakhtunkhwa. We deliver comprehensive textbook series that ease teacher planning and inspire students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs flex flex-col">
            <div className="w-10 h-10 rounded-lg bg-[#0B132B] text-[#E8D099] flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#0B132B] mb-2">
              Custom School Monogram
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed mb-4 flex-1">
              Add your school&apos;s crest, campus address, and custom academic diary to textbook covers for unified institutional pride and prestige.
            </p>
            <div className="text-[11px] font-semibold text-stone-700 flex items-center gap-1.5 pt-3 border-t border-stone-100">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Available on bulk academic batches</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs flex flex-col">
            <div className="w-10 h-10 rounded-lg bg-[#0B132B] text-[#E8D099] flex items-center justify-center mb-4">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#0B132B] mb-2">
              Free Teacher Resource Packs
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed mb-4 flex-1">
              Each school order includes complimentary teacher guides, lesson planning templates, term assessment papers, and audio pronunciation aids.
            </p>
            <div className="text-[11px] font-semibold text-stone-700 flex items-center gap-1.5 pt-3 border-t border-stone-100">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Saves 100+ planning hours per term</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs flex flex-col">
            <div className="w-10 h-10 rounded-lg bg-[#0B132B] text-[#E8D099] flex items-center justify-center mb-4">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#0B132B] mb-2">
              Direct Campus Freight Delivery
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed mb-4 flex-1">
              Packaged in weather-shielded heavy cartons, we coordinate direct door delivery straight to your school campus before the academic session commences.
            </p>
            <div className="text-[11px] font-semibold text-stone-700 flex items-center gap-1.5 pt-3 border-t border-stone-100">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Reliable nationwide logistics</span>
            </div>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="bg-[#0B132B] rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold mb-1.5 text-[#FAF5EB]">
              Need Physical Examination Copies for Your School Board?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              We dispatch sample evaluation packs directly to certified school principals across Pakistan. Connect directly on WhatsApp with our institutional director.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <a
              href={whatsappSchoolUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold transition-colors shadow-xs"
            >
              <span>Request School Specimen on WhatsApp</span>
            </a>
            <button
              onClick={onViewSchoolPackages}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-[#FAF5EB] text-xs font-semibold transition-colors"
            >
              <span>View School Packages</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
