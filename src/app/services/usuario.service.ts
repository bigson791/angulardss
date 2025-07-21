import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private api = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  agregar(usuario: any) {
    return this.http.post(this.api, usuario);
  }

  obtenerTodos() {
    return this.http.get(this.api);
  }
}
