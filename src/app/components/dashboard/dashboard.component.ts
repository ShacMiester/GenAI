import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DashboardCardService, DashboardCard } from '../../services/dashboard-card.service';
import { DashboardCardComponent } from '../dashboard-card/dashboard-card.component';
import { VehicleTablePrimaryComponent } from '../vehicle-table-primary/vehicle-table-primary.component';
import { VehicleTableSecondaryComponent } from '../vehicle-table-secondary/vehicle-table-secondary.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    Toast,
    DashboardCardComponent,
    VehicleTablePrimaryComponent,
    VehicleTableSecondaryComponent
  ],
  providers: [MessageService],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-cards">
        @for (card of dashboardCards(); track card.id) {
          <app-dashboard-card [card]="card" />
        }
      </div>

      <div class="tables-section">
        <app-vehicle-table-primary />
        
        <app-vehicle-table-secondary />
      </div>
      
      <p-toast />
    </div>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private dashboardCardService = inject(DashboardCardService);
  private messageService = inject(MessageService);

  dashboardCards = signal<DashboardCard[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadDashboardCards();
  }

  private loadDashboardCards(): void {
    this.dashboardCardService.getDashboardCards().subscribe({
      next: (cards) => {
        this.dashboardCards.set(cards);
        this.isLoading.set(false);
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load dashboard cards'
        });
        this.isLoading.set(false);
      }
    });
  }
}