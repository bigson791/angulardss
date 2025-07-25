import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';


interface Producto {
  _id?: string; // opcional si el producto ya existe
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
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, DropdownModule, TableModule],
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
      this.idEditando = null;
  }

  guardarProducto(form: NgForm) {
    if (form.invalid) {
      Swal.fire('Formulario Inválido', 'Por favor, completa todos los campos requeridos.', 'warning');
      return;
    }
    const data = {
      ...this.nuevoProducto,
      fechaIngreso: new Date().toISOString()
    };

    if (this.idEditando) {
      this.http.put(`http://localhost:3000/api/productos/${this.idEditando}`, data)
        .subscribe({
          next: () => {
            Swal.fire('Éxito', 'Producto actualizado correctamente.', 'success');
            this.cargarProductos();
            this.cerrarModal();
            this.idEditando = null;
          },
          error: err => {
          
            Swal.fire('Error', 'No se pudo actualizar el producto.', 'error');
            console.error('Error actualizando:', err);
          }
        });
    } else {
      this.http.post('http://localhost:3000/api/productos', data)
        .subscribe({
          next: () => {
            Swal.fire('Éxito', 'Producto guardado correctamente.', 'success');
            this.cargarProductos();
            this.cerrarModal();
          },
          error: err => {
            console.error('Error guardando:', err);
          }
        });
    }
  }
  idEditando: string | null = null;
  editarProducto(producto: Producto, index: number) {
    this.nuevoProducto = { ...producto };
    this.idEditando = producto._id || null;
    this.mostrarModal = true;
    this.proveedoresFiltrados = this.proveedores;
    this.busquedaProveedor = '';
  }

  eliminarProducto(producto: Producto) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: `¿Deseas eliminar el producto "${producto.nombre}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      this.http.delete(`http://localhost:3000/api/productos/${producto._id}`)
        .subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
            this.cargarProductos();
          },
          error: err => {
            console.error('Error al eliminar:', err);
            Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
          }
        });
    }
  });
  }

}
