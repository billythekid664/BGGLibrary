import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { BggService } from '../service/bgg.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BggItem } from '../model/bgg.model';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatButtonModule, MatIconModule],
  providers: [BggService],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TableComponent implements OnInit {

  bggData: any = {};
  items: any[] = [];
  paging: any = {};
  loading: boolean = false;
  _searchTerm: string = '';
  _pageSize: number = 10;
  _pageNumber: number = 1;
  sortColumn: any;
  sortDirection: any;
  columnsToDisplay = ['Name', 'Availability', 'Player Count', 'Play Time'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: BggItem | undefined


  constructor(private bggService: BggService) {}
  
  ngOnInit() {
    this.getBggInfo();
  }

  getBggInfo() {
    this.loading = true;
    this.bggService.getBggLibraryInfo(this._searchTerm, this._pageNumber, this._pageSize, this.sortColumn, this.sortDirection).subscribe((data: any) => {
      this.loading = false;
      this.bggData = data;
      this.items = data.result.items;
      this.paging = data.result.paging;
      console.log(this.bggData);
    });
  }

}
