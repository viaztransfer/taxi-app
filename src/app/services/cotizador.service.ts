import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TramosService } from './tramos.service';

export type TipoServicio = 'aeropuerto' | 'punto' | 'hora';
export type TipoVehiculo =
  'sedan' | 'minivan' | 'suv' | 'minibus' | 'Van 16 asientos';
export type SubtipoVehiculo =
  'estandar' | 'espacioso' | 'premium' | 'Van 12 asientos' | 'Van 16 asientos';
  export interface CotizacionDTO {
    tipoServicio: TipoServicio;
    distanciaKm?: number;                 // requerido en aeropuerto|punto
    horasContratadas?: number;            // requerido en hora
    vehiculo: TipoVehiculo;               // p. ej. 'sedan'
    vehiculoSubtipoSeleccionado?: SubtipoVehiculo; // p. ej. 'estandar'
    pasajeros?: number;
    maletas?: number;
    sillasBebe?: number;
  }
  
  export interface ResultadoCalculo {
    subtotal: number;
    iva: number;
    total: number;
    desglose: {
      precioBase?: number;
      kmExtras?: number;
      precioPorKm?: number;
      horasBase?: number;
      horasExtras?: number;
      precioHoraBase?: number;
      precioHoraExtra?: number;
      tipoTarifa: 'distancia' | 'hora';
    };
  }
@Injectable({ providedIn: 'root' })
export class CotizadorService {
  public tarifaTotalSubject = new BehaviorSubject<number>(0);
  public distanciaKmSubject = new BehaviorSubject<number>(0);

  tarifaTotal$ = this.tarifaTotalSubject.asObservable();
  distanciaKm$ = this.distanciaKmSubject.asObservable();
  public distanciaKm = new BehaviorSubject<number>(0);

  private _tarifaTotal$ = new BehaviorSubject<number>(0);
  constructor(private tramos: TramosService) {}
  setTarifaTotal(valor: number) {
    this.tarifaTotalSubject.next(valor);
  }

setDistanciaKm(km: number) {
  this.distanciaKm.next(km);
}

public duracionHoras = new BehaviorSubject<number>(2);

setDuracionHoras(horas: number) {
  this.duracionHoras.next(horas);
}

getDuracionHoras(): number {
  return this.duracionHoras.getValue();
}

getDistanciaKm(): number {
  return this.distanciaKm.getValue();
}
calcular(dto: CotizacionDTO): ResultadoCalculo {
    if (dto.tipoServicio === 'hora') {
      const r = this.calcularPorHora(dto);
      this._tarifaTotal$.next(r.total);
      return r;
    } else {
      const r = this.calcularPorDistancia(dto);
      this._tarifaTotal$.next(r.total);
      return r;
    }
  }

  // ----------- helpers internos -----------
  private obtenerClaveVehiculo(tipo: string, subtipo?: string): string {
    const norm = (s: string) => (s || '').toLowerCase().replace(/\s+/g, '_');
    if (tipo === 'minibus' && subtipo === 'Van 12 asientos') return 'minibus_12';
    if (tipo === 'Van 16 asientos') return 'minibus_19';
    return `${norm(tipo)}_${norm(subtipo || 'estandar')}`;
  }

  private calcularPorDistancia(dto: CotizacionDTO): ResultadoCalculo {
    const distancia = Number(
      dto.distanciaKm ?? this.distanciaKm ?? 0
    );

    const tipoSrv = dto.tipoServicio === 'aeropuerto'
      ? 'aeropuerto_hotel'
      : 'punto_a_punto';

    const claveVeh = this.obtenerClaveVehiculo(dto.vehiculo, dto.vehiculoSubtipoSeleccionado);

    // Usa tu TramosService para obtener precio base + por km
    const totalSinIVA = this.tramos.calcularTarifa(distancia, tipoSrv, claveVeh);

    // Para desglose exacto (opcional): inspeccionamos tramos
    const t = this.tramos.getTramos?.() ?? (this.tramos as any)['tramos'] ?? [];
    let precioBase = 0, kmExtras = 0, precioPorKm = 0;

    const tramoFijo = t.find((x: any) => x.tipo === 'fijo');
    if (tramoFijo) {
      const tarifasServicio = tramoFijo.tarifas as Record<string, Record<string, number>>;
      precioBase = tarifasServicio?.[tipoSrv]?.[claveVeh] || 0;
    }

    if (distancia > 10) {
      const tramoVar = t
        .filter((x: any) => x.tipo === 'por_intervalo')
        .find((x: any) => distancia > (x.kmDesde || 0) && distancia <= (x.kmHasta || Infinity));
      if (tramoVar) {
        const tarifasKm = tramoVar.tarifas as Record<string, number>;
        const unidad = tramoVar.unidadCadaKm || 1;
        kmExtras = Math.max(0, distancia - 10);
        precioPorKm = unidad > 0 ? (tarifasKm[claveVeh] || 0) / unidad : 0;
      }
    }

    const subtotal = Number(totalSinIVA || 0);
    const iva = +(subtotal * 0.16).toFixed(2);
    const total = +(subtotal + iva).toFixed(2);

    return {
      subtotal,
      iva,
      total,
      desglose: {
        precioBase,
        kmExtras,
        precioPorKm,
        tipoTarifa: 'distancia'
      }
    };
  }

  private calcularPorHora(dto: CotizacionDTO): ResultadoCalculo {
    const horas = Number(dto.horasContratadas ?? this.duracionHoras ?? 2);

    // misma tabla que ya usas en components two/three
    const tarifasHora = [
      { tipo: 'sedan',   subtipo: 'estandar',        base: 1500, adicional:  750 },
      { tipo: 'sedan',   subtipo: 'espacioso',       base: 2056, adicional: 1028 },
      { tipo: 'sedan',   subtipo: 'premium',         base: 3480, adicional: 1740 },
      { tipo: 'minivan', subtipo: 'estandar',        base: 2898, adicional: 1449 },
      { tipo: 'minivan', subtipo: 'premium',         base: 5761, adicional: 2880 },
      { tipo: 'suv',     subtipo: 'premium',         base: 6356, adicional: 3178 },
      { tipo: 'minibus', subtipo: 'Van 12 asientos', base: 7950, adicional: 3975 },
      { tipo: 'Van 16 asientos', subtipo: 'Van 16 asientos', base: 8960, adicional: 4480 }
    ] as const;

    const fila = tarifasHora.find(f =>
      f.tipo === dto.vehiculo &&
      f.subtipo === (dto.vehiculoSubtipoSeleccionado || 'estandar')
    );

    if (!fila) {
      return { subtotal: 0, iva: 0, total: 0, desglose: { tipoTarifa: 'hora' } };
    }

    const horasExtras = Math.max(0, horas - 2);
    const subtotal = fila.base + horasExtras * fila.adicional;
    const iva = +(subtotal * 0.16).toFixed(2);
    const total = +(subtotal + iva).toFixed(2);

    return {
      subtotal,
      iva,
      total,
      desglose: {
        horasBase: 2,
        horasExtras,
        precioHoraBase: fila.base,
        precioHoraExtra: fila.adicional,
        tipoTarifa: 'hora'
      }
    };
  }


}
