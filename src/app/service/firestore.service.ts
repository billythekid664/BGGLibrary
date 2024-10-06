import { inject, Injectable } from '@angular/core';
import { addDoc, arrayUnion, collection, collectionData, collectionGroup, doc, docData, Firestore, getDocs, limitToLast, orderBy, query, QueryFieldFilterConstraint, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { exhaustAll, lastValueFrom, mergeAll, Observable, takeLast, tap } from 'rxjs';
import { UserGamelistRef } from '../model/user-gamelist-ref.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore = inject(Firestore);

  constructor() { }

  getDocData(...pathSegments: string[]): Observable<any> {
    return docData(doc(this.firestore, pathSegments.shift()!, ...pathSegments));
  }

  getCollectionData(...pathSegments: string[]): Observable<any> {
    return collectionData(collection(this.firestore, pathSegments.shift()!, ...pathSegments));
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

  createSubDocData(data: any, ...pathSegments: string[]) {
    let docRef = doc(this.firestore, pathSegments.shift()!, ...pathSegments);
    return setDoc(docRef, data).then(() => {
      return docRef.id;
    });
  }

  querySubCollectionData(groupName: string, groupQuery: QueryFieldFilterConstraint): Promise<any> {
    let collectionGroupRef = collectionGroup(this.firestore, groupName);
    return getDocs(query(collectionGroupRef, groupQuery, orderBy('id', 'asc'), limitToLast(1))).then(snapshot => {
       snapshot
    });
  }
}
