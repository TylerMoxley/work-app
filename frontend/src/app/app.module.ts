import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppRoutingModule } from './app-routing.module';
import { RepairTableComponent } from './repair-table/repair-table.component';  // Import the table component
import { TimeAgoPipe } from './time-ago.pipe';  // Correct import for the pipe
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,  // Now it's a regular declared component
    LoginComponent,
    DashboardComponent,
    RepairTableComponent,  // <-- Add a comma here
    TimeAgoPipe  // Declare the TimeAgoPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NzButtonModule,
    NzInputModule,
    NzFormModule,
    BrowserAnimationsModule,
  ],
  providers: [
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
