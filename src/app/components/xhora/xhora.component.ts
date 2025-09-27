import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { VirtualRouterService } from '../../services/virtual-router.service';

@Component({
  selector: 'app-xhora',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './xhora.component.html',
  styleUrl: './xhora.component.css'
})
export class XhoraComponent {
constructor(
  public virtual: VirtualRouterService
){}
}
