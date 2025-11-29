import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [RouterOutlet, RouterModule]
})
export class AppComponent {
  title = 'Patient Management';
}
