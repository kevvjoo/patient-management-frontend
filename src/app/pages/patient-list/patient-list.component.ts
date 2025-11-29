import { Component, OnInit, ChangeDetectorRef, afterNextRender, Injector } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { PatientService, Patient } from '../../services/patient.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    RouterModule,
    DatePipe
  ]
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  page = 0;
  size = 10;
  totalElements = 0;
  search = '';
  loading = false;
  displayedColumns: string[] = ['pid', 'name', 'dob', 'phone', 'actions'];

  private platformId = inject(PLATFORM_ID);

  constructor(
    private service: PatientService,
    private cdr: ChangeDetectorRef,
    private injector: Injector,
    private router: Router
  ) {
    // Load data after rendering is complete
    afterNextRender(() => {
      this.loadPatients();
    }, { injector: this.injector });
  }

  ngOnInit() {
    // Don't load patients here for SSR
  }

  loadPatients() {
    // Only make HTTP calls in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.loading = true;
    this.service.list(this.page, this.size, this.search).subscribe({
      next: (response) => {
        console.log('Full response:', response);
        console.log('Response type:', typeof response);

        this.patients = response.content || [];
        this.totalElements = response.totalElements || 0;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading patients:', error);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  onEdit(patientId: number) {
    console.log('Navigating to edit patient with ID:', patientId);
    this.router.navigate(['/patients/edit', patientId]);
  }

  onSearch() {
    this.page = 0;
    this.loadPatients();
  }

  delete(id: number) {
    if (!confirm('Delete this patient?')) return;

    this.service.delete(id).subscribe({
      next: () => this.loadPatients(),
      error: (error) => {
        console.error('Error deleting patient:', error);
      }
    });
  }

  onPageChange(event: any) {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.loadPatients();
  }
}
