import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// Site-wide smooth (inertia) scrolling for mouse wheel and trackpad.
// Touch devices keep their native scrolling.
export const lenis = new Lenis({
  lerp: 0.085,
  wheelMultiplier: 1,
  smoothWheel: true,
  autoRaf: true,
  anchors: true,
  // Let drawers, modals and other inner scroll areas scroll natively.
  allowNestedScroll: true,
  prevent: (node) => !!node.closest('[role="dialog"], [data-lenis-prevent]'),
});

export const scrollToTop = () => lenis.scrollTo(0, { duration: 1.1 });

// Height of the pinned announcement bar + header, so sections don't land underneath it.
const pinnedTopHeight = () => document.querySelector<HTMLElement>('#site-top')?.offsetHeight ?? 0;

export const scrollToElement = (selector: string) => {
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return;
  const offset = -pinnedTopHeight();
  lenis.scrollTo(el, {
    duration: 1.4,
    offset,
    // Images above may finish loading mid-scroll and shift the page; settle on the final position.
    onComplete: () => {
      if (Math.abs(el.getBoundingClientRect().top + offset) > 4) lenis.scrollTo(el, { duration: 0.4, offset });
    },
  });
};
