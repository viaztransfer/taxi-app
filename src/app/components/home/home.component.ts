import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { VirtualRouterService } from '../../services/virtual-router.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
constructor(
  public virtual: VirtualRouterService,
){}
}
