import { Injectable } from '@angular/core';
import PocketBase, { RecordModel } from 'pocketbase';
import { environment } from '../../environment/environment';

@Injectable({ providedIn: 'root' })
export class DriverTripsService {
    
  private pb = new PocketBase(environment.PB_URL);

 async getMyTrips(driverId: string) {
  return await this.pb.collection('trips').getFullList({
    filter: `driverId="${driverId}" && Status_del_servicio != "Completado"`,
    sort: '-created'
  });
}
async updateTrip(id: string, data: FormData) {
  return await this.pb.collection('trips').update(id, data);
}


}
