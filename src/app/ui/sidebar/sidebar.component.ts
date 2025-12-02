import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { VirtualRouterService } from '../../services/virtual-router.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  constructor(
    public virtual: VirtualRouterService,
    
  ){}
  ngOnInit(): void {
  }
}
