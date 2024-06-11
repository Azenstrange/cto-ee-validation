import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  username: string;
  password: string;
  qrCodeImage: string;

  constructor(private authService: AuthService, private router: Router) {
    this.username = '';
    this.password = '';
    this.qrCodeImage = '';
  }

  async register() {
    try {
      console.log(this.username);
      const response = await this.authService.register(this.username, this.password);
      this.qrCodeImage = response.imageUrl;
    } catch (error) {
      alert('Registration failed');
    }
  }
}
