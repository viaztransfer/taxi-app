import { Injectable, signal, computed } from '@angular/core';
import PocketBase, { RecordModel } from 'pocketbase';
import { environment } from '../../environment/environment';

export interface AppUser {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  role?: 'admin' | 'driver' | 'cliente' | 'operador';
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  pb = new PocketBase(environment.PB_URL);
currentUser() {
  return this.pb.authStore.model;
}
getDriverByUserId(userId: string) {
  return this.pb.collection('drivers').getFirstListItem(`userId="${userId}"`);
}

  private _user = signal<AppUser | null>(null);
  user = computed(() => this._user());
  isAuth = computed(() => this._user() !== null);

  constructor() {
    const model = this.pb.authStore.model as RecordModel | null;
    this.loadFromAuthStore(model);

    this.pb.authStore.onChange((_token, model) => {
      this.loadFromAuthStore(model as RecordModel | null);
    });
  }

  private loadFromAuthStore(model: RecordModel | null) {
    if (!model) {
      this._user.set(null);
      return;
    }

    this._user.set({
      id: model.id,
      email: (model as any).email,
      name: (model as any).name ?? '',
      role: (model as any).role,
      avatar: (model as any).avatar
        ? `${environment.PB_URL}/api/files/${model.collectionId}/${model.id}/${(model as any).avatar}`
        : undefined
    });
  }

  async login(email: string, password: string, remember = true) {
    // Cambiar storage según opción
(this.pb.authStore as any).storage = remember ? localStorage : sessionStorage;

    await this.pb.collection('users')
      .authWithPassword(email.trim().toLowerCase(), password);

    // Todo se maneja en onChange()
  }

  logout() {
    this.pb.authStore.clear();
    this._user.set(null);
  }

  get token() {
    return this.pb.authStore.token;
  }

  get raw() {
    return this.pb.authStore.model;
  }
}
