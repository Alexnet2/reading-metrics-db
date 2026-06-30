import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgChartsModule  } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { ProcessingResult } from '@app/models/processing.model';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatGridListModule,
    NgChartsModule
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css'],
})
export class DashboardPageComponent {
  @Input() result!: ProcessingResult;
  @Output() newProcessing = new EventEmitter<void>();
  @Output() exportExcel = new EventEmitter<void>();

  displayedColumns: string[] = ['time', 'db'];
  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  get chartLabels(): string[] {
    return this.result.readings.map((r) => r.time.toFixed(2) + 's');
  }

  get chartDatasets() {
    return [
      {
        label: 'Nível de Ruído (dB)',
        data: this.result.readings.map((r) => r.db || 0),
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 4,
      },
    ];
  }

  get readingsPage() {
    return this.result.readings.slice(0, 10);
  }

  onNewProcessing(): void {
    this.newProcessing.emit();
  }

  onExportExcel(): void {
    this.exportExcel.emit();
  }
}
