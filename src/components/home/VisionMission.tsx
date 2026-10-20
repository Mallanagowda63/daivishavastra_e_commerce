import React from 'react';
import { Compass, Target } from 'lucide-react';
import { SectionHeading } from '../common/ContentBlocks';

const ITEMS = [
  {
    icon: Compass,
    title: 'Our Vision',
    text: 'To celebrate Indian saree culture in a way that feels relevant, beautiful and accessible to today’s woman.',
  },
  {
    icon: Target,
    title: 'Our Mission',
    text: 'To thoughtfully curate sarees that honour traditional aesthetics while welcoming modern preferences, supported by honest communication and a personal shopping experience.',
  },
];

const VALUES = ['Heritage', 'Quality & Care', 'Authenticity', 'Customer Connection', 'Individual Expression'];

/** Home page: vision and mission side by side, with the brand values below. */
export const VisionMission: React.FC = () => (
  <section className="bg-[#f8efe2] border-b border-gold-500/30">
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-14 sm:py-16">
      <SectionHeading kicker="What Guides Us" title="Vision & Mission" />
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {ITEMS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="bg-[#fffaf3] border border-gold-500/40 rounded-xl px-6 py-7 text-center">
            <span className="mx-auto w-12 h-12 rounded-full border border-gold-600/70 text-gold-700 grid place-items-center">
              <Icon className="w-5 h-5" strokeWidth={1.5} />
            </span>
            <h3 className="mt-3 font-serif text-xl sm:text-2xl font-semibold uppercase tracking-[0.05em] text-burgundy-800">{title}</h3>
            <p className="mt-2 font-serif text-lg leading-relaxed text-stone-700">{text}</p>
          </div>
        ))}
      </div>
      <ul className="mt-8 flex flex-wrap justify-center gap-2.5" aria-label="Our values">
        {VALUES.map((v) => (
          <li key={v} className="px-4 py-1.5 rounded-full border border-gold-500/50 bg-[#fffaf3] font-serif text-base text-burgundy-800">
            {v}
          </li>
        ))}
      </ul>
    </div>
  </section>
);
