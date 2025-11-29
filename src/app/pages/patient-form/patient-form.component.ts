import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient, PatientService } from '../../services/patient.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    RouterModule
  ]
})
export class PatientFormComponent implements OnInit {

  id?: number;
  patient: Patient = {
    pid: '',
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    phone: '',
    address: '',
    suburb: '',
    state: '',
    postcode: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: PatientService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Route ID parameter:', this.id);

    if (this.id) {
      console.log('Fetching patient with ID:', this.id);
      this.service.get(this.id).subscribe({
        next: (res) => {
          console.log('Patient fetched for edit:', res);
          this.patient = res;
        },
        error: (error) => {
          console.error('Error fetching patient:', error);
        }
      });
    }
  }

  save() {
    if (this.id) {
      this.service.update(this.id, this.patient).subscribe(() => {
        this.router.navigate(['/patients']);
      });
    } else {
      this.service.create(this.patient).subscribe(() => {
        this.router.navigate(['/patients']);
      });
    }
  }
}
