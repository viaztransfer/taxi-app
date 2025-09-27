import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsService } from '../../services/google-maps.service';
import { CotizadorService } from '../../services/cotizador.service';
import { TravelDataService } from '../../services/travel-data.service';
import { VirtualRouterService } from '../../services/virtual-router.service';

import { MobileStep1ServicePickerComponent } from '../mobile-step1-service-picker/mobile-step1-service-picker.component';
import { MobileStep2FormComponent } from '../mobile-step2-form/mobile-step2-form.component';
import { MobileStep3SummaryComponent } from '../mobile-step3-summary/mobile-step3-summary.component';
import { MobileStep4SummaryComponent } from '../mobile-step4-summary/mobile-step4-summary.component';
import { MapboxService } from '../../services/mapbox.service';

@Component({
  selector: 'app-mobile-booking',
  standalone: true,
  imports: [
    CommonModule,
    MobileStep1ServicePickerComponent,
    MobileStep2FormComponent,
    MobileStep3SummaryComponent,
    MobileStep4SummaryComponent
  ],
  templateUrl: './mobile-booking.component.html'
})
export class MobileBookingComponent {
  step: 'buscar'|'categoria'|'subtipo'|'resumen' = 'buscar';
  tipo: 'aeropuerto'|'punto'|'hora' = 'punto';

  // datos que vamos rellenando paso a paso
  origin = '';
  destination = '';
  pax = 1;
  bags = 0;
  baby = 0;
  categoria: 'sedan'|'minivan'|'suv'|'minibus'|'Van 16 asientos' = 'sedan';
  subtipo: 'estandar'|'espacioso'|'premium'|'Van 12 asientos'|'Van 16 asientos' = 'estandar';

  resumen: any = null;
  constructor(
    public virtual: VirtualRouterService,
    public cotizador: CotizadorService,
    public maps: GoogleMapsService,
    public mapbox: MapboxService  
  ){}

  ngOnInit(): void {
    const t = this.virtual.getState<'aeropuerto'|'punto'|'hora'>('tipo');
    this.tipo = t ?? 'punto';
    this.step = 'buscar';
  }
  
  goHome(){     this.virtual.setActiveRoute('home'); }

  // Step 1 -> Step 2

  async onSearchContinue(evt: any) {
    this.origin = evt.origin ?? '';
    this.destination = this.tipo === 'hora' ? 'Servicio por hora' : (evt.destination ?? '');
    this.pax = evt.pax ?? 1;
    this.bags = evt.bags ?? 0;
    this.baby = evt.baby ?? 0;

    // Si quieres precalcular distancia/hours aquí, puedes:
    if (this.tipo !== 'hora' && this.origin && this.destination) {
      const { km } = await this.mapbox.routeByText(this.origin, this.destination);
this.cotizador.setDistanciaKm(km);
    } else if (this.tipo === 'hora') {
      const horas = Math.max(2, Number(evt.horas ?? 2));
      this.cotizador.setDuracionHoras(horas);
    }

    this.step = 'categoria';
  }

  // Step 2 -> Step 3
  onCategoryContinue(evt: {pax:number;bags:number;baby:number;categoria:any}) {
    this.pax = evt.pax; this.bags = evt.bags; this.baby = evt.baby;
    this.categoria = evt.categoria;
  
    // Arma dto resumido
    const dto: any = {
      tipoServicio: this.tipo,
      origin: this.origin,
      destination: this.destination || (this.tipo==='hora' ? 'Servicio por hora' : ''),
      pasajeros: this.pax,
      maletas: this.bags,
      sillasBebe: this.baby,
      vehiculo: this.categoria,
      vehiculoSubtipoSeleccionado: 'estandar' // o calcula uno por defecto
    };
  
    // Distancia u horas
    if (this.tipo !== 'hora') {
      dto.distanciaKm = this.cotizador.getDistanciaKm(); // ya seteaste en onSearchContinue
    } else {
      dto.horasContratadas = this.cotizador.getDuracionHoras() ?? 2;
    }
  
    const res = this.cotizador.calcular({
      tipoServicio: dto.tipoServicio,
      distanciaKm: dto.distanciaKm,
      horasContratadas: dto.horasContratadas,
      vehiculo: dto.vehiculo,
      vehiculoSubtipoSeleccionado: dto.vehiculoSubtipoSeleccionado
    });
  
    dto.precio = res.total;
    dto.desglose = res.desglose;
  
    localStorage.setItem('datosCotizador', JSON.stringify(dto));
    this.resumen = dto;
    this.step = 'resumen';
  }

  onSubtypeContinue(evt: any) {
    this.subtipo = evt.subtipo;

    // Arma dto para cotizar
    const dto: any = {
      tipoServicio: this.tipo,
      origin: this.origin,
      destination: this.destination,
      passengerCount: this.pax,
      maletaCount: this.bags,
      sillasBebe: this.baby,
      vehiculo: this.categoria,
      vehiculoSubtipoSeleccionado: this.subtipo
    };

    // Distancia u horas
    if (this.tipo !== 'hora') {
      dto.distanciaKm = this.cotizador.getDistanciaKm();
    } else {
      dto.horasContratadas = this.cotizador.getDuracionHoras() ?? 2;
    }

    // Cotiza
    const res = this.cotizador.calcular({
      tipoServicio: dto.tipoServicio,
      distanciaKm: dto.distanciaKm,
      horasContratadas: dto.horasContratadas,
      vehiculo: dto.vehiculo,
      vehiculoSubtipoSeleccionado: dto.vehiculoSubtipoSeleccionado
    });

    dto.precio = res.total;
    dto.desglose = res.desglose;

    // Persiste y avanza
    localStorage.setItem('datosCotizador', JSON.stringify(dto));
    this.resumen = dto;
    this.step = 'resumen';
  }

  // Confirmación final
  confirmar() {
    // Redirige a tu paso de pago / siguiente pantalla
    this.virtual.setActiveRoute('two');
  }
  // Si quieres SALTAR subtipo:



}
