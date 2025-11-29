import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';

export interface Patient {
  id?: number;
  pid: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  phone: string;

  address: string;
  suburb: string;
  state: string;
  postcode: string;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private api = 'http://localhost:8080/api/patients';

  constructor(private http: HttpClient) {}

  list(page: number, size: number, search?: string): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search) params = params.set('search', search);

    const url = `${this.api}?${params.toString()}`;
    console.log('Making GET request to:', url);

    return this.http.get(this.api, { params }).pipe(
      tap(response => console.log('GET response:', response))
    );
  }

  get(id: number): Observable<Patient> {
    console.log('Fetching patient with ID:', id);
    return this.http.get<Patient>(`${this.api}/${id}`).pipe(
      tap(response => console.log('GET single patient response:', response)),
      catchError(error => {
        console.error('Error fetching single patient:', error);
        throw error;
      })
    );
  }

  create(patient: Patient): Observable<Patient> {
    console.log('Sending patient data:', patient);
    return this.http.post<Patient>(this.api, patient).pipe(
      tap(response => console.log('Patient created successfully:', response)),
      catchError(error => {
        console.error('Error creating patient:', error);
        throw error;
      })
    );
  }

  update(id: number, patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.api}/${id}`, patient);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
