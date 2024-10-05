import { inject, Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { UserService } from './user.service';
import { Game } from '../model/game.model';
import { arrayRemove, arrayUnion } from '@angular/fire/firestore';
import { firstValueFrom, Observable } from 'rxjs';
import { GameList } from '../model/gamelist.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private firestore = inject(FirestoreService);
  private userService = inject(UserService);
  private DB = {
    USERS: 'users',
    DATA_LISTS: 'dataLists'
  }

  constructor() { }

  createGameList(listName: string, game?: Game): Promise<string> {
    return this.firestore.setDocData({
      name: listName,
      gameList: !!game ? [game] : []
    }, this.DB.DATA_LISTS).then(id => {
      return this.updateUserGameList(id, listName).then((newId: string) => {
        return newId;
      });
   });
  }

  addGameToList(listId: string, game: Game): Promise<string> {
    return this.firestore.updateDocData({
      gameList: arrayUnion(game)
    }, this.DB.DATA_LISTS, listId);
  }

  removeGamefromList(listId: string, game: Game): Promise<string> {
    return this.firestore.updateDocData({
      gameList: arrayRemove(game)
    }, this.DB.DATA_LISTS, listId);
  }

  updateUserGameList(gameListId: string, gameListName: string): Promise<string> {
    // return this.firestore.updateDocData({
    //   gameList: arrayUnion({
    //     id: gameListId,
    //     name: gameListName
    //   })
    // }, this.DB.USERS, this.userService.getCurrentUserData().uid).then(id => {
    //   return firstValueFrom(this.userService.fetchUser(this.userService.getCurrentUserData().uid)).then((user: any) => {
    //     return gameListId;
    //   });
    // });
    return this.firestore.updateDocCollectionData(this.DB.USERS, this.userService.getCurrentUserData().uid, 'gameLists', gameListId, {
      id: gameListId,
      name: gameListName
    });
  }

  fetchGameList(gameListId: string): Observable<GameList> {
    return this.firestore.getDocData(this.DB.DATA_LISTS, gameListId);
  }
}
