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

  public confirm(
    title: string,
    text: string,
    confirmButtonText?: string,
    cancelButtonText?: string ,
    icon?: SweetAlertIcon
  ): Promise<SweetAlertResult> {

    const finalConfirmButtonText = confirmButtonText ?? 'Yes, proceed!';
    const finalCancelButtonText = cancelButtonText ?? 'Cancel';
    const finalIcon = icon ?? 'question';

    return Swal.fire({
      icon: finalIcon,
      title: title,
      text: text,
      showCancelButton: true,
      confirmButtonText: finalConfirmButtonText,
      cancelButtonText: finalCancelButtonText
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
