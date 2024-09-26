import { Routes } from '@angular/router';
import { TableComponent } from './table/table.component';

export const routes: Routes = [
    { path: '', redirectTo: 'library', pathMatch: "full"},
    { path: 'library', component: TableComponent}
];
