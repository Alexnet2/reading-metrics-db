import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { VideoApiService } from '@app/services/video-api.service';
import { ProcessingProgress, ProcessingResult } from '@app/models/processing.model';
import { DashboardPageComponent } from '../dashboard-page/dashboard-page.component';

@Component({
  selector: 'app-upload-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    DashboardPageComponent,
  ],
  templateUrl: './upload-page.component.html',
  styleUrls: ['./upload-page.component.css'],
})
export class UploadPageComponent {
  selectedFile: File | null = null;
  isProcessing = false;
  progress: ProcessingProgress | null = null;
  result: ProcessingResult | null = null;
  videoId: string | null = null;
  isDragOver = false;
  errorMessage: string | null = null;

  constructor(private videoApiService: VideoApiService) {}

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (files && files.length > 0) {
      this.selectedFile = files[0];
      this.errorMessage = null;
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(): void {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
      this.errorMessage = null;
    }
  }

  processVideo(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Por favor selecione um arquivo de vídeo';
      return;
    }

    this.isProcessing = true;
    this.errorMessage = null;

    this.videoApiService.uploadVideo(this.selectedFile).subscribe({
      next: (response) => {
        this.videoId = response.videoId;
        this.monitorProgress();
      },
      error: (error) => {
        console.error('Upload error:', error);
        this.errorMessage = 'Erro ao enviar o vídeo. Tente novamente.';
        this.isProcessing = false;
      },
    });
  }

  private monitorProgress(): void {
    if (!this.videoId) return;

    const progressInterval = setInterval(() => {
      this.videoApiService.getProgress(this.videoId!).subscribe({
        next: (progress) => {
          this.progress = progress;

          if (progress.status === 'completed') {
            clearInterval(progressInterval);
            this.isProcessing = false;
            this.loadResults();
          } else if (progress.status === 'failed') {
            clearInterval(progressInterval);
            this.isProcessing = false;
            this.errorMessage = progress.message || 'Erro durante o processamento';
          }
        },
        error: (error) => {
          console.error('Progress error:', error);
          clearInterval(progressInterval);
          this.isProcessing = false;
          this.errorMessage = 'Erro ao verificar o progresso';
        },
      });
    }, 1000);
  }

  private loadResults(): void {
    if (!this.videoId) return;

    this.videoApiService.getResults(this.videoId).subscribe({
      next: (result) => {
        this.result = result;
      },
      error: (error) => {
        console.error('Results error:', error);
        this.errorMessage = 'Erro ao carregar os resultados';
      },
    });
  }

  newProcessing(): void {
    this.selectedFile = null;
    this.isProcessing = false;
    this.progress = null;
    this.result = null;
    this.videoId = null;
    this.errorMessage = null;
  }

  exportExcel(): void {
    if (this.videoId) {
      this.videoApiService.exportExcel(this.videoId);
    }
  }
}
