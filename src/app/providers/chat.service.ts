import { Injectable } from '@angular/core';
import { Mensaje } from '../interface/mensaje.interface';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public chats: Mensaje[] = [];
  public usuario: any = {};
  public uid: string = '';

  private itemsCollection: AngularFirestoreCollection<Mensaje>;

  constructor(private afs: AngularFirestore, public auth: AngularFireAuth) {
    this.auth.authState.subscribe( user => {
      console.log(user)

      if ( !user ){
        return;
      }

      this.usuario.nombre = user.displayName;
      this.uid = user.uid;
    })
  }

  cargarMensajes() {
    this.itemsCollection = this.afs.collection<Mensaje>('chats', (ref) =>
      ref.orderBy('fecha', 'desc').limit(5)
    );

    return this.itemsCollection.valueChanges().pipe(
      map((mensajes: Mensaje[]) => {
        this.chats = [];

        for (let mensaje of mensajes) {
          this.chats.unshift(mensaje);
        }

        return this.chats;
      })
    );
  }

  agregarMensaje(texto: string) {
    const mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.uid
    };

    return this.itemsCollection.add(mensaje);
  }

  login(proveedor: string) {
    this.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout() {
    this.uid = '';
    this.auth.signOut();
  }
}
