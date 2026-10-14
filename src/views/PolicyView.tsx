import React from 'react';
import { ChevronRight } from 'lucide-react';
import { LotusMark } from '../components/layout/BrandEmblem';
import { POLICIES, PolicyId } from '../data/policies';

interface PolicyViewProps {
  policy: PolicyId;
  onNavigateHome: () => void;
  onOpenPolicy: (policy: PolicyId) => void;
}

const TABS: { id: PolicyId; label: string }[] = [
  { id: 'privacy', label: 'Privacy Policy' },
  { id: 'terms', label: 'Terms & Conditions' },
  { id: 'refund', label: 'Refund Policy' },
];

export const PolicyView: React.FC<PolicyViewProps> = ({ policy, onNavigateHome, onOpenPolicy }) => {
  const p = POLICIES[policy];

  return (
    <div>
      {/* Banner */}
      <section className="bg-gradient-to-r from-[#fbefdf] via-[#fbf1e3] to-[#f6e6cf] border-b border-gold-500/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12 text-center">
          <nav aria-label="Breadcrumbs" className="flex items-center justify-center gap-2 text-xs text-stone-500 mb-5">
            <button onClick={onNavigateHome} className="hover:text-burgundy-900 cursor-pointer">
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-charcoal font-medium">{p.title}</span>
          </nav>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium text-burgundy-800">{p.title}</h1>
          <div className="flex items-center justify-center gap-2 my-4 text-gold-600" aria-hidden="true">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold-500" />
            <LotusMark className="w-5 h-5" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold-500" />
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Last updated {p.updated}</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Switch between policies */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => onOpenPolicy(t.id)}
              aria-current={t.id === policy ? 'page' : undefined}
              className={`px-4 py-1.5 rounded-full border font-serif text-sm transition-colors cursor-pointer ${
                t.id === policy
                  ? 'bg-burgundy-800 border-burgundy-800 text-ivory'
                  : 'border-gold-500/50 text-burgundy-950 hover:border-burgundy-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <p className="font-serif text-lg sm:text-xl leading-relaxed text-stone-700">{p.intro}</p>

        <div className="mt-10 space-y-9">
          {p.sections.map((s, i) => (
            <section key={s.heading}>
              <h2 className="font-serif text-2xl text-burgundy-900">
                <span className="text-gold-600 mr-2">{String(i + 1).padStart(2, '0')}</span>
                {s.heading}
              </h2>
              {s.paragraphs?.map((para) => (
                <p key={para} className="mt-3 text-[15px] leading-relaxed text-stone-700">
                  {para}
                </p>
              ))}
              {s.points && (
                <ul className="mt-3 space-y-2">
                  {s.points.map((pt) => (
                    <li key={pt} className="flex gap-3 text-[15px] leading-relaxed text-stone-700">
                      <span className="mt-2 w-1.5 h-1.5 rotate-45 bg-gold-500 shrink-0" aria-hidden="true" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};
