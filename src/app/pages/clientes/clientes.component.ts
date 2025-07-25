import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import Swal from 'sweetalert2';

interface Cliente {
  _id?: string;
  nombres: string;
  apellidos: string;
  direccion: string;
  nit: string;
  correo: string;
  telefono: string;
  totalPedidos?: number;

}

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, InputTextModule, ButtonModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  clienteNuevo: Cliente = this.resetCliente();
  mostrarModal = false;
  editando = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.cargarClientes();
  }

  resetCliente(): Cliente {
    return {
      nombres: '',
      apellidos: '',
      direccion: '',
      nit: '',
      correo: '',
      telefono: ''
    };
  }

  cargarClientes() {
    this.http.get<Cliente[]>('http://localhost:3000/api/clientes')
      .subscribe(data => this.clientes = data);
  }

  guardarCliente(form: NgForm) {
    if (form.invalid) {
      Swal.fire('Formulario Inválido', 'Por favor, completa todos los campos requeridos.', 'warning');
      return;
    }
    if (this.editando && this.clienteNuevo._id) {
      this.http.put(`http://localhost:3000/api/clientes/${this.clienteNuevo._id}`, this.clienteNuevo)
        .subscribe(() => {
          this.cargarClientes();
          this.cerrarModal();
        });
    } else {
      this.http.post('http://localhost:3000/api/clientes', this.clienteNuevo)
        .subscribe(() => {
          this.cargarClientes();
          this.cerrarModal();
        });
    }
  }

  editarCliente(cliente: Cliente) {
    
    this.clienteNuevo = { ...cliente };
    this.editando = true;
    this.mostrarModal = true;
  }

  eliminarCliente(cliente: Cliente) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el producto "${cliente.nombres}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        if (cliente.totalPedidos != 0) {
          Swal.fire('Error', 'No se puede eliminar un cliente con pedidos asociados.', 'error');
          return;
        }
        this.http.delete(`http://localhost:3000/api/clientes/${cliente._id}`)
          .subscribe({
            next: () => {
              Swal.fire('Eliminado', 'El cliente ha sido eliminado.', 'success');
              this.cargarClientes();
            },
            error: err => {
              console.error('Error al eliminar:', err);
              Swal.fire('Error', 'No se pudo eliminar el cliente.', 'error');
            }
          });
      }
    });
  }

  abrirModal() {
    this.clienteNuevo = this.resetCliente();
    this.editando = false;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
}
