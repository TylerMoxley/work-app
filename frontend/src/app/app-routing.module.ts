import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';  // Import the DashboardComponent
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';  // Import the guard

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // This wires up the router configuration
  exports: [RouterModule]  // Export RouterModule so it can be used in other modules
})
export class AppRoutingModule {}

