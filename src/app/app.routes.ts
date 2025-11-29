import { Routes } from '@angular/router';
import { PatientListComponent } from './pages/patient-list/patient-list.component';
import { PatientFormComponent } from './pages/patient-form/patient-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'patients', pathMatch: 'full' },
  { path: 'patients', component: PatientListComponent },
  { path: 'patients/new', component: PatientFormComponent },
  { path: 'patients/:id', component: PatientFormComponent }
];
