import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardCard {
  id: number;
  title: string;
  value: number;
  total?: number;
  percentage?: number;
  type: 'percentage' | 'simple';
  color: 'primary' | 'success' | 'warning' | 'danger';
}

@Injectable({
  providedIn: 'root'
})
export class DashboardCardService {
  private apiUrl = 'http://localhost:3000/dashboardCards';

  constructor(private http: HttpClient) {}

  getDashboardCards(): Observable<DashboardCard[]> {
    return this.http.get<DashboardCard[]>(this.apiUrl);
  }
}