import React from 'react';
import { ChevronRight } from 'lucide-react';
import { POLICIES, POLICY_TABS, PolicyId } from '../data/policies';
import { SectionHeading } from '../components/common/ContentBlocks';

interface PolicyViewProps {
  policy: PolicyId;
  onNavigateHome: () => void;
  onOpenPolicy: (policy: PolicyId) => void;
}

export const PolicyView: React.FC<PolicyViewProps> = ({ policy, onNavigateHome, onOpenPolicy }) => {
  const p = POLICIES[policy];

  return (
    <div className="bg-[#fbf6ee]">
      {/* Banner */}
      <section className="bg-gradient-to-r from-[#fbefdf] via-[#fbf1e3] to-[#f6e6cf] border-b border-gold-500/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <nav aria-label="Breadcrumbs" className="flex items-center justify-center gap-2 text-xs text-stone-500 mb-5">
            <button onClick={onNavigateHome} className="hover:text-burgundy-900 cursor-pointer">
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-charcoal font-medium">{p.title}</span>
          </nav>
          <SectionHeading as="h1" title={p.title} subtitle={p.subtitle} />
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Switch between policies */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {POLICY_TABS.map((t) => (
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

        <ul className="space-y-7">
          {p.sections.map((s) => (
            <li key={s.heading} className="flex gap-4">
              <span className="mt-2.5 w-2 h-2 rounded-full bg-gold-600 shrink-0" aria-hidden="true" />
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-semibold uppercase tracking-[0.04em] text-burgundy-800">{s.heading}</h2>
                <p className="mt-1.5 font-serif text-[17px] sm:text-lg leading-relaxed text-stone-700">{s.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
