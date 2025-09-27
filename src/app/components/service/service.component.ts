import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { VirtualRouterService } from '../../services/virtual-router.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './service.component.html',
  styleUrl: './service.component.css'
})
export class ServiceComponent {
  
constructor(
  public virtual: VirtualRouterService,
  private route: ActivatedRoute, private router: Router
){}

ngOnInit() {
  const tipo = this.route.snapshot.queryParamMap.get('tipoServicio');
  if (tipo === 'aeropuerto' || tipo === 'punto' || tipo === 'hora') {
    // setea selección inicial y continúa o muestra marcada en la UI
  }
}
go(tipo: 'aeropuerto'|'punto'|'hora') {
  this.virtual.setState('tipo', tipo);
  this.virtual.setActiveRoute('mobile-booking');
}


}
