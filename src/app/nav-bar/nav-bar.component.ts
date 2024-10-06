import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Auth, authState, signOut, user } from '@angular/fire/auth';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { traceUntilFirst } from '@angular/fire/performance';
import { map } from 'rxjs';
import { UserService } from '../service/user.service';
import { User } from '../model/user.model';


@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  active: number = 1;
  loggedIn: boolean = false;
  userSubscription: any;
  querySub: any;
  redirectUrl = { redirectUrl: '/' }
  displayName?: string;

  ngOnInit(): void {
    this.querySub = this.route.queryParams.subscribe(params => {
      if (params['redirectUrl']) {
        this.redirectUrl = { redirectUrl: decodeURIComponent(params['redirectUrl'])};
      } else {
        this.redirectUrl = { redirectUrl: '/' };
      }
    });
    this.userSubscription = this.userService.checkAuth().subscribe((user: any) => {
        this.loggedIn = !!user;
        if (!!user?.uid) {
          this.getUserData(user.uid);
          if (![1,2,3].includes(this.active)) {
            this.setActive(1);
          }
        }
    });
  }

  ngOnDestroy(): void {
    this.querySub.unsubscribe();
    this.userSubscription.unsubscribe();
  }
  setActive(index: number): void {
    this.active = index;
  }

  handleNavClick(index: number): void {
    this.setActive(index);
    document.getElementById('navToggleButton')?.click();
  }


  getUserData(uid: string) {
    this.userService.fetchUser(uid).subscribe((user: any) => {
      if (user) {
        this.displayName = `${user?.firstName} ${user?.lastName}`.normalize();
      }
    });
    this.userService.fetchUserGameLists(uid).subscribe((gameLists: any) => {});
  }

  logout() {
    this.userService.signUserOut();
    this.loggedIn = false;
    this.router.navigate(['/']);
    this.active = 1;
  }
}
