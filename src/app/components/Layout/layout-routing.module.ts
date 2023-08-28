import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './Layout.component';
import { DashboardComponent } from './Pages/Dashboard/Dashboard.component';
import { UsuarioComponent } from './Pages/Usuario/Usuario.component';
import { ProductoComponent } from './Pages/Producto/Producto.component';
import { VentaComponent } from './Pages/Venta/Venta.component';
import { HistorialVentaComponent } from './Pages/HistorialVenta/HistorialVenta.component';
import { ReporteComponent } from './Pages/Reporte/Reporte.component';

const routes: Routes = [
  {
    path: '',component:LayoutComponent,children:[
      {path:'dashboard',component:DashboardComponent},
      {path:'usuarios',component:UsuarioComponent},
      {path:'productos',component:ProductoComponent},
      {path:'venta',component:VentaComponent},
      {path:'historial',component:HistorialVentaComponent},
      {path:'reportes',component:ReporteComponent}, 
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
