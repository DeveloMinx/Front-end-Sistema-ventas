import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalProductoComponent } from '../../Modales/modalProducto/modalProducto.component';
import { Producto } from 'src/app/Interfaces/Producto';
import { ProductoService } from 'src/app/Services/Producto.service';
import { UtilidadService } from 'src/app/Reutilizable/Utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-Producto',
  templateUrl: './Producto.component.html',
  styleUrls: ['./Producto.component.css']
})
export class ProductoComponent implements OnInit,AfterViewInit {

  columnasTabla:string[]=['nombre','categoria','stock','precio','estado','acciones'];
  dataInicio:Producto[]=[];
  dataListaProduct = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!:MatPaginator;

  constructor(
    private dialog:MatDialog,
    private prodctService:ProductoService,
    private utilityService:UtilidadService
  ) { }

  ngAfterViewInit(): void {
    this.dataListaProduct.paginator=this.paginacionTabla;
  }

  ngOnInit() { 
    this.getProducts();
  }

  //Obtener productos
  getProducts(){
    this.prodctService.lista().subscribe({
      next:(data)=>{
        if(data.status) 
          this.dataListaProduct.data=data.value;
        else
          this.utilityService.mostrarMensaje("No se encontraron datos","Cerrar")
      },
      error:(e)=>{
      }
    });
  }

  filterTable(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaProduct.filter = filterValue.trim().toLocaleLowerCase();
  }

  newProduct(){
    this.dialog.open(ModalProductoComponent,{
      disableClose:true
    }).afterClosed().subscribe(resultado =>{
      if(resultado==='true')this.getProducts();
    });
  }

  editProduct(product:Producto){
    this.dialog.open(ModalProductoComponent,{
      disableClose:true,
      data:product
    }).afterClosed().subscribe(resultado =>{
      if(resultado==='true')this.getProducts();
    });
  }

  deleteProduct(product:Producto){
    Swal.fire({
      title:"Eliminar producto?",
      text:product.nombre,
      icon:"warning",
      confirmButtonColor:"#3085d6",
      confirmButtonText:"Si, eliminar",
      showCancelButton:true,
      cancelButtonColor:"#d33",
      cancelButtonText:"No,volver"
    }).then((result)=>{ 
      if(result.isConfirmed){
        this.prodctService.eliminar(product.idProducto).subscribe({
          next:(data)=>{
            if(data.status){
              this.utilityService.mostrarMensaje("Producto eliminado", "Exito");
              this.getProducts();
            }else
            this.utilityService.mostrarMensaje("No a sido posible eliminar el producto", "Cerrar");
          },
          error:(e)=>{}
        });
      }
    });
  }


}
