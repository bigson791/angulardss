import { Component, OnInit } from '@angular/core';
import { CompraService } from '../../services/compra.service';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { Compra, DetalleCompra } from '../../models/compra';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';

interface Proveedor {
  _id: string;
  nombre: string;
  nit: string;
  telefono: string;
  correo: string;
  direccion: string;
  contacto: string;
}
interface Producto {
  _id: string;
  nombre: string;
  precioCompra: number;
  precioVenta: number;
}

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss'],
  standalone: true,
  imports: [FormsModule,
    CommonModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    TableModule]
})
export class ComprasComponent implements OnInit {
  nuevaCompra: Compra = {
    idProveedor: '',
    nombreProveedor: '',
    serieFactura: '',
    numeroFactura: '',
    pago: 'efectivo',
    retencionIsr: 0,
    impuesto: 0,
    diasCredito: 0,
    fechaCompra: new Date(),
    observacion: '',
    tipoCompra: 'articulo',
    detalleCompra: []
  };

  nuevoDetalle: DetalleCompra = {
    idProducto: '',
    nombreProducto: '',
    precioCompra: 0,
    cantidad: 1
  };

  productoSeleccionado = {
    idProducto: '',
    nombreProducto: '',
    precioCompra: 0,
    cantidad: 1
  };

  proveedorSeleccionado = {
    _id: '',
    nombre: '',
    nit: '',
    telefono: '',
    correo: '',
    direccion: '',
    contacto: '',
    fechaIngreso: ''
  }

  proveedores: Proveedor[] = [];
  productos: Producto[] = [];
  diasCredito: number[] = [0, 15, 45, 60, 75, 90];

  tipoCompraBloqueado = false;

  constructor(private compraService: CompraService, private http: HttpClient) { }

  ngOnInit() {
    this.http.get<Proveedor[]>('http://localhost:3000/api/proveedores').subscribe(data => this.proveedores = data);
    this.http.get<Producto[]>('http://localhost:3000/api/productos').subscribe(data => this.productos = data);
  }

  agregarDetalle() {
    if (!this.productoSeleccionado) {
      Swal.fire('Advertencia', 'Debe seleccionar un producto', 'warning');
      return;
    }

    if (this.productoSeleccionado.cantidad <= 0 || this.productoSeleccionado.precioCompra <= 0) {
      Swal.fire('Error', 'Cantidad y precio unitario deben ser mayores a cero', 'warning');
      return;
    }

    this.nuevaCompra.detalleCompra.push({ ...this.productoSeleccionado });
    this.productoSeleccionado = {
      idProducto: '',
      nombreProducto: '',
      precioCompra: 0,
      cantidad: 1
    };
  }

  eliminarDetalle(index: number) {
    this.nuevaCompra.detalleCompra.splice(index, 1);
  }

  guardarCompra(form: NgForm) {
    if (form.invalid || this.nuevaCompra.detalleCompra.length === 0) {
      console.log(form.invalid);
      console.log(this.nuevaCompra.detalleCompra.length);
      Swal.fire('Error', 'Debes llenar todos los campos y agregar al menos un producto.', 'warning');
      return;
    }

    this.compraService.registrar(this.nuevaCompra).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Compra registrada correctamente.', 'success');
        form.resetForm();
        this.nuevaCompra.detalleCompra = [];
      },
      error: err => {
        console.error(err);
        Swal.fire('Error', 'No se pudo guardar la compra.', 'error');
      }
    });
  }

  ajustarDiasCredito() {
    if (!this.esCredito()) {
      this.nuevaCompra.diasCredito = 0;

    }
  }
  alSeleccionarProducto(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const id = selectElement.value;

    const producto = this.productos.find(p => p._id === id);
    if (producto) {
      this.productoSeleccionado.idProducto = producto._id;
      this.productoSeleccionado.nombreProducto = producto.nombre;
      this.productoSeleccionado.precioCompra = producto.precioCompra;
    }
  }
  alSeleccionarProveedor(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const id = selectElement.value;
    const proveedor = this.proveedores.find(p => p._id === id);
    if (proveedor) {
      this.proveedorSeleccionado._id = proveedor._id;
      this.proveedorSeleccionado.nombre = proveedor.nombre;
      this.proveedorSeleccionado.nit = proveedor.nit;
      this.proveedorSeleccionado.telefono = proveedor.telefono;
      this.proveedorSeleccionado.correo = proveedor.correo;
      this.proveedorSeleccionado.direccion = proveedor.direccion;
      this.proveedorSeleccionado.contacto = proveedor.contacto;
    }
  }
  calcularTotalCompra(): number {
    return this.nuevaCompra.detalleCompra.reduce((total, item) => {
      return total + item.precioCompra * item.cantidad;
    }, 0);
  }


  esServicio(): boolean {
    return this.nuevaCompra.tipoCompra === 'servicio';
  }

  esCredito(): boolean {
    return this.nuevaCompra.pago === 'Credito';

  }
  bloquearTipoCompra() {
    if (this.nuevaCompra.tipoCompra === 'servicio') {
      this.tipoCompraBloqueado = true;
    }
  }


}
