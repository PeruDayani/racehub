declare module "leaflet-gpx" {
  import * as L from "leaflet";

  interface GPXOptions {
    async?: boolean;
    marker_options?: {
      startIconUrl?: string;
      endIconUrl?: string;
      shadowUrl?: string;
      wptIconUrls?: Record<string, string>;
    };
    polyline_options?: L.PolylineOptions;
  }

  interface GPXLoadedEvent {
    target: GPX;
  }

  class GPX extends L.FeatureGroup {
    constructor(gpx: string | Document, options?: GPXOptions);
    getBounds(): L.LatLngBounds;
    get_duration_string(duration: number, hidems: boolean): string;
    get_duration_string_iso(duration: number, hidems: boolean): string;
    to_miles(n: number): number;
    to_ft(n: number): number;
    m_to_km(n: number): number;
    format_time(s: number): string;
    format_time_iso(s: number): string;
    on(event: "loaded", callback: (e: GPXLoadedEvent) => void): this;
  }

  export default GPX;
}
