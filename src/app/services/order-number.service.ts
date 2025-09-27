import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OrderNumberService {
  private prefix = 'VZ';

  /** Devuelve algo como: VZ-20250901-000123 */
  next(date = new Date()): string {
    try {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      const dayKey = `${y}${m}${d}`;
      const lsKey = `orderSeq:${dayKey}`;

      let seq = 1;
      const current = localStorage.getItem(lsKey);
      if (current) seq = Number(current) + 1;

      localStorage.setItem(lsKey, String(seq)); // reset diario por clave
      const n = String(seq).padStart(6, '0');
      return `${this.prefix}-${dayKey}-${n}`;
    } catch {
      // Fallback si localStorage no está disponible
      const r = crypto.getRandomValues(new Uint32Array(1))[0] % 1000000;
      return `${this.prefix}-${this.yyyymmdd(date)}-${String(r).padStart(6, '0')}`;
    }
  }

  private yyyymmdd(date: Date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}${m}${d}`;
  }
}
