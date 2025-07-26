import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


interface Usuario {
  _id?: string;
  nombres: string;
  apellidos: string;
  nombreUsuario: string;
  contrasena: string;
  correo: string;
  telefono: string;
  tipoUsuario: string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private api = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<any[]> {
    return this.http.get<Usuario[]>(this.api);
  }

  agregar(usuario: Usuario): Observable<any> {
    return this.http.post(this.api, usuario);
  }

  actualizarUsuario(id: string, usuario: Usuario): Observable<any> {
    return this.http.put(`${this.api}/${id}`, usuario);
  }

  eliminarUsuario(id: string): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}
