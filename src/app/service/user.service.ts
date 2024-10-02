import { inject, Injectable } from '@angular/core';
import { User } from '../model/user.model';
import { Observable } from 'rxjs';
import { traceUntilFirst } from '@angular/fire/performance';
import { Auth, authState, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, UserCredential } from '@angular/fire/auth';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private auth = inject(Auth);
  private firestoreService = inject(FirestoreService);

  constructor() { }

  addUser(user: User) {
    this.firestoreService.setDocData(user, 'users', user.uid);
  }

  getUser(uid: string): Observable<User> {
    return this.firestoreService.getDocData('users', uid);
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
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  createUser(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  signUserOut() {
    signOut(this.auth).then(() => {
      console.log('User signed out');
    }, err => console.error('error signing out', err));
  }
}
