import { Routes } from '@angular/router';
import { TableComponent } from './table/table.component';
import { PageNotFountComponent } from './page-not-fount/page-not-fount.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: '', redirectTo: 'library/home', pathMatch: "full"},
    { path: 'login', component: LoginComponent },
    { path: 'library', redirectTo: 'library/home', pathMatch: "full"},
    { path: 'library/', redirectTo: 'library/home', pathMatch: "full"},
    { path: 'library/home', component: TableComponent},
    { path: '**', component: PageNotFountComponent }
];
