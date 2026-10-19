import React from 'react';
import { ChevronRight } from 'lucide-react';
import { InfoCard, LotusDivider, Prose, SectionHeading } from '../components/common/ContentBlocks';

interface AboutUsViewProps {
  onNavigateHome: () => void;
}

const AUDIENCE = [
  { title: 'The Festive Dresser', text: 'Women looking for sarees for festivals, weddings, family celebrations and special gatherings.' },
  { title: 'The Modern Traditionalist', text: 'Those who love Indian heritage but want versatile styling and fresh colour stories.' },
  { title: 'The Everyday Elegance Seeker', text: 'Customers looking for graceful cottons, lighter drapes and wearable designs.' },
  { title: 'The Thoughtful Gift Buyer', text: 'People choosing a meaningful saree for birthdays, anniversaries, ceremonies and celebrations.' },
  { title: 'The Textile Enthusiast', text: 'Customers curious about regional inspirations, motifs, borders and the stories behind fabrics.' },
];

const VALUES = [
  { title: 'Heritage', text: 'Respect the stories, regions and textile traditions that inspire each design.' },
  { title: 'Quality & Care', text: 'Present products carefully and communicate details as accurately as possible.' },
  { title: 'Authenticity', text: 'Be transparent about fabric descriptions, product availability, pricing and policies.' },
  { title: 'Customer Connection', text: 'Build trust through responsive service and a warm, considered experience.' },
  { title: 'Individual Expression', text: 'Celebrate the many ways women style and make a saree their own.' },
];

const Section: React.FC<{ children: React.ReactNode; tinted?: boolean }> = ({ children, tinted }) => (
  <section className={`${tinted ? 'bg-[#f8efe2]' : 'bg-[#fbf6ee]'} border-b border-gold-500/25`}>
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14 sm:py-16">{children}</div>
  </section>
);

export const AboutUsView: React.FC<AboutUsViewProps> = ({ onNavigateHome }) => (
  <div>
    {/* About Us */}
    <section className="bg-gradient-to-r from-[#fbefdf] via-[#fbf1e3] to-[#f6e6cf] border-b border-gold-500/40">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-10 pb-14 sm:pb-16">
        <nav aria-label="Breadcrumbs" className="flex items-center justify-center gap-2 text-xs text-stone-500 mb-6">
          <button onClick={onNavigateHome} className="hover:text-burgundy-900 cursor-pointer">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-charcoal font-medium">About Us</span>
        </nav>
        <SectionHeading as="h1" kicker="Meet the brand" title="About Us" subtitle="Founded by Divya Anand" />
        <Prose
          className="mt-8"
          paragraphs={[
            'Daivisha Vastra was founded by Divya Anand with a love for Indian attire and the belief that traditional elegance belongs in every generation.',
            'The brand brings together a personal appreciation for sarees, a respect for cultural detail and a desire to make discovering beautiful drapes a more thoughtful experience.',
            'As a growing label, Daivisha Vastra is committed to learning, curating with care and building relationships with customers through clear information and attentive service.',
          ]}
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <InfoCard title="Our Promise">A considered selection, graceful presentation and honest communication.</InfoCard>
          <InfoCard title="Our Personality">Warm, elegant, rooted in heritage and open to contemporary expression.</InfoCard>
        </div>
      </div>
    </section>

    {/* What We Do */}
    <Section>
      <SectionHeading title="What We Do" subtitle="A considered collection for every kind of occasion." />
      <Prose
        className="mt-8"
        paragraphs={[
          'Daivisha Vastra curates sarees across traditional, festive and contemporary styles, with attention to colour, texture, borders, motifs and the way each drape makes a woman feel.',
          'Our collection spans silk-inspired occasion wear, soft tissue looks, cotton styles, printed designs and statement details—offering choices for different moods, events and personal tastes.',
          'We aim to make saree discovery more welcoming through clear product information, thoughtful presentation and personal assistance before an order is confirmed.',
        ]}
      />
      <div className="mt-8 space-y-4">
        <InfoCard title="Curated Collections">A considered mix of heritage-inspired and contemporary saree styles.</InfoCard>
        <InfoCard title="Personal Service">Support with product details, availability, styling questions and order enquiries.</InfoCard>
        <InfoCard title="A Story Behind the Drape">Sharing textile origins and design inspiration wherever reliable information is available.</InfoCard>
      </div>
    </Section>

    {/* Our Audience */}
    <Section tinted>
      <SectionHeading kicker="Our Audience" title="For the Saree-Loving Woman" />
      <Prose
        className="mt-8"
        paragraphs={[
          'Daivisha Vastra is for women who see a saree as more than an outfit—it is a way to express identity, celebrate milestones and carry tradition into everyday life.',
        ]}
      />
      <div className="mt-8 space-y-4">
        {AUDIENCE.map((a) => (
          <InfoCard key={a.title} title={a.title}>
            {a.text}
          </InfoCard>
        ))}
      </div>
    </Section>

    {/* Vision, Mission & Values */}
    <Section>
      <SectionHeading kicker="What Guides Us" title="Vision, Mission & Values" />
      <Prose
        className="mt-8"
        paragraphs={[
          'Our vision is to celebrate Indian saree culture in a way that feels relevant, beautiful and accessible to today’s woman.',
          'Our mission is to thoughtfully curate sarees that honour traditional aesthetics while welcoming modern preferences, supported by honest communication and a personal shopping experience.',
        ]}
      />
      <div className="mt-8 space-y-4">
        {VALUES.map((v) => (
          <InfoCard key={v.title} title={v.title}>
            {v.text}
          </InfoCard>
        ))}
      </div>
      <LotusDivider className="mt-12" />
      <p className="mt-3 text-center font-sans text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-gold-700">
        Every saree has a story
      </p>
    </Section>
  </div>
);
