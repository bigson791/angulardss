import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MovimientoInventario {
  _id: string;
  producto: { _id: string; nombre: string };
  tipo: 'entrada' | 'salida' | 'ajuste' | 'creacion';
  cantidad: number;
  fecha: Date;
  observacion?: string;
}

@Injectable({ providedIn: 'root' })
export class InventarioService {
  private api = 'http://localhost:3000/api/inventario';

  constructor(private http: HttpClient) { }

  obtenerStock(idProducto: string, inicio?: string, fin?: string) {
    let params = new HttpParams();

    if (inicio) params = params.set('inicio', inicio);
    if (fin) params = params.set('fin', fin);

    return this.http.get<{ stock: number }>(`${this.api}/inventario/${idProducto}`, { params });
  }

obtenerMovimientos(idProducto: string, inicio?: string, fin?: string) {
  let url = `${this.api}/movimientos/${idProducto}`;

  const params = new URLSearchParams();
  if (inicio) params.append('inicio', inicio);
  if (fin) params.append('fin', fin);

  if (params.toString()) url += `?${params.toString()}`;

  return this.http.get<MovimientoInventario[]>(url);
}

}
