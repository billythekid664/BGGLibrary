import { inject, Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { USERS_DB, UserService } from './user.service';
import { Game } from '../model/game.model';
import { arrayRemove, arrayUnion, where } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';
import { GameList } from '../model/gamelist.model';
import { UserGameListRef } from '../model/user-gamelist-ref.model';
import { User } from '../model/user.model';

export const DATALIST_DB = {
  DATA_LISTS: 'dataLists'
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private firestore = inject(FirestoreService);
  private userService = inject(UserService);

  constructor() { }

  createGameList(listName: string, game?: Game): Promise<string> {
    return this.firestore.setDocData({
      name: listName,
      gameList: !!game ? [game] : []
    }, DATALIST_DB.DATA_LISTS).then(id => {
      return this.createUserGameList(id, listName).then((newId: string) => {
        return newId;
      });
   });
  }

  addGameToList(listId: string, game: Game): Promise<string> {
    return this.firestore.updateDocData({
      gameList: arrayUnion(game)
    }, DATALIST_DB.DATA_LISTS, listId);
  }

  removeGamefromList(listId: string, game: Game): Promise<string> {
    return this.firestore.updateDocData({
      gameList: arrayRemove(game)
    }, DATALIST_DB.DATA_LISTS, listId);
  }

  createUserGameList(gameListId: string, gameListName: string): Promise<string> {
   return this.createSpecifiedUserGameList({
    id: gameListId,
    name: gameListName
   }, this.userService.getCurrentUserData());
  }

  private createSpecifiedUserGameList(gameList: UserGameListRef, user: User): Promise<string> {
    let data = {
      id: gameList.id,
      name: gameList.name,
      userId: user.uid,
      owner: gameList?.ownerId ? gameList.ownerId : user.uid 
    }
    return this.firestore.createSubDocData(data, USERS_DB.USERS, user.uid, USERS_DB.GAME_LISTS, gameList.id);
  }

  fetchGameList(gameListId: string): Promise<GameList> {
    return firstValueFrom(this.firestore.getDocData(DATALIST_DB.DATA_LISTS, gameListId));
  }

  fetchUsersWithGameList(gameListId: string): Promise<UserGameListRef[]> {
    return this.firestore.queryCollectionGroupData(USERS_DB.GAME_LISTS, where('id', '==', gameListId));
  }

  deleteGameListAndReferences(gameListId: string): Promise<string> {
    return this.firestore.deleteDocument(DATALIST_DB.DATA_LISTS, gameListId).then((id) => {
      return this.fetchUsersWithGameList(gameListId).then(dataArray => {
        dataArray.forEach(userGameList => {
          this.firestore.deleteDocument(USERS_DB.USERS, userGameList.userId!, USERS_DB.GAME_LISTS, gameListId);
        });
        return id;
      });
    });
  }

  shareGameList(gameList: UserGameListRef, email: string): Promise<string> {
    return this.firestore.queryCollectionData(USERS_DB.USERS, where('email', '==', email)).then((users: any) => {
      if (users.length === 0) {
        console.error(`No user found with email: ${email}`);
        return '';
      }
      return this.createSpecifiedUserGameList(gameList, users[0]);
    });
  }
}
