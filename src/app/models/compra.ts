// src/app/models/compra.model.ts

export interface DetalleCompra {
    idProducto: string;
    nombreProducto: string;
    precioCompra: number;
    cantidad: number;
}

export interface Compra {
    idProveedor: string;
    nombreProveedor: string;
    serieFactura: string;
    numeroFactura: string;
    fechaFactura?: Date;
    pago: 'efectivo' | 'Credito';
    retencionIsr: 0 | 5 | 7;
    impuesto: 0 | 12;
    diasCredito: 0 | 15 | 45 | 60 | 75 | 90;
    fechaCompra?: Date;
    observacion?: string;
    tipoCompra: 'articulo' | 'servicio';
    detalleCompra: DetalleCompra[];
}

//asignarNombreProveedor($event.target.value)