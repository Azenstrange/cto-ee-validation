import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8888';

  constructor(private http: HttpClient) {}

  async register(username: string, password: string): Promise<any> {
    try {
      const response = await this.http.post(`${this.apiUrl}/register`, { username, password }).toPromise();
      return response;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  }
  
  async validateotp(token: string, otpcode: string): Promise<any> {
    try {
      const response = await this.http.post<any>(`${this.apiUrl}/validateotp`, { token, otpcode }).toPromise();
      return response;
    } catch (error) {
      console.error('Error during OTP validation:', error);
      throw error;
    }
  }
  

  async login(username: string, password: string): Promise<string> {
    try {
      const response = await this.http.post<{ token: string }>(`${this.apiUrl}/login`, { username, password}).toPromise();
      return response?.token ?? '';
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }
}
