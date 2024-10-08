import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, HostListener, inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { BggService } from '../service/bgg.service';
import { UserService } from '../service/user.service';
import { GameService } from '../service/game.service';
import { NgbdSortableHeader } from '../directive/ngbd-sortable-header.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserGamelistRef } from '../model/user-gamelist-ref.model';
import { BggItem } from '../model/bgg.model';
import { firstValueFrom } from 'rxjs';
import { User } from '../model/user.model';
import moment from 'moment';
import { Game } from '../model/game.model';
import { ActiveService } from '../service/active.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, NgbdSortableHeader, FormsModule, NgbModule, ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit, AfterViewInit {
  private bggService = inject(BggService);
  private userService = inject(UserService);
  private gameService = inject(GameService);
  private activeService = inject(ActiveService);

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  firstLoad: boolean = true;

  loading: boolean = false;
  buttonLoading: Map<number, boolean> = new Map();
  bggGameMap: Map<string, BggItem> = new Map();
  userSignedIn: boolean = false;

  _searchTerm: string = '';
  _pageSize: number = 10;
  _pageNumber: number = 1;
  totalNumItems: number = 0;
  sortColumn: any;
  sortDirection: any;
  accordionItem: string = '';
  debounceTimer: any;

  selectListValue: string = '';
  newListName: string = '';
  userGameLists?: UserGamelistRef[];
  currentGameList: any[][] = [[]];
  shareEmail: string = '';
  showShareAlert: boolean = false;
  showShareErrorAlert: boolean = false;


  ngOnInit() {
    this.userService.checkAuth().subscribe((user: any) => {
      if (user) {
        this.userSignedIn = true;
        this.userService.fetchUser(user.uid).subscribe((user: User) => {
        });
        this.userService.fetchUserGameLists(user.uid).subscribe((gameLists: any) => {
          if (this.firstLoad) {
            this.selectListValue = gameLists?.[0]?.id || '';
            this.onSelected();
            this.firstLoad = false;
          }
        });
      }
    });
  }

  ngAfterViewInit() {
    this.activeService.setActive(2);
    setTimeout(() => {
      let nameHeader = this.headers.find(h => h.sortable === "name");
      if (!nameHeader) return;
      nameHeader.sort.emit({ column: "name", direction: "asc" });
      nameHeader.direction = "asc";
    }, 100);
  }

  startFetch(delay = 500) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.getBggInfo();
      // this.getBggInfo(); TODO: get info for the current game page
    }, delay);
  }

  getBggInfo() {
    this.bggGameMap.clear();
    this.currentGameList[this.listIndex()]?.forEach((game: Game) => {
      this.bggService.getBggGameInfo(game.id!).subscribe((item: any) => {
        this.bggGameMap.set(game.id!, item.result);
      });
    });
  }

  getBggGameInfo(game: Game) {
    return this.bggGameMap.get(game.id!);
  }

  getColSpan(): number {
    return Array.from(document?.getElementById('headerRow')?.children!).filter(el => {
      return getComputedStyle(el).display !== 'none';
    }).length;
  }

  getRowSpan(): number {
    return this.getColSpan() <= 3 ? 2 : 1;
  }

  checkIfUserGameListEmptyOrNull() {
    return !this.userGameLists || (this.userGameLists?.length || 0) < 1;
  }

  onSelected() {
    if (!this.selectListValue) {
      return;
    }
    this.gameService.fetchGameList(this.selectListValue).then(data => {
      this.totalNumItems = data?.gameList?.length || 0
      let newList = data?.gameList?.sort((a, b) => {
          return a?.name?.localeCompare(b?.name || '') || 0;
      });
      this.currentGameList = this.chunk(newList || [], 10);
      this.startFetch(0);
      this.getUserGameLists();
    });
  }

  chunk(arr: any[], size: number) {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  }

  getUserGameLists() {
    this.userGameLists = this.userService.getCurrentUserGameLists();
  }

  addGameToList(index: number, game: BggItem) {
    this.buttonLoading.set(index, true);
    this.gameService.addGameToList(this.selectListValue, {
      bgg_id: game?.bgg_id,
      name: game?.name,
      photo: game?.bgg_icon_uri,
      id: game?.id
    }).then((id: string) => {
      setTimeout(() => {
        this.buttonLoading.delete(index);
      }, 200);
    });
  }

  deleteGameListAndReferences() {
    this.gameService.deleteGameListAndReferences(this.selectListValue).then(listId => {
      this.userGameLists = this.userGameLists?.filter(list => list.id !== listId);
      this.selectListValue = this.userGameLists?.[0].id || '';
      this.onSelected();
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
    
    let newList = (this.currentGameList.flat() as Game[]).sort((a: Game, b: Game) => {
      if (direction === 'asc') {
        return this.getBggGameInfo(a)?.[(column as keyof BggItem)]?.localeCompare(this.getBggGameInfo(b)?.[(column as keyof BggItem)]) || 0;
      } else {
        return this.getBggGameInfo(b)?.[(column as keyof BggItem)]?.localeCompare(this.getBggGameInfo(a)?.[(column as keyof BggItem)]) || 0;
      }
    });
    this.currentGameList = this.chunk(newList, 10);
    this.startFetch(100);
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

  createNewList() {
    this.gameService.createGameList(this.newListName).then((id: string) => {
      this.selectListValue = id;
      this.newListName = '';
      this.onSelected();
    });
  }

  shareGameList() {
    let gameList = this.userGameLists?.find(item => item.id === this.selectListValue)!;
    this.gameService.shareGameList(gameList, this.shareEmail).then(id => {
      if (!id || id === '') {
        console.error('Failed to share game list');
        this.showShareErrorAlert = true;
      }
      else {
        this.showShareAlert = true;
      }
      setTimeout(() => {
        this.showShareAlert = false;
        this.showShareErrorAlert = false;
      }, 3000);
      this.shareEmail = '';
    });
  }

  listIndex() {
    return this.pageNumber - 1;
  }

  gameExistsInList(game: Game) {
    return this.currentGameList.flat()?.some(g => g.id === game.id);
  }

  removeGameFromList(index: number, game: Game) {
    this.buttonLoading.set(index, true);
    this.gameService.removeGamefromList(this.selectListValue, {
      bgg_id: game?.bgg_id,
      name: game?.name,
      photo: game?.photo,
      id: game?.id
    }).then(() => {
      this.onSelected();
      setTimeout(() => {
        this.buttonLoading.delete(index);
      }, 200);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    document.querySelectorAll('.dynamic-rowspan').forEach(el => {
      el.setAttribute('rowspan', this.getRowSpan().toString());
    });
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
