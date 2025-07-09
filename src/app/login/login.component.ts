import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../services/login.service';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-login',
  standalone: true, // 👈 asegúrate que esto está presente si estás usando imports aquí
  imports: [
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    RouterLink,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None // 👈 esto permite que tu CSS global personalizado funcione
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  login() {
    this.loginService.login(this.username, this.password).subscribe(data => {
      sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);
      this.router.navigate(['/pages/dashboard']);
    });
  }
}
