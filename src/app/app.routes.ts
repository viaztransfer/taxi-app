import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MobileBookingComponent } from './components/mobile-booking/mobile-booking.component';
import { MobileStep1ServicePickerComponent } from './components/mobile-step1-service-picker/mobile-step1-service-picker.component';
import { MobileStep2FormComponent } from './components/mobile-step2-form/mobile-step2-form.component';
import { MobileStep3SummaryComponent } from './components/mobile-step3-summary/mobile-step3-summary.component';
import { HomeComponent as DriverHomeComponent } from './components/driver/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { TripStartComponent } from './components/driver/trip-start/trip-start.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  { 
    path: 'driver',
    children: [
      { path: 'home', component: DriverHomeComponent },
      { path: 'trip-start', component: TripStartComponent }
    ]
  },

  {
    path: 'booking',
    component: MobileBookingComponent,
    children: [
      { path: '', redirectTo: 'step1', pathMatch: 'full' },
      { path: 'step1', component: MobileStep1ServicePickerComponent },
      { path: 'step2', component: MobileStep2FormComponent },
      { path: 'step3', component: MobileStep3SummaryComponent },
    ]
  },

  { path: '**', redirectTo: 'login' }
];

