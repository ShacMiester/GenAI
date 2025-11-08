import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TableConfiguration, SortEvent, FilterEvent } from '../../interfaces';
import { GenAITypography } from "../../ui-elements/gen-ai-typography/gen-ai-typography";

@Component({
  selector: 'app-reusable-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    Select,
    IconFieldModule,
    InputIconModule,
    GenAITypography
],
  template: `
    @if (config().globalFilterFields && config().globalFilterFields!.length > 0) {
        <div class="table-header">
          <p-iconfield>
            <p-inputicon class="pi pi-search" />
            <input 
              type="text" 
              pInputText 
              [value]="globalFilterValue()"
              (input)="onGlobalFilter($event)"
              placeholder="Search"
              class="global-filter"
            />
          </p-iconfield>
        </div>
      }
      @if (headerTitle() || headerDescription() || headerImage()) {
        <div class="table-header-info flex gap-5">
          @if (headerImage()) {
            <img [src]="headerImage()" alt="Header" class="header-image">
          }
          <div class="header-text flex-col gap-2">
            @if (headerTitle()) {
              <genai-typography [name]="14" class="header-title m-0">{{ headerTitle() }}</genai-typography>
            }
            @if (headerDescription()) {
              <genai-typography [name]="12" class="header-description m-0">{{ headerDescription() }}</genai-typography>
            }
          </div>
        </div>
      }
    <div class="table-container">
      <p-table 
        #dt
        [value]="data()"
        [columns]="config().columns"
        [scrollable]="true"
        [scrollHeight]="config().scrollHeight || '400px'"
        [showGridlines]="config().showGridlines || true"
        [reorderableColumns]="config().reorderableColumns || true"
        [globalFilterFields]="config().globalFilterFields"
        [sortField]="currentSort()?.field"
        [sortOrder]="currentSort()?.order || 0"
        (onSort)="onSort($event)"
        (onFilter)="onFilter($event)"
        styleClass="p-datatable-sm"
        breakpoint="960px"
      >
        <ng-template pTemplate="header" let-columns>
          <tr>
            @for (col of columns; track col.field) {
              <th 
                [pSortableColumn]="col.sortable !== false ? col.field : null"
                [style.width]="col.width"
                pReorderableColumn
              >
                <div class="column-header">
                  <span>{{ col.header }}</span>
                  @if (col.sortable !== false) {
                    <p-sortIcon [field]="col.field" />
                  }
                </div>
              </th>
            }
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-rowData let-rowIndex="rowIndex">
          <tr>
            @for (col of config().columns; track col.field) {
              <td>
                @switch (col.type) {
                  @case ('date') {
                    {{ formatDate(getFieldValue(rowData, col.field)) }}
                  }
                  @case ('boolean') {
                    <i [class]="getBooleanIcon(getFieldValue(rowData, col.field))"></i>
                  }
                  @case ('number') {
                    {{ formatNumber(getFieldValue(rowData, col.field)) }}
                  }
                  @case ('template') {
                    @switch (col.templateName) {
                      @case ('deviceIcon') {
                        <div class="device-with-icon">
                          <img src="images/device-icon.svg" alt="Device" width="26" height="26">
                          <span>{{ getFieldValue(rowData, col.field) }}</span>
                        </div>
                      }
                      @case ('statusDropdown') {
                        <p-select 
                          [ngModel]="getFieldValue(rowData, col.field)"
                          (ngModelChange)="onStatusChange(rowData, $event)"
                          [options]="statusOptions"
                          optionLabel="label"
                          optionValue="value"
                          placeholder="Select Status"
                          styleClass="status-dropdown"
                        />
                      }
                      @default {
                        {{ getFieldValue(rowData, col.field) }}
                      }
                    }
                  }
                  @default {
                    {{ getFieldValue(rowData, col.field) }}
                  }
                }
              </td>
            }
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td [attr.colspan]="config().columns.length" class="text-center">
              No data found
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  styleUrls: ['./reusable-table.component.scss']
})
export class ReusableTableComponent {
  data = input.required<any[]>();
  config = input.required<TableConfiguration>();
  headerTitle = input<string>('');
  headerDescription = input<string>('');
  headerImage = input<string>('');

  sortChange = output<SortEvent>();
  filterChange = output<FilterEvent>();
  statusChange = output<{ item: any; newStatus: string }>();

  globalFilterValue = signal('');
  currentSort = signal<SortEvent | null>(null);

  statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' }
  ];

  filteredData = computed(() => {
    return this.data();
  });

  onGlobalFilter(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.globalFilterValue.set(target.value);
  }

  onStatusChange(item: any, newStatus: string): void {
    this.statusChange.emit({ item, newStatus });
  }

  onSort(event: any): void {
    const sortEvent: SortEvent = {
      field: event.field,
      order: event.order
    };
    this.currentSort.set(sortEvent);
    this.sortChange.emit(sortEvent);
  }

  onFilter(event: any): void {
    const filterEvent: FilterEvent = {
      filters: event.filters,
      filteredValue: event.filteredValue
    };
    this.filterChange.emit(filterEvent);
  }

  getFieldValue(obj: any, field: string): any {
    return field.split('.').reduce((o, i) => o?.[i], obj);
  }

  formatDate(value: any): string {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleDateString();
  }

  formatNumber(value: any): string {
    if (value === null || value === undefined) return '';
    return Number(value).toLocaleString();
  }

  getBooleanIcon(value: any): string {
    return value ? 'pi pi-check text-green-500' : 'pi pi-times text-red-500';
  }
}