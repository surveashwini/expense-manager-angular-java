import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './components/add/add.component';
import { AnalysisComponent } from './components/analysis/analysis.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RecurringComponent } from './components/recurring/recurring.component';
import { ReportComponent } from './components/report/report.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'add', component: AddComponent},
  {path: 'report', component: ReportComponent},
  {path: 'recurring', component: RecurringComponent},
  {path: 'analysis', component: AnalysisComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
