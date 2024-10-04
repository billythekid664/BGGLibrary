import { AfterContentChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HideNavService } from './service/hide-nav.service';
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
  isHideNav = false;
  subscription: any;

  constructor(private hideNavService: HideNavService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subscription = this.hideNavService.checkHideNav()
        .subscribe((value) => {
          this.isHideNav = value;
          this.cdr.detectChanges();
        });
    ;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
