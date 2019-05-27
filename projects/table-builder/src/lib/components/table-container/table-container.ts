import {
  Component,
  Input,
  EventEmitter,
  Output,
  ContentChildren,
  QueryList,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { Observable, Subject, concat } from 'rxjs';
import { FieldType } from '../../interfaces/report-def';
import { first } from 'rxjs/operators';
import { FilterInfo } from '../../classes/filter-info';
import { DataFilter } from '../../classes/data-filter';
import { mapArray } from '../../functions/rxjs-operators';
import { TableBuilder } from '../../classes/table-builder';
import { MatRowDef, MatColumnDef } from '@angular/material';
import { TableTemplateBuilder } from '../../classes/TableTemplateBuilder';
import { ColumnTemplates } from '../../interfaces/column-template';
import { CustomCellDirective } from '../../directives/custom-cell-directive';


@Component({
  selector: 'tb-table-container',
  templateUrl: './table-container.html',
  changeDetection: ChangeDetectionStrategy.OnPush
}) export class TableContainerComponent {

  @Input() tableBuilder: TableBuilder;
  @Input() IndexColumn = false;
  @Input() SelectionColumn = false;
  @Input() trackBy: string;
  @Output() filters$ = new EventEmitter();
  @Output() selection$ = new EventEmitter();
  @ViewChild('header') header: TemplateRef<any>;
  @ViewChild('body') body: TemplateRef<any>;
  @ViewChild('footer') footer: TemplateRef<any>;
  @ContentChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef>;
  @ContentChildren(MatRowDef) customRows: QueryList<MatRowDef<any>>;
  @ContentChildren(CustomCellDirective) customCells: QueryList<CustomCellDirective>;

  FieldType = FieldType;
  displayedColumns$: Observable<string[]>;
  columnsSelected$ = new Subject<string[]>();
  columnNames$: Observable<string[]>;
  filteredData: DataFilter;
  columnTemplates$: Observable<ColumnTemplates[]>;

  ngAfterContentInit() {
    this.InitializeData();
    this.InitializeColumns();
  }

  InitializeData() {
    this.filteredData = new DataFilter(
      this.filters$.pipe(
        mapArray((fltr: FilterInfo) => fltr.getFunc())
      ),
      this.tableBuilder.getData$()
    );
  }

  InitializeColumns() {
    const t = new TableTemplateBuilder(
      this.tableBuilder,
      this.header,
      this.body,
      this.footer,
      this.columnDefs.toArray(),
      this.customCells.toArray()
    );
    this.columnNames$ = t.getColumnNames();
    this.displayedColumns$ = concat(
      this.columnNames$.pipe(first()),
      this.columnsSelected$
    );

    this.columnTemplates$ = t.getColumnTemplates();
  }

}
