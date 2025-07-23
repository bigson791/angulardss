import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'userToken';
  private readonly nombres = 'userName';

  constructor(private http: HttpClient) {}

  loginUser(nombreUsuario: string, contrasena: string) {
    return this.http.post<{ token: string, nombre: string }>('http://localhost:3000/api/login', { nombreUsuario, contrasena });
  }

  login(token: string, name: string ) {
    localStorage.setItem(this.TOKEN_KEY, token);
    sessionStorage.setItem(this.nombres, name); // Guardar el nombre de usuario en sessionStorage
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}
