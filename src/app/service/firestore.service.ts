import { inject, Injectable } from '@angular/core';
import { addDoc, arrayUnion, collection, doc, docData, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../model/user.model';
import { Game } from '../model/game.model';
import { GameList } from '../model/gamelist.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore = inject(Firestore);

  constructor() { }

  getDocData(...pathSegments: string[]): Observable<any> {
    return docData(doc(this.firestore, pathSegments.shift()!, ...pathSegments));
  }

  setDocData(data: any, ...pathSegments: string[]): Promise<string> {
    let ref;
    if (pathSegments.length === 1) {
      ref = doc(collection(this.firestore, pathSegments[0]));
    } else {
      ref = doc(this.firestore, pathSegments.shift()!, ...pathSegments);
    }
    return setDoc(ref, data).then(() => {
      return ref.id;
    });
  }

  updateDocData(data: any, ...pathSegments: string[]): Promise<string> {
    let ref = doc(this.firestore, pathSegments.shift()!, ...pathSegments);
    return updateDoc(ref, data).then(() => {
      return ref.id;
    });
  }
}
