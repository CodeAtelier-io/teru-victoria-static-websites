import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';

/**
 * Pointer-driven 3D tilt for premium card interactions. The element rotates
 * subtly toward the cursor and lifts, with an optional light "glare" that
 * follows the pointer for a glossy, high-end feel.
 *
 * Writes styles directly (zoneless-friendly) and disables itself under
 * `prefers-reduced-motion` or on coarse/touch pointers, where a hover tilt
 * makes no sense. Pair with `[tiltGlare]="true"` on elements that clip their
 * overflow (the global `.tilt-glare` style handles the sheen).
 */
@Directive({ selector: '[appTilt]' })
export class TiltDirective implements OnInit, OnDestroy {
  /** Maximum rotation in degrees at the card edges. */
  readonly tiltMax = input(7);
  /** Add a cursor-following light glare (element must clip overflow). */
  readonly tiltGlare = input(false);
  /** Pixels the card lifts toward the viewer while hovered. */
  readonly tiltLift = input(6);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private glare?: HTMLElement;
  private raf = 0;
  private enabled = false;

  ngOnInit(): void {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia?.('(pointer: coarse)').matches;
    if (reduced || coarse) return;

    this.enabled = true;
    const el = this.host.nativeElement;
    el.style.transition = 'transform 0.3s var(--ease)';
    el.style.transformStyle = 'preserve-3d';

    if (this.tiltGlare()) {
      const glare = document.createElement('span');
      glare.className = 'tilt-glare';
      glare.setAttribute('aria-hidden', 'true');
      el.appendChild(glare);
      this.glare = glare;
    }

    el.addEventListener('pointermove', this.onMove);
    el.addEventListener('pointerleave', this.onLeave);
  }

  ngOnDestroy(): void {
    const el = this.host.nativeElement;
    el.removeEventListener('pointermove', this.onMove);
    el.removeEventListener('pointerleave', this.onLeave);
    cancelAnimationFrame(this.raf);
  }

  private readonly onMove = (event: PointerEvent): void => {
    if (!this.enabled) return;
    const el = this.host.nativeElement;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width; // 0..1
    const py = (event.clientY - rect.top) / rect.height; // 0..1
    const max = this.tiltMax();
    const rotateY = (px - 0.5) * 2 * max;
    const rotateX = (0.5 - py) * 2 * max;

    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(() => {
      el.style.transform =
        `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) ` +
        `rotateY(${rotateY.toFixed(2)}deg) translateY(-${this.tiltLift()}px)`;
      if (this.glare) {
        this.glare.style.opacity = '1';
        this.glare.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
        this.glare.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
      }
    });
  };

  private readonly onLeave = (): void => {
    const el = this.host.nativeElement;
    cancelAnimationFrame(this.raf);
    el.style.transform = '';
    if (this.glare) this.glare.style.opacity = '0';
  };
}
