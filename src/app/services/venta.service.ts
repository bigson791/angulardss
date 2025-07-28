import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DetalleVenta {
  idProducto: string;
  producto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Venta {
  clienteid: string;
  cliente: string;
  fecha: string;
  origen: string;
  tipoPago: string;
  cuotas: number;
  total: number;
  detalles: DetalleVenta[];
}

@Injectable({ providedIn: 'root' })
export class VentaService {
  private apiUrl = 'http://localhost:3000/api/ventas';

  constructor(private http: HttpClient) {}

  obtenerTodas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.apiUrl);
  }

  crearVenta(venta: Venta): Observable<any> {
    return this.http.post(this.apiUrl, venta);
  }

  actualizarVenta(id: string, venta: Venta): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, venta);
  }

  eliminarVenta(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
