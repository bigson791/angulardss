import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Proveedor {
  _id?: string;
  nombre: string;
  nit: string;
  telefono: string;
  correo: string;
  direccion: string;
  contacto: string;
  fechaIngreso?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private api = 'http://localhost:3000/api/proveedores';

  constructor(private http: HttpClient) { }
 obtenerTodos(): Observable<any[]> {
    return this.http.get<Proveedor[]>(this.api);
  }

  agregar(proveedor: Proveedor): Observable<any> {
    return this.http.post(this.api, proveedor);
  }

  actualizar(id: string, proveedor: Proveedor): Observable<any> {
    return this.http.put(`${this.api}/${id}`, proveedor);
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }

}
