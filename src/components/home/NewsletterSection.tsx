import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      showToast({ type: 'success', title: 'You\'re subscribed!', message: 'Thank you for joining the Daivisha Circle.' });
    }
  };

  return (
    <section className="py-12 lg:py-14 bg-burgundy-950 text-ivory border-t border-gold-500/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>Exclusive Atelier Privileges</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
          Join the Daivisha Circle
        </h2>

        <p className="text-sm sm:text-base text-cream/80 font-sans font-light leading-relaxed max-w-xl mx-auto">
          Be the first to discover new seasonal handloom collections, private bridal appointments, and receive a 10% welcome privilege code.
        </p>

        {isSubscribed ? (
          <div className="p-4 bg-gold-500/10 border border-gold-500/40 text-gold-300 flex items-center justify-center gap-2 text-sm font-sans animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-gold-400" />
            <span>Welcome to the Daivisha Circle. Use code <strong>WELCOME10</strong> on your first order.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 py-3.5 bg-burgundy-900/60 border border-gold-500/30 text-white placeholder:text-stone-400 focus:outline-none focus:border-gold-400 text-xs font-sans"
            />
            <button
              type="submit"
              className="px-6 py-3.5 bg-gold-500 hover:bg-gold-400 text-burgundy-950 font-bold text-xs tracking-widest uppercase transition-colors shrink-0 flex items-center justify-center gap-2"
            >
              <span>Join Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <p className="text-[11px] text-stone-400 font-sans">
          We honor your privacy. Unsubscribe anytime with a single click.
        </p>
      </div>
    </section>
  );
};
