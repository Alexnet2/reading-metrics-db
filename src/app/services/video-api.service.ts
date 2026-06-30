import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ProcessingResult, ProcessingProgress } from '@app/models/processing.model';

@Injectable({
  providedIn: 'root',
})
export class VideoApiService {
  private apiUrl = '/api/video';
  private progressSubject = new BehaviorSubject<ProcessingProgress | null>(null);
  public progress$ = this.progressSubject.asObservable();

  constructor(private http: HttpClient) {}

  uploadVideo(file: File): Observable<{ videoId: string }> {
    const formData = new FormData();
    formData.append('video', file);

    return this.http.post<{ videoId: string }>(`${this.apiUrl}/upload`, formData);
  }

  getProgress(videoId: string): Observable<ProcessingProgress> {
    return this.http.get<ProcessingProgress>(`${this.apiUrl}/progress/${videoId}`);
  }

  monitorProgress(videoId: string): Observable<ProcessingProgress> {
    return interval(1000).pipe(
      switchMap(() => this.getProgress(videoId)),
      takeUntil(this.progress$),
    );
  }

  getResults(videoId: string): Observable<ProcessingResult> {
    return this.http.get<ProcessingResult>(`${this.apiUrl}/results/${videoId}`);
  }

  exportExcel(videoId: string): void {
    const link = document.createElement('a');
    link.href = `${this.apiUrl}/export/${videoId}`;
    link.download = `${videoId}.xlsx`;
    link.click();
  }

  getCalibration(): Observable<any> {
    return this.http.get(`${this.apiUrl}/calibration`);
  }

  saveCalibration(displayRegion: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/calibration`, { displayRegion });
  }
}
