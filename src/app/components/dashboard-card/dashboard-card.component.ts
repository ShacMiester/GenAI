import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenAITypography } from '../../shared/ui-elements/gen-ai-typography/gen-ai-typography';
import { DashboardCard } from '../../services/dashboard-card.service';

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [CommonModule, GenAITypography],
  template: `
    <div class="dashboard-card" [class]="'card-' + card().color">
      <div class="card-content">
        @if (card().type === 'percentage') {
          <div class="percentage-circle">
            <svg class="circle-svg" viewBox="0 0 36 36">
              <path
                class="circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                class="circle-progress"
                [attr.stroke-dasharray]="card().percentage + ', 100'"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div class="percentage-text">
              <genai-typography [name]="14" [weight]="600" color="text-prim">
                {{ card().percentage }}%
              </genai-typography>
            </div>
          </div>
          <div class="card-info">
            <genai-typography [name]="14" [weight]="700" color="text-prim">
              {{ card().value }}/{{ card().total }}
            </genai-typography>
            <genai-typography [name]="13" [weight]="400" color="text-light">
              {{ card().title }}
            </genai-typography>
          </div>
        } @else {
          <div class="simple-card">
            <genai-typography [name]="14" [weight]="700" color="text-prim">
              {{ card().value }}
            </genai-typography>
            <genai-typography [name]="13" [weight]="400" color="text-light">
              {{ card().title }}
            </genai-typography>
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./dashboard-card.component.scss']
})
export class DashboardCardComponent {
  card = input.required<DashboardCard>();
}