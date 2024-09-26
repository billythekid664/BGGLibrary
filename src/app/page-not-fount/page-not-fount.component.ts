import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ErrorPageService } from '../service/error-page.service';

@Component({
  selector: 'app-page-not-fount',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-not-fount.component.html',
  styleUrl: './page-not-fount.component.css'
})
export class PageNotFountComponent implements OnInit, OnDestroy {

  constructor(private errorPageService: ErrorPageService) { }

  ngOnInit(): void {
    this.errorPageService.setOnErrorPage(true);
  }

  ngOnDestroy(): void {
      this.errorPageService.setOnErrorPage(false)
  }
}
