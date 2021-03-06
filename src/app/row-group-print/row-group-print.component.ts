import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatMenuTrigger} from '@angular/material/menu';
import {CarTableDataService} from '../material-row-group/car-table-data.service';
import {PrintService} from '../print-layout/print.service';


export class Group {
  level = 0;
  parent: Group;
  expanded = true;
  totalCounts = 0;
  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
}

@Component({
  selector: 'app-row-group-print',
  templateUrl: './row-group-print.component.html',
  styleUrls: ['./row-group-print.component.scss']
})

export class RowGroupPrintComponent implements OnInit {
  title = 'Grid Grouping';

  public dataSource = new MatTableDataSource<any | Group>([]);
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  _alldata: any[];
  columns: any[];
  displayedColumns: string[];
  groupByColumns: string[] = [];

  constructor(
    protected dataSourceService: CarTableDataService,  private printService: PrintService) {
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
    // this.groupByColumns = ['district'];
  }

  ngOnInit(): void {
    this.dataSourceService.getAllData()
      .subscribe(
        ({objects}: any) => {
          objects.forEach((item, index) => {
            item.name = item.person.name;
          });
          if (this.printService.getOption() !== null  && this.printService.getOption() !== undefined) {
            objects = objects.filter(el => this.printService.getOption().includes(el.district));
            //  objects = objects.filter(x => x.district.toString() === this.printService.getOption());
          }
          this._alldata = objects;
          this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
          this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
          this.dataSource.filter = performance.now().toString();
          if (this.printService.getIsMobile()) {
            this.printService.onMobileDataReady();
          } else {
            this.printService.onDataReady();
          }
        },
        (err: any) => console.log(err)
      );
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

  groupHeaderClick(row): any {
    row.expanded = !row.expanded;
    this.dataSource.filter = performance.now().toString();  // bug here need to fix
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

  uniqueBy(a, key) {
    const seen = {};
    return a.filter((item) => {
      const k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  isGroup(index, item): boolean {
    return item.level;
  }
}
