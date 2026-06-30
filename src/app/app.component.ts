import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadPageComponent } from './pages/upload-page/upload-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, UploadPageComponent, DashboardPageComponent],
  template: `
    <div class="app-container">
      <header>
        <h1>Sistema de Extração de Métricas de Decibelímetro</h1>
      </header>
      <main>
        <app-upload-page></app-upload-page>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    header h1 {
      margin: 0;
      font-size: 2rem;
      font-weight: 300;
    }

    main {
      flex: 1;
      padding: 2rem;
    }
  `],
})
export class AppComponent {}
