import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActiveService {
  private active: BehaviorSubject <number> = new BehaviorSubject(1);
  activeObservable: Observable<number> = this.active.asObservable();

  checkActive(): Observable<number> {
    return this.activeObservable;
  }

  setActive(value: number): void {
    this.active.next(value);
  }
}
