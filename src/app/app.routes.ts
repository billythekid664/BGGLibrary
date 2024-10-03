import { Routes } from '@angular/router';
import { TableComponent } from './table/table.component';
import { PageNotFountComponent } from './page-not-fount/page-not-fount.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { authGuard } from './auth/auth.guard';
import { isAuthGuard } from './auth/is-auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'library/home', pathMatch: "full"},
    { path: 'login', component: LoginComponent, title: 'Login - BGG Library', canActivate: [isAuthGuard] },
    { path: 'library', redirectTo: 'library/home', pathMatch: "full"},
    { path: 'library/', redirectTo: 'library/home', pathMatch: "full"},
    { path: 'library/home', component: TableComponent, title: 'Home - BGG Library'},
    { path: 'library/user', component: UserComponent, title: 'User - BGG Library', canActivate: [authGuard]},
    { path: '**', component: PageNotFountComponent, title: 'Page Not Found - BGG Library' }
];
