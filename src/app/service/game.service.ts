import { inject, Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { UserService } from './user.service';
import { Game } from '../model/game.model';
import { arrayUnion } from '@angular/fire/firestore';

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

  createGameList(listName: string, game: Game): Promise<string> {
    return this.firestore.setDocData({
      name: listName,
      gameList: [game]
    }, this.DB.DATA_LISTS).then(id => {
      // TODO: update user's game list
      return id;
    });
  }

  addGameToList(listId: string, game: Game): Promise<string> {
    return this.firestore.updateDocData({
      gameList: arrayUnion(game)
    }, this.DB.DATA_LISTS, listId);
  }

  updateUserGameList(gameListId: string, gameListName: string): Promise<string> {
    return this.firestore.updateDocData({
      gameList: arrayUnion({
        id: gameListId,
        name: gameListName
      })
    }, this.DB.USERS, this.userService.getCurrentUserData().uid).then(id => {
      this.userService.fetchUser(this.userService.getCurrentUserData().uid);
      return id;
    });
  }
}
