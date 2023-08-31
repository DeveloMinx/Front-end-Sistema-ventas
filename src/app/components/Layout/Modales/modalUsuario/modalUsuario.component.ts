import { Component, OnInit,Inject } from '@angular/core';

import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Rol } from 'src/app/Interfaces/Rol';
import { Usuario } from 'src/app/Interfaces/Usuario';

//Services
import { RolService } from 'src/app/Services/Rol.service';
import { UsuarioService } from 'src/app/Services/Usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/Utilidad.service';

@Component({
  selector: 'app-modalUsuario',
  templateUrl: './modalUsuario.component.html',
  styleUrls: ['./modalUsuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {

  formUsuario:FormGroup;
  hiddenPassword:boolean =true;
  titleAction:string= "Agregar";
  butonAction:string = "Guardar";
  listRol:Rol[]=[]

  constructor(
    private modalActual:MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA)public dataUser:Usuario,
    private fb:FormBuilder,
    private rolService:RolService,
     private userService:UsuarioService,
     private utilityService:UtilidadService
  ) {
    this.formUsuario= this.fb.group({
    nombreCompleto:['',Validators.required],
    correo:['',Validators.required],
    idRol:['',Validators.required],
    clave:['',Validators.required],
    esActivo:['',Validators.required],
    });

    if(this.dataUser !=null){
      this.titleAction="Editar"
      this.butonAction="Actualizar"
    }

    this.rolService.lista().subscribe({
      next:(data)=>{
        if(data.status) this.listRol=data.value
      },
      error:(e)=>{

      }
    })
   }

  ngOnInit() {
    if(this.dataUser !=null){
      this.formUsuario.patchValue({
        nombreCompleto:this.dataUser.nombreCompleto,
        correo:this.dataUser.correo,
        idRol:this.dataUser.idRol,
        clave:this.dataUser.clave,
        esAvtivo:this.dataUser.esActivo.toString(),
      })
    }
  }

  saveEditUser(){
    const _user:Usuario={
      idUsuario:this.dataUser==null? 0: this.dataUser.idUsuario,
      nombreCompleto:this.formUsuario.value.nombreCompleto,
      correo:this.formUsuario.value.correo,
      idRol:this.formUsuario.value.idRol,
      rolDescripcion:"",
      clave:this.formUsuario.value.clave,
      esActivo:parseInt(this.formUsuario.value.esActivo),
    }

    if(this.dataUser == null){

      this.userService.guardar(_user).subscribe({
        next:(data) =>{
          if(data.status){
            this.utilityService.mostrarMensaje("Usuario registrado con exito", "Exito");
            this.modalActual.close("true");
          }else
            this.utilityService.mostrarMensaje("No a sido posible registrar el usuario","Error")  
        },
        error:(e)=>{}
      })

    }else{

      this.userService.editar(_user).subscribe({
        next:(data) =>{
          if(data.status){
            this.utilityService.mostrarMensaje("Usuario editado con exito", "Exito");
            this.modalActual.close("true");
          }else
            this.utilityService.mostrarMensaje("No a sido posible editar el usuario","Error")  
        },
        error:(e)=>{}
      })

    }
  }

}
