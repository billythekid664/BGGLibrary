import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbdSortableHeader } from '../directive/ngbd-sortable-header.directive';
import { BggService } from '../service/bgg.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import 'moment-timezone';
import moment from 'moment';
import { BggItem } from '../model/bgg.model';
import { UserService } from '../service/user.service';
import { FirestoreService } from '../service/firestore.service';
import { GameService } from '../service/game.service';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, NgbdSortableHeader, FormsModule, NgbModule, ReactiveFormsModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit, AfterViewInit {
  private bggService = inject(BggService);
  private userService = inject(UserService);
  private gameService = inject(GameService);
  private fb = inject(FormBuilder);

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  bggData: any = {};

  items: BggItem[] = [];
  paging: any = {};
  currentGame: any = {};

  loading: boolean = false;
  buttonLoading: Map<number, boolean> = new Map();
  userSignedIn: boolean = false;
  _searchTerm: string = '';
  _pageSize: number = 10;
  _pageNumber: number = 1;
  sortColumn: any;
  sortDirection: any;
  accordionItem: string = '';

  formGroupXORValidator(controlNames: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const controls = controlNames.map(name => control.get(name));

      const filledControls = controls.filter(c => c?.value);

      if (filledControls.length === 1) {
        return null; // Valid - only one control is filled
      } else {
        return { exclusiveOr: true }; // Invalid - either none or more than one control is filled
      }
    };
  }

  listForm!: FormGroup;

  debounceTimer: any;

  constructor() {}

  ngOnInit(): void {
    this.userService.checkAuth().subscribe((user: any) => {
      if (user) {
        this.userSignedIn = true;
      }
    });

    this.listForm = this.fb.group({
      selectValue: [''],
      newListName: [''],
    }, { validators: this.formGroupXORValidator(['selectValue', 'newListName']) });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      let nameHeader = this.headers.find(h => h.sortable === "name");
      if (!nameHeader) return;
      nameHeader.sort.emit({ column: "name", direction: "asc" });
      nameHeader.direction = "asc";
    }, 100);
  }

  getBggInfo() {
    this.loading = true;
    this.bggService.getBggLibraryInfo(this._searchTerm, this._pageNumber, this._pageSize, this.sortColumn, this.sortDirection).subscribe((data: any) => {
      this.loading = false;
      this.bggData = data;
      this.items = data.result.items
      this.paging = data.result.paging
    });
  }

  onSort({ column, direction }: any) {
		// resetting other headers
		this.headers.forEach((header) => {
			if (header.sortable !== column) {
				header.direction = '';
			}
		});

		this.sortColumn = column;
		this.sortDirection = direction;
    this.startFetch(100);
	}

  startFetch(delay = 500) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.getBggInfo();
    }, delay);
  }

  getLastcheckoutTime(datetime: any) {
    let timezone = moment.tz.guess();
    if (datetime == null){ return ""; }
    var date = moment.tz(datetime, 'UTC');
    if (timezone != null) {
        date = date.tz(timezone);
    }
    return date.fromNow();
  }

  setAccordion(index: number) {
    let accordion = 'accordion-';
    if (this.accordionItem.endsWith(index.toString())) {
      this.accordionItem = ''
    } else {
      this.accordionItem = accordion + index;
    }
  }

  openModal(item: BggItem, index: number) {
    console.log('select item: ', item);
    console.log('user: ', this.userService.getCurrentUserData());
    this.listForm.reset();
    this.currentGame = {
      game: item,
      index: index
    };
  }

  addGameToList() {
    console.log('selectValue: ', this.listForm);
    // this.buttonLoading.set(index, true);
    // this.firestore.setDocData({
    //   name: 'test',
    //   gameList: [{
    //     bgg_id: item.bgg_id,
    //     name: item.name,
    //     photo: item.bgg_icon_uri,
    //     id: item.id
    // }]}, 'dataList').then((id) => {
    //   console.log('Document written with ID: ', id);
    // });
  }

  getUserGameLists() {
    return this.userService.getCurrentUserData()?.gameList
  }

  get pageNumber() {
    return this._pageNumber;
  }

  get pageSize() {
    return this._pageSize;
  }

  get searchTerm() {
    return this._searchTerm;
  }

  set pageNumber(pageNumber: number) {
    this._pageNumber = pageNumber;
    this.startFetch(200);
  }

  set pageSize(pageSize: number) {
    this._pageSize = pageSize;
    this.startFetch(200);
  }

  set searchTerm(searchTerm: string) {
    this._searchTerm = searchTerm;
    this.startFetch(800);
  }

}
