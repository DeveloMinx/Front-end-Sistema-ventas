import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { FormBuilder,FormGroup} from '@angular/forms';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';
import { ModalDetalleVentaComponent } from '../../Modales/modalDetalleVenta/modalDetalleVenta.component';

import { Venta } from 'src/app/Interfaces/Venta';
import { VentaService } from 'src/app/Services/Venta.service';
import { UtilidadService } from 'src/app/Reutilizable/Utilidad.service';

export const MY_DATA_FORMATS ={
  parse:{
    dataInput:'DD/MM/YYYY'
  },
  display:{
    dateInput:'DD/MM/YYYY',
    monthYearLabel:'MMMM YYYY'
  }
}


@Component({
  selector: 'app-HistorialVenta',
  templateUrl: './HistorialVenta.component.html',
  styleUrls: ['./HistorialVenta.component.css'],
  providers:[{provide:MAT_DATE_FORMATS, useValue:MY_DATA_FORMATS}]
})
export class HistorialVentaComponent implements OnInit,AfterViewInit {

  formBuscar:FormGroup;
  optionsBusqueda:any[]=[
    {value:'fecha', descripcion:"Por fechas"},
    {value:'numero', descripcion:"Numero Venta"},
  ];
  columnsTabla:string[]=['fechaRegistro', 'numeroDocumento','tipoPago','total','accion'];
  dataInicio:Venta[]=[];
  datosListaVenta=new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!:MatPaginator;


  constructor(
    private fb:FormBuilder,
    private dialog:MatDialog,
    private _ventaSercive:VentaService,
    private _utilidadService:UtilidadService
  ) {
    this.formBuscar=this.fb.group({
      buscarPor:['fecha'],
      numero:[''],
      fechaInicio:[''],
      fechaFinal:['']
    });

    this.formBuscar.get('buscarPor')?.valueChanges.subscribe(value=>{
      this.formBuscar.patchValue({
        numero:'',
        fechaInicio:'',
        fechaFinal:''
      })
    })
   }


  ngOnInit() {
  }



  ngAfterViewInit(): void {
    this.datosListaVenta.paginator=this.paginacionTabla;
  }


  filterTable(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.datosListaVenta.filter = filterValue.trim().toLocaleLowerCase();
  }

  buscarVenta(){
    let _fechaInicio:string='';
    let _fechaFin:string='';

    if(this.formBuscar.value.buscarPor==="fecha"){
      _fechaInicio = moment(this.formBuscar.value.fechaInicio).format('DD/MM/YYYY');
      _fechaFin = moment(this.formBuscar.value.fechaFinal).format('DD/MM/YYYY');

      if(_fechaInicio==='Invalid date' || _fechaFin==='Invalid date'){
        this._utilidadService.mostrarMensaje("Verifica las fechas e intenta de nuevo","Cerrar");
        return;
      }
    }
    this._ventaSercive.historial(
      this.formBuscar.value.buscarPor,
      this.formBuscar.value.numero,
      _fechaInicio,
      _fechaFin
    ).subscribe({
      next:(data)=>{
        if(data.status){
          this.datosListaVenta = data.value;
        }else{
          this._utilidadService.mostrarMensaje("No se encontraron datos","Cerrar");
        }
      },
      error:(e)=>{
        this._utilidadService.mostrarMensaje(`No asido posible realizar la fusqueda ${e}`,"Cerrar");
      }
    })
  }

  showDetalleVenta(_venta:Venta){
    this.dialog.open(ModalDetalleVentaComponent,{
      data:_venta,
      disableClose:true,
      width:'700px'

    })
  }
 
}
