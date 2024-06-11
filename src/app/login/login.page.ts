import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';
  otp: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    try {
      const token = await this.authService.login(this.username, this.password);
      localStorage.setItem('token', token);
      this.router.navigate(['login/' + token]);
    } catch (error) {
      alert('Invalid credentials or OTP');
    }
  }
}
