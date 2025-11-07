import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReusableTableComponent } from '../../shared/components/reusable-table/reusable-table.component';
import { TableConfiguration } from '../../shared/interfaces/table.interface';

interface VehicleData {
  id: number;
  vehicle: string;
  plateNum: string;
  odometer: string;
  gps: string;
  device: string;
  sim: string;
  fleet: string;
  status: string;
}

@Component({
  selector: 'app-vehicle-table-primary',
  standalone: true,
  imports: [CommonModule, ReusableTableComponent],
  template: `
    <div class="vehicle-table-container">
      <h2>Vehicle Fleet Management - Primary View</h2>
      <app-reusable-table 
        [data]="vehicleData()" 
        [config]="tableConfig()"
        (statusChange)="onStatusChange($event)"
      />
    </div>
  `,
  styleUrls: ['./vehicle-table-primary.component.scss']
})
export class VehicleTablePrimaryComponent implements OnInit {
  vehicleData = signal<VehicleData[]>([]);
  
  tableConfig = signal<TableConfiguration>({
    columns: [
      { field: 'vehicle', header: 'Vehicle', width: '120px', sortable: true },
      { field: 'plateNum', header: 'Plate Num.', width: '100px', sortable: true },
      { field: 'odometer', header: 'Odometer', width: '120px', sortable: true },
      { field: 'gps', header: 'GPS', width: '180px', sortable: true },
      { field: 'device', header: 'Device', width: '200px', sortable: true, type: 'template', templateName: 'deviceIcon' },
      { field: 'sim', header: 'SIM', width: '150px', sortable: true },
      { field: 'fleet', header: 'Fleet', width: '80px', sortable: true },
      { field: 'status', header: 'Status', width: '100px', sortable: true, type: 'template', templateName: 'statusDropdown' },
    ],
    actions: [],
    globalFilterFields: ['vehicle', 'plateNum', 'device', 'fleet', 'status'],
    scrollable: true,
    scrollHeight: '400px'
  });

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadVehicleData();
  }

  loadVehicleData() {
    this.http.get<VehicleData[]>('http://localhost:3000/vehicles').subscribe({
      next: (data) => {
        this.vehicleData.set(data);
      },
      error: (error) => {
        console.error('Error loading vehicle data:', error);
      }
    });
  }

  onStatusChange(event: { item: VehicleData; newStatus: string }) {
    const { item, newStatus } = event;
    
    const currentData = this.vehicleData();
    const updatedData = currentData.map(v => 
      v.vehicle === item.vehicle ? { ...v, status: newStatus } : v
    );
    this.vehicleData.set(updatedData);
    
    const updatedVehicle = { ...item, status: newStatus };
    this.http.put(`http://localhost:3000/vehicles/${item.id}`, updatedVehicle).subscribe({
      next: () => {
        console.log(`Status updated in database for ${item.vehicle}: ${item.status} → ${newStatus}`);
      },
      error: (error) => {
        console.error('Failed to update status in database:', error);
        this.vehicleData.set(currentData);
      }
    });
  }
}