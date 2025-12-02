import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DriverTripsService } from '../../../services/driver-trips.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-driver-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showStartModal = false;
startTripId: string | null = null;
startImage: File | null = null;
previewStart: string | null = null;
showFinishModal = false;
finishTripId: string | null = null;
endImage: File | null = null;
previewEnd: string | null = null;
  trips: any[] = [];
  loading = true;
  stats = {
    totalTrips: 0,
    completedTrips: 0,
    pendingTrips: 0,
    cancelledTrips: 0
  };

  constructor(
    private router: Router,
    private tripsService: DriverTripsService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const user = this.auth.raw;
    if (!user) return;

    this.auth.getDriverByUserId(user.id)
      .then(driver => {
        if (!driver) {
          console.error("⚠️ Este usuario no está vinculado a ningún driver");
          return;
        }

        const driverId = driver.id;
        this.loadDriverTrips(driverId);
      })
      .catch(err => console.error("Error al obtener el conductor:", err));
  }

  private loadDriverTrips(driverId: string) {
    this.tripsService.getMyTrips(driverId)
      .then(trips => {
        this.trips = trips;
        this.calculateStats(trips);
        this.loading = false;
      })
      .catch(err => console.error("Error al cargar viajes:", err));
  }

  private calculateStats(trips: any[]) {
    this.stats = {
      totalTrips: trips.length,
      completedTrips: trips.filter(trip => trip.Status_del_servicio === 'Completado').length,
      pendingTrips: trips.filter(trip => trip.Status_del_servicio === 'Pendiente').length,
      cancelledTrips: trips.filter(trip => trip.Status_del_servicio === 'Cancelado').length
    };
  }

  startTrip() {
    this.router.navigate(['/driver/trip-start']);
  }
openStartTripModal(trip: any) {
  this.startTripId = trip.id;
  this.showStartModal = true;
}
onSelectStartImage(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  this.startImage = file;

  const reader = new FileReader();
  reader.onload = (e: any) => {
    this.previewStart = e.target.result;
  };
  reader.readAsDataURL(file);
}
async confirmStartTrip() {
  if (!this.startTripId || !this.startImage) return;

  try {
    const formData = new FormData();
    formData.append("foto_inicio", this.startImage);
    formData.append("Status_del_servicio", "iniciado");

    await this.tripsService.updateTrip(this.startTripId, formData);

    this.showStartModal = false;
    this.startImage = null;
    this.previewStart = null;

    // 🚀 Notificación SweetAlert2
    Swal.fire({
      title: '¡Viaje iniciado!',
      text: 'La evidencia inicial fue enviada correctamente.',
      icon: 'success',
      confirmButtonText: 'Continuar',
      confirmButtonColor: '#0d6efd'
    });

    this.ngOnInit();

  } catch (err) {
    console.error("Error al iniciar viaje", err);

    Swal.fire({
      title: 'Error',
      text: 'No se pudo iniciar el viaje. Intente nuevamente.',
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#dc3545'
    });
  }
}
openFinishTripModal(trip: any) {
  this.finishTripId = trip.id;
  this.showFinishModal = true;
}
onSelectFinishImage(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  this.endImage = file;

  const reader = new FileReader();
  reader.onload = (e: any) => {
    this.previewEnd = e.target.result;
  };
  reader.readAsDataURL(file);
}
async confirmFinishTrip() {
  if (!this.finishTripId || !this.endImage) return;

  try {
    const formData = new FormData();
    formData.append("foto_fin", this.endImage);
    formData.append("Status_del_servicio", "completado");

    await this.tripsService.updateTrip(this.finishTripId, formData);

    this.showFinishModal = false;
    this.endImage = null;
    this.previewEnd = null;

    Swal.fire({
      title: 'Viaje completado',
      text: 'Has enviado la evidencia final correctamente.',
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#0d6efd'
    });

    this.ngOnInit();

  } catch (err) {
    console.error(err);

    Swal.fire({
      title: 'Error',
      text: 'No se pudo completar el viaje.',
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#dc3545'
    });
  }
}



}
