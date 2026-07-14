import {
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { I18nService } from '../../core/i18n.service';
import { Theme, ThemeService } from '../../core/theme.service';
import {
  BULGARIA_BOUNDS,
  Office,
  generateOffices,
  officeCities,
} from '../../core/office-locations';

/**
 * Interactive office-network map. Renders ~200 mock offices across Bulgaria on
 * a Leaflet map with free CARTO basemap tiles (no API key), clustered for a
 * clean country view. The three filters (city / street / office code) reactively
 * re-plot the visible markers and fly the map to the matching area — the whole
 * country when cleared, a city's cluster when a city is picked, tight onto a
 * single office. The basemap follows the app's light/dark theme.
 *
 * Leaflet mutates the DOM directly, which is fine under zoneless: the map keeps
 * its own state and we drive it from `effect`s on the filtered/theme signals.
 * The map is built in `afterNextRender` (not ngAfterViewInit) so the container
 * is fully laid out — otherwise Leaflet sizes the map to a 0-width stub.
 */
@Component({
  selector: 'app-locations',
  imports: [FormsModule],
  template: `
    <div class="locations">
      <div class="locations__bar" role="search">
        <label class="locations__field">
          <span>{{ i18n.t('locations.city') }}</span>
          <select [ngModel]="city()" (ngModelChange)="city.set($event)">
            <option value="">{{ i18n.t('locations.allCities') }}</option>
            @for (c of cities; track c) {
              <option [value]="c">{{ c }}</option>
            }
          </select>
        </label>

        <label class="locations__field">
          <span>{{ i18n.t('locations.street') }}</span>
          <input
            type="text"
            [ngModel]="street()"
            (ngModelChange)="street.set($event)"
            [placeholder]="i18n.t('locations.streetPlaceholder')"
          />
        </label>

        <label class="locations__field">
          <span>{{ i18n.t('locations.office') }}</span>
          <input
            type="text"
            [ngModel]="office()"
            (ngModelChange)="office.set($event)"
            [placeholder]="i18n.t('locations.officePlaceholder')"
          />
        </label>

        <button type="button" class="locations__reset" (click)="reset()" [disabled]="!hasFilter()">
          {{ i18n.t('locations.reset') }}
        </button>

        <span class="locations__count">
          {{ i18n.t('locations.showing', { count: filtered().length + '', total: total + '' }) }}
        </span>
      </div>

      <div #mapEl class="locations__map"></div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .locations__map {
        width: 100%;
      }
      .locations__bar {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        gap: 14px;
        padding: 18px 20px;
        margin-bottom: 18px;
        background: var(--color-white);
        border: 1px solid var(--color-line);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
      }
      .locations__field {
        display: grid;
        gap: 6px;
        font-size: 0.76rem;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--color-muted);
      }
      .locations__field select,
      .locations__field input {
        min-width: 190px;
        font-family: inherit;
        font-size: 0.95rem;
        font-weight: 500;
        text-transform: none;
        letter-spacing: normal;
        color: var(--color-ink);
        padding: 11px 13px;
        border: 1px solid var(--color-line);
        border-radius: var(--radius);
        background: var(--color-surface);
        transition:
          border-color 0.2s var(--ease),
          box-shadow 0.2s var(--ease),
          background 0.2s var(--ease);
      }
      .locations__field select:focus,
      .locations__field input:focus {
        outline: none;
        background: var(--color-white);
        border-color: var(--color-accent);
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-accent) 16%, transparent);
      }
      .locations__reset {
        font-family: inherit;
        font-size: 0.9rem;
        font-weight: 700;
        color: var(--color-accent);
        background: color-mix(in srgb, var(--color-accent) 10%, transparent);
        border: 1px solid color-mix(in srgb, var(--color-accent) 24%, transparent);
        border-radius: var(--radius);
        padding: 11px 18px;
        cursor: pointer;
        transition:
          background 0.2s var(--ease),
          opacity 0.2s var(--ease);
      }
      .locations__reset:hover:not(:disabled) {
        background: color-mix(in srgb, var(--color-accent) 18%, transparent);
      }
      .locations__reset:disabled {
        opacity: 0.4;
        cursor: default;
      }
      .locations__count {
        margin-left: auto;
        align-self: center;
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--color-muted);
      }
      .locations__map {
        height: 480px;
        border-radius: var(--radius-lg);
        overflow: hidden;
        border: 1px solid var(--color-line);
        box-shadow: var(--shadow-md);
        background: var(--color-surface);
      }
      @media (max-width: 640px) {
        .locations__field select,
        .locations__field input {
          min-width: 0;
          width: 100%;
        }
        .locations__field {
          flex: 1 1 100%;
        }
        .locations__count {
          margin-left: 0;
        }
        .locations__map {
          height: 400px;
        }
      }
    `,
  ],
})
export class Locations implements OnDestroy {
  readonly i18n = inject(I18nService);
  private readonly theme = inject(ThemeService);

