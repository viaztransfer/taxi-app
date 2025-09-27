import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VirtualRouterService {
  private activeRouteSubject = new BehaviorSubject<string>('home');
  activeRoute$ = this.activeRouteSubject.asObservable();

  // 🔹 Pequeño almacén de estado (memoria + sessionStorage)
  private state: Record<string, any> = {};

  constructor() {
    // Ruta persistida
    const savedRoute = localStorage.getItem('activeRoute');
    if (savedRoute) this.activeRouteSubject.next(savedRoute);

    // Estado persistido por sesión (opcional)
    const savedState = sessionStorage.getItem('virtualState');
    if (savedState) this.state = JSON.parse(savedState);
  }

  get activeRoute(): string {
    return this.activeRouteSubject.value;
  }

  setActiveRoute(route: string) {
    this.activeRouteSubject.next(route);
    localStorage.setItem('activeRoute', route);
  }

  // 🔹 Estado: set/get/remove (persistimos en sessionStorage)
  setState(key: string, value: any) {
    this.state[key] = value;
    sessionStorage.setItem('virtualState', JSON.stringify(this.state));
  }

  getState<T = any>(key: string): T | undefined {
    return this.state[key] as T | undefined;
  }

  removeState(key: string) {
    delete this.state[key];
    sessionStorage.setItem('virtualState', JSON.stringify(this.state));
  }
}
