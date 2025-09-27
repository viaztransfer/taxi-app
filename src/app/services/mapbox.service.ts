import { Injectable } from '@angular/core';
import mapboxgl, { LngLatLike, Map } from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import type * as GeoJSON from 'geojson';
const geocoder = new MapboxGeocoder({
  accessToken: (mapboxgl as any).accessToken,
  mapboxgl: mapboxgl as any,
  placeholder: 'Buscar dirección',
  countries: 'co'
});
type LatLng = { lat: number; lng: number };

@Injectable({ providedIn: 'root' })
export class MapboxService {
  private token = 'pk.eyJ1IjoidmlhLXoiLCJhIjoiY21jOGp2YXAxMDhmdDJxbzl3dHRocW1uZyJ9.nK653zYb1bbfUHCNCeXjkA';
  private map?: Map;
  private markers: mapboxgl.Marker[] = [];
  private routeSourceId = 'route-src';
  private routeLayerId = 'route-layer';

  constructor() {
    (mapboxgl as any).accessToken = this.token;
  }

  /** Crea o reusa el mapa en el contenedor dado */
  async initMap(container: HTMLElement, center: LatLng = { lat: 4.711, lng: -74.0721 }, zoom = 12): Promise<void> {
    if (!this.map) {
      this.map = new mapboxgl.Map({
        container,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [center.lng, center.lat],
        zoom
      });

      await new Promise<void>((resolve) => this.map!.on('load', () => resolve()));

      // Fuente/layer para la ruta
      if (!this.map.getSource(this.routeSourceId)) {
        this.map.addSource(this.routeSourceId, {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] }
        });
      }
      if (!this.map.getLayer(this.routeLayerId)) {
        this.map.addLayer({
          id: this.routeLayerId,
          type: 'line',
          source: this.routeSourceId,
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: { 'line-width': 5, 'line-color': '#1fbad6' }
        });
      }
    } else {
      this.map.resize();
      this.map.setCenter([center.lng, center.lat]);
      this.map.setZoom(zoom);
      (this.map.getSource(this.routeSourceId) as mapboxgl.GeoJSONSource)?.setData({
        type: 'FeatureCollection',
        features: []
      });
    }
  }
  
  centerMap(coords: LatLng, zoom = 14) {
    this.map?.flyTo({ center: [coords.lng, coords.lat], zoom });
  }

  clearMarkers() {
    this.markers.forEach(m => m.remove());
    this.markers = [];
  }

  addMarker(coords: LatLng, title = 'Marker') {
    if (!this.map) return;
    const m = new mapboxgl.Marker({ color: '#d4b100' })
      .setLngLat([coords.lng, coords.lat])
      .setPopup(new mapboxgl.Popup().setText(title))
      .addTo(this.map);
    this.markers.push(m);
  }

  /** Forward geocoding (texto -> coords) */
  async geocode(text: string, country = 'co'): Promise<LatLng | null> {
    const url = new URL('https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(text) + '.json');
    url.searchParams.set('access_token', this.token);
    url.searchParams.set('limit', '1');
    url.searchParams.set('country', country);
    const res = await fetch(url.toString());
    const data = await res.json();
    const f = data?.features?.[0];
    if (!f) return null;
    const [lng, lat] = f.center;
    return { lat, lng };
  }

  /** Reverse geocoding (coords -> texto) */
  async reverseGeocode(coords: LatLng, country = 'co'): Promise<string | undefined> {
    const url = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.lng},${coords.lat}.json`);
    url.searchParams.set('access_token', this.token);
    url.searchParams.set('limit', '1');
    url.searchParams.set('country', country);
    const res = await fetch(url.toString());
    const data = await res.json();
    return data?.features?.[0]?.place_name;
  }

  /** Distancia + dibujo de ruta desde textos */
  async routeByText(originText: string, destText: string, country = 'co'):
    Promise<{ km: number; origin: LatLng; destination: LatLng }> {

    const [o, d] = await Promise.all([this.geocode(originText, country), this.geocode(destText, country)]);
    if (!o || !d) throw new Error('No se pudo geocodificar origen o destino.');

    const r = await this.route(o, d);
    return { km: r.km, origin: o, destination: d };
  }

  /** Usa Directions API; dibuja la línea en el mapa y devuelve km */
  async route(origin: LatLng, destination: LatLng): Promise<{ km: number }> {
    const profile = 'driving'; // driving | walking | cycling
    const url = new URL(`https://api.mapbox.com/directions/v5/mapbox/${profile}/${origin.lng},${origin.lat};${destination.lng},${destination.lat}`);
    url.searchParams.set('access_token', this.token);
    url.searchParams.set('geometries', 'geojson'); // para dibujar
    url.searchParams.set('overview', 'full');

    const res = await fetch(url.toString());
    const data = await res.json();

    const route = data?.routes?.[0];
    if (!route?.geometry) throw new Error('No se encontró ruta.');

    // Dibuja
    const geojson: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: route.geometry as GeoJSON.LineString
          }
        ]
      };
      (this.map!.getSource(this.routeSourceId) as mapboxgl.GeoJSONSource).setData(geojson);
      
    // ajusta cámara
    const coords = route.geometry.coordinates as [number, number][];
    const bounds = new mapboxgl.LngLatBounds(coords[0], coords[0]);
    for (const c of coords) bounds.extend(c as LngLatLike);
    this.map?.fitBounds(bounds, { padding: 40 });

    // distancia en km (Mapbox entrega metros)
    const km = (route.distance ?? 0) / 1000;
    return { km };
  }

  /** Ubicación actual del usuario */
  async useMyLocation(): Promise<{ coords: LatLng; address?: string }> {
    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error('Geolocalización no soportada'));
      navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
    });
    const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    const address = await this.reverseGeocode(coords);
    return { coords, address };
  }
}
