import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SidebarComponent } from './ui/sidebar/sidebar.component';
import { BottombarComponent } from './ui/bottombar/bottombar.component';
import { MyridesComponent } from "./components/myrides/myrides.component";
import { SelectAutoComponent } from './components/select-auto/select-auto.component';
import { SearchLocationComponent } from './components/search-location/search-location.component';
import { VirtualRouterService } from './services/virtual-router.service';
import { CommonModule } from '@angular/common';
import { ServiceComponent } from './components/service/service.component';
import { HeaderComponent } from './ui/header/header.component';
import { XhoraComponent } from './components/xhora/xhora.component';
import { XhoradetailComponent } from './components/xhoradetail/xhoradetail.component';
import { ResumenComponent } from './components/resumen/resumen.component';
import { MobileBookingComponent } from './components/mobile-booking/mobile-booking.component';
import { MobileStep2FormComponent } from './components/mobile-step2-form/mobile-step2-form.component';
import { MobileStep3SummaryComponent } from './components/mobile-step3-summary/mobile-step3-summary.component';
import { MobileStep1ServicePickerComponent } from './components/mobile-step1-service-picker/mobile-step1-service-picker.component';
import { MobileStep4SummaryComponent } from './components/mobile-step4-summary/mobile-step4-summary.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HomeComponent,
    SidebarComponent,
    BottombarComponent, MyridesComponent,
    SelectAutoComponent,
    SearchLocationComponent,
    ServiceComponent,
    HeaderComponent,
    XhoraComponent,
    XhoradetailComponent,
    ResumenComponent,
    MobileBookingComponent,
    MobileStep2FormComponent,
    MobileStep3SummaryComponent,
    MobileStep1ServicePickerComponent,
    MobileStep4SummaryComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']   
  })
export class AppComponent {
  title = 'taxi1';

  constructor(
    public virtual: VirtualRouterService
  ){}
}
