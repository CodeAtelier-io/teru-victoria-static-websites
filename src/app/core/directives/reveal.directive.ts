import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';

export type RevealFrom = 'up' | 'left' | 'right' | 'scale' | 'fade';

/**
 * Fades an element into view as it enters the viewport, moving in from a chosen
 * direction. The reveal replays every time the element re-enters — scroll away
 * and back and it animates again. Add `appReveal` to any element; use
 * `[revealFrom]` for the variant and `[revealDelay]` (ms) to stagger groups.
 * Honours `prefers-reduced-motion` (handled in global CSS).
 */
@Directive({
  selector: '[appReveal]',
})
export class RevealDirective implements OnInit, OnDestroy {
  readonly revealFrom = input<RevealFrom>('up');
  readonly revealDelay = input(0);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;
  private clearTimer = 0;

  ngOnInit(): void {
    const node = this.el.nativeElement;
    node.classList.add('reveal', `reveal--${this.revealFrom()}`);

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-visible');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const delay = this.revealDelay();
            node.style.transitionDelay = `${delay}ms`;
            node.classList.add('is-visible');
            // Drop the stagger delay once the reveal has played, otherwise it
            // would also delay later transitions such as hover.
            clearTimeout(this.clearTimer);
            this.clearTimer = window.setTimeout(() => {
              node.style.transitionDelay = '';
            }, delay + 900);
          } else {
            // Reset to the hidden state (while it's out of view) so the reveal
            // replays the next time the element scrolls back in.
            clearTimeout(this.clearTimer);
            node.style.transitionDelay = '';
            node.classList.remove('is-visible');
          }
        }
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' },
    );
    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    clearTimeout(this.clearTimer);
  }
}
