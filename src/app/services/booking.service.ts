// src/app/services/booking.service.ts
import { Injectable } from '@angular/core';

export type TipoServicio = 'aeropuerto' | 'punto' | 'hora';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private _tipo: TipoServicio | null = null;

  set tipoServicio(t: TipoServicio | null) { this._tipo = t; }
  get tipoServicio(): TipoServicio | null { return this._tipo; }

  reset() { this._tipo = null; }
}
