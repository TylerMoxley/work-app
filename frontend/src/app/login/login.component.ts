import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.authenticate(this.username, this.password).subscribe({
      next: (response) => {
        const token = response.access;
        this.authService.setToken(token);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        alert('Invalid username or password');
      }
    });
  }
}
