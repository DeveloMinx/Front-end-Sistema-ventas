import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalUsuarioComponent } from '../../Modales/modalUsuario/modalUsuario.component';
import { Usuario } from 'src/app/Interfaces/Usuario';
import { UsuarioService } from 'src/app/Services/Usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/Utilidad.service';
import Swal from 'sweetalert2';
 
@Component({
  selector: 'app-Usuario',
  templateUrl: './Usuario.component.html',
  styleUrls: ['./Usuario.component.css']
})
export class UsuarioComponent implements OnInit,AfterViewInit {

  columnasTabla:string[]=['nombreCompleto','correo','rolDescripcion','estado','acciones'];
  dataInicio:Usuario[]=[];
  dataListaUsuario = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!:MatPaginator;

  constructor(
    private dialog:MatDialog,
    private userService:UsuarioService,
    private utilityService:UtilidadService
  ) { }
 


  ngAfterViewInit(): void {
    this.dataListaUsuario.paginator=this.paginacionTabla;
  }
  ngOnInit() {
    this.getUsers();
  }

  getUsers(){
    this.userService.lista().subscribe({
      next:(data)=>{
        if(data.status) 
          this.dataListaUsuario.data=data.value;
        else
          this.utilityService.mostrarMensaje("No se encontraron datos","Cerrar")
      },
      error:(e)=>{
        this.utilityService.mostrarMensaje(`Error al obtener usuarios ${e}`,'Cerrar')
      }
    });
  }

  filterTable(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaUsuario.filter = filterValue.trim().toLocaleLowerCase();
  }

  newUser(){
    this.dialog.open(ModalUsuarioComponent,{
      disableClose:true
    }).afterClosed().subscribe(resultado =>{
      if(resultado==='true')this.getUsers();
    });
  }

  editUser(user:Usuario){
    this.dialog.open(ModalUsuarioComponent,{
      disableClose:true,
      data:user
    }).afterClosed().subscribe(resultado =>{
      if(resultado==='true')this.getUsers();
    });
  }

  deleteUser(user:Usuario){
    Swal.fire({
      title:"Eliminar usuario?",
      text:user.nombreCompleto,
      icon:"warning",
      confirmButtonColor:"#3085d6",
      confirmButtonText:"Si, eliminar",
      showCancelButton:true,
      cancelButtonColor:"#d33",
      cancelButtonText:"No,volver"
    }).then((result)=>{ 
      if(result.isConfirmed){
        this.userService.eliminar(user.idUsuario).subscribe({
          next:(data)=>{
            if(data.status){
              this.utilityService.mostrarMensaje("Usuario eliminado", "Exito");
              this.getUsers();
            }else
            this.utilityService.mostrarMensaje("No a sido posible eliminar el usuario", "Cerrar");
          },
          error:(e)=>{}
        });
      }
    });
  }

}
