import { Injectable } from '@angular/core';

/**
 * Shared scroll-progress engine powering Revolut-style scroll-linked motion.
 *
 * Every registered element gets two CSS custom properties updated as the page
 * scrolls, which the global `.sd--*` styles turn into transforms/opacity:
 *   --rp  reveal progress, 0 (just below the fold) → 1 (well into view)
 *   --pc  centred progress, -1 (above centre) → 0 (centre) → 1 (below centre)
 *
 * One IntersectionObserver keeps the "currently near the viewport" set small,
 * and a single rAF-throttled pass updates only those elements, so hundreds of
 * animated nodes stay cheap. Writes styles directly (zoneless-friendly) and
 * fully disables under `prefers-reduced-motion` (everything renders at rest).
 */
@Injectable({ providedIn: 'root' })
export class ScrollEngine {
  private readonly tracked = new Set<HTMLElement>();
  private readonly active = new Set<HTMLElement>();
  private observer?: IntersectionObserver;
  private frame = 0;
  private ticking = false;
  private started = false;
  private reduced = false;

  register(el: HTMLElement): void {
    this.ensureStarted();
    this.tracked.add(el);
    if (this.reduced) {
      el.style.setProperty('--rp', '1');
      el.style.setProperty('--pc', '0');
      return;
    }
    this.observer?.observe(el);
    this.update(el); // seed initial values so nothing flashes in/out
  }

  unregister(el: HTMLElement): void {
    this.tracked.delete(el);
    this.active.delete(el);
    this.observer?.unobserve(el);
  }

  private ensureStarted(): void {
    if (this.started) return;
    this.started = true;
    this.reduced = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (this.reduced) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) this.active.add(el);
          else this.active.delete(el);
        }
        this.requestTick();
      },
      { rootMargin: '25% 0px 25% 0px' },
    );

    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onScroll, { passive: true });
  }

  private readonly onScroll = (): void => this.requestTick();

  private requestTick(): void {
    if (this.ticking) return;
    this.ticking = true;
    this.frame = requestAnimationFrame(() => {
      this.ticking = false;
      for (const el of this.active) this.update(el);
    });
  }

  private update(el: HTMLElement): void {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;

    // Reveal: begins as the top passes 92% of the viewport, completes ~42%.
    const rp = clamp((vh * 0.92 - rect.top) / (vh * 0.5), 0, 1);

    // Centred: where the element's middle sits relative to the viewport middle.
    const center = rect.top + rect.height / 2;
    const pc = clamp((center - vh / 2) / (vh / 2 + rect.height / 2), -1, 1);

    el.style.setProperty('--rp', rp.toFixed(3));
    el.style.setProperty('--pc', pc.toFixed(3));
  }
}

function clamp(n: number, min: number, max: number): number {
  return n < min ? min : n > max ? max : n;
}
