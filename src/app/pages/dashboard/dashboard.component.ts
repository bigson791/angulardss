import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';

interface Venta {
  _id: string;
  producto: string;
  cliente: string;
  cantidad: number;
  total: number;
  fecha: string;
  origen: string;
  tipoPago: string;
  cuotas: number;
  __v: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  ventas: Venta[] = [];

  // Datos para los tres gráficos
  barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  canalChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  metodoChartData: ChartData<'pie'> = { labels: [], datasets: [] };

  // Tipos de gráfico
  barChartType: ChartType = 'bar';
  canalChartType: ChartType = 'doughnut';
  metodoChartType: ChartType = 'pie';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<Venta[]>('http://localhost:3000/api/ventas').subscribe(data => {
      this.ventas = data;
      this.generarGraficos();
    });
  }

  generarGraficos() {
    // Orden cronológico de los meses
    const mesesOrdenados = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    const ventasPorMes: { [mes: string]: number } = {};
    this.ventas.forEach(v => {
      const fecha = new Date(v.fecha);
      const mes = fecha.toLocaleString('es-ES', { month: 'long' }).toLowerCase();
      ventasPorMes[mes] = (ventasPorMes[mes] || 0) + v.total;
    });

    const etiquetasMeses: string[] = [];
    const datosMeses: number[] = [];

    mesesOrdenados.forEach(mes => {
      if (ventasPorMes[mes]) {
        etiquetasMeses.push(mes.charAt(0).toUpperCase() + mes.slice(1));
        datosMeses.push(ventasPorMes[mes]);
      }
    });

    this.barChartData = {
      labels: etiquetasMeses,
      datasets: [{ data: datosMeses, label: 'Ventas por mes' }]
    };

    // Canal con más ventas
    const canalVentas: { [origen: string]: number } = {};
    this.ventas.forEach(v => {
      canalVentas[v.origen] = (canalVentas[v.origen] || 0) + v.total;
    });
    this.canalChartData = {
      labels: Object.keys(canalVentas),
      datasets: [{ data: Object.values(canalVentas) }]
    };

    // Método de pago más usado (conteo, no total)
    const pagos: { [tipoPago: string]: number } = {};
    this.ventas.forEach(v => {
      pagos[v.tipoPago] = (pagos[v.tipoPago] || 0) + 1;
    });
    this.metodoChartData = {
      labels: Object.keys(pagos),
      datasets: [{ data: Object.values(pagos) }]
    };
  }

}
