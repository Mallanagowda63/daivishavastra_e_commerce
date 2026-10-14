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

export const scrollToElement = (selector: string) => {
  const el = document.querySelector<HTMLElement>(selector);
  if (el) lenis.scrollTo(el, { duration: 1.4 });
};
