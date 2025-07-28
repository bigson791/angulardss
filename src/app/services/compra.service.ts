import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Compra } from '../models/compra'; 
// interfaces.ts

@Injectable({ providedIn: 'root' })
export class CompraService {
  private apiUrl = 'http://localhost:3000/api/compras';

  constructor(private http: HttpClient) { }

  registrar(compra: Compra): Observable<any> {
    return this.http.post(this.apiUrl, compra);
  }

  obtenerCompras(): Observable<Compra[]> {
    return this.http.get<Compra[]>(this.apiUrl);
  }
}
