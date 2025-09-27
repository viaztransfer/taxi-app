import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { VirtualRouterService } from '../../services/virtual-router.service';

@Component({
  selector: 'app-bottombar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bottombar.component.html',
  styleUrl: './bottombar.component.css'
})
export class BottombarComponent {
constructor(
  public virtual: VirtualRouterService
){}
}
