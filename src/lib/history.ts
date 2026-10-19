import { useEffect, useRef } from 'react';

// Browser history for the single-page site, so the phone back button behaves like a normal website:
//  • every page change adds a history entry (pushUrl) and remembers the scroll position of the page you left;
//  • open drawers / modals add an entry too (useBackToClose), so "back" closes them instead of leaving the page.
// When a modal closes some other way (✕ button, or tapping a link inside it), its entry is removed with
// history.go(-n). That pop is swallowed here, and any page change requested meanwhile waits until it lands,
// so the new page is never undone by the clean-up.

let pendingPops = 0; // history.go() calls whose popstate we must swallow
let toDrop = 0; // modal entries waiting to be removed in the next microtask
const queued: Array<() => void> = [];

const flush = () => {
  if (pendingPops === 0 && toDrop === 0) queued.splice(0).forEach((run) => run());
};

if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual';
  window.addEventListener(
    'popstate',
    (e) => {
      if (pendingPops > 0) {
        pendingPops--;
        e.stopImmediatePropagation();
        flush();
      }
    },
    { capture: true },
  );
}

const whenSettled = (run: () => void) => {
  if (pendingPops > 0 || toDrop > 0) queued.push(run);
  else run();
};

/** Add a history entry for a new page. `leavingScrollY` is the scroll position of the page being left. */
export const pushUrl = (url: string, leavingScrollY: number) => {
  // Let any modal that is closing in this same tap remove its entry first.
  setTimeout(() =>
    whenSettled(() => {
      window.history.replaceState({ ...(window.history.state ?? {}), scrollY: leavingScrollY }, '');
      window.history.pushState({ page: true }, '', url);
    }),
  );
};

/** Change the current entry's address without adding history (e.g. fixing an unknown address). */
export const replaceUrl = (url: string) => window.history.replaceState(window.history.state, '', url);

const dropModalEntry = () => {
  toDrop++;
  if (toDrop === 1) {
    queueMicrotask(() => {
      const n = toDrop;
      toDrop = 0;
      pendingPops++;
      window.history.go(-n);
    });
  }
};

/** While `open`, the back button calls `close` instead of leaving the page. */
export const useBackToClose = (open: boolean, close: () => void) => {
  const closeRef = useRef(close);
  closeRef.current = close;

  useEffect(() => {
    if (!open) return;
    let closedByBack = false;
    whenSettled(() => window.history.pushState({ ...(window.history.state ?? {}), modal: true }, ''));
    const onPop = () => {
      closedByBack = true;
      closeRef.current();
    };
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      if (!closedByBack) dropModalEntry();
    };
  }, [open]);
};
