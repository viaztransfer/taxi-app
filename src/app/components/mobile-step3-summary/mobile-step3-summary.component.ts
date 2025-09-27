import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapboxService } from '../../services/mapbox.service';

type CategoriaKey = 'sedan'|'minivan'|'suv'|'minibus'|'Van 16 asientos';
type SubtipoVehiculo = 'estandar'|'espacioso'|'premium'|'Van 12 asientos'|'Van 16 asientos';
type Categoria = 'sedan'|'minivan'|'suv'|'minibus'|'Van 16 asientos';
@Component({
  selector: 'app-mobile-step3-summary', // lo mantenemos
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-step3-summary.component.html' // tu HTML ya lo tienes
  })
export class MobileStep3SummaryComponent {
  @ViewChild('mapEl') mapEl!: ElementRef<HTMLDivElement>;
  @Input() origin = '';
  @Input() destination = '';
  @Input() pax = 1;
  @Input() bags = 0;
  @Input() baby = 0;
  @Input() categoria!: Categoria;
  @Input() tipo!: 'aeropuerto'|'punto'|'hora';

  @Output() back = new EventEmitter<void>();
  @Output() continue = new EventEmitter<{subtipo: string}>();

  subtipos: string[] = [];
  subtipoSeleccionado = '';
  constructor(
    public mapbox: MapboxService
  ){}
  ngOnInit(): void {
    // define subtipos por categoría
    const map: Record<Categoria, string[]> = {
      sedan: ['estandar','premium'],
      minivan: ['estandar','espacioso'],
      suv: ['estandar','premium'],
      minibus: ['Van 12 asientos'],
      'Van 16 asientos': ['Van 16 asientos']
    };
    this.subtipos = map[this.categoria] ?? ['estandar'];
    this.subtipoSeleccionado = this.subtipos[0];
  }

  seleccionar(s: string) {
    this.subtipoSeleccionado = s;
  }

 /*  next() {
    this.continue.emit({ subtipo: this.subtipoSeleccionado });
  } */
  next() {
    this.continue.emit({
      subtipo: 'estandar' // ...lo que selecciones aquí
       /* estimadoKm: this.distanciaKm, */ // si lo calculaste
    });
  }

 
  async ngAfterViewInit() {
    if (this.tipo === 'hora') return; // sin ruta
    await this.mapbox.initMap(this.mapEl.nativeElement);
    const { km } = await this.mapbox.routeByText(this.origin, this.destination);
    // si quieres exponer este km al padre al hacer continue:
    /*  this.distanciaKm = km; */
  }
  
}
