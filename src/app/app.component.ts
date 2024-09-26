import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ErrorPageService } from './service/error-page.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'BGGLibrary';
  isOnError = false;
  subscription: any;

  constructor(private errorPageService: ErrorPageService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subscription = this.errorPageService.checkOnErrorPage()
        .subscribe((value) => {
          this.isOnError = value;
          this.cdr.detectChanges();
        });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
}
