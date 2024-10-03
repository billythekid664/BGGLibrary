import { inject, Injectable } from '@angular/core';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore = inject(Firestore);

  constructor() { }

  getDocData(...pathSegments: string[]): Observable<any>  {
    return docData(doc(this.firestore, pathSegments.shift()!, ...pathSegments));
  }

  setDocData(data: any, ...pathSegments: string[]) {
    setDoc(doc(this.firestore, pathSegments.shift()!, ...pathSegments), data);
  }
}
