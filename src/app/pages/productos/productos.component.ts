import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Producto {
  codigo: string;
  nombre: string;
  precioCompra: number;
  precioVenta: number;
  fechaCompra: string;
  proveedor: string;
}

interface Proveedor {
  _id: string;
  nombre: string;
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  proveedores: Proveedor[] = [];
  proveedoresFiltrados: Proveedor[] = [];
  busquedaProveedor = '';
  mostrarModal = false;

  nuevoProducto: Producto = {
    codigo: '',
    nombre: '',
    precioCompra: 0,
    precioVenta: 0,
    fechaCompra: '',
    proveedor: ''
  }

  constructor(private http: HttpClient) { }
  ngOnInit() {
    this.cargarProductos();
    this.cargarProveedores();
    // Aquí podrías cargar productos desde tu API si tienes endpoint
  }

  cargarProductos() {
    this.http.get<Producto[]>('http://localhost:3000/api/productos')
      .subscribe(data => {
        this.productos = data;
        console.log('Productos cargados:', this.productos);
      });
  }

  cargarProveedores() {
    this.http.get<Proveedor[]>('http://localhost:3000/api/proveedores')
      .subscribe(data => {
        this.proveedores = data;
        this.proveedoresFiltrados = data;
      });
  }

  filtrarProveedores() {
    const filtro = this.busquedaProveedor.toLowerCase();
    this.proveedoresFiltrados = this.proveedores.filter(p =>
      p.nombre.toLowerCase().includes(filtro)
    );
  }

  abrirModal() {
    this.mostrarModal = true;
    this.nuevoProducto = {
      codigo: '',
      nombre: '',
      precioCompra: 0,
      precioVenta: 0,
      fechaCompra: '',
      proveedor: ''
    };
    this.busquedaProveedor = '';
    this.proveedoresFiltrados = this.proveedores;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarProducto() {
    this.productos.push({ ...this.nuevoProducto });
    this.cerrarModal();
  }

}
