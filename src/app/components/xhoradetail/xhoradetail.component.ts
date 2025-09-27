import { Component } from '@angular/core';
import { VirtualRouterService } from '../../services/virtual-router.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-xhoradetail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './xhoradetail.component.html',
  styleUrl: './xhoradetail.component.css'
})
export class XhoradetailComponent {
constructor(
  public virtual: VirtualRouterService
){}
}
