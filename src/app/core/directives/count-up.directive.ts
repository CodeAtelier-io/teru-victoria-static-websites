import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';

/**
 * Counts a numeric value up from zero each time it scrolls into view (it resets
 * while out of view and replays on re-entry), preserving any non-digit
 * prefix/suffix (e.g. "180 000+"). Digits are grouped with spaces to match the
 * source formatting.
 */
@Directive({
  selector: '[appCountUp]',
})
export class CountUpDirective implements OnInit, OnDestroy {
  /** The final value to display, e.g. "180 000+" or "40+". */
  readonly appCountUp = input.required<string>();
  readonly duration = input(1600);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;
  private frame = 0;

  ngOnInit(): void {
    const node = this.el.nativeElement;
    const target = this.appCountUp();
    const digits = target.replace(/\D/g, '');
    const value = Number(digits);

    // Nothing numeric to animate — just render the value.
    if (!digits || Number.isNaN(value)) {
      node.textContent = target;
      return;
    }

    const prefix = target.slice(0, target.search(/\d/));
    const suffix = target.slice(target.search(/\d(?=\D*$)/) + 1);

    const render = (n: number) => {
      node.textContent = `${prefix}${this.group(n)}${suffix}`;
    };
    render(0);

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      render(value);
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.animate(value, render);
          } else {
            // Reset while out of view so the count-up replays on re-entry.
            cancelAnimationFrame(this.frame);
            render(0);
          }
        }
      },
      { threshold: 0.4 },
    );
    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    cancelAnimationFrame(this.frame);
  }

  private animate(target: number, render: (n: number) => void): void {
    cancelAnimationFrame(this.frame);
    const start = performance.now();
    const dur = this.duration();
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      render(Math.round(eased * target));
      if (t < 1) {
        this.frame = requestAnimationFrame(tick);
      }
    };
    this.frame = requestAnimationFrame(tick);
  }

  private group(n: number): string {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
}
