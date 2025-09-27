import { Component } from '@angular/core';
import { VirtualRouterService } from '../../services/virtual-router.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-auto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-auto.component.html',
  styleUrl: './select-auto.component.css'
})
export class SelectAutoComponent {
constructor(
  public virtual: VirtualRouterService 
){}
}
