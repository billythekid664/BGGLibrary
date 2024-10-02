import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, docData, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { User } from '../model/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firestore = inject(Firestore);

  constructor() { }

  addUser(user: User) {
    setDoc(doc(this.firestore, 'users', user.uid), user).then((data: any) => {
      console.log('User added successfully', data);
    });
  }

  getUser(uid: string): Observable<User> {
    return docData(doc(this.firestore, 'users', uid));
  }
}
