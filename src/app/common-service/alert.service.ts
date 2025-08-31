import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  public success(title: string, text: string): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      showConfirmButton: false,
      timer: 2000
    });
  }

  public confirm(title: string, text: string): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'warning',
      title: title,
      text: text,
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed!',
      cancelButtonText: 'Cancel'
    });
  }

  public error(title: string, text: string): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      confirmButtonText: 'OK'
    });
  }
}
