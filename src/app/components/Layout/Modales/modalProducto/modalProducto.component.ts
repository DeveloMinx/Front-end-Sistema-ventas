import { Component, OnInit,Inject } from '@angular/core';

import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Categoria } from 'src/app/Interfaces/Categoria';
import { Producto } from 'src/app/Interfaces/Producto';
import { CategoriaService } from 'src/app/Services/Categoria.service';
import { ProductoService } from 'src/app/Services/Producto.service';
import { UtilidadService } from 'src/app/Reutilizable/Utilidad.service';


@Component({
  selector: 'app-modalProducto',
  templateUrl: './modalProducto.component.html',
  styleUrls: ['./modalProducto.component.css']
})
export class ModalProductoComponent implements OnInit {


  formProducto:FormGroup;
  titleAction:string= "Agregar";
  butonAction:string = "Guardar";
  listCategorias:Categoria[]=[]

  constructor(
    private modalActual:MatDialogRef<ModalProductoComponent>,
    @Inject(MAT_DIALOG_DATA)public dataProduct:Producto,
    private fb:FormBuilder,
    private categoryService:CategoriaService,
    private productService:ProductoService,
    private utilityService:UtilidadService
  ) {
    this.formProducto= this.fb.group({
      nombre:['',Validators.required],
      idCategoria:['',Validators.required],
      stock:['',Validators.required],
      precio:['',Validators.required],
      esActivo:['1',Validators.required],
      });

      if(this.dataProduct !=null){
        this.titleAction="Editar"
        this.butonAction="Actualizar"
      }
      //Obtenemos la lista de categorias
      this.categoryService.lista().subscribe({
        next:(data)=>{
          if(data.status) this.listCategorias=data.value
        },
        error:(e)=>{
  
        }
      })
   }

   
 
  ngOnInit() {
    //Setear valores si hay informacion
    if(this.dataProduct !=null){
      this.formProducto.patchValue({


        nombre:this.dataProduct.nombre,
        idCategoria:this.dataProduct.idCategoria,
        stock:this.dataProduct.stock,
        precio:this.dataProduct.precio,
        esAvtivo:this.dataProduct.esActivo.toString(),
      })
    }
  }

  saveEditProduct(){
    const _product:Producto={
      idProducto:this.dataProduct==null? 0: this.dataProduct.idProducto,
      nombre:this.formProducto.value.nombre,
      idCategoria:this.formProducto.value.idCategoria,
      descripcionCategoria:"",
      precio:this.formProducto.value.precio,
      stock:this.formProducto.value.stock,
      esActivo:parseInt(this.formProducto.value.esActivo),
    }

    if(this.dataProduct == null){

      this.productService.guardar(_product).subscribe({
        next:(data) =>{
          if(data.status){
            this.utilityService.mostrarMensaje("Producto registrado con exito", "Exito");
            this.modalActual.close("true");
          }else
            this.utilityService.mostrarMensaje("No a sido posible registrar el producto","Error")  
        },
        error:(e)=>{}
      })

    }else{

      this.productService.editar(_product).subscribe({
        next:(data) =>{
          if(data.status){
            this.utilityService.mostrarMensaje("Producto editado con exito", "Exito");
            this.modalActual.close("true");
          }else
            this.utilityService.mostrarMensaje("No a sido posible editar el producto","Error")  
        },
        error:(e)=>{}
      })

    }
  }

}
