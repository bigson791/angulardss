import { Routes } from '@angular/router';
import { MainComponent } from './layout/main.component';
import { LoginComponent } from './pages/login/login.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { AuthGuard } from './guards/auth.guard';
import { NotFoundComponent } from './pages/not-found/not-found.component';


export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },

    // Rutas protegidas con layout
    {
        path: '',
        component: MainComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
            { path: 'usuarios', loadComponent: () => import('./pages/usuarios/usuarios.component').then(m => m.UsuariosComponent) },
            { path: 'productos', loadComponent: () => import('./pages/productos/productos.component').then(m => m.ProductosComponent) },
            { path: 'clientes', loadComponent: () => import('./pages/clientes/clientes.component').then(m => m.ClientesComponent) },
            { path: 'proveedores', loadComponent: () => import('./pages/proveedores/proveedores.component').then(m => m.ProveedoresComponent) },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: '**', component: NotFoundComponent } // Redirige a 404 si no encuentra la ruta
        ]
    },

    // // Página 404 (también protegida si lo deseas)
    // {
        
    //     path: '**',
    //     component: NotFoundComponent,
    //     canActivate: [AuthGuard]
    // }
];
