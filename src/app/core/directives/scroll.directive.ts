import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';
import { ScrollEngine } from '../services/scroll-engine';

export type ScrollEffect =
  | 'rise'
  | 'rise-lg'
  | 'left'
  | 'right'
  | 'zoom'
  | 'parallax'
  | 'driftx'
  | 'zoompan'
  | 'exit'
  | 'herozoom'
  | 'fade';

/**
 * Scroll-linked motion. Add `[appScroll]` with an effect; the shared
 * {@link ScrollEngine} drives the animation from the element's position:
 *
 *   rise / rise-lg   fade + translate up as it enters
 *   left / right     fade + slide in from the side
 *   zoom             inner media scales down to rest (Revolut-style)
 *   parallax         drifts against the scroll (use `[scrollSpeed]`)
 *   fade             opacity only
 *
 * `[scrollSpeed]` scales parallax intensity. Continuous (not one-shot), so
 * elements keep moving the whole time they're on screen.
 */
@Directive({ selector: '[appScroll]' })
export class ScrollDirective implements OnInit, OnDestroy {
  readonly appScroll = input<ScrollEffect>('rise');
  readonly scrollSpeed = input(1);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly engine = inject(ScrollEngine);

  ngOnInit(): void {
    this.el.classList.add('sd', `sd--${this.appScroll()}`);
    this.el.style.setProperty('--spd', String(this.scrollSpeed()));
    this.engine.register(this.el);
  }

  ngOnDestroy(): void {
    this.engine.unregister(this.el);
  }
}
