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
  private auth = inject(Auth);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  active: number = 1;
  loggedIn: boolean = false;
  userSubscription: any;
  querySub: any;
  redirectUrl = { redirectUrl: '/' }

  ngOnInit(): void {
    this.querySub = this.route.queryParams.subscribe(params => {
      if (params['redirectUrl']) {
        this.redirectUrl = { redirectUrl: decodeURIComponent(params['redirectUrl'])};
      } else {
        this.redirectUrl = { redirectUrl: '/' };
      }
    });
    this.userSubscription = authState(this.auth).pipe(
        traceUntilFirst('auth'),
      ).subscribe((user: any) => {
        this.loggedIn = !!user;
        console.log('user: ', user.uid)
        if (!!user?.uid) {
          this.getUserData(user?.uid);
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

  getUserData(uid: string) {
    console.log('Getting user data for uid:', uid);
    this.userService.getUser(uid).subscribe((user: any) => {
    // .then((user: any) => {
    //   // update user data here
      console.log('User data:', user);
    });
  }

  login() {
    this.router.navigate(['/login'], { queryParams: this.redirectUrl });
  }

  logout() {
    this.auth.signOut();
    this.auth.updateCurrentUser(null);
    this.loggedIn = false;
    this.router.navigate(['/']);
  }
}
