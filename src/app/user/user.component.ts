import { Component, inject, OnInit } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  private firestore = inject(Firestore);

  ngOnInit() {
    collectionData(collection(this.firestore, 'users')).subscribe((users: any) => {
      console.log('Users:', users);
    })
  }
}
