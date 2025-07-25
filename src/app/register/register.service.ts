import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = environment.apiBaseUrl.replace('/api', '');

  constructor(private http: HttpClient) { }

  //call api for getAllDivisions
  getAllDivisions(){
    return this.http.get<any>(`${this.apiUrl}/api/divisions`);
  }

  getAllUpazilaByDistrictId(districtId: string) {
    return this.http.get<any>(`${this.apiUrl}/api/upazilas/district/${districtId}`);
  }

  getAllDistrictByDivisionId(divisionId: string) {
    return this.http.get<any>(`${this.apiUrl}/api/districts/division/${divisionId}`);
  }
}
