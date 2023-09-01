import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';


///Paginas
import { DashboardComponent } from './Pages/Dashboard/Dashboard.component';
import { UsuarioComponent } from './Pages/Usuario/Usuario.component';
import { HistorialVentaComponent } from './Pages/HistorialVenta/HistorialVenta.component';
import { ProductoComponent } from './Pages/Producto/Producto.component';
import { ReporteComponent } from './Pages/Reporte/Reporte.component';
import { VentaComponent } from './Pages/Venta/Venta.component';

///Modales
import { ModalUsuarioComponent } from './Modales/modalUsuario/modalUsuario.component';
import { ModalProductoComponent } from './Modales/modalProducto/modalProducto.component';

//Modulo Angular Material
import { SharedModule } from 'src/app/Reutilizable/Shared/Shared.module';


@NgModule({
  declarations: [
    DashboardComponent,
    UsuarioComponent,
    HistorialVentaComponent,
    ProductoComponent,
    ReporteComponent,
    VentaComponent,
    ModalUsuarioComponent,
    ModalProductoComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule,

  ]
})
export class LayoutModule { }
