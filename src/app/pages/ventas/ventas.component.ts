import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { VentaService, Venta, DetalleVenta } from '../../services/venta.service';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import Swal from 'sweetalert2';

interface Cliente {
  _id: string;
  nombres: string;
  apellidos: string;
  correo: string;
  nit: string;
  direccion: string;
}

interface Producto {
  _id: string;
  nombre: string;
  precioVenta: number;
}


@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    TableModule],
  templateUrl: './ventas.component.html'
})
export class VentasComponent implements OnInit {
  clientes: Cliente[] = [];
  productos: Producto[] = [];
  tiposPago: string[] = ['Transferencia', 'Depósito', 'Tarjeta', 'Crédito Propio'];
  fuentes: string[] = ['Facebook', 'Instagram', 'Web', 'Whatsapp'];
  cuotasDisponibles: number[] = [];


  venta: Venta = {
    clienteid: '',
    cliente: '',
    fecha: '',
    origen: '',
    tipoPago: '',
    cuotas: 1,
    total: 0,
    detalles: []
  };

  nuevoDetalle: DetalleVenta = {
    idProducto: '',
    producto: '',
    cantidad: 1,
    precioUnitario: 0,
    subtotal: 0
  };

  clienteSeleccionado?: Cliente;
  productoSeleccionado?: Producto;

  constructor(private ventaService: VentaService, private http: HttpClient) { }
  ngOnInit() {
    this.cargarClientes();
    this.cargarProductos();
  }

  alSeleccionarCliente(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const id = selectElement.value;

    const cliente = this.clientes.find(c => c._id === id);
    if (cliente) {
      this.clienteSeleccionado = cliente;
      this.venta.cliente = cliente.nombres + ' ' + cliente.apellidos;
      this.venta.clienteid = cliente._id;
    }
  }

  alSeleccionarProducto(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const id = selectElement.value;

    const producto = this.productos.find(p => p._id === id);
    if (producto) {
      this.productoSeleccionado = producto;
      this.nuevoDetalle.producto = producto.nombre;
      this.nuevoDetalle.precioUnitario = producto.precioVenta;
      this.nuevoDetalle.idProducto = producto._id;
    }
  }


  agregarDetalle() {
    if (!this.productoSeleccionado) {
      Swal.fire('Advertencia', 'Debe seleccionar un producto', 'warning');
      return;
    }

    if (this.nuevoDetalle.cantidad <= 0 || this.nuevoDetalle.precioUnitario <= 0) {
      Swal.fire('Error', 'Cantidad y precio unitario deben ser mayores a cero', 'warning');
      return;
    }
    this.nuevoDetalle.subtotal = this.nuevoDetalle.cantidad * this.nuevoDetalle.precioUnitario;
    if (this.nuevoDetalle.subtotal <= 0) {
      Swal.fire('Error', 'Subtotal debe ser mayor a cero', 'warning');
      return; 
    }
    this.venta.detalles.push({ ...this.nuevoDetalle });
    this.calcularTotal();
    this.nuevoDetalle = {idProducto:'', producto: '', cantidad: 1, precioUnitario: 0, subtotal: 0 };
    this.cargarProductos(); // Resetear selección de producto
  }

  calcularTotal() {
    this.venta.total = this.venta.detalles.reduce(
      (sum, item) => sum + item.cantidad * item.precioUnitario, 0
    );
  }

  guardarVenta(form: NgForm) {
    if (form.invalid || this.venta.detalles.length === 0) {
      Swal.fire('Error', 'Completa todos los campos y agrega al menos un producto.', 'warning');
      return;
    }

    this.ventaService.crearVenta(this.venta).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Venta registrada correctamente', 'success');
        form.resetForm();
        this.venta = {
          clienteid: '',
          cliente: '',
          fecha: '',
          origen: '',
          tipoPago: '',
          cuotas: 1,
          total: 0,
          detalles: []
        };
      },
      error: () => {
        Swal.fire('Error', 'No se pudo registrar la venta', 'error');
      }
    });
  }

  cargarClientes() {
    this.http.get<Cliente[]>('http://localhost:3000/api/clientes')
      .subscribe(data => this.clientes = data);
  }

  cargarProductos() {
    this.http.get<Producto[]>('http://localhost:3000/api/productos')
      .subscribe(data => this.productos = data);
  }

  actualizarCuotasDisponibles() {
    if (this.venta.tipoPago === 'Transferencia' || this.venta.tipoPago === 'Depósito') {
      this.cuotasDisponibles = [1];
      this.venta.cuotas = 1;
    } else {
      this.cuotasDisponibles = [1, 3, 6, 9, 12];
      this.venta.cuotas = 1; // valor por defecto si no es efectivo
    }
  }

  eliminarDetalle(index: number) {
    this.venta.detalles.splice(index, 1);
    this.calcularTotal();
  }
}
