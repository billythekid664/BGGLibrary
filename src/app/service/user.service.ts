import { inject, Injectable } from '@angular/core';
import { User } from '../model/user.model';
import { Observable, tap } from 'rxjs';
import { traceUntilFirst } from '@angular/fire/performance';
import { Auth, authState, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, UserCredential } from '@angular/fire/auth';
import { FirestoreService } from './firestore.service';
import { arrayUnion } from '@angular/fire/firestore';
import { UserGamelistRef } from '../model/user-gamelist-ref.model';

export const USERS_DB = {
    USERS: 'users',
    GAME_LISTS: 'gameLists'
  };

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private auth = inject(Auth);
  private firestore = inject(FirestoreService);
  private user!: User;
  private gameLists!: UserGamelistRef[];

  constructor() { }

  addUser(user: User): Promise<string> {
    return this.firestore.setDocData(user, USERS_DB.USERS, user.uid);
  }

  fetchUser(uid: string): Observable<User> {
    return this.firestore.getDocData(USERS_DB.USERS, uid).pipe(
      tap(user => {
        this.user = user;
      })
    );
  }

  fetchUserGameLists(uid: string): Observable<UserGamelistRef[]> {
    return this.firestore.getCollectionData(USERS_DB.USERS, uid, USERS_DB.GAME_LISTS).pipe(
      tap(gameLists => {
        this.gameLists = gameLists;
      })
    );
  }

  createUser(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  getCurrentUserData(): User {
    return this.user;
  }

  getCurrentUserGameLists() {
    return this.gameLists;
  }

  checkAuth(): Observable<any> {
    return authState(this.auth).pipe(
      traceUntilFirst('auth'),
    );
  }

  signUserIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  signUserInWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account"
  })
    return signInWithPopup(this.auth, provider);
  }

  signUserOut(): Promise<void> {
    return signOut(this.auth).then(() => {
      console.log('User signed out');
    }, err => console.error('error signing out', err));
  }
}
