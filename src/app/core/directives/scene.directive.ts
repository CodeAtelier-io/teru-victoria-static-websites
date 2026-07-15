import { Directive, ElementRef, OnDestroy, OnInit, inject } from '@angular/core';

/**
 * Cursor-driven parallax "scene". Put `appScene` on a container; as the pointer
 * moves across it, the directive writes normalised offsets to two CSS custom
 * properties on the host:
 *   --mx  -1 (left) → 0 (centre) → 1 (right)
 *   --my  -1 (top)  → 0 (centre) → 1 (bottom)
 *
 * Child "layers" translate by those offsets times their own depth, e.g.
 *   transform: translate3d(calc(var(--mx) * var(--d) * 1px), … , 0);
 * giving a lifelike 3D parallax. Writes styles directly (zoneless-friendly) and
 * disables under reduced-motion / coarse pointers (offsets stay at 0).
 */
@Directive({ selector: '[appScene]' })
export class SceneDirective implements OnInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private raf = 0;
  private enabled = false;

  ngOnInit(): void {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia?.('(pointer: coarse)').matches;
    const el = this.host.nativeElement;
    el.style.setProperty('--mx', '0');
    el.style.setProperty('--my', '0');
    if (reduced || coarse) return;

    this.enabled = true;
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
    const mx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const my = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(() => {
      el.style.setProperty('--mx', mx.toFixed(3));
      el.style.setProperty('--my', my.toFixed(3));
    });
  };

  private readonly onLeave = (): void => {
    const el = this.host.nativeElement;
    el.style.transition = '';
    el.style.setProperty('--mx', '0');
    el.style.setProperty('--my', '0');
  };
}
