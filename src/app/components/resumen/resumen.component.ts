import { Component } from '@angular/core';
import { VirtualRouterService } from '../../services/virtual-router.service';

@Component({
  selector: 'app-resumen',
  imports: [],
  templateUrl: './resumen.component.html',
  styleUrl: './resumen.component.css'
})
export class ResumenComponent {
constructor(
  public virtual: VirtualRouterService
){}
}
