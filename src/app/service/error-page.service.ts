import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorPageService {
  private onErrorPage: BehaviorSubject <boolean> = new BehaviorSubject(false);
  onErrorPageObservable: Observable<boolean> = this.onErrorPage.asObservable();

  checkOnErrorPage(): Observable<boolean> {
    return this.onErrorPageObservable;
  }

  setOnErrorPage(value: boolean): void {
    this.onErrorPage.next(value);
  }
}
