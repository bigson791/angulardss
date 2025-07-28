import { Component, OnInit } from '@angular/core';
import { InventarioService, MovimientoInventario } from '../../services/inventario.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-inventarios',
  standalone: true,
  imports: [FormsModule, CommonModule, DropdownModule, CalendarModule],
  templateUrl: './inventarios.component.html',
  styleUrl: './inventarios.component.scss'
})
export class InventariosComponent implements OnInit {

  productos: { _id: string; nombre: string }[] = [];

  filtro = {
    idProducto: '',
    inicio: null as Date | null,
    fin: null as Date | null
  };
  stock: number | null = null;
  movimientosFiltrados: MovimientoInventario[] = [];

  constructor(private inventarioService: InventarioService, private http: HttpClient) { }

  ngOnInit() {
    this.http.get<{ _id: string; nombre: string }[]>('http://localhost:3000/api/productos')
      .subscribe(data => this.productos = data);
  }

  aplicarFiltros() {
    if (!this.filtro.idProducto) {
      Swal.fire('Error', 'Debe seleccionar un producto.', 'error');
      return;
    }

    if (this.filtro.inicio && this.filtro.fin && new Date(this.filtro.fin) < new Date(this.filtro.inicio)) {
      Swal.fire('Error', 'La fecha de fin no puede ser menor a la fecha de inicio.', 'error');
      return;
    }

    const inicio = this.filtro.inicio ? this.formatearFecha(this.filtro.inicio) : undefined;
    const fin = this.filtro.fin ? this.formatearFecha(this.filtro.fin) : undefined;

    let rspuesta = this.inventarioService.obtenerStock(this.filtro.idProducto, inicio, fin)
      .subscribe(res => this.stock = res.stock);
    console.log(rspuesta);

  }

  limpiarFiltros() {
    this.filtro = {
      idProducto: '',
      inicio: null,
      fin: null
    }
    this.stock = 0;
  }

  alSeleccionarProducto(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const id = selectElement.value;
    const producto = this.productos.find(p => p._id === id);
    if (producto) {
      this.filtro.idProducto = producto._id;
      //this.aplicarFiltros();
    }
  }

  formatearFecha(fecha: Date | string | null): string {
    if (!fecha) return '';

    let dateObj: Date;

    if (fecha instanceof Date) {
      dateObj = fecha;
    } else {
      dateObj = new Date(fecha);
    }

    const dia = dateObj.getDate().toString().padStart(2, '0');
    const mes = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const año = dateObj.getFullYear();
    return `${año}-${mes}-${dia}`;
  }
  buscar() {
    if (!this.filtro.idProducto) {
      Swal.fire('Error', 'Debe seleccionar un producto.', 'error');
      return;
    }
    if (this.filtro.inicio && this.filtro.fin && new Date(this.filtro.fin) < new Date(this.filtro.inicio)) {
      Swal.fire('Error', 'La fecha de fin no puede ser menor a la fecha de inicio.', 'error');
      return;
    }
    const inicioStr = this.filtro.inicio ? this.formatearFecha(this.filtro.inicio) : undefined;
    const finStr = this.filtro.fin ? this.formatearFecha(this.filtro.fin) : undefined;
    this.inventarioService.obtenerStock(this.filtro.idProducto, inicioStr, finStr)
      .subscribe(res => this.stock = res.stock);

       this.inventarioService.obtenerMovimientos(this.filtro.idProducto, inicioStr, finStr)
         .subscribe(res => this.movimientosFiltrados = res);
  }
}