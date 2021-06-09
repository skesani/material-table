import {Component, HostListener, OnInit, ViewChild} from '@angular/core';

import {CarTableDataService} from './car-table-data.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatMenuTrigger} from '@angular/material/menu';
import {PrintService} from '../print-layout/print.service';

export class Group {
  level = 0;
  parent: Group;
  expanded = false;
  totalCounts = 0;
  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
}

@Component({
  selector: 'app-material-row-group',
  templateUrl: './material-row-group.component.html',
  styleUrls: ['./material-row-group.component.scss']
})
export class MaterialRowGroupComponent implements OnInit {
  title = 'Grid Grouping';

  public dataSource = new MatTableDataSource<any | Group>([]);
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  _alldata: any[];
  columns: any[];
  displayedColumns: string[];
  groupByColumns: string[] = [];
  rowClicked: Array<number>;
  screenWidth: number;
  screenHeight: number;

  constructor(protected dataSourceService: CarTableDataService, public printService: PrintService) {

    this.columns = [{
      field: 'name'
    }, {
      field: 'role_type'
    }, {
      field: 'phone'
    }, {
      field: 'description'
    }, {
      field: 'party'
    }, {
      field: 'district'
    }, {
      field: 'enddate'
    }];
    this.displayedColumns = this.columns.map(column => column.field);
    this.groupByColumns = ['district'];
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.rowClicked = [];
    this.dataSourceService.getAllData()
      .subscribe(
        ({objects}: any) => {
          objects.forEach((item, index) => {
            item.name = item.person.name;
          });
          this._alldata = objects;
          this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
          this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
          this.dataSource.filter = performance.now().toString();
        },
        (err: any) => console.log(err)
      );
  }

  isMobile(): any {
    return !(this.screenWidth >= 768);
  }

  // below is for grid row grouping
  customFilterPredicate(data: any | Group, filter: string): boolean {
    return (data instanceof Group) ? data.visible : this.getDataRowVisible(data);
  }

  getDataRowVisible(data: any): boolean {
    const groupRows = this.dataSource.data.filter(
      row => {
        if (!(row instanceof Group)) {
          return false;
        }
        let match = true;
        this.groupByColumns.forEach(column => {
          if (!row[column] || !data[column] || row[column] !== data[column]) {
            match = false;
          }
        });
        return match;
      }
    );

    if (groupRows.length === 0) {
      return true;
    }
    const parent = groupRows[0] as Group;
    return parent.visible && parent.expanded;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event): any {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  groupHeaderClick(row): any {
    row.expanded = !row.expanded;
    this.dataSource.filter = performance.now().toString();  // bug here need to fix
    if (row.expanded) {
      this.rowClicked.push(row.district);
    } else if (this.rowClicked.indexOf(row.district) > -1) {
      this.rowClicked = this.rowClicked.filter(element => ![row.district].includes(element));
    }
    console.log(this.rowClicked);
  }

  addGroups(data: any[], groupByColumns: string[]): any[] {
    const rootGroup = new Group();
    rootGroup.expanded = true;
    return this.getSublevel(data, 0, groupByColumns, rootGroup);
  }

  getSublevel(data: any[], level: number, groupByColumns: string[], parent: Group): any[] {
    if (level >= groupByColumns.length) {
      return data;
    }
    const groups = this.uniqueBy(
      data.map(
        row => {
          const result = new Group();
          result.level = level + 1;
          result.parent = parent;
          for (let i = 0; i <= level; i++) {
            result[groupByColumns[i]] = row[groupByColumns[i]];
          }
          return result;
        }
      ),
      JSON.stringify);

    const currentColumn = groupByColumns[level];
    let subGroups = [];
    groups.forEach(group => {
      const rowsInGroup = data.filter(row => group[currentColumn] === row[currentColumn]);
      group.totalCounts = rowsInGroup.length;
      const subGroup = this.getSublevel(rowsInGroup, level + 1, groupByColumns, group);
      subGroup.unshift(group);
      subGroups = subGroups.concat(subGroup);
    });
    return subGroups;
  }

  uniqueBy(a, key): any {
    const seen = {};
    return a.filter((item) => {
      const k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  isGroup(index, item): boolean {
    return item.level;
  }

  onPrintTable(): void {
    this.printService.setIsMobile(this.isMobile());
    this.printService.printTableDocument('printing');
  }

  onExpandedPrintTable(): void {
    this.printService.setIsMobile(this.isMobile());
    this.printService.printTableDocument('printing', this.rowClicked);
  }
}
