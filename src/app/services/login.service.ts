import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Plantilla temporal, pude haberlo hecho como modelo pero como lo usare solo aqui no hace falta que este 
// exportable para lo demas
interface ILoginRequest{
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private url: string = `${environment.HOST}/login`;
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

getRole(): string {
  const token = sessionStorage.getItem(environment.TOKEN_NAME);
  if (!token) return '';

  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.authorities[0]; // O manejar múltiples roles si vienen en array
}

getUser(): string {
  let token = sessionStorage.getItem('token');
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub;
  }
  return '';
}


  login(username: string, password: string){
    const body: ILoginRequest = { username, password};

    return this.http.post<any>(this.url, body);
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['login']);
  }
}
