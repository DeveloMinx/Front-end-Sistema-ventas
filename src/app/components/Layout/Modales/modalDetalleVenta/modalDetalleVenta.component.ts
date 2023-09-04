import { Component, OnInit,Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Venta } from 'src/app/Interfaces/Venta';
import { DetalleVenta } from 'src/app/Interfaces/DetalleVenta';

@Component({
  selector: 'app-modalDetalleVenta',
  templateUrl: './modalDetalleVenta.component.html',
  styleUrls: ['./modalDetalleVenta.component.css']
})
export class ModalDetalleVentaComponent implements OnInit {

  fechaRegistro:string='';
  numDocumento:string='';
  tipoPago:string='';
  total:string='';
  detalleVenta:DetalleVenta[]=[];
  columnasTabla:string[]=['producto','cantidad','precio','total']


  constructor(
    @Inject(MAT_DIALOG_DATA)public _venta:Venta,
  ) { 
    this.fechaRegistro=_venta.fechaRegistro!;
    this.numDocumento=_venta.numeroDocumento!;
    this.tipoPago=_venta.tipoPago;
    this.total=_venta.totalTexto;
    this.detalleVenta=_venta.detalleVenta;

  }
 
  ngOnInit() {
  }

}
