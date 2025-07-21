import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // Asegúrate de importar tu servicio de autenticación

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule] // no olvides importar FormsModule para ngModel
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) { }

  onSubmit() {
    // Aquí va la llamada al backend para validar usuario
    // Por ahora, ejemplo simple:
    this.auth.loginUser(this.username, this.password).subscribe({
      next: (response) => {
        this.auth.login(response.token); // Guarda el token en el localStorage
        this.router.navigate(['/usuarios']); // Redirige al dashboard o usuarios
      },
      error: (error) => {
        console.error('Error de login:', error);
        alert('Usuario o contraseña incorrectos');
      }
    })
  }
}
