import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HideNavService } from '../service/hide-nav.service';

@Component({
  selector: 'app-page-not-fount',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-not-fount.component.html',
  styleUrl: './page-not-fount.component.css'
})
export class PageNotFountComponent implements OnInit, OnDestroy {

  constructor(private hideNavService: HideNavService) { }

  ngOnInit(): void {
    this.hideNavService.setHideNav(true);
  }

  ngOnDestroy(): void {
      this.hideNavService.setHideNav(false);
  }
}
