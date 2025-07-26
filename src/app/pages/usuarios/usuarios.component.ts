import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';

interface Usuario {
  _id?: string;
  nombres: string;
  apellidos: string;
  nombreUsuario: string;
  contrasena: string;
  correo: string;
  telefono: string;
  tipoUsuario: string;
}

interface Rol {
  nombre: string;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    TableModule
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  roles: Rol[] = [];
  mostrarModal = false;
  idEditando: string | null = null;

  nuevoUsuario: Usuario = {
    nombres: '',
    apellidos: '',
    nombreUsuario: '',
    contrasena: '',
    correo: '',
    telefono: '',
    tipoUsuario: ''
  };

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarRoles();
  }

  cargarUsuarios() {
    this.usuarioService.obtenerTodos().subscribe(data => {
     this.usuarios = data;
      //console.log('Usuarios cargados:', this.usuarios);
      //console.log(data);
    });
  }

  cargarRoles() {
    this.roles = ['admin', 'ventas', 'compras', 'pagos'].map(role => ({ nombre: role }));
  }

  abrirModal() {
    this.mostrarModal = true;
    this.nuevoUsuario = {
      nombres: '',
      apellidos: '',
      nombreUsuario: '',
      contrasena: '',
      correo: '',
      telefono: '',
      tipoUsuario: ''
    };
    this.idEditando = null;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.idEditando = null;
  }

  guardarUsuario(form: NgForm) {
    if (form.invalid) {
      Swal.fire('Formulario Inválido', 'Por favor, completa todos los campos requeridos.', 'warning');
      return;
    }

    if (this.idEditando) {
      this.usuarioService.actualizarUsuario(this.idEditando, this.nuevoUsuario)
        .subscribe({
          next: () => {
            Swal.fire('Éxito', 'Usuario actualizado correctamente.', 'success');
            this.cargarUsuarios();
            this.cerrarModal();
          },
          error: err => {
            console.error('Error actualizando usuario:', err);
            Swal.fire('Error', 'No se pudo actualizar el usuario.', 'error');
          }
        });
    } else {
      this.usuarioService.agregar(this.nuevoUsuario)
        .subscribe({
          next: () => {
            Swal.fire('Éxito', 'Usuario guardado correctamente.', 'success');
            this.cargarUsuarios();
            this.cerrarModal();
          },
          error: err => {
            console.error('Error guardando usuario:', err);
            Swal.fire('Error', 'No se pudo guardar el usuario.', 'error');
          }
        });
    }
  }

  editarUsuario(usuario: Usuario) {
    this.nuevoUsuario = { ...usuario };
    this.idEditando = usuario._id || null;
    this.mostrarModal = true;
  }

  eliminarUsuario(usuario: Usuario) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar al usuario "${usuario.nombreUsuario}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed && usuario._id) {
        this.usuarioService.eliminarUsuario(usuario._id)
          .subscribe({
            next: () => {
              Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
              this.cargarUsuarios();
            },
            error: err => {
              console.error('Error al eliminar usuario:', err);
              Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
            }
          });
      }
    });
  }
}
