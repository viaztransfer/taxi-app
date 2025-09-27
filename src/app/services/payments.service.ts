import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class PaymentsService {
  private http = inject(HttpClient);
  private base = location.hostname === 'localhost'
    ? 'http://localhost:4242/payments'   // dev local
    : 'https://db.via-z.com/payments';   // prod por 443 (proxy)

  createCheckout(body: {
    customer: { name: string; email: string };
    currency: string; // 'mxn' o 'usd'
    amountTotal: number; // total con IVA ya incluido, en unidad (no centavos)
    viajeData: any;
    resumen: string;
    successPath?: string;
    cancelPath?: string;
  }) {
    return this.http.post<{ url: string }>(`${this.base}/checkout`, body);
  }
  
  getStatus(sessionId: string) {
    return this.http.get(`${this.base}/status/${sessionId}`);
  }
   
}