  private readonly mapEl = viewChild.required<ElementRef<HTMLDivElement>>('mapEl');

  private readonly offices = generateOffices(200);
  readonly cities = officeCities(this.offices);
  readonly total = this.offices.length;

  readonly city = signal('');
  readonly street = signal('');
  readonly office = signal('');

  readonly hasFilter = computed(() => !!(this.city() || this.street().trim() || this.office().trim()));

  /** Offices matching all active filters. */
  readonly filtered = computed<Office[]>(() => {
    const city = this.city();
    const street = this.street().trim().toLowerCase();
    const office = this.office().trim().toLowerCase();
    return this.offices.filter(
      (o) =>
        (!city || o.city === city) &&
        (!street || o.street.toLowerCase().includes(street)) &&
        (!office || o.code.toLowerCase().includes(office)),
    );
  });

  private map?: L.Map;
  private cluster?: L.MarkerClusterGroup;
  private tiles?: L.TileLayer;
  private readonly markers = new Map<number, L.Marker>();
  private resizeObs?: ResizeObserver;
  private plotted = false;

  private readonly pinIcon = L.divIcon({
    className: 'office-pin',
    html: '<span class="office-pin__dot"></span>',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
  });

  constructor() {
    // Build the map after the DOM is painted, so the container is measured and
    // Leaflet gets a real size (ngAfterViewInit runs before layout → 0-width map).
    afterNextRender(() => this.initMap());

    // Re-plot when filters change. Read `filtered()` first so the effect always
    // tracks it, then no-op until the map exists.
    effect(() => {
      const list = this.filtered();
      if (this.plotted) this.render(list);
    });

    // Swap the basemap when the light/dark theme flips.
    effect(() => {
      const theme = this.theme.theme();
      this.tiles?.setUrl(tileUrl(theme));
    });
  }

  ngOnDestroy(): void {
    this.resizeObs?.disconnect();
    this.map?.remove();
  }

  private initMap(): void {
    const container = this.mapEl().nativeElement;
    const map = L.map(container, { scrollWheelZoom: false });

    this.tiles = L.tileLayer(tileUrl(this.theme.theme()), {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    }).addTo(map);

    const cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 55,
      iconCreateFunction: (c) =>
        L.divIcon({
          className: 'office-cluster',
          html: `<span>${c.getChildCount()}</span>`,
          iconSize: [42, 42],
        }),
    });

    for (const o of this.offices) {
      const marker = L.marker([o.lat, o.lng], { icon: this.pinIcon }).bindPopup(
        `<strong>${o.code}</strong><br>${o.street}<br>${o.city}`,
      );
      this.markers.set(o.id, marker);
    }

    map.addLayer(cluster);
    this.map = map;
    this.cluster = cluster;
    this.plotted = true;

    map.invalidateSize();
    this.render(this.filtered(), false);

    // Keep the map correct on later layout/viewport changes.
    this.resizeObs = new ResizeObserver(() => map.invalidateSize());
    this.resizeObs.observe(container);
  }

  reset(): void {
    this.city.set('');
    this.street.set('');
    this.office.set('');
  }

  /** Sync the visible markers to `list` and move the map to fit them. */
  private render(list: Office[], animate = true): void {
    const map = this.map;
    const cluster = this.cluster;
    if (!map || !cluster) return;

    cluster.clearLayers();

    if (list.length === 0) {
      map.fitBounds(BULGARIA_BOUNDS, { animate });
      return;
    }

    cluster.addLayers(list.map((o) => this.markers.get(o.id)!));

    if (list.length === 1) {
      const only = list[0];
      if (animate) map.flyTo([only.lat, only.lng], 15, { duration: 0.6 });
      else map.setView([only.lat, only.lng], 15);
      return;
    }

    const bounds = L.latLngBounds(list.map((o) => [o.lat, o.lng] as [number, number])).pad(0.25);
    if (animate) map.flyToBounds(bounds, { duration: 0.6, maxZoom: 14 });
    else map.fitBounds(bounds, { maxZoom: 14, animate: false });
  }
}

/** Free CARTO basemap tiles (no API key) that match the app's theme. */
function tileUrl(theme: Theme): string {
  const style = theme === 'dark' ? 'dark_all' : 'light_all';
  return `https://{s}.basemaps.cartocdn.com/${style}/{z}/{x}/{y}{r}.png`;
}
