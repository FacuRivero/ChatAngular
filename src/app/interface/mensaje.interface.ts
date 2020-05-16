import { NumberValueAccessor } from '@angular/forms';

export interface Mensaje {
    nombre: string;
    mensaje: string;
    fecha?: number;
    uid?: string;
}