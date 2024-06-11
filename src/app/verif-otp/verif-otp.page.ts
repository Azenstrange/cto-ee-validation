import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-verif-otp',
  templateUrl: './verif-otp.page.html',
  styleUrls: ['./verif-otp.page.scss'],
})
export class VerifOtpPage {

  token: string = '';
  otpcode: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute 
  ) {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  async validateotp() {
    try {
      console.log(this.otpcode);
      const response = await this.authService.validateotp(this.token, this.otpcode);
      const username = response.username;
      this.router.navigate(['/profile', username]);
    } catch (error) {
      alert('Invalid OTP');
    }
  }
}
