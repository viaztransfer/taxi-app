import { Component } from '@angular/core';
import { VirtualRouterService } from '../../services/virtual-router.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-location',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-location.component.html',
  styleUrl: './search-location.component.css'
})
export class SearchLocationComponent {
constructor(
  public virtual: VirtualRouterService
){}
}
