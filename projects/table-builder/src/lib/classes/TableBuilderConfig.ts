import { InjectionToken } from '@angular/core';
import { TableState } from './TableState';
import { ArrayAdditional } from '../interfaces/report-def';

export interface TableBuilderConfig {
  defaultTableState: Partial<TableState>;
  export?: TableBuilderExport,
  arrayInfo?: ArrayAdditional
}

export interface TableBuilderExport {
  dateFormat?: string;
  onSave?: (event?: any) => void;
}

export const TableBuilderConfigToken = new InjectionToken<TableBuilderConfig>('TableBuilderConfig');
