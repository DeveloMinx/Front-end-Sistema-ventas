import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Sesion } from '../Interfaces/Sesion';

@Injectable({
  providedIn: 'root'
})
export class UtilidadService {

constructor(private _snackBar:MatSnackBar) { }

mostrarMensaje(mensaje:string, tipo:string){
  this._snackBar.open(mensaje,tipo,{
    horizontalPosition:'end',
    verticalPosition:'top',
    duration:3000
  })
}

sesionUsuario(sesionUsuario:Sesion){
  localStorage.setItem("usuario", JSON.stringify(sesionUsuario));
}

getSesionUsuario(){
  const dataCadena = localStorage.getItem('usuario');

  const usuario = JSON.parse(dataCadena!);
  return usuario;
}

deleteSesionUsuario(){
  localStorage.removeItem("usuario")
}
}