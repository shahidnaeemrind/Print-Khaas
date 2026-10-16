import React from 'react';
import { History, MapPin, CheckCircle, ShieldCheck, HeartHandshake, Printer } from 'lucide-react';
import { CompanySettings } from '../types';

interface AboutSectionProps {
  settings: CompanySettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings }) => {
  return (
    <section id="about" className="py-16 bg-[#F4F1EA] border-t border-[#E8E5DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EB] border border-[#E5C06E]/50 text-[#996515] text-xs font-semibold uppercase tracking-wider mb-4">
            <History className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>Our Heritage</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B132B] mb-4">
            About Print Khaas
          </h2>
          <p className="text-stone-600 text-base leading-relaxed">
            {settings.tagline || 'Quality Books. Meaningful Learning.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto mb-12">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-2xs space-y-4">
            <img
              src="/logo.svg"
              alt="Print Khaas"
              className="h-10 w-auto object-contain mb-2"
            />
            <div className="flex items-center gap-2 text-[#996515] text-xs font-bold uppercase tracking-wider">
              <Printer className="w-4 h-4" />
              <span>Publishing & Fine Printing Since {settings.establishedYear || '2014'}</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0B132B]">
              Rooted in Lahore, Serving Pakistan
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Founded in 2014 in the historic educational hub of Lahore, Print Khaas began with a clear mission: to bring superior production quality, durable bindings, and pedagogical depth to school textbooks and children&apos;s storybooks.
            </p>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Over the past decade, we have printed millions of instructional pages, partnering with forward-thinking educators to modernize school curricula without losing touch with our national language, Islamic values, and cultural wisdom.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-2xs flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-[#0B132B] text-[#E8D099] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-[#0B132B] mb-1">
                  Uncompromising Material Standards
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  We use premium high-GSM opaque book paper that prevents ink bleeding, paired with child-safe vegetable-based inks and reinforced machine stitch binding.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-2xs flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-[#0B132B] text-[#E8D099] flex items-center justify-center shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-[#0B132B] mb-1">
                  Fair Educational Pricing
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  By operating our own printing press, we eliminate intermediate middlemen, passing substantial cost savings directly to schools and everyday parents.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-2xs flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-[#0B132B] text-[#E8D099] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-[#0B132B] mb-1">
                  Headquartered in Dream Garden, Lahore
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {settings.address || '283A, Dream Garden, Lahore, Pakistan'}. Visitors and school delegates are welcome by appointment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
