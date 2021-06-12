import {ChangeDetectorRef, Component, HostListener, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';

import {CarTableDataService} from './car-table-data.service';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatMenuTrigger} from '@angular/material/menu';
import {PrintService} from '../print-layout/print.service';
import {MatSort} from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';


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
  styleUrls: ['./material-row-group.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MaterialRowGroupComponent implements OnInit {
  title = 'Grid Grouping';

  public dataSource = new MatTableDataSource<any | Group| Congress>([]);
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  show = false;
  _alldata: Congress[] = [];
  columnsToDisplay: any[];
  columns: any[];
  displayedColumns: any[];
  groupByColumns: string[] = [];
  rowClicked: Array<number>;
  screenWidth: number;
  screenHeight: number;
  innerDisplayedColumns = ['street', 'zipCode', 'city'];
  expandedElement: Congress | null;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<Address>>;



  @ViewChild('outerSort', { static: true }) sort: MatSort;

  constructor(protected dataSourceService: CarTableDataService, public printService: PrintService,  private cd: ChangeDetectorRef) {

    this.columns = [{
      field: 'icon'
    }, {
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
            item.addresses = [];
            const addDetails  = {
              street: 'Street 1',
              zipCode: '78542',
              city: 'Kansas'
            };
            addDetails.street = item.extra.address;
            item.addresses.push(addDetails);
          });
          objects.forEach(user => {
            if (user.addresses && Array.isArray(user.addresses) && user.addresses.length) {
              this._alldata = [...this._alldata, {...user, addresses: new MatTableDataSource(user.addresses)}];
            } else {
              this._alldata = [...this._alldata, user];
            }
          });
          console.log(this._alldata);
          this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
          this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
          this.dataSource.filter = performance.now().toString();
        },
        (err: any) => console.log(err)
      );
    console.log(this.displayedColumns);
  }
  toggleRow(element: Congress) {
    this.show= true;
    element.addresses && ((element.addresses) as MatTableDataSource<Address>).data.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this.cd.detectChanges();
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<Address>).sort = this.innerSort.toArray()[index]);
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

export interface Address {
  street: string;
  zipCode: string;
  city: string;
}

export interface Congress {
  caucus?: null;
  congress_numbers?: (number)[] | null;
  current: boolean;
  description: string;
  district: number;
  enddate: string;
  extra: Extra;
  leadership_title?: null;
  party: string;
  person: Person;
  phone: string;
  role_type: string;
  role_type_label: string;
  senator_class?: null;
  senator_rank?: null;
  startdate: string;
  state: string;
  title: string;
  title_long: string;
  website: string;
  addresses?: Address[] | MatTableDataSource<Address>;
}
export interface Extra {
  address: string;
  office: string;
  rss_url: string;
}
export interface Person {
  bioguideid: string;
  birthday: string;
  cspanid: number;
  firstname: string;
  gender: string;
  gender_label: string;
  lastname: string;
  link: string;
  middlename: string;
  name: string;
  namemod: string;
  nickname: string;
  osid: string;
  pvsid: string;
  sortname: string;
  twitterid: string;
  youtubeid: string;
}
