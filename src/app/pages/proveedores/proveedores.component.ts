import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import Swal from 'sweetalert2';
import { ProveedorService } from '../../services/proveedor.service';

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

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    TableModule],
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.scss'
})
export class ProveedoresComponent implements OnInit {
  proveedores: Proveedor[] = [];
  mostrarModal = false;
  nuevoProveedor: Proveedor = {
    nombre: '',
    nit: '',
    telefono: '',
    correo: '',
    direccion: '',
    contacto: ''
  };
  idEditando: string | null = null;


  constructor(private proveedorService: ProveedorService) { }

  ngOnInit() {
    this.cargarProveedores();
  }

  cargarProveedores() {
    this.proveedorService.obtenerTodos().subscribe(data => {
      this.proveedores = data;
    });
  }

  agregarProveedor() {
    this.mostrarModal = true;
  }

  abrirModal() {
    this.mostrarModal = true;
    this.nuevoProveedor = {
      nombre: '',
      nit: '',
      telefono: '',
      correo: '',
      direccion: '',
      contacto: ''
    };
    this.idEditando = null;
  }
  cerrarModal() {
    this.mostrarModal = false;
    this.idEditando = null;
  }
  guardarProveedor(form: NgForm) {
    if (form.valid) {
      if (this.idEditando) {
        this.proveedorService.actualizar(this.idEditando, this.nuevoProveedor).subscribe(() => {
          Swal.fire('Éxito', 'Proveedor actualizado correctamente', 'success');
          this.cargarProveedores();
          this.mostrarModal = false;
          form.reset();
        }, error => {
          Swal.fire('Error', 'No se pudo actualizar el proveedor', 'error');
        });
      } else {
        this.proveedorService.agregar(this.nuevoProveedor).subscribe(() => {
          Swal.fire('Éxito', 'Proveedor agregado correctamente', 'success');
          this.cargarProveedores();
          this.mostrarModal = false;
          form.reset();
        }, error => {
          Swal.fire('Error', 'No se pudo agregar el proveedor', 'error');
        });
      }
    }else{
      Swal.fire('Formulario Inválido', 'Por favor, completa todos los campos requeridos.', 'warning');
      return;
    }
  }

  editarProveedor(proveedor: Proveedor) {
    this.nuevoProveedor = { ...proveedor };
    this.idEditando = proveedor._id || null;
    this.mostrarModal = true;
  }

  actualizarProveedor(form: NgForm) {
    if (form.valid) {
      this.proveedorService.actualizar(this.nuevoProveedor._id!, this.nuevoProveedor).subscribe(() => {
        Swal.fire('Éxito', 'Proveedor actualizado correctamente', 'success');
        this.cargarProveedores();
        this.mostrarModal = false;
        form.reset();
      }, error => {
        Swal.fire('Error', 'No se pudo actualizar el proveedor', 'error');
      });
    }
  }

  eliminarProveedor(proveedor: Proveedor) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás deshacer esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.proveedorService.eliminar(proveedor._id!).subscribe(() => {
          Swal.fire('Eliminado', 'El proveedor ha sido eliminado.', 'success');
          this.cargarProveedores();
        }, error => {
          Swal.fire('Error', 'No se pudo eliminar el proveedor', 'error');
        });

      }
    });
  }
}