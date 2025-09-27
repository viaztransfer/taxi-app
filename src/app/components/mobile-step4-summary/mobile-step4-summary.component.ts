import { Component, EventEmitter, Input, Output, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsService } from '../../services/google-maps.service';

type Tipo = 'aeropuerto'|'punto'|'hora';

@Component({
  selector: 'app-mobile-step4-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-step4-summary.component.html'
})
export class MobileStep4SummaryComponent implements AfterViewInit {
  @Input() tipo!: Tipo;
  @Input() data: any;
  @Output() back = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  @ViewChild('mapEl') mapEl?: ElementRef<HTMLDivElement>;

  constructor(private maps: GoogleMapsService){}

  async ngAfterViewInit() {
    if (this.tipo==='hora' || !this.mapEl) return;
    await this.maps.initMap(this.mapEl.nativeElement);
    // Dibuja ruta usando textos (coincide con tu firma existente)
    this.maps.calcularRuta(
      () => {},                 // callback opcional
      undefined,                // originCoords
      undefined,                // destCoords
      this.data?.origin,        // originText
      this.data?.destination    // destText
    );
  }
}
