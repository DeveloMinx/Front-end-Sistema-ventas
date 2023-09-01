import { Component, OnInit } from '@angular/core';

import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ProductoService } from 'src/app/Services/Producto.service';
import { VentaService } from 'src/app/Services/Venta.service';
import { UtilidadService } from 'src/app/Reutilizable/Utilidad.service';
import { Producto } from 'src/app/Interfaces/Producto';
import { Venta } from 'src/app/Interfaces/Venta';
import Swal from 'sweetalert2';
import { DetalleVenta } from 'src/app/Interfaces/DetalleVenta';

@Component({
  selector: 'app-Venta',
  templateUrl: './Venta.component.html',
  styleUrls: ['./Venta.component.css']
})
export class VentaComponent implements OnInit {

  listProducts:Producto[]=[];
  listProductsFilter: Producto[]=[];

  listProductForSale:DetalleVenta[]=[];
  blockButtonRegister:boolean=false;

  productoSelect!:Producto;
  typePayDefault:string ='Efectivo';
  totalPagar:number=0;

  formProductSale:FormGroup;
  columnsTable:string[]=['producto','cantidad','precio','total','accion'];
  dataDetailSale= new MatTableDataSource(this.listProductForSale);

  returnProdsForFilter(search:any):Producto[]{
    const valorSearch = typeof search === "string" ? search.toLocaleLowerCase(): search.nombre.toLocaleLowerCase();
    return this.listProducts.filter(item=> item.nombre.toLocaleLowerCase().includes(valorSearch));

  }


  constructor(
    private fb:FormBuilder,
    private productService:ProductoService,
    private ventaService:VentaService,
    private utilidadService:UtilidadService
  ) {
    this.formProductSale= this.fb.group({
      producto:['',Validators.required],
      cantidad:['',Validators.required],
      });

      this.productService.lista().subscribe({
        next:(data)=>{
          const lista =data.value as Producto[];
          this.listProducts=lista.filter(p => p.esActivo == 1 && p.stock>0);
        },
        error:(e)=>{
  
        }
      });
      this.formProductSale.get('producto')?.valueChanges.subscribe(value =>{
        this.listProductsFilter = this.returnProdsForFilter(value);
      })
   }
 
  ngOnInit() {
  }

  showProduct(product:Producto):string{
    return product.nombre;
  }

  productForSale(event:any){
    this.productoSelect = event.option.value;
  }

  addProductForSale(){
    const _cantidad:number = this.formProductSale.value.cantidad;
    const _precio:number = parseFloat(this.productoSelect.precio);
    const _total:number = _cantidad * _precio;
    this.totalPagar =this.totalPagar + _total;

    this.listProductForSale.push({
      idProducto:this.productoSelect.idProducto,
      descripcionProducto:this.productoSelect.nombre,
      cantidad:_cantidad,
      precioTexto:String(_precio.toFixed(2)),
      totalTexto:String(_total.toFixed(2)),
    })

    this.dataDetailSale = new MatTableDataSource(this.listProductForSale);
    this.formProductSale.patchValue({
      producto:'',
      cantidad:''
    })
  }

  deleteProduct(detail:DetalleVenta){
    this.totalPagar = this.totalPagar - parseFloat(detail.totalTexto),
    this.listProductForSale = this.listProductForSale.filter(p => p.idProducto != detail.idProducto);
    this.dataDetailSale = new MatTableDataSource(this.listProductForSale);
  }

  registerSale(){
    if(this.listProductForSale.length > 0){
      this.blockButtonRegister = true;

      const request: Venta ={
        tipoPago:this.typePayDefault,
        totalTexto:String(this.totalPagar.toFixed(2)),
        detalleVenta: this.listProductForSale
      }

      this.ventaService.registrar(request).subscribe({
        next:(response) =>{
          if(response.status){
            this.totalPagar = 0.00;
            this.listProductForSale =[];
            this.dataDetailSale = new MatTableDataSource(this.listProductForSale);



            Swal.fire({
              icon:'success',
              title:'Venta registrada con exito',
              text:`Numero de venta: ${response.value.numeroDocumento}`
            })
          }else
          this.utilidadService.mostrarMensaje('No a sido posible registrar la venta', 'Cerrar')
        },
        complete:()=>{
          this.blockButtonRegister=false;
        },
        error:(e)=>{
          this.utilidadService.mostrarMensaje(`Error al registrar venta ${e}`,'Cerrar')
        }
      })
    }
  }

}
