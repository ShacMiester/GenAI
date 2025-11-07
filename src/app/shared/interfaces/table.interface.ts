export interface TableColumn {
  field: string;
  header: string;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'template';
  templateName?: string; // For custom templates
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
}

export interface TableAction {
  label: string;
  icon?: string;
  command: (item: any) => void;
  disabled?: (item: any) => boolean;
}

export interface TableConfiguration {
  columns: TableColumn[];
  actions: TableAction[];
  globalFilterFields?: string[];
  scrollable?: boolean;
  scrollHeight?: string;
  showGridlines?: boolean;
  reorderableColumns?: boolean;
}

export interface SortEvent {
  field: string;
  order: number;
}

export interface FilterEvent {
  filters: { [key: string]: any };
  filteredValue: any[];
}