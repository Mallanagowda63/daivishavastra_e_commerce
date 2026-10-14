import React from 'react';

// Scalloped (cusped) temple-arch silhouette in a 0–100 box, stretched to each card.
// Points trace an ogee from the left shoulder up to the finial; each segment bulges outward as a lobe.
const ARCH_POINTS: [number, number][] = [
  [0, 21], [4, 16], [12, 12.5], [22, 9.5], [33, 6.5], [43, 4.5],
];
const LOBE = 3;
const buildArchPath = () => {
  const lobes = (pts: [number, number][]) =>
    pts.slice(1).map(([x, y], i) => {
      const [px, py] = pts[i];
      const dx = x - px, dy = y - py, len = Math.hypot(dx, dy);
      // outward normal (pointing away from the card interior)
      const nx = (dy / len) * LOBE * Math.sign(dx), ny = (-Math.abs(dx) / len) * LOBE;
      return `Q${((px + x) / 2 + nx).toFixed(2)} ${((py + y) / 2 + ny).toFixed(2)} ${x} ${y}`;
    });
  const left = lobes(ARCH_POINTS);
  const mirrored = [...ARCH_POINTS].reverse().map(([x, y]) => [100 - x, y] as [number, number]);
  const right = lobes(mirrored);
  return `M0 100 V21 ${left.join(' ')} L50 0 L${mirrored[0][0]} ${mirrored[0][1]} ${right.join(' ')} V100 Z`;
};
export const ARCH_PATH = buildArchPath();
const ARCH_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><path d='${ARCH_PATH}'/></svg>`
)}")`;
export const archMaskStyle: React.CSSProperties = {
  maskImage: ARCH_MASK,
  WebkitMaskImage: ARCH_MASK,
  maskSize: '100% 100%',
  WebkitMaskSize: '100% 100%',
};
