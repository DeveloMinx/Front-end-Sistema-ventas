import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/Interfaces/Login';
import { UsuarioService } from 'src/app/Services/Usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/Utilidad.service';

@Component({
  selector: 'app-Login',
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.css']
})
export class LoginComponent implements OnInit {

  formLogin:FormGroup;
  hiddenPassword:boolean=true;
  showLoading:boolean=false;

  constructor(
    private fb:FormBuilder,
    private router:Router,
    private usuariosService:UsuarioService,
    private utilidadService:UtilidadService
  ) {
    this.formLogin=this.fb.group({
      email:[,Validators.required],
      password:[,Validators.required]
    });
   }

  ngOnInit() {
  }



  login(){
    this.showLoading=true;
    const request:Login={
      correo: this.formLogin.value.email,
      clave: this.formLogin.value.password
    }

    this.usuariosService.iniciarSesion(request).subscribe({
      next:(data)=>{
        if(data.status){
          this.utilidadService.sesionUsuario(data.value);
          this.router.navigate(["pages"])
        }else
        this.utilidadService.mostrarMensaje("Verifica las credeciales e intenta nuevamente","Cerrar!")
      },
      complete:()=>{
        this.showLoading=false;
      },
      error:()=>{
        this.utilidadService.mostrarMensaje("Error al iniciar sesion, Intentalo mas tarde","Cerrar!")
      }
    })
  }

}
