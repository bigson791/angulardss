import { Routes } from '@angular/router';
import { MainComponent } from './layout/main.component';
import { LoginComponent } from './pages/login/login.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { AuthGuard } from './guards/auth.guard';


export const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'usuarios', loadComponent: () => import('./pages/usuarios/usuarios.component').then(m => m.UsuariosComponent) },
            // aquí agregarás clientes, productos, etc.
            { path: '', redirectTo: 'usuarios', pathMatch: 'full' }
        ]
    },
    {
        path: 'login',
        component: LoginComponent // login sin layout
    },
    { path: '**', redirectTo: 'login' }
];
