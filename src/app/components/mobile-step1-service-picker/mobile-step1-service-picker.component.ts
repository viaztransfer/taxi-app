import { Component, EventEmitter, Input, Output, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMapsService } from '../../services/google-maps.service';
import { MapboxService } from '../../services/mapbox.service';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
type Tipo = 'aeropuerto'|'punto'|'hora';
type Modo = 'aeropuerto'|'punto'|'hora';
type Step1Result = {
  origin: string;
  destination: string;
  pax?: number;
  bags?: number;
  baby?: number;
  horas?: number;
};
@Component({
  selector: 'app-mobile-step1-service-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mobile-step1-service-picker.component.html'
})
export class MobileStep1ServicePickerComponent implements AfterViewInit {
  @Input()  modo: Tipo = 'punto';                           // <-- [modo]="tipo"
  @Output() back = new EventEmitter<void>();                // <-- (back)
  @Output() continue = new EventEmitter<Step1Result>();

  origin = '';
  destination = '';
  pax = 1; bags = 0; baby = 0; horas = 2;
  
  @ViewChild('originRef') originRef?: ElementRef<HTMLInputElement>;
  @ViewChild('destRef')   destRef?: ElementRef<HTMLInputElement>;
  @ViewChild('mapRef', { static: false }) mapRef!: ElementRef<HTMLDivElement>; // <- "!" y {static:false}
  constructor(private maps: GoogleMapsService, 
    public mapbox: MapboxService){}

    async ngAfterViewInit() {
      await this.mapbox.initMap(this.mapRef!.nativeElement);
  
      const geocoder = new MapboxGeocoder({
        accessToken: (mapboxgl as any).accessToken,
        mapboxgl: mapboxgl as any,
        placeholder: this.modo === 'hora' ? 'Lugar de recogida' : 'Origen',
        countries: 'co'
      });
      geocoder.addTo(this.mapRef!.nativeElement); // <- "!" aquí también
      geocoder.on('result', (e: any) => {
        this.origin = e.result?.place_name ?? this.origin;
      });
  
      if (this.modo !== 'hora') {
        const geocoder2 = new MapboxGeocoder({
          accessToken: (mapboxgl as any).accessToken,
          mapboxgl: mapboxgl as any,
          placeholder: 'Destino',
          countries: 'co'
        });
        geocoder2.addTo(this.mapRef!.nativeElement); // <- "!"
        geocoder2.on('result', (e: any) => {
          this.destination = e.result?.place_name ?? this.destination;
        });
      }
    }
  
    useMyLocation() {
      this.mapbox.useMyLocation().then(({ address, coords }) => {
        if (address) this.origin = address;
        this.mapbox.centerMap(coords);
        this.mapbox.clearMarkers();
        this.mapbox.addMarker(coords, 'Tu ubicación');
      });
    }
  
    next() {
      this.continue.emit({
        origin: this.origin.trim(),
        destination: this.modo === 'hora' ? 'Servicio por hora' : this.destination.trim(),
        pax: this.pax,
        bags: this.bags,
        baby: this.baby,
        horas: this.horas
      });
    }

  swap(){ [this.origin, this.destination] = [this.destination, this.origin]; }

  
   
}
