import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { VirtualRouterService } from '../../services/virtual-router.service';

@Component({
  selector: 'app-myrides',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './myrides.component.html',
  styleUrl: './myrides.component.css'
})
export class MyridesComponent {
constructor(
  public virtual: VirtualRouterService
){}
}
